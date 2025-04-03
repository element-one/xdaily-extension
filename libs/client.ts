import axios from "axios"

import { useStore } from "~store/store"

const client = axios.create({
  headers: {},
  baseURL: `${process.env.PLASMO_PUBLIC_SERVER_URL}`,
  withCredentials: true
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const { clearUserInfo } = useStore.getState()
    if (error.response?.status == 401) {
      clearUserInfo()
    }
    return Promise.reject(error)
  }
)

export default client
