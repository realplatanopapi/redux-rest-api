import fetchMock from 'fetch-mock'
import test from 'ava'

import createTestStore from './helpers/create-test-store'

import { API_ACTION_TYPE } from '../src'

test.beforeEach(() => {
  // Reset fetch mocks before every test
  fetchMock.restore()
})

test('Initial state', t => {
  const store = createTestStore({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  t.deepEqual(store.getState(), {
    error: null,
    isPending: false,
    response: null
  })
})

test('API actions are converted to Promises', t => {
  const requestTypes = ['PENDING', 'SUCCESS', 'FAILURE']
  const store = createTestStore({
    types: requestTypes
  })

  const request = store.dispatch({
    [API_ACTION_TYPE]: {
      endpoint: 'http://integration.test',
      types: requestTypes
    }
  })

  t.true(typeof request.then === 'function')
  t.true(typeof request.catch === 'function')
})

test('Successful API request', async t => {
  const requestTypes = ['PENDING', 'SUCCESS', 'FAILURE']
  const store = createTestStore({
    types: requestTypes
  })

  fetchMock.mock('http://integration.test', {
    name: 'mario the ghost',
    age: 23
  })

  const request = store.dispatch({
    [API_ACTION_TYPE]: {
      endpoint: 'http://integration.test',
      types: requestTypes
    }
  })

  // Assert state was updated
  t.deepEqual(store.getState(), {
    error: null,
    isPending: true,
    response: null
  })

  // Wait for request to complete
  const result = await request

  // Assert state was updated
  const storeState = store.getState()
  t.deepEqual(store.getState(), {
    error: null,
    isPending: false,
    response: {
      name: 'mario the ghost',
      age: 23
    }
  })

  // Assert Promise resolved with response payload
  t.deepEqual(storeState.response, result.payload)
})

test('Failed API request', async t => {
  const requestTypes = ['PENDING', 'SUCCESS', 'FAILURE']
  const store = createTestStore({
    types: requestTypes
  })

  fetchMock.mock('http://integration.test', {
    body: 'Not allowed',
    status: 400
  })

  const request = store.dispatch({
    [API_ACTION_TYPE]: {
      endpoint: 'http://integration.test',
      types: requestTypes
    }
  })

  // Assert state was updated
  t.deepEqual(store.getState(), {
    error: null,
    isPending: true,
    response: null
  })

  // Wait for request to complete
  try {
    await request
    // Fail the test if the request was not rejected
    t.fail()
  } catch (error) {
    const storeState = store.getState()
    t.is(storeState.isPending, false)
    t.is(storeState.response, null)

    // Assert the Response object was included in the action payload
    t.is(storeState.error.url, 'http://integration.test')
    t.is(storeState.error.status, 400)

    // Assert Promise rejected with error payload
    t.deepEqual(storeState.error, error.payload)
  }
})
