import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "../styles/global.css"

import { useEffect } from "react"

import { useUser } from "~services/user"
import { useStore } from "~store/store"
import { MessageType } from "~types/enum"

import { DashboardPage } from "./components/DashboardPage"
import { LoginPage } from "./components/LoginPage"

const queryClient = new QueryClient()

const IndexSidePanel = () => {
  const { isAuthenticated, setIsAuthenticated, updateUserInfo } = useStore()
  const { data, isLoading, refetch } = useUser({
    retry: 0,
    enabled: !isAuthenticated
  })

  useEffect(() => {
    if (isAuthenticated) {
      return
    }
    if (data && data.id) {
      setIsAuthenticated(true)
      updateUserInfo(data)
    } else {
      setIsAuthenticated(false)
      updateUserInfo(null)
    }
  }, [data, isAuthenticated])

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === MessageType.SIDE_PANEL_CLOSE_ITSELF) {
      window.close()
    } else if (message.type === MessageType.CHECK_AUTH) {
      setIsAuthenticated(false)
      refetch()
    }
  })

  if (isLoading) {
    return (
      // TODO
      <div className="w-full h-screen flex items-center justify-center bg-muted text-slate-900 text-lg">
        loading...
      </div>
    )
  }

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden bg-muted">
      {isAuthenticated ? <DashboardPage /> : <LoginPage />}
    </div>
  )
}

const RootApp = () => (
  <QueryClientProvider client={queryClient}>
    <IndexSidePanel />
  </QueryClientProvider>
)

export default RootApp
