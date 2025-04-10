import { ChevronLeftIcon } from "lucide-react"
import { useEffect } from "react"

import { MeNavbarItem } from "~sidepanel/components/MeNavbarItem"
import { TabMenu } from "~sidepanel/components/TabMenu"
import { useStore } from "~store/store"
import { UserPanelItemKey } from "~types/enum"

import { ChatSection } from "./ChatSection/ChatSection"
import { UserSection } from "./UserSection"

export const UserPanel = () => {
  const { userPanelItemKey, setUserPanelItemKey } = useStore()
  const handleBack = () => {
    setUserPanelItemKey(UserPanelItemKey.LIST)
  }

  useEffect(() => {
    setUserPanelItemKey(UserPanelItemKey.LIST)
  }, [])

  return (
    <div className="flex flex-col w-full gap-y-2 flex-1 min-h-0">
      {userPanelItemKey === UserPanelItemKey.CHAT ? (
        <div className="flex items-center gap-x-1 p-0 relative text-primary-brand">
          <ChevronLeftIcon
            className="w-5 h-5 cursor-pointer"
            onClick={handleBack}
          />
          <span className="text-base font-semibold">Chat</span>
        </div>
      ) : (
        <TabMenu />
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        {userPanelItemKey === UserPanelItemKey.LIST && <UserSection />}
        {userPanelItemKey === UserPanelItemKey.CHAT && <ChatSection />}
      </div>
    </div>
  )
}
