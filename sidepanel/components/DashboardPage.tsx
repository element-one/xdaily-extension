import { AtomIcon } from "lucide-react"
import { useEffect, useMemo, type FC, type ReactNode } from "react"
import robotImg from "url:/assets/robot.png" // strange

import { useStore } from "~store/store"
import { NavbarItemKey, UserPanelItemKey } from "~types/enum"
import { MessageType, type QuoteTweetPayload } from "~types/message"

import AddIcon from "./icons/AddIcon"
import ExploreIcon from "./icons/ExploreIcon"
import KnowledgeBaseIcon from "./icons/KnowlegeBaseIcon"
import MemoIcon from "./icons/MemoIcon"
import MessageIcon from "./icons/MessageIcon"
import ReminderIcon from "./icons/ReminderIcon"
import SettingIcon from "./icons/SettingIcon"
import SheetIcon from "./icons/SheetIcon"
import { MeNavbarItem } from "./MeNavbarItem"
import { ChatPanel } from "./panels/ChatPanel/ChatPanel"
import { MemoPanel } from "./panels/MemoPanel/MemoPanel"
import { SheetPanel } from "./panels/SheetPanel/SheetPanel"
import { UserNavbarItem } from "./UserNavbarItem"

// import { BoardPanel } from "./panels/BoardPanel/BoardPanel"
// import { ChatPanel } from "./panels/ChatPanel/ChatPanel"
// import { MemoPanel } from "./panels/MemoPanel/MemoPanel"
// import { PostPanel } from "./panels/PostPanel/PostPanel"
// import { SettingPanel } from "./panels/SettingPanel"
// import { UserPanel } from "./panels/UserPanel/UserPanel"
// import { Button } from "./ui/button"
// import { UserAvatar } from "./UserAvatar"

type NavbarItem = {
  key: NavbarItemKey
  icon: FC<{
    className?: string
  }>

  tooltip: string
  component: ReactNode
}

const NavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.EXPLORE,
    icon: ExploreIcon,
    tooltip: "Explore",
    component: <div>explore</div>
  },
  {
    key: NavbarItemKey.SETTING,
    icon: SettingIcon,
    tooltip: "Setting",
    component: <div>setting</div>
  },
  {
    key: NavbarItemKey.KNOWLEDGE,
    icon: KnowledgeBaseIcon,
    tooltip: "Knowledge Base",
    component: <div>knowledge base</div>
  },
  {
    key: NavbarItemKey.MEMO,
    icon: MemoIcon,
    tooltip: "Memo",
    component: <MemoPanel />
  },
  {
    key: NavbarItemKey.SHEET,
    icon: SheetIcon,
    tooltip: "Sheet",
    component: <SheetPanel />
  },
  {
    key: NavbarItemKey.REMINDER,
    icon: ReminderIcon,
    tooltip: "Reminder",
    component: <div>reminder</div>
  },
  {
    key: NavbarItemKey.ADD,
    icon: AddIcon,
    tooltip: "Add",
    component: <div>add</div>
  }
] as const

const BottomNavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.MESSAGE,
    icon: MessageIcon,
    tooltip: "Messages",
    component: <div>messages</div>
  }
] as const

const ChatNavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.CHAT,
    icon: AtomIcon,
    tooltip: "",
    component: <ChatPanel />
  }
]

export const DashboardPage = () => {
  const {
    navbarItemKey,
    setNavbarItemKey,
    clearNavbar,
    setUserPanelItemKey,
    setQuoteTweet
  } = useStore()

  const currentNavbarItem = useMemo(() => {
    if (navbarItemKey) {
      const AllNavbarItems =
        NavbarItems.concat(ChatNavbarItems).concat(BottomNavbarItems)
      return AllNavbarItems.find((item) => item.key === navbarItemKey)
    }
    return undefined
  }, [navbarItemKey])

  const toggleDrawer = (itemKey: NavbarItemKey) => {
    if (itemKey !== navbarItemKey) {
      setNavbarItemKey(itemKey)
    }
  }

  // const checkTweetPage = (urlString: string) => {
  //   const url = new URL(urlString)
  //   const pathSegments = url.pathname.split("/").filter(Boolean)

  //   // const isTweetDetail =
  //   //   pathSegments.length >= 3 &&
  //   //   pathSegments[1] === "status" &&
  //   //   /^\d+$/.test(pathSegments[2])

  //   const RESERVED_PATHS = ["search", "settings", "notifications"]
  //   const isUserProfile =
  //     pathSegments.length === 1 && !RESERVED_PATHS.includes(pathSegments[0])

  //   if (isUserProfile) {
  //     // go to chat panel if is tweet profile page
  //     toggleDrawer(NavbarItemKey.USER)
  //     setTimeout(() => {
  //       setUserPanelItemKey(UserPanelItemKey.CHAT)
  //     }, 50)
  //   }
  //   // else if (isTweetDetail) {
  //   //   // go to suggestion panel if is tweet detail page
  //   //   toggleDrawer(NavbarItemKey.SUGGESTION)
  //   // }
  // }

  useEffect(() => {
    clearNavbar()

    // const checkCurrentTab = () => {
    //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //     if (tabs[0]?.url) checkTweetPage(tabs[0].url)
    //   })
    // }
    // checkCurrentTab()

    // const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
    //   if (changeInfo.status === "complete" && tab.url) {
    //     checkTweetPage(tab.url)
    //   }
    // }
    // const handleTabActivated = () => {
    //   checkCurrentTab()
    // }

    const messageListener = (message: QuoteTweetPayload) => {
      if (message.type === MessageType.QUOTE_TWEET) {
        setQuoteTweet(message.data)
        toggleDrawer(NavbarItemKey.CHAT)
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)
    // chrome.tabs.onUpdated.addListener(handleTabUpdate)
    // chrome.tabs.onActivated.addListener(handleTabActivated)
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
      // chrome.tabs.onUpdated.removeListener(handleTabUpdate)
      // chrome.tabs.onActivated.removeListener(handleTabActivated)
    }
  }, [])

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden">
      {/* main */}
      <div className="flex flex-col relative p-1 transition-all w-[calc(100%-68px)]">
        <div className="bg-fill-bg-deep text-text-default-primary w-full relative flex-1 overflow-hidden rounded-xl">
          <div className="p-4 h-screen">
            <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
              {currentNavbarItem?.component}
            </div>
          </div>
        </div>
      </div>
      <aside className="max-w-[68px] p-4 flex flex-col items-center gap-4 h-full w-[68px]">
        {/* top tabs */}
        <div className="flex-grow flex items-center overflow-y-auto gap-4 flex-col">
          <img
            src={robotImg}
            alt="chat robot"
            className="w-9 h-9 object-contain cursor-pointer"
            onClick={() => toggleDrawer(NavbarItemKey.CHAT)}
          />
          {NavbarItems.map((item) => {
            return (
              <MeNavbarItem
                key={item.key}
                handleClick={() => toggleDrawer(item.key)}
                isTargeted={item.key === currentNavbarItem.key}
                icon={item.icon}
                tooltip={item.tooltip}
              />
            )
          })}
        </div>
        {/* bottom buttons */}
        <div className="flex flex-col gap-4">
          {BottomNavbarItems.map((item) => {
            return (
              <MeNavbarItem
                key={item.key}
                handleClick={() => toggleDrawer(item.key)}
                isTargeted={item.key === currentNavbarItem.key}
                icon={item.icon}
                tooltip={item.tooltip}
              />
            )
          })}
          <UserNavbarItem />
        </div>
      </aside>
    </div>
  )
}
