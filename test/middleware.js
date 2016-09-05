import test from 'ava'

import createTestStore from './helpers/create-test-store'

import { configureApiReducer } from '../src'

test('Reducer throws an error when receiving missing or invalid config object', t => {
  t.throws(configureApiReducer)
  t.throws(() => {
    configureApiReducer({})
  })
  t.throws(() => {
    configureApiReducer({
      types: ['just', '2']
    })
  })
  t.notThrows(() => {
    configureApiReducer({
      types: ['1', '2', '3!']
    })
  })
})

test('Initial state', t => {
  const store = createTestStore({
    types: ['FETCH', 'SUCCESS', 'ERROR']
  })

  t.deepEqual(store.getState(), {
    error: null,
    isPending: false,
    response: null
  })
})
