import { useEffect, useState } from "react"

export const ChatPanel = () => {
  const [agentId, setAgentId] = useState<string>("")
  useEffect(() => {
    const extractTwitterUsername = (url: string): string | null => {
      const match = url.match(/https?:\/\/(x\.com|twitter\.com)\/([^/]+)/)
      return match ? match[2] : null
    }

    const init = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      const username = tab?.url ? extractTwitterUsername(tab.url) : null
      setAgentId(username || "")
    }

    init()

    const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete" && tab.url) {
        const username = extractTwitterUsername(tab.url)
        setAgentId(username || "")
      }
    }
    const handleTabActivated = () => {
      init()
    }
    chrome.tabs.onUpdated.addListener(handleTabUpdate)
    chrome.tabs.onActivated.addListener(handleTabActivated)
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate)
      chrome.tabs.onActivated.removeListener(handleTabActivated)
    }
  }, [])
  return <div>{agentId}</div>
}
