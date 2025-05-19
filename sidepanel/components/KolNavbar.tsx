import clsx from "clsx"
import { useEffect, useMemo, useRef, useState, type FC } from "react"

import { useKolCollections } from "~services/collection"
import type { KolCollection } from "~types/collection"
import { X_SITE } from "~types/enum"

import { Avatar } from "./ui/Avatar"

export const KolNavbar: FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useKolCollections(15, "")
  const bottomObserver = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (bottomObserver.current) observer.observe(bottomObserver.current)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const collection = useMemo(() => {
    return [...(data?.pages ? data.pages : [])]
  }, [data])

  const handleClickKol = (kol: KolCollection) => {
    chrome.tabs.create({
      url: `${X_SITE}/${kol.screenName}`
    })
  }

  return (
    <div className="flex flex-col h-full text-white flex-1 min-h-0 overflow-y-auto hide-scrollbar">
      {collection?.length && (
        <section className="flex flex-col gap-4 flex-1 overflow-y-scroll stylized-scroll">
          {collection.map((kol) => (
            <div
              key={kol.id}
              onClick={() => handleClickKol(kol)}
              className={clsx(
                "cursor-pointer w-9 h-9 flex items-center justify-center border rounded-full",
                screenName === kol.screenName
                  ? "border-border-regular"
                  : "border-transparent"
              )}>
              <Avatar
                className="w-6 h-6"
                url={kol.avatar}
                alt={kol.screenName}
              />
            </div>
          ))}
        </section>
      )}
      {/* load more */}
      <div ref={bottomObserver} className="h-6 w-full" />
    </div>
  )
}
