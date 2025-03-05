import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "../styles/global.css"

import { useUser } from "~services/user"
import { MessageType } from "~types/enum"

import { DashboardPage } from "./components/DashboardPage"
import { LoginPage } from "./components/LoginPage"

const queryClient = new QueryClient()

const IndexSidePanel = () => {
  // TODO persist
  const { data, isLoading, refetch, isError } = useUser({
    retry: 0
  })
  const isAuthenticated = !isError && data && !!data.id

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === MessageType.SIDE_PANEL_CLOSE_ITSELF) {
      window.close()
    } else if (message.type === MessageType.CHECK_AUTH) {
      refetch()
    }
  })

  if (isLoading) {
    return (
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
