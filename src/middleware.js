import { API_ACTION_TYPE } from './'

export default ({ dispatch }) => next => action => {
  const apiAction = action[API_ACTION_TYPE]

  // Ignore non-api actions.
  if (typeof apiAction !== 'object') {
    return next(action)
  }

  const PENDING_TYPE = apiAction.types[0]
  const SUCCESS_TYPE = apiAction.types[1]
  const FAILURE_TYPE = apiAction.types[2]

  dispatch({
    type: PENDING_TYPE
  })

  return new Promise((resolve, reject) => {
    fetch(apiAction.endpoint).then(response => {
      if (!response.ok) {
        throw response
      }

      return response.json()
    }).then(json => {
      const successAction = dispatch({
        type: SUCCESS_TYPE,
        payload: json
      })

      resolve(successAction)
    }).catch(error => {
      const failureAction = dispatch({
        type: FAILURE_TYPE,
        payload: error
      })

      reject(failureAction)
    })
  })
}
