import test from 'ava'
import { API_ACTION_TYPE, apiMiddleware, configureApiReducer } from '../src'

test('Package exports', t => {
  t.true(typeof API_ACTION_TYPE === 'string')
  t.true(typeof apiMiddleware === 'function')
  t.true(typeof configureApiReducer === 'function')
})
