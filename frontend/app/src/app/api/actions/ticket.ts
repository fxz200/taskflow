import * as actionType from '@api/constant/ticket'
import { api } from '@utils/apiMiddleware'
import { AppDispatch } from 'app/store'
import qs from 'query-string'

interface Props {
  query?: Record<string, any> | {}
  body?: object
}

export const getTickets = (query: any) => (dispatch: AppDispatch) => {
  dispatch({ type: actionType.getTickets.request })
  return api
    .get(`/v1/ticket?${qs.stringify(query)}`)
    .then((res) => {
      if (res.data?.code === 200) {
        dispatch({
          type: actionType.getTickets.success,
          payload: res.data?.data,
        })
        return res.data?.data
      } else {
        dispatch({
          type: actionType.getTickets.failure,
          payload: res.data,
        })
        return Promise.resolve('error')
      }
    })
    .catch((error) => {
      dispatch({
        type: actionType.getTickets.failure,
        payload: error,
      })
    })
}

export const postTicket = ({body}: Props) => (dispatch: AppDispatch) => {
  dispatch({ type: actionType.postTicket.request })
  return api
    .post(`/v1/ticket`, body)
    .then((res) => {
      if (res.data?.code === 200) {
        dispatch({
          type: actionType.postTicket.success,
          payload: res.data?.data,
        })
        return res.data?.data
      } else {
        dispatch({
          type: actionType.postTicket.failure,
          payload: res.data,
        })
        return Promise.resolve('error')
      }
    })
    .catch((error) => {
      dispatch({
        type: actionType.postTicket.failure,
        payload: error,
      })
    }).finally(() => {
      dispatch(getTickets({}))
    })
}

export const putTicket = ({body}: Props) => (dispatch: AppDispatch) => {
  dispatch({ type: actionType.postTicket.request })
  return api
    .put(`/v1/ticket`, body)
    .then((res) => {
      if (res.data?.code === 200) {
        dispatch({
          type: actionType.postTicket.success,
          payload: res.data?.data,
        })
        return res.data?.data
      } else {
        dispatch({
          type: actionType.postTicket.failure,
          payload: res.data,
        })
        return Promise.resolve('error')
      }
    })
    .catch((error) => {
      dispatch({
        type: actionType.postTicket.failure,
        payload: error,
      })
    }).finally(() => {
      dispatch(getTickets({}))
    })
}

export const deleteTicket = ({body}: Props) => (dispatch: AppDispatch) => {
  dispatch({ type: actionType.postTicket.request })
  return api
    .delete(`/v1/ticket`, body)
    .then((res) => {
      if (res.data?.code === 200) {
        dispatch({
          type: actionType.postTicket.success,
          payload: res.data?.data,
        })
        return res.data?.data
      } else {
        dispatch({
          type: actionType.postTicket.failure,
          payload: res.data,
        })
        return Promise.resolve('error')
      }
    })
    .catch((error) => {
      dispatch({
        type: actionType.postTicket.failure,
        payload: error,
      })
    }).finally(() => {
      dispatch(getTickets({}))
    })
}