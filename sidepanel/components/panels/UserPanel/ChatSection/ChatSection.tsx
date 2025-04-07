import { useEffect, useState } from "react"

import { useStore } from "~store/store"
import { NavbarItemKey, UserPanelItemKey, X_SITE } from "~types/enum"

import { ChatStatusSection } from "./ChatStatusSection"

export const ChatSection = () => {
  const { setNavbarItemKey, setUserPanelItemKey } = useStore()
  const [screenName, setScreenName] = useState<string>("") // screen name is extra from the site url

  //   get user agent id from the current active tab url
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
    setNavbarItemKey(NavbarItemKey.USER)
    setUserPanelItemKey(UserPanelItemKey.LIST)
  }

  const handleGoX = () => {
    chrome.tabs.create({
      url: X_SITE
    })
  }

  if (!screenName) {
    return (
      <div className="flex gap-y-4 rounded-md flex-col h-full bg-gray-50 items-center justify-center">
        <div className="text-base font-semibold">Choose a user...</div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleGoX}
            className="rounded-md bg-primary-brand text-white  px-4 py-2 hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary-brand">
            From web
          </button>
          <button
            onClick={handleGoCollection}
            className="rounded-md border-2 border-primary-brand text-primary-brand  hover:bg-slate-100  px-4 py-2  focus:outline-none focus:ring-2 focus:ring-primary-brand">
            From Users
          </button>
        </div>
      </div>
    )
  }

  return <ChatStatusSection screenName={screenName} key={screenName} />
}
