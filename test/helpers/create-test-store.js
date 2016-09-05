import { applyMiddleware, createStore } from 'redux'

import { apiMiddleware, apiReducer } from '../../src/index'

export default function createTestStore (apiReducerOptions) {
  return createStore(apiReducer(apiReducerOptions), applyMiddleware(apiMiddleware))
}
