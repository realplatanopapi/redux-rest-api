import extend from 'object-assign'

const initialState = {
  error: null,
  isPending: false,
  response: null
}

export default function configureApiReducer ({ types } = {}) {
  if (typeof types !== 'object') {
    throw new Error('Missing `types` array.')
  } else if (!types.length || types.length !== 3) {
    throw new Error('`types` must be an array of 3 strings')
  }

  const PENDING_TYPE = types[0]
  const SUCCESS_TYPE = types[1]
  const FAILURE_TYPE = types[2]

  return function apiReducer (state = initialState, { type, payload }) {
    switch (type) {
      case PENDING_TYPE:
        return extend({}, state, {
          isPending: true
        })
      case SUCCESS_TYPE:
        return extend({}, state, {
          error: null,
          isPending: false,
          response: payload
        })
      case FAILURE_TYPE:
        return extend({}, state, {
          error: payload,
          isPending: false
        })
      default:
        return state
    }
  }
}
