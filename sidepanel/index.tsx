import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "../styles/global.css"

import { useEffect, useMemo } from "react"

import { useUser } from "~services/user"
import { useStore } from "~store/store"
import { MessageType } from "~types/message"

import { DashboardPage } from "./components/DashboardPage"
import { I18nProvider } from "./components/I18nProvider"
import { LoginPage } from "./components/LoginPage"
import { Loading } from "./components/ui/Loading"
import { ToastProvider } from "./components/ui/Toast"

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
    const port = chrome.runtime.connect({ name: "sidepanel" })
    return () => {
      port.disconnect()
    }
  }, [])

  const defaultLang = useMemo(() => {
    if (userInfo?.lang) {
      return userInfo?.lang === "en" ? "en" : "zh"
    }
    return ""
  }, [userInfo])

  if (isLoading) {
    return <Loading />
  }

  return (
    <I18nProvider defaultLang={defaultLang}>
      <div className="flex flex-row w-full h-screen overflow-hidden bg-fill-bg-deep font-geist">
        {isAuthenticated ? <DashboardPage /> : <LoginPage />}
      </div>
    </I18nProvider>
  )
}

const RootApp = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <IndexSidePanel />
    </ToastProvider>
  </QueryClientProvider>
)

export default RootApp
