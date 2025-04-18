import { ChatWindow } from "~sidepanel/components/ChatWindow"
import { useStore } from "~store/store"

export const ChatPanel = () => {
  const { userInfo, chatTweetId } = useStore()
  return <ChatWindow screenName={userInfo.username} tweetId={chatTweetId} />
}
