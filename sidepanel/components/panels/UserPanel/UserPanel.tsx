import { ChevronLeftIcon } from "lucide-react"

import { useStore } from "~store/store"
import { UserPanelItemKey } from "~types/enum"

import { ChatSection } from "./ChatSection/ChatSection"
import { UserSection } from "./UserSection"

export const UserPanel = () => {
  const { userPanelItemKey, setUserPanelItemKey } = useStore()
  const handleBack = () => {
    setUserPanelItemKey(UserPanelItemKey.LIST)
  }
  return (
    <div className="flex flex-col w-full gap-y-2 flex-1 min-h-0">
      <div className="flex items-center gap-x-1 p-0 relative text-primary-brand">
        {userPanelItemKey === UserPanelItemKey.CHAT && (
          <ChevronLeftIcon
            className="w-5 h-5 cursor-pointer"
            onClick={handleBack}
          />
        )}
        <div className=" text-base font-semibold">Users</div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        {userPanelItemKey === UserPanelItemKey.LIST && <UserSection />}
        {userPanelItemKey === UserPanelItemKey.CHAT && <ChatSection />}
      </div>
    </div>
  )
}
