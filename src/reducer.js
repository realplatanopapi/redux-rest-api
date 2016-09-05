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

  return function apiReducer (state = initialState, { type, payload }) {
    return state
  }
}
