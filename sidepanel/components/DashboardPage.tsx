import clsx from "clsx"
import { AtomIcon } from "lucide-react"
import { useEffect, useMemo, useRef, type FC, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import robotImg from "url:/assets/robot.png" // strange

import { useStore } from "~store/store"
import { NavbarItemKey } from "~types/enum"
import { MessageType, type MessagePayload } from "~types/message"

import ExploreIcon from "./icons/ExploreIcon"
import KnowledgeBaseIcon from "./icons/KnowlegeBaseIcon"
import MemoIcon from "./icons/MemoIcon"
import MessageIcon from "./icons/MessageIcon"
import ReminderIcon from "./icons/ReminderIcon"
import SettingIcon from "./icons/SettingIcon"
import SheetIcon from "./icons/SheetIcon"
import { KolChatSection } from "./KolChatSection/KolChatSection"
import { KolNavbar } from "./navbar/KolNavbar"
import { LanguageSelector } from "./navbar/LanguageSelector"
import { MeNavbarItem } from "./navbar/MeNavbarItem"
import { UserNavbarItem } from "./navbar/UserNavbarItem"
import { ChatPanel } from "./panels/ChatPanel/ChatPanel"
import { ExplorePanel } from "./panels/ExplorePanel/ExplorePanel"
import { InvitePanel } from "./panels/InvitePanel/InvitePanel"
import { KnowledgeBasePanel } from "./panels/KnowledgeBasePanel/KnowledgeBasePanel"
import { MemoPanel } from "./panels/MemoPanel/MemoPanel"
import { ReminderPanel } from "./panels/ReminderPanel/ReminderPanel"
import { SheetPanel } from "./panels/SheetPanel/SheetPanel"
import { StudioSettingPanel } from "./panels/StudioSettingPanel/StudioSettingPanel"

type NavbarItem = {
  key: NavbarItemKey
  icon: FC<{
    className?: string
  }>
  component: ReactNode
  wrapperClassName?: string
  tooltipI18nKey?: string
}

const NavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.EXPLORE,
    icon: ExploreIcon,
    tooltipI18nKey: "dashboard_page.explore",
    component: <ExplorePanel />,
    wrapperClassName: "!p-0 !py-4"
  },
  {
    key: NavbarItemKey.SETTING,
    icon: SettingIcon,
    tooltipI18nKey: "dashboard_page.studio",
    component: <StudioSettingPanel />
  },
  {
    key: NavbarItemKey.KNOWLEDGE,
    icon: KnowledgeBaseIcon,
    tooltipI18nKey: "dashboard_page.knowledge_base",
    component: <KnowledgeBasePanel />
  },
  {
    key: NavbarItemKey.MEMO,
    icon: MemoIcon,
    tooltipI18nKey: "dashboard_page.memo",
    component: <MemoPanel />
  },
  {
    key: NavbarItemKey.SHEET,
    icon: SheetIcon,
    tooltipI18nKey: "dashboard_page.sheet",
    component: <SheetPanel />
  },
  {
    key: NavbarItemKey.REMINDER,
    icon: ReminderIcon,
    tooltipI18nKey: "dashboard_page.reminder",
    component: <ReminderPanel />
  }
] as const

const BottomNavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.INVITE,
    icon: MessageIcon,
    tooltipI18nKey: "dashboard_page.invite",
    component: <InvitePanel />
  }
] as const

const ChatNavbarItems: NavbarItem[] = [
  {
    key: NavbarItemKey.CHAT,
    icon: AtomIcon,
    component: <ChatPanel />
  }
]

export const DashboardPage = () => {
  const { t } = useTranslation()
  const {
    navbarItemKey,
    setNavbarItemKey,
    clearNavbar,
    setQuoteTweet,
    setKolScreenName
  } = useStore()
  const didInitRef = useRef(false)

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
    setNavbarItemKey(itemKey)
  }

  useEffect(() => {
    const messageListener = (message: MessagePayload) => {
      didInitRef.current = true
      if (message.type === MessageType.QUOTE_TWEET) {
        setQuoteTweet(message.data)
        toggleDrawer(NavbarItemKey.CHAT)
      }
      if (message.type === MessageType.ADD_COLLECTION) {
        toggleDrawer(NavbarItemKey.KNOWLEDGE)
      }
      if (message.type === MessageType.CHAT_WITH_USER) {
        setKolScreenName(message.data?.kolScreenName ?? "")
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)

    requestAnimationFrame(() => {
      if (!didInitRef.current) {
        clearNavbar()
        setKolScreenName("")
      }
    })

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
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
      <aside className="max-w-[68px] p-4 flex flex-col items-center gap-4 h-full w-[68px] bg-fill-bg-deep">
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
                tooltip={item.tooltipI18nKey ? t(item.tooltipI18nKey) : ""}
              />
            )
          })}
          <KolNavbar />
        </div>
        {/* bottom buttons */}
        <div className="flex flex-col gap-3">
          {BottomNavbarItems.map((item) => {
            return (
              <MeNavbarItem
                key={item.key}
                handleClick={() => toggleDrawer(item.key)}
                isTargeted={item.key === currentNavbarItem.key}
                icon={item.icon}
                tooltip={item.tooltipI18nKey ? t(item.tooltipI18nKey) : ""}
              />
            )
          })}
          <LanguageSelector />
          <UserNavbarItem />
        </div>
      </aside>
    </div>
  )
}
