import axios from "axios"

const client = axios.create({
  headers: {},
  baseURL: `${process.env.PLASMO_PUBLIC_SERVER_URL}`,
  withCredentials: true
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default client
