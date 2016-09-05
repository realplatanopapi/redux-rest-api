import test from 'ava'
import * as apiMiddleware from '../src/index'

test('Package exports', t => {
  t.is(typeof apiMiddleware.API_ACTION_TYPE, 'string')
  t.is(typeof apiMiddleware.apiMiddleware, 'function')
  t.is(typeof apiMiddleware.apiReducer, 'function')
})
