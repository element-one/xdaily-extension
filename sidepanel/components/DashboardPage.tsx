import clsx from "clsx"
import { AtomIcon } from "lucide-react"
import { useEffect, useMemo, type FC, type ReactNode } from "react"
import robotImg from "url:/assets/robot.png" // strange

import { useStore } from "~store/store"
import { NavbarItemKey } from "~types/enum"
import { MessageType, type QuoteTweetPayload } from "~types/message"

import ExploreIcon from "./icons/ExploreIcon"
import KnowledgeBaseIcon from "./icons/KnowlegeBaseIcon"
import MemoIcon from "./icons/MemoIcon"
import MessageIcon from "./icons/MessageIcon"
import ReminderIcon from "./icons/ReminderIcon"
import SettingIcon from "./icons/SettingIcon"
import SheetIcon from "./icons/SheetIcon"
import { KolChatSection } from "./KolChatSection/KolChatSection"
import { KolNavbar } from "./KolNavbar"
import { MeNavbarItem } from "./MeNavbarItem"
import { ChatPanel } from "./panels/ChatPanel/ChatPanel"
import { ExplorePanel } from "./panels/ExplorePanel/ExplorePanel"
import { InvitePanel } from "./panels/InvitePanel/InvitePanel"
import { KnowledgeBasePanel } from "./panels/KnowledgeBasePanel/KnowledgeBasePanel"
import { MemoPanel } from "./panels/MemoPanel/MemoPanel"
import { ReminderPanel } from "./panels/ReminderPanel/ReminderPanel"
import { SheetPanel } from "./panels/SheetPanel/SheetPanel"
import { StudioSettingPanel } from "./panels/StudioSettingPanel/StudioSettingPanel"
import { UserNavbarItem } from "./UserNavbarItem"

// import { SettingPanel } from "./panels/SettingPanel"

type NavbarItem = {
  key: NavbarItemKey
  icon: FC<{
    className?: string
  }>
  tooltip: string
  component: ReactNode
  wrapperClassName?: string
}

const NavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.EXPLORE,
    icon: ExploreIcon,
    tooltip: "Explore",
    component: <ExplorePanel />,
    wrapperClassName: "!p-0 !py-4"
  },
  {
    key: NavbarItemKey.SETTING,
    icon: SettingIcon,
    tooltip: "Studio",
    component: <StudioSettingPanel />
  },
  {
    key: NavbarItemKey.KNOWLEDGE,
    icon: KnowledgeBaseIcon,
    tooltip: "Knowledge Base",
    component: <KnowledgeBasePanel />
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
    component: <ReminderPanel />
  }
  // {
  //   key: NavbarItemKey.ADD,
  //   icon: AddIcon,
  //   tooltip: "Invite People",
  //   component: <InvitePanel />
  // }
] as const

const BottomNavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.INVITE,
    icon: MessageIcon,
    tooltip: "Invite User",
    component: <InvitePanel />
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
    setQuoteTweet,
    setKolScreenName
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
    setKolScreenName("")
    if (itemKey !== navbarItemKey) {
      setNavbarItemKey(itemKey)
    }
  }

  useEffect(() => {
    const messageListener = (message: QuoteTweetPayload) => {
      if (message.type === MessageType.QUOTE_TWEET) {
        setQuoteTweet(message.data)
        toggleDrawer(NavbarItemKey.CHAT)
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)

    const cleanup = () => {
      chrome.runtime.onMessage.removeListener(messageListener)
      clearNavbar()
      setKolScreenName("")
    }
    window.addEventListener("unload", cleanup)
    return () => {
      window.removeEventListener("unload", cleanup)
      chrome.runtime.onMessage.removeListener(messageListener)
      clearNavbar()
      setKolScreenName("")
    }
  }, [])

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden">
      {/* main */}
      <div className="flex flex-col relative p-1 transition-all w-[calc(100%-68px)]">
        <div className="bg-fill-bg-deep text-text-default-primary w-full relative flex-1 overflow-hidden rounded-xl">
          <div
            className={clsx(
              "py-4 pl-4 pr-0 h-screen",
              currentNavbarItem?.wrapperClassName
            )}>
            <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
              {currentNavbarItem?.component}
            </div>
          </div>
          <KolChatSection />
        </div>
      </div>
      <aside className="max-w-[68px] p-4 flex flex-col items-center gap-4 h-full w-[68px] bg-text-inverse-primary">
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
          <KolNavbar />
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
