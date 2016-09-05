import { applyMiddleware, createStore } from 'redux'

import { apiMiddleware, configureApiReducer } from '../../src/index'

export default function createTestStore (apiReducerOptions) {
  return createStore(configureApiReducer(apiReducerOptions), applyMiddleware(apiMiddleware))
}
