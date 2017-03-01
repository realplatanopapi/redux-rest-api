import { API_ACTION_TYPE } from '../src'
import expect from 'expect'

describe('API_ACTION_TYPE', function () {
  it('is a string', function () {
    expect(API_ACTION_TYPE).toEqual('@@API_ACTION_TYPE')
  })
})
