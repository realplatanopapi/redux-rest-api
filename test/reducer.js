import {configureApiReducer} from '../src'
import expect from 'expect'

describe('configureReducer()', function () {
  it('throws an error when `types` array is invalid', function () {
    expect(() => configureApiReducer()).toThrow()
    expect(() => configureApiReducer({typees: ['PENDING', 'SUCCESS']})).toThrow()
  })

  it('does not throw an error when `types` array is valid', function () {
    expect(() => configureApiReducer({types: ['PENDING', 'SUCCESS', 'FAILURE']})).toNotThrow()
  })

  it('returns a reducer function', function () {
    expect(configureApiReducer({types: ['PENDING', 'SUCCESS', 'FAILURE']})).toBeA('function')
  })
})

describe('reducer returned from `configureReducer()`', function () {
  before(function () {
    this.reducer = configureApiReducer({
      types: ['PENDING', 'SUCCESS', 'FAILURE']
    })

    this.initialState = this.reducer(undefined, {
      type: '@@INIT'
    })
  })

  it('returns initial state when state is undefined', function () {
    expect(this.initialState).toEqual({
      error: null,
      isPending: false,
      response: null
    })
  })

  it('ignores action types not present in `types`', function () {
    const state = this.reducer(this.initialState, {
      type: 'TEST_ACTION'
    })

    expect(state).toEqual({
      error: null,
      isPending: false,
      response: null
    })
  })

  it('handles `pending` action type', function () {
    const state = this.reducer(this.initialState, {
      type: 'PENDING'
    })

    expect(state).toEqual({
      error: null,
      isPending: true,
      response: null
    })
  })

  it('handles `success` action type', function () {
    const state = this.reducer(this.initialState, {
      type: 'SUCCESS',
      payload: {
        data: 'yo'
      }
    })

    expect(state).toEqual({
      error: null,
      isPending: false,
      response: {
        data: 'yo'
      }
    })
  })

  it('handles `failure` action type', function () {
    const state = this.reducer(this.initialState, {
      type: 'FAILURE',
      payload: new Error('Oh no!')
    })

    expect(state).toEqual({
      error: new Error('Oh no!'),
      isPending: false,
      response: null
    })
  })
})
