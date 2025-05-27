import { ChatWindow } from "~sidepanel/components/Chat/ChatWindow"
import { useStore } from "~store/store"

// chat with myself
export const ChatPanel = () => {
  const { userInfo, quoteTweet } = useStore()
  return <ChatWindow screenName={userInfo.username} quoteTweet={quoteTweet} />
}
