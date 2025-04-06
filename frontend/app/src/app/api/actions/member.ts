import * as actionType from '@api/constant/member'
import { api } from '@utils/apiMiddleware'
import { AppDispatch } from 'app/store'
import qs from 'query-string'

interface Props {
  query?: Record<string, any> | {}
  body?: object
}

export const getAllMembers = () => (dispatch: AppDispatch) => {
  dispatch({ type: actionType.getAllMembers.request })
  return api
    .get(`/v1/member`)
    .then((res) => {
      if (res.data?.code === 200) {
        dispatch({
          type: actionType.getAllMembers.success,
          payload: res.data?.data,
        })
        return res.data?.data
      } else {
        dispatch({
          type: actionType.getAllMembers.failure,
          payload: res.data,
        })
        return Promise.resolve('error')
      }
    })
    .catch((error) => {
      dispatch({
        type: actionType.getAllMembers.failure,
        payload: error.response ?? { msg: 'server_error' },
      })
    })
}

export const postMember =
  ({ body }: Props) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: actionType.postMember.request })
    return api
      .post(`/v1/member`, body)
      .then((res) => {
        console.log('res', res)
        if (res.data?.code === 200) {
          dispatch({
            type: actionType.postMember.success,
            payload: res.data?.data,
          })
        } else {
          dispatch({
            type: actionType.postMember.failure,
            payload: res.data,
          })
          return Promise.resolve('error')
        }
      })
      .catch((error) => {
        dispatch({
          type: actionType.postMember.failure,
          payload: error.response ?? { msg: 'server_error' },
        })
      })
      .finally(() => {
        dispatch(getAllMembers())
      })
  }

export const deleteMember =
  ({ query = {} }: Props) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: actionType.deleteMember.request })
    return api
      .delete(`/v1/member?${qs.stringify(query)}`)
      .then((res) => {
        if (res.data?.code === 200) {
          dispatch({
            type: actionType.deleteMember.success,
            payload: res.data?.data,
          })
        } else {
          dispatch({
            type: actionType.deleteMember.failure,
            payload: res.data,
          })
          return Promise.resolve('error')
        }
      })
      .catch((error) => {
        dispatch({
          type: actionType.deleteMember.failure,
          payload: error.response ?? { msg: 'server_error' },
        })
      })
      .finally(() => {
        dispatch(getAllMembers())
      })
  }
