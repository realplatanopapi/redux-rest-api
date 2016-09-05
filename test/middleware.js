import test from 'ava'
import fetchMock from 'fetch-mock'
import { applyMiddleware, createStore } from 'redux'

import { apiMiddleware, apiReducer } from '../src/index'

test.beforeEach(t => {
  // Create a fresh store for each test.
  t.context.store = createStore(apiReducer({
    types: ['API_FETCH_PENDING', 'API_FETCH_SUCCESS', 'API_FETCH_ERROR']
  }), applyMiddleware(apiMiddleware))
})

test.afterEach(t => {
  // Reset fetch mock state after each test
  fetchMock.reset()
})

test.after(t => {
  // Restore original fetch function
  fetchMock.restore()
})

test('Initializes state', t => {
  const { store } = t.context
  t.deepEqual(store.getState(), {
    error: null,
    isPending: false,
    response: null
  })
})
