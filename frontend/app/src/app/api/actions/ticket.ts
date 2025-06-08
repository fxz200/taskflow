import * as actionType from '@api/constant/ticket'
import { api } from '@utils/apiMiddleware'
import { AppDispatch } from 'app/store'
import qs from 'query-string'

interface Props {
  query?: Record<string, any> | {}
  body?: object
}

export const getAllTickets = () => (dispatch: AppDispatch) => {
  dispatch({ type: actionType.getAllTickets.request })
  return api
    .get(`/v1/ticket`)
    .then((res) => {
      if (res.data?.code === 200) {
        dispatch({
          type: actionType.getAllTickets.success,
          payload: res.data?.data,
        })
        return res.data?.data
      } else {
        dispatch({
          type: actionType.getAllTickets.failure,
          payload: res.data,
        })
        return Promise.resolve('error')
      }
    })
    .catch((error) => {
      dispatch({
        type: actionType.getAllTickets.failure,
        payload: error,
      })
    })
}

export const getSpecificTickets =
  ({ query = {} }: Props) =>
  (dispatch: AppDispatch) => {
    dispatch({ type: actionType.getSpecificTickets.request })
    return api
      .get(`/v1/ticket?${qs.stringify(query)}`)
      .then((res) => {
        if (res.data?.code === 200) {
          dispatch({
            type: actionType.getSpecificTickets.success,
            payload: res.data?.data,
          })
          return res.data?.data
        } else {
          dispatch({
            type: actionType.getSpecificTickets.failure,
            payload: res.data,
          })
          return Promise.resolve('error')
        }
      })
      .catch((error) => {
        dispatch({
          type: actionType.getSpecificTickets.failure,
          payload: error,
        })
      })
  }

export const postTicket =
  ({ body }: Props) =>
  (dispatch: AppDispatch) => {
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
      })
      .finally(() => {
        dispatch(getAllTickets())
      })
  }

export const putTicket =
  ({ body }: Props) =>
  (dispatch: AppDispatch) => {
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
      })
      .finally(() => {
        dispatch(getAllTickets())
      })
  }

export const deleteTicket =
  ({ body }: Props) =>
  (dispatch: AppDispatch) => {
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
      })
      .finally(() => {
        dispatch(getAllTickets())
      })
  }
