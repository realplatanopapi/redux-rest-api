import test from 'ava'
import { API_ACTION_TYPE, apiMiddleware, apiReducer } from '../src/index'

test('Package exports', t => {
  t.is(typeof API_ACTION_TYPE, 'string')
  t.is(typeof apiMiddleware, 'function')
  t.is(typeof apiReducer, 'function')
})
