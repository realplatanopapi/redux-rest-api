import { API_ACTION_TYPE } from './constants'

const initialState = {
  error: null,
  isPending: false,
  response: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case API_ACTION_TYPE:
      return state
    default:
      return state
  }
}
