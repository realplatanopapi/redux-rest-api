import test from 'ava'

import { configureApiReducer } from '../src'

test('Error is thrown if options object is missing or invalid', t => {
  t.throws(configureApiReducer)
  t.throws(() => {
    configureApiReducer({})
  })
  t.throws(() => {
    configureApiReducer({
      types: 'Not an array'
    })
  })
  t.throws(() => {
    configureApiReducer({
      types: ['Not', '3']
    })
  })
  t.notThrows(() => {
    configureApiReducer({
      types: ['1', '2', '3']
    })
  })
})

test('Return value is a function', t => {
  const reducer = configureApiReducer({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })
  t.true(typeof reducer === 'function')
})

test('Initial state', t => {
  const reducer = configureApiReducer({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  const state = reducer(undefined, {
    type: 'INIT'
  })

  t.deepEqual(state, {
    error: null,
    isPending: false,
    response: null
  })
})

test('Un-recognized actions', t => {
  const reducer = configureApiReducer({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  let initialState = {
    fakeState: 'some fake state'
  }

  const state = reducer(initialState, {
    type: 'RANDO_ACTION'
  })

  // Assert state was returned un-modified
  t.deepEqual(state, {
    fakeState: 'some fake state'
  })
})

test('Receiving actions with initial state', t => {
  const reducer = configureApiReducer({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  const initialState = reducer(undefined, {
    type: 'INIT'
  })

  // Pending action
  let state = reducer(initialState, {
    type: 'PENDING'
  })

  t.deepEqual(state, {
    error: null,
    isPending: true,
    response: null
  })

  // Success action
  state = reducer(initialState, {
    type: 'SUCCESS',
    payload: {
      data: {}
    }
  })

  t.deepEqual(state, {
    error: null,
    isPending: false,
    response: {
      data: {}
    }
  })

  // Failure action
  state = reducer(initialState, {
    type: 'FAILURE',
    payload: {
      message: 'Some fake error'
    }
  })

  t.deepEqual(state, {
    error: {
      message: 'Some fake error'
    },
    isPending: false,
    response: null
  })
})

test('Receiving actions with a request pending', t => {
  const reducer = configureApiReducer({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  const initialState = {
    isPending: true,
    response: null,
    error: null
  }

  // Pending action
  let state = reducer(initialState, {
    type: 'PENDING'
  })

  t.deepEqual(state, {
    error: null,
    isPending: true,
    response: null
  })

  // Success action
  state = reducer(initialState, {
    type: 'SUCCESS',
    payload: {
      data: {}
    }
  })

  t.deepEqual(state, {
    error: null,
    isPending: false,
    response: {
      data: {}
    }
  })

  // Failure action
  state = reducer(initialState, {
    type: 'FAILURE',
    payload: {
      message: 'Some fake error'
    }
  })

  t.deepEqual(state, {
    error: {
      message: 'Some fake error'
    },
    isPending: false,
    response: null
  })
})

test('Receiving actions with response populated', t => {
  const reducer = configureApiReducer({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  const initialState = {
    isPending: false,
    response: {
      data: {}
    },
    error: null
  }

  // Pending action
  let state = reducer(initialState, {
    type: 'PENDING'
  })

  t.deepEqual(state, {
    error: null,
    isPending: true,
    response: {
      data: {}
    }
  })

  // Success action
  state = reducer(initialState, {
    type: 'SUCCESS',
    payload: {
      newData: {
        message: 'hey'
      }
    }
  })

  t.deepEqual(state, {
    error: null,
    isPending: false,
    response: {
      newData: {
        message: 'hey'
      }
    }
  })

  // Failure action
  state = reducer(initialState, {
    type: 'FAILURE',
    payload: {
      message: 'Some fake error'
    }
  })

  t.deepEqual(state, {
    error: {
      message: 'Some fake error'
    },
    isPending: false,
    response: {
      data: {}
    }
  })
})

test('Receiving actions with error populated', t => {
  const reducer = configureApiReducer({
    types: ['PENDING', 'SUCCESS', 'FAILURE']
  })

  const initialState = {
    isPending: false,
    response: null,
    error: {
      message: 'why u breaking things'
    }
  }

  // Pending action
  let state = reducer(initialState, {
    type: 'PENDING'
  })

  t.deepEqual(state, {
    error: {
      message: 'why u breaking things'
    },
    isPending: true,
    response: null
  })

  // Success action
  state = reducer(initialState, {
    type: 'SUCCESS',
    payload: {
      data: {}
    }
  })

  t.deepEqual(state, {
    error: null,
    isPending: false,
    response: {
      data: {}
    }
  })

  // Failure action
  state = reducer(initialState, {
    type: 'FAILURE',
    payload: {
      message: 'Some fake error'
    }
  })

  t.deepEqual(state, {
    error: {
      message: 'Some fake error'
    },
    isPending: false,
    response: null
  })
})
