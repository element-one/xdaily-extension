import { useState } from "react"

import "../styles/global.css"

import { DashboardPage } from "./components/DashboardPage"
import { LoginPage } from "./components/LoginPage"

const IndexSidePanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "sidepanel_close_self") {
      window.close()
    }
  })

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden bg-muted">
      {isAuthenticated ? <DashboardPage /> : <LoginPage />}
    </div>
  )
}

export default IndexSidePanel
