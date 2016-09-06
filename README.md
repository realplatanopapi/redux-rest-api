# redux-api-promise-middleware [![Build Status](https://travis-ci.org/restlessbit/redux-api-promise-middleware.svg?branch=master)](https://travis-ci.org/restlessbit/redux-api-promise-middleware)

Middleware that gives you a uniform way to define API actions in Redux applications.

Example usage:

```javascript
import { API_ACTION_TYPE } from 'redux-api-promise-middleware'

store.dispatch({
  [API_ACTION_TYPE]: {
    types: ['PENDING', 'SUCCESS', 'FAILURE'],
    endpoint: 'https://monsterfactory.net',
    fetchOptions: {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        name: 'Guy Fieri'
      })
    }
  }
}).then(() => {
  console.log()('Oh no what have you done')
}).catch(() => {
  console.log('Thank god')
})
```

# Installation

```
npm install redux-api-promise-middleware
```

## Usage



### Add middleware to store

In order for a fetch to request to be generated whenever an API action is dispatched, the api middleware must be applied to your store.

```javascript
// Adding the api middleware to your store
import { apiMiddleware } from 'redux-api-promise-middleware'
import { applyMiddleware, createStore } from 'redux'

const middleware = applyMiddleware(apiMiddleware)

const store = createStore(reducers, initialState, middleware)
```

Now whenever an [API action](#dispatching-api-actions) like this gets dispatched to the store:

```javascript
// Example API action
import { API_ACTION_TYPE } from 'redux-api-promise-middleware'

const promise = store.dispatch({
  [API_ACTION_TYPE]: {
    types: ['PENDING', 'SUCCESS', 'FAILURE'],
    endpoint: 'https://monsterfactory.net',
    fetchOptions: { /* Options to pass to underlying fetch request */ }
  }
})

// Do something with the returned Promise if you want to, but you don't have to.
```

A fetch request will be made to the given `endpoint`, and three actions with the specified `types` will be dispatched while that fetch request is being made.
The

You can specify the types of these three actions by setting the `types` property of the api action to an array of three strings.

The first string will be the `pending` action type, the second the `success` action type, and the third the `failure` action type.

#### Pending Action

The `pending` action is dispatched to the store before the fetch request is created.

```javascript
// Pending action
{
  type: ['PENDING']
}
```

#### Success action

This action will be dispatched to the store if the fetch request resolves with an `OK` status code. The action's payload will contain the JSON response from the endpoint.

```javascript
// Success action
{
  type: ['SUCCESS'],
  payload: { /* Server response as JSON */ }
}
```

#### Failure action

The failure action is dispatched to the store if the fetch request is rejected with a non-`OK` status code. The payload of the action will contain the [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object from the rejected request.

```javascript
// Failure action
{
  type: ['FAILURE'],
  payload: { /* Response object */ }
}
```

### Hook up a reducer (or write your own)

Now that you have middleware that is generating actions for you, you need to create a reducer that will handle those actions and update the store accordingly.

You can use the reducer included with `redux-api-promise-middleware` to handle these actions, or you can write your own.

#### Using the provided reducer

Odds are the state for most of your API requests is going to look very similar:

```javascript
// Example API request state
const state = {
  // True if a request is in progress
  isPending: false,

  // Contains a response from an API if a request was successful.
  response: null,

  // Contains the failed [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object from a rejected request.
  error: null
}
```

As such, `redux-api-promise-middleware` provides a reducer that you can use to manage the state of multiple API requests.

##### Example usage

```javascript
// Setting up reducers to handle the state for multiple API requests within an application
import { configureApiReducer } from 'redux-api-promise-middleware'
import { combineReducers } from 'redux'

const reducers = combineReducers({
  // Create a reducer that will respond to API actions with the specified `types`.
  monsters: configureApiReducer({
    // The types for this API action.
    types: ['MONSTERS_FETCH_PENDING', 'MONSTERS_FETCH_SUCCESS', 'MONSTERS_FETCH_FAILURE']
  }),
  pokemon: configureApiReducer({
    // The types for this API action.
    types: ['POKEMON_FETCH_PENDING', 'POKEMON_FETCH_SUCCESS', 'POKEMON_FETCH_FAILURE']
  }),
  ...
})

export reducers
```

The initial state of the store will look like this:

```javascript
// Initial state
{
  monsters: {
    isPending: false,
    response: null,
    error: null
  },
  pokemon: {
    isPending: false,
    response: null,
    error: null
  }
}
```

##### How the reducer updates state

The api reducer will handle actions from the API middleware that match the given `types`.

###### Pending action type

The reducer will set the `isPending` property to true.

```javascript
// State after receiving a pending action
{
  isPending: false => true
}
```

###### Success action type

The api reducer will set the `isPending` property to `false` and will populate the `response`
field with the `JSON` response from the API. `error` will be set to null.

```javascript
// State after receiving a success action
{
  isPending: true => false,
  response: null => { /* JSON response */ },
  error: { /* Previous error object */ } => null
}
```

###### Failure action type

The api reducer will set the `isPending` property to `false` and will populate the `error` field
with the [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object from the failed fetch request.

```javascript
// State after receiving a failure action
{
  isPending: true => false,
  error: null => { /* Response object from failed fetch request */ }
}
```

#### Using your own reducer

If the provided reducer doesn't meet your needs, you can always write your own reducer to handle the actions that are dispatched by the API middleware.

Check out the [source for the included reducer](https://github.com/restlessbit/redux-api-promise-middleware/blob/e3bb2239bb7236480e96ac26ebe9318724e606fc/src/reducer.js#L20) for an example.

### Dispatching API actions

Once you have a reducer to handle the actions dispatched by the API middleware, you can start dispatching API actions.

API actions have the following properties:

#### `types`

This is an array of three strings that define the action types that will be [dispatched by the API middleware](#add-middleware-to-store).

#### `endpoint`

The url for the fetch request.

#### `fetchOptions`

An object containing the options that will be passed to the underlying fetch request, such as `body` and `method`.

For a full list of options you can pass to the fetch request, check out out the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch#Parameters).

Because the API middleware converts API actions to Promises, you can delay rendering a component until
the data that it requires has been fetched. This is super handy for server side rendering.

Here's an example of delaying rendering with React Router:

```javascript
// Example of delaying rendering until data has been fetched
import { API_ACTION_TYPE } from 'redux-api-promise-middleware'

// Route configuration that has been given access to the store.
// Example: routeConfig(store): route configuration
<Route path="/" component={SomeComponent} onEnter={(state, replace, next) => {
  // Dispatch an action and wait for it to resolve (or be rejected) before rendering.
  store.dispatch({
    [API_ACTION_TYPE]: {
      types: ['FIERI_DESTROY_PENDING', 'FIERI_DESTROY_SUCCESS', 'FIERI_DESTROY_FAILURE'],
      endpoint: 'http://monsterfactory.net/1',
      fetchOptions: {
        method: 'DELETE'
      }
    }
  }).then(() => {
    // Store state has been updated 🎉, render the component
    next()
  }).catch(() => {
    // Uh oh, something broke :/, maybe dispatch an action to render an alert?
    next()
  })
}} />
```

For more details on async routes in React Router, check out the [React Router docs](https://github.com/reactjs/react-router/blob/0625e7656d21863563cf59019cfc16b800b79e85/docs/guides/RouteConfiguration.md#enter-and-leave-hooks).

## License

MIT
