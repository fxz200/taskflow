import axios from 'axios'

const API_HOST = process.env.API_HOST
const config = {
  baseURL: API_HOST,
}

const api = axios.create(config)

api.interceptors.request.use(
  (config) => config,
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