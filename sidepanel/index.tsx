import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "../styles/global.css"

import { useEffect, useRef } from "react"

import { useUser } from "~services/user"
import { useStore } from "~store/store"
import { MessageType } from "~types/message"

import { DashboardPage } from "./components/DashboardPage"
import { LoginPage } from "./components/LoginPage"

const queryClient = new QueryClient()

const IndexSidePanel = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    updateUserInfo,
    userInfo,
    clearUserInfo
  } = useStore()

  const { data, isLoading, isError, refetch } = useUser({
    retry: 0,
    enabled: !isAuthenticated,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const localData = isError ? undefined : data

  useEffect(() => {
    // clear user info if not authenticated
    if (!isAuthenticated) {
      updateUserInfo(null)
    }
    if (isAuthenticated && userInfo) {
      return
    }
    if (localData && localData.id) {
      setIsAuthenticated(true)
      updateUserInfo(localData)
    } else {
      clearUserInfo()
    }
  }, [localData, isAuthenticated, isError])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === MessageType.SIDE_PANEL_CLOSE_ITSELF) {
        window.close()
      } else if (message.type === MessageType.CHECK_AUTH) {
        refetch()
      }
    })
  }, [])

  if (isLoading) {
    return (
      // TODO
      <div className="w-full h-screen flex items-center justify-center bg-muted text-slate-900 text-lg">
        loading...
      </div>
    )
  }

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden bg-fill-bg-deep">
      {/* {isAuthenticated ? <DashboardPage /> : <LoginPage />} */}
      <DashboardPage />
    </div>
  )
}

const RootApp = () => (
  <QueryClientProvider client={queryClient}>
    <IndexSidePanel />
  </QueryClientProvider>
)

export default RootApp
