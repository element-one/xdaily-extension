import { useEffect, useRef, useState } from "react"

enum MessageSender {
  user = "user",
  ai = "ai"
}
type Message = {
  id: string
  text: string
  sender: MessageSender
}

export const ChatPanel = () => {
  const [agentId, setAgentId] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you with Twitter/X today?",
      sender: MessageSender.ai
    }
  ])
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  //   get user agent id from the current active tab url
  useEffect(() => {
    const extractTwitterUsername = (url: string): string | null => {
      const RESERVED_PATHS = new Set([
        "home",
        "explore",
        "search",
        "settings",
        "notifications"
      ])
      const match = url.match(
        /https?:\/\/(x\.com|twitter\.com)\/([^/?#]+)(?:\/|$|\?|#)/
      )
      if (!match) return null

      const username = match[2]
      return RESERVED_PATHS.has(username) ? null : username
    }

    const init = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      const username = tab?.url ? extractTwitterUsername(tab.url) : null
      setAgentId(username || "")
    }

    init()

    const handleTabUpdate = (tabId: number, changeInfo: any, tab: any) => {
      if (changeInfo.status === "complete" && tab.url) {
        const username = extractTwitterUsername(tab.url)
        setAgentId(username || "")
      }
    }
    const handleTabActivated = () => {
      init()
    }
    chrome.tabs.onUpdated.addListener(handleTabUpdate)
    chrome.tabs.onActivated.addListener(handleTabActivated)
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate)
      chrome.tabs.onActivated.removeListener(handleTabActivated)
    }
  }, [])

  //   scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!inputText.trim()) return

    //  user
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: MessageSender.user
    }
    setMessages((prev) => [...prev, newUserMessage])
    setInputText("")

    // mock
    setTimeout(() => {
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm an AI assistant. This is a simulated response.",
        sender: MessageSender.ai
      }
      setMessages((prev) => [...prev, newAiMessage])
    }, 1000)
  }

  return (
    <div className="flex gap-y-4 rounded-md flex-col h-full bg-gray-50">
      <div className="bg-white py-2 text-base font-semibold">
        {agentId ? agentId : "Anonymous User"}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-4 stylized-scroll">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === MessageSender.user ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === MessageSender.user
                  ? "bg-primary-brand text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* input and send message button */}
      <div className="bg-white py-2 ">
        <div className="flex rounded-md overflow-hidden border border-primary-brand]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-brand"
          />
          <button
            onClick={handleSend}
            className="bg-primary-brand text-white  px-4 py-2 hover:bg-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
