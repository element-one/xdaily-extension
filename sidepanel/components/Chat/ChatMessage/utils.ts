import type { ChatMessageData } from "~types/chat"

export const tryParseJsonMessage = (msg: string): ChatMessageData | null => {
  try {
    const jsonBlockMatch = msg.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      return JSON.parse(jsonBlockMatch[1])
    }
    return JSON.parse(msg)
  } catch (error) {
    return null
  }
}
