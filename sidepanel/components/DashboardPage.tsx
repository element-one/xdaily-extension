import { Bookmark, FolderOpenDot, Lightbulb, Settings } from "lucide-react"
import { useEffect, useMemo, useState, type ReactNode } from "react"

import { MeNavbarItem } from "./MeNavbarItem"
import { AiSuggestionPanel } from "./panels/AiSuggestionPanel/AiSuggestionPanel"
import { BoardPanel } from "./panels/BoardPanel/BoardPanel"
import { SearchPanel } from "./panels/SearchPanel/SearchPanel"
import { SettingPanel } from "./panels/SettingPanel"
import { UserAvatar } from "./UserAvatar"

enum NavbarItemKey {
  SEARCH = "search",
  SUGGESTION = "ai suggestions",
  BOARD = "board",
  SETTING = "setting"
}

type NavbarItem = {
  key: NavbarItemKey
  icon: ReactNode
  tooltip: string
  component: ReactNode
}

const NavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.SEARCH,
    icon: <Bookmark className="w-5 h-5" />,
    tooltip: "Bookmarks",
    component: <SearchPanel />
  },
  {
    key: NavbarItemKey.SUGGESTION,
    icon: <Lightbulb className="w-5 h-5" />,
    tooltip: "AI Suggestions",
    component: <AiSuggestionPanel />
  },
  {
    key: NavbarItemKey.BOARD,
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
  const [navbarItemKey, setNavbarItemKey] = useState<NavbarItemKey>(
    NavbarItemKey.SEARCH
  )

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

  const checkTweetDetailPage = (url: string) => {
    if (url.includes("/status/")) {
      // go to suggestion panel if is tweet detail page
      toggleDrawer(NavbarItemKey.SUGGESTION)
    }
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const currentTab = tabs[0]
        checkTweetDetailPage(currentTab.url || "")
      }
    })

    const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete" && tab.url) {
        checkTweetDetailPage(tab.url)
      }
    }

    chrome.tabs.onUpdated.addListener(handleTabUpdate)

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate)
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
