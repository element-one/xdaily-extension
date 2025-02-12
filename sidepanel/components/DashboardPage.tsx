import { Bookmark, FolderOpenDot, Search, Settings } from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"

import { MeNavbarItem } from "./MeNavbarItem"
import { AiSuggestionPanel } from "./panels/AiSuggestionPanel"
import { BoardPanel } from "./panels/BoardPanel"
import { SearchPanel } from "./panels/SearchPanel/SearchPanel"
import { SettingPanel } from "./panels/SettingPanel"

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
    icon: <Search className="w-5 h-5" />,
    tooltip: "Search",
    component: <SearchPanel />
  },
  {
    key: NavbarItemKey.SUGGESTION,
    icon: <Bookmark className="w-5 h-5" />,
    tooltip: "AI Suggestions",
    component: <AiSuggestionPanel />
  },
  {
    key: NavbarItemKey.BOARD,
    icon: <FolderOpenDot className="w-5 h-5" />,
    tooltip: "Board",
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
            <div className="w-8 h-8 bg-primary-brand rounded-full"></div>
          </div>
        </aside>
      </div>
    </div>
  )
}
