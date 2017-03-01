import 'isomorphic-fetch'
import {API_ACTION_TYPE, apiMiddleware} from '../src'
import expect from 'expect'
import nock from 'nock'
import {spy} from 'sinon'

describe('middleware', function () {
  before(function () {
    this.fetchSpy = spy(global, 'fetch')
  })

  beforeEach(function () {
    nock('http://fakeapi.test').get('/').reply(200, {
      data: 'some_fake_data'
    })
  })

  afterEach(function () {
    this.fetchSpy.reset()
    nock.cleanAll()
  })

  after(function () {
    this.fetchSpy.restore()
  })

  it('dispatches `pending` action type before making request', function () {
    const action = {
      [API_ACTION_TYPE]: {
        types: ['PENDING', 'SUCCESS', 'FAILURE'],
        endpoint: 'http://fakeapi.test'
      }
    }
    const dispatchSpy = spy()
    const nextSpy = spy()

    apiMiddleware({
      dispatch: dispatchSpy
    })(nextSpy)(action)

    expect(dispatchSpy.callCount).toEqual(1)
    expect(dispatchSpy.firstCall.args).toEqual([{
      type: 'PENDING'
    }])
  })

  it('makes fetch request with passed options', function () {
    const action = {
      [API_ACTION_TYPE]: {
        types: ['PENDING', 'SUCCESS', 'FAILURE'],
        endpoint: 'http://fakeapi.test',
        fetchOptions: {
          headers: {
            'accept': 'application/json',
            'authorization': 'bearer token'
          }
        }
      }
    }
    const dispatchSpy = spy()
    const nextSpy = spy()

    apiMiddleware({
      dispatch: dispatchSpy
    })(nextSpy)(action)

    // Assert a request was made
    expect(this.fetchSpy.callCount).toEqual(1)
    expect(this.fetchSpy.firstCall.args).toEqual(['http://fakeapi.test', {
      headers: {
        'accept': 'application/json',
        'authorization': 'bearer token'
      }
    }])
  })

  it('returns a promise when it receives an api action', function () {
    const action = {
      [API_ACTION_TYPE]: {
        types: ['PENDING', 'SUCCESS', 'FAILURE'],
        endpoint: 'http://fakeapi.test'
      }
    }
    const dispatchSpy = spy()
    const nextSpy = spy()

    const result = apiMiddleware({
      dispatch: dispatchSpy
    })(nextSpy)(action)

    expect(result.then).toBeA('function')
    expect(result.catch).toBeA('function')
  })

  it('dispatches `success` action type when request resolves', function () {
    const action = {
      [API_ACTION_TYPE]: {
        types: ['PENDING', 'SUCCESS', 'FAILURE'],
        endpoint: 'http://fakeapi.test'
      }
    }
    const dispatchSpy = spy()
    const nextSpy = spy()

    const result = apiMiddleware({
      dispatch: dispatchSpy
    })(nextSpy)(action)

    return result.then(() => {
      // Assert action was dispatched
      expect(dispatchSpy.callCount).toEqual(2)

      expect(dispatchSpy.firstCall.args).toEqual([{
        type: 'PENDING'
      }])

      expect(dispatchSpy.secondCall.args).toEqual([{
        type: 'SUCCESS',
        payload: {
          data: 'some_fake_data'
        }
      }])
    })
  })

  it('dispatches `failure` action type when request rejects', function () {
    // Respond to fake request with an error
    nock('http://fakeapi.test').get('/error').reply(500)

    // Make request
    const action = {
      [API_ACTION_TYPE]: {
        types: ['PENDING', 'SUCCESS', 'FAILURE'],
        endpoint: 'http://fakeapi.test/error'
      }
    }
    const dispatchSpy = spy()
    const nextSpy = spy()

    const result = apiMiddleware({
      dispatch: dispatchSpy
    })(nextSpy)(action)

    return result.catch(error => {
      expect(dispatchSpy.callCount).toEqual(2)

      expect(dispatchSpy.firstCall.args).toEqual([{
        type: 'PENDING'
      }])

      expect(dispatchSpy.secondCall.args).toEqual([{
        type: 'FAILURE',
        payload: error
      }])
    })
  })

  it('ignores non-api actions', function () {
    const action = {
      type: 'NON_API_ACTION'
    }
    const dispatchSpy = spy()
    const nextSpy = spy()

    // Invoke middleware with non-api action
    apiMiddleware({
      dispatch: dispatchSpy
    })(nextSpy)(action)

    // Assert next was invoked with action
    expect(nextSpy.callCount).toEqual(1)
    expect(nextSpy.firstCall.args).toEqual([{
      type: 'NON_API_ACTION'
    }])

    // Assert dispatch was not invoked
    expect(dispatchSpy.callCount).toEqual(0)
  })
})
