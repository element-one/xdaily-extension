import type { ChatMessageData } from "~types/chat"

export const tryParseJsonMessage = (msg: string): ChatMessageData | null => {
  try {
    const jsonMatch = msg.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    const rawContent = jsonMatch?.[1] ?? msg

    // remove useless character
    const sanitized = rawContent
      .replace(/\\_/g, "_") // \_ to _
      .replace(/\\(?!["\\/bfnrtu])/g, "")

    return JSON.parse(sanitized)
  } catch (error) {
    return null
  }
}
