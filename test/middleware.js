import test from 'ava'
import fetchMock from 'fetch-mock'

import createTestStore from './helpers/create-test-store'

test.afterEach(t => {
  // Reset fetch mock state after each test
  fetchMock.reset()
})

test.after(t => {
  // Restore original fetch function
  fetchMock.restore()
})

test('Initializes state', t => {
  const store = createTestStore({types: []})
  t.deepEqual(store.getState(), {
    error: null,
    isPending: false,
    response: null
  })
})
