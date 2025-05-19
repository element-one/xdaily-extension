import { ChevronLeftIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import { useStore } from "~store/store"
import type { KolCollection, UserCollection } from "~types/collection"
import { UserPanelItemKey } from "~types/enum"

import { ChatSection } from "./ChatSection/ChatSection"
import { KolSection } from "./KolSection"

export const ExplorePanel = () => {
  const { userPanelItemKey, setUserPanelItemKey } = useStore()
  const [screenName, setScreenName] = useState("")

  useEffect(() => {
    setUserPanelItemKey(UserPanelItemKey.LIST)
  }, [])

  const handleBack = () => {
    setUserPanelItemKey(UserPanelItemKey.LIST)
    setScreenName("")
  }
  const handleClickKol = (kol: KolCollection) => {
    setScreenName(kol.screenName)
    setTimeout(() => {
      setUserPanelItemKey(UserPanelItemKey.CHAT)
    }, 10)
  }

  if (userPanelItemKey === UserPanelItemKey.LIST) {
    return <KolSection onClickKol={handleClickKol} />
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
      <ChatSection screenName={screenName} />
    </div>
  )
}
