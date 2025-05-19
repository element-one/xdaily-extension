import { useEffect, useState, type FC } from "react"

import { useStore } from "~store/store"
import { NavbarItemKey, UserPanelItemKey, X_SITE } from "~types/enum"

import { ChatStatusSection } from "./ChatStatusSection"

interface ChatSetionProps {
  screenName?: string
}
export const ChatSection: FC<ChatSetionProps> = ({ screenName = "" }) => {
  const { setNavbarItemKey, setUserPanelItemKey } = useStore()

  const handleGoCollection = () => {
    setNavbarItemKey(NavbarItemKey.KNOWLEDGE)
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
