import type { PartialBlock } from "@blocknote/core"

export const extractAllTextWithLineBreaks = (
  content?: PartialBlock[],
  maxLine = 5
) => {
  const lines: string[] = []
  const document = content ?? []

  for (const block of document) {
    if (lines.length >= maxLine) break

    const blockContent = block.content

    if (typeof blockContent === "string") {
      if (blockContent.trim()) {
        lines.push(blockContent.trim())
      }
    } else if (Array.isArray(blockContent)) {
      const line = blockContent
        .map((item: any) => {
          if (item.type === "text" && typeof item.text === "string") {
            return item.text
          }
          if (item.type === "link" && typeof item.content === "string") {
            return item.content
          }
          return ""
        })
        .join("")

      if (line.trim()) {
        lines.push(line)
      }
    }
  }

  return lines.slice(0, maxLine).join("\n")
}
