const API_BASE_URL = "https://jsonplaceholder.typicode.com" // TODO real url

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getAuthToken() // cookies or storage

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) }
  })

  if (!response.ok) {
    throw new Error(`API failed: ${response.statusText}`)
  }
  return response.json()
}

// cookies or storage
const getAuthToken = async () => {
  return new Promise<string>((resolve) => {
    chrome.storage.local.get("authToken", (data) => {
      resolve(data.authToken || "")
    })
  })
}
