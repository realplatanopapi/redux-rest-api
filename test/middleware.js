import test from 'ava'
import { applyMiddleware, createStore } from 'redux'

import { apiMiddleware, apiReducer } from '../src/index'

const store = createStore(apiReducer, applyMiddleware(apiMiddleware))

test('Initializes state', t => {
  t.deepEqual(store.getState(), {
    error: null,
    isPending: false,
    response: null
  })
})
