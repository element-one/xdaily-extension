import type { ChatMessageData } from "~types/chat"

export const tryParseJsonMessage = (msg: string): ChatMessageData | null => {
  try {
    const jsonMatch = msg.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1])
    }
    return null
  } catch (error) {
    console.error("Failed to parse JSON message:", error)
    return null
  }
}
