import { useEffect, useState, type FC } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { useStore } from "~store/store"
import { NavbarItemKey, UserPanelItemKey, X_SITE } from "~types/enum"

import { ChatStatusSection } from "./ChatStatusSection"

export const ChatSection: FC = () => {
  const { setNavbarItemKey, setUserPanelItemKey } = useStore()
  const [screenName, setScreenName] = useState<string>("") // screen name is extra from the site url

  useEffect(() => {
    const isTwitterDomain = (urlStr: string) => {
      try {
        const url = new URL(urlStr)
        return (
          url.hostname.endsWith("twitter.com") || url.hostname.endsWith("x.com")
        )
      } catch (e) {
        return false
      }
    }

    const extractTwitterUsername = (url: string): string | null => {
      if (!isTwitterDomain(url)) return ""
      const RESERVED_PATHS = new Set([
        "home",
        "explore",
        "search",
        "settings",
        "notifications"
      ])
      const match = url.match(
        /https?:\/\/(x\.com|twitter\.com)\/([^/?#]+)(?:\/|$|\?|#)/
      )
      if (!match) return null

      const username = match[2]
      return RESERVED_PATHS.has(username) ? null : username
    }

    const init = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      const username = tab?.url ? extractTwitterUsername(tab.url) : null
      if (username) {
        // avoid change when it is empty
        setScreenName(username)
      }
    }

    init()

    const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete" && tab.url) {
        const username = extractTwitterUsername(tab.url)
        // avoid change when it is empty
        if (username) {
          setScreenName(username)
        }
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

  const handleGoCollection = () => {
    setNavbarItemKey(NavbarItemKey.EXPLORE)
    setUserPanelItemKey(UserPanelItemKey.LIST)
  }

  const handleGoX = () => {
    chrome.tabs.create({
      url: X_SITE
    })
  }

  if (!screenName) {
    return (
      <div className="flex gap-y-4 rounded-md flex-col h-full text-text-default-primary items-center justify-center">
        <div className="text-base font-semibold">Choose a user...</div>
        <div className="flex flex-col gap-2">
          <Button onClick={handleGoX}>From web</Button>
          <Button onClick={handleGoCollection} variant="secondary">
            From KOLs
          </Button>
        </div>
      </div>
    )
  }

  return <ChatStatusSection screenName={screenName} key={screenName} />
}
