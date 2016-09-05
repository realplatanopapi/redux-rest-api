import test from 'ava'
import middleware from '../src/index'

test('That it works', t => {
  t.is(typeof middleware, 'object')
})
