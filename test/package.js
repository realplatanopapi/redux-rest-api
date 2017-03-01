import {API_ACTION_TYPE, apiMiddleware, configureApiReducer} from '../src'
import expect from 'expect'

describe('Package exports', function () {
  it('includes `API_ACTION_TYPE`', function () {
    expect(API_ACTION_TYPE).toBe('@@API_ACTION_TYPE')
  })

  it('includes `apiMiddleware`', function () {
    expect(apiMiddleware).toBeA('function')
  })

  it('includes `configureApiReducer`', function () {
    expect(configureApiReducer).toBeA('function')
  })
})
