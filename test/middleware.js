import test from 'ava'
import { spy } from 'sinon'
import fetchMock from 'fetch-mock'

import createTestStore from './helpers/create-test-store'

import { API_ACTION_TYPE, apiMiddleware } from '../src'

test.beforeEach(() => {
  // Reset fetch mocks before every test.
  fetchMock.restore()
})

test('Ignores non-api actions', t => {
  const store = createTestStore({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  const next = spy()

  // Invoke middleware with a non-api middleware
  const result = apiMiddleware(store)(next)({
    type: 'Meep'
  })

  // Assert action was ignored passed along with next
  t.deepEqual(next.firstCall.args[0], {
    type: 'Meep'
  })

  // Assert a Promise was not returned
  t.true(typeof result === 'undefined')
})

test('Converts API actions to Promises', t => {
  const store = createTestStore({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  const next = spy()

  // Invoke middleware
  const promise = apiMiddleware(store)(next)({
    [API_ACTION_TYPE]: {
      endpoint: 'http://middleware.test',
      types: ['PENDING', 'SUCCESS', 'FAILURE']
    }
  })

  // Assert next was not invoked
  t.is(next.callCount, 0)

  // Assert a Promise was returned
  t.true(typeof promise.then === 'function')
  t.true(typeof promise.catch === 'function')
})

test('Dispatching pending action type', t => {
  const store = createTestStore({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  const dispatchSpy = spy(store, 'dispatch')
  const next = spy()

  apiMiddleware(store)(next)({
    [API_ACTION_TYPE]: {
      endpoint: 'http://middleware.test',
      types: ['PENDING', 'SUCCESS', 'FAILURE']
    }
  })

  // Assert the pending action was dispatched to the store
  t.deepEqual(dispatchSpy.firstCall.args[0], {
    type: 'PENDING'
  })
})

test('Dispatching success action type on successful fetch request', async t => {
  const store = createTestStore({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  // Respond to fetch request with Guy Fieri
  fetchMock.mock('http://middleware.test', {
    name: 'Guy Fieri'
  })

  const dispatchSpy = spy(store, 'dispatch')
  const next = spy()

  // Invoke middleware
  const promise = apiMiddleware(store)(next)({
    [API_ACTION_TYPE]: {
      endpoint: 'http://middleware.test',
      types: ['PENDING', 'SUCCESS', 'FAILURE']
    }
  })

  // Assert the pending action was dispatched to the store
  t.deepEqual(dispatchSpy.firstCall.args[0], {
    type: 'PENDING'
  })

  const result = await promise
  // Assert the Promise resolved with the success action
  t.deepEqual(result, {
    type: 'SUCCESS',
    payload: {
      name: 'Guy Fieri'
    }
  })

  // Assert the success action was dispatched to the store
  t.deepEqual(dispatchSpy.getCall(1).args[0], result)
})

test('Dispatching failure action type on failed fetch request', async t => {
  const store = createTestStore({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  // Respond to fetch request with an error
  fetchMock.mock('http://middleware.test', 500)

  const dispatchSpy = spy(store, 'dispatch')
  const next = spy()

  // Invoke middleware
  const promise = apiMiddleware(store)(next)({
    [API_ACTION_TYPE]: {
      endpoint: 'http://middleware.test',
      types: ['PENDING', 'SUCCESS', 'FAILURE']
    }
  })

  // Assert the pending action was dispatched to the store
  t.deepEqual(dispatchSpy.firstCall.args[0], {
    type: 'PENDING'
  })

  try {
    await promise
    // Fail the test if the Promise was not rejected
    t.fail('Promise was not rejected.')
  } catch (error) {
    // Assert the Promise rejected with the failure action
    t.is(error.type, 'FAILURE')

    // Assert the failure action was dispatched to the store
    t.deepEqual(dispatchSpy.getCall(1).args[0], error)

    // Assert the Response object was included in the action payload
    t.is(error.payload.url, 'http://middleware.test')
    t.is(error.payload.status, 500)
    t.is(error.payload.statusText, 'Internal Server Error')
  }
})
