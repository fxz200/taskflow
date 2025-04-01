import * as actionType from '@api/constant/sprint'
import { api } from '@utils/apiMiddleware'
import { AppDispatch } from 'app/store'
import qs from 'query-string'

interface Props {
  query: Record<string, any> | {}
  body?: object
}

export const getAllSprints =
  () =>
  (dispatch: AppDispatch) => {
    dispatch({ type: actionType.getAllSprints.request })
    return api
      .get(`/v1/sprint`)
      .then((res) => {
        if (res.data?.code === 200) {
          dispatch({
            type: actionType.getAllSprints.success,
            payload: res.data?.data,
          })
          return res.data?.data
        } else {
          dispatch({
            type: actionType.getAllSprints.failure,
            payload: res.data,
          })
          return Promise.resolve('error')
        }
      })
      .catch((error) => {
        dispatch({
          type: actionType.getAllSprints.failure,
          payload: error.response ?? { msg: 'server_error' },
        })
      })
  }

export const getSprint =
  ({ query }: Props) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: actionType.getSprint.request })
    return api
      .get(`/v1/sprint?${qs.stringify(query)}`)
      .then((res) => {
        if (res.data?.code === 200) {
          dispatch({
            type: actionType.getSprint.success,
            payload: res.data?.data,
          })
          return res.data?.data
        } else {
          dispatch({
            type: actionType.getSprint.failure,
            payload: res.data,
          })
          return Promise.resolve('error')
        }
      })
      .catch((error) => {
        dispatch({
          type: actionType.getSprint.failure,
          payload: error.response ?? { msg: 'server_error' },
        })
      })
  }

export const postSprint =
  ({ query, body }: Props) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: actionType.postSprint.request })
    return api
      .post(`/v1/sprint?${qs.stringify(query)}`, body)
      .then((res) => {
        if (res.data?.code === 200) {
          dispatch({
            type: actionType.postSprint.success,
            payload: res.data?.data,
          })
          return res.data?.data
        } else {
          dispatch({
            type: actionType.postSprint.failure,
            payload: res.data,
          })
          return Promise.resolve('error')
        }
      })
      .catch((error) => {
        dispatch({
          type: actionType.postSprint.failure,
          payload: error.response ?? { msg: 'server_error' },
        })
      })
  }
