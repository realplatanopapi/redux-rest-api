import test from 'ava'

import { API_ACTION_TYPE } from '../src'

test('Unique API_ACTION_TYPE value', t => {
  t.is(API_ACTION_TYPE, '@@API_ACTION_TYPE')
})
