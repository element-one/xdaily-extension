import { ChevronLeftIcon } from "lucide-react"
import { useEffect } from "react"

import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import { useStore } from "~store/store"
import { UserPanelItemKey } from "~types/enum"

import { ChatSection } from "./ChatSection/ChatSection"
import { KolSection } from "./KolSection"

export const ExplorePanel = () => {
  const { userPanelItemKey, setUserPanelItemKey } = useStore()

  useEffect(() => {
    setUserPanelItemKey(UserPanelItemKey.LIST)
  }, [])

  const handleBack = () => {
    setUserPanelItemKey(UserPanelItemKey.LIST)
  }

  if (userPanelItemKey === UserPanelItemKey.LIST) {
    return <KolSection />
  }

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title={
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleBack}>
            <ChevronLeftIcon className="w-4 h-4 text-text-default-secondary" />
            <span className="text-text-default-primary font-semibold text-base">
              Chat
            </span>
          </div>
        }
      />
      <ChatSection />
    </div>
  )
}
