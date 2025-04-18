import {
  BotMessageSquare,
  FolderOpenDot,
  Settings,
  TwitterIcon,
  UserIcon
} from "lucide-react"
import { useEffect, useMemo, type ReactNode } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { useStore } from "~store/store"
import { NavbarItemKey, UserPanelItemKey } from "~types/enum"
import { MessageType, type QuoteTweetPayload } from "~types/message"

import { MeNavbarItem } from "./MeNavbarItem"
import { AiSuggestionPanel } from "./panels/AiSuggestionPanel/AiSuggestionPanel"
import { BoardPanel } from "./panels/BoardPanel/BoardPanel"
import { ChatPanel } from "./panels/ChatPanel/ChatPanel"
import { PostPanel } from "./panels/PostPanel/PostPanel"
import { SettingPanel } from "./panels/SettingPanel"
import { UserPanel } from "./panels/UserPanel/UserPanel"
import { UserAvatar } from "./UserAvatar"

type NavbarItem = {
  key: NavbarItemKey
  icon: ReactNode
  tooltip: string
  component: ReactNode
}

const NavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.POST,
    icon: <TwitterIcon className="w-5 h-5" />,
    tooltip: "Posts",
    component: <PostPanel />
  },
  {
    key: NavbarItemKey.USER,
    icon: <UserIcon className="w-5 h-5" />,
    tooltip: "Users",
    component: <UserPanel />
  },
  // {
  //   key: NavbarItemKey.SUGGESTION,
  //   icon: <Lightbulb className="w-5 h-5" />,
  //   tooltip: "AI Suggestions",
  //   component: <AiSuggestionPanel />
  // },
  {
    key: NavbarItemKey.CHAT,
    icon: <BotMessageSquare className="w-5 h-5" />,
    tooltip: "Chat",
    component: <ChatPanel />
  },
  {
    key: NavbarItemKey.COLLECTION,
    icon: <FolderOpenDot className="w-5 h-5" />,
    tooltip: "Collections",
    component: <BoardPanel />
  }
] as const

const SettingNavbarItem: NavbarItem = {
  key: NavbarItemKey.SETTING,
  icon: <Settings className="w-5 h-5" />,
  tooltip: "Setting",
  component: <SettingPanel />
}

export const DashboardPage = () => {
  const { navbarItemKey, setNavbarItemKey, clearNavbar, setUserPanelItemKey } =
    useStore()

  const currentNavbarItem = useMemo(() => {
    if (navbarItemKey) {
      const AllNavbarItems = NavbarItems.concat(SettingNavbarItem)
      return AllNavbarItems.find((item) => item.key === navbarItemKey)
    }
    return undefined
  }, [navbarItemKey])

  const toggleDrawer = (itemKey: NavbarItemKey) => {
    setNavbarItemKey(itemKey)
  }

  const checkTweetPage = (urlString: string) => {
    const url = new URL(urlString)
    const pathSegments = url.pathname.split("/").filter(Boolean)

    // const isTweetDetail =
    //   pathSegments.length >= 3 &&
    //   pathSegments[1] === "status" &&
    //   /^\d+$/.test(pathSegments[2])

    const RESERVED_PATHS = ["search", "settings", "notifications"]
    const isUserProfile =
      pathSegments.length === 1 && !RESERVED_PATHS.includes(pathSegments[0])

    if (isUserProfile) {
      // go to chat panel if is tweet profile page
      toggleDrawer(NavbarItemKey.USER)
      setTimeout(() => {
        setUserPanelItemKey(UserPanelItemKey.CHAT)
      }, 50)
    }
    // else if (isTweetDetail) {
    //   // go to suggestion panel if is tweet detail page
    //   toggleDrawer(NavbarItemKey.SUGGESTION)
    // }
  }

  useEffect(() => {
    clearNavbar()

    const checkCurrentTab = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) checkTweetPage(tabs[0].url)
      })
    }
    checkCurrentTab()

    const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete" && tab.url) {
        checkTweetPage(tab.url)
      }
    }
    const handleTabActivated = () => {
      checkCurrentTab()
    }

    const messageListener = (message) => {
      if (message.type === MessageType.QUOTE_TWEET) {
        toggleDrawer(NavbarItemKey.CHAT)
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)
    chrome.tabs.onUpdated.addListener(handleTabUpdate)
    chrome.tabs.onActivated.addListener(handleTabActivated)
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
      chrome.tabs.onUpdated.removeListener(handleTabUpdate)
      chrome.tabs.onActivated.removeListener(handleTabActivated)
    }
  }, [])

  return (
    // TODO fonts
    <div className="flex flex-row w-full h-screen overflow-hidden bg-muted">
      {/* main */}
      <div className="flex flex-col relative p-1 transition-all w-[calc(100%-50px)]">
        <div className="bg-white w-full relative flex-1 overflow-hidden rounded-xl">
          <div className="p-4 h-screen">
            <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
              {currentNavbarItem?.component}
            </div>
          </div>
        </div>
      </div>
      {/* aside */}
      <div className="max-w-[50px] py-2 flex flex-col items-center gap-4 h-full w-[50px]">
        <aside className="flex h-full flex-col">
          {/* top tabs */}
          <div className="flex-grow flex items-center overflow-y-auto gap-4 flex-col">
            {NavbarItems.map((item) => {
              return (
                <MeNavbarItem
                  key={item.key}
                  handleClick={() => toggleDrawer(item.key)}
                  isTargeted={item.key === currentNavbarItem.key}
                  content={item.icon}
                  tooltip={item.tooltip}
                />
              )
            })}
          </div>
          {/* bottom buttons */}
          <div className="flex flex-col gap-4">
            {/* Settings */}
            <MeNavbarItem
              key={SettingNavbarItem.key}
              handleClick={() => toggleDrawer(SettingNavbarItem.key)}
              isTargeted={SettingNavbarItem.key === currentNavbarItem.key}
              content={SettingNavbarItem.icon}
              tooltip={SettingNavbarItem.tooltip}
            />
            <UserAvatar />
          </div>
        </aside>
      </div>
    </div>
  )
}
