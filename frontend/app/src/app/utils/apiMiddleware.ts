import axios from 'axios'

const API_HOST = `${process.env.NEXT_PUBLIC_API_HOST}/api`
const config = {
  baseURL: API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}

export const api = axios.create(config)

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    if (response.data.code !== 200) {
      return response
    }
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)
