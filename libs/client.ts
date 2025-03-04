import axios from "axios"

declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorHandler?: boolean
  }
}

const client = axios.create({
  headers: {},
  baseURL: `${process.env.PLASMO_PUBLIC_SERVER_URL}`,
  withCredentials: true
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.skipErrorHandler) {
      return Promise.reject(error)
    }

    // if (error.response) {
    //   console.error(
    //     "Response error:",
    //     error.response.status,
    //     error.response.data
    //   )
    // } else if (error.request) {
    //   console.error("Request error:", error.request)
    // } else {
    //   console.error("Error:", error.message)
    // }

    return Promise.reject(error)
  }
)

export default client
