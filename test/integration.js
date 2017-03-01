import {API_ACTION_TYPE, apiMiddleware, configureApiReducer} from '../src'
import {applyMiddleware, createStore} from 'redux'
import expect from 'expect'
import nock from 'nock'
import {spy} from 'sinon'

describe('Integration test', function () {
  beforeEach(function () {
    this.store = createStore(
      configureApiReducer({
        types: ['PENDING', 'SUCCESS', 'FAILURE']
      }),
      applyMiddleware(apiMiddleware)
    )
  })

  it('handles successful requests', function () {
    nock('http://fakeapi.test').get('/').reply(200, {
      data: 'it worked!'
    })

    const dispatchSpy = spy(this.store, 'dispatch')
    const action = {
      [API_ACTION_TYPE]: {
        types: ['PENDING', 'SUCCESS', 'FAILURE'],
        endpoint: 'http://fakeapi.test'
      }
    }

    this.store.dispatch(action)

    expect(this.store.getState()).toEqual({
      isPending: true,
      response: null,
      error: null
    })

    return dispatchSpy.firstCall.returnValue.then(() => {
      expect(this.store.getState()).toEqual({
        isPending: false,
        response: {
          data: 'it worked!'
        },
        error: null
      })
    })
  })

  it('handles failed requests', function () {
    nock('http://fakeapi.test').get('/').reply(500, {})

    const dispatchSpy = spy(this.store, 'dispatch')
    const action = {
      [API_ACTION_TYPE]: {
        types: ['PENDING', 'SUCCESS', 'FAILURE'],
        endpoint: 'http://fakeapi.test'
      }
    }

    this.store.dispatch(action)

    expect(this.store.getState()).toEqual({
      isPending: true,
      response: null,
      error: null
    })

    return dispatchSpy.firstCall.returnValue.catch(response => {
      expect(this.store.getState()).toEqual({
        isPending: false,
        response: null,
        error: response
      })
    })
  })
})
