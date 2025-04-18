import { ChatWindow } from "~sidepanel/components/ChatWindow"
import { useStore } from "~store/store"

export const ChatPanel = () => {
  const { userInfo, quoteTweet } = useStore()
  return <ChatWindow screenName={userInfo.username} quoteTweet={quoteTweet} />
}
