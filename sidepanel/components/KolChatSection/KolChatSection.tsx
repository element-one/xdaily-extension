import { ChevronLeftIcon } from "lucide-react"
import { type FC } from "react"

import { useStore } from "~store/store"

import { PanelHeader } from "../ui/PanelHeader"
import { ChatStatusSection } from "./ChatStatusSection"

interface ChatSectionProps {
  screenName: string
}
const ChatSection: FC<ChatSectionProps> = ({ screenName }) => {
  return <ChatStatusSection screenName={screenName} key={screenName} />
}

export const KolChatSection: FC = () => {
  const { kolScreenName, setKolScreenName, setKolInfo } = useStore()

  const handleBack = () => {
    setKolScreenName("")
    setKolInfo({
      avatarUrl: "",
      userName: ""
    })
  }
  if (!kolScreenName) {
    return <></>
  }
  return (
    <div className="flex flex-col h-full py-4 pl-4 pr-0 absolute inset-0 bg-fill-bg-deep">
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
      <ChatSection screenName={kolScreenName} />
    </div>
  )
}
