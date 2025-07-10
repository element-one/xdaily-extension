import type {
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  PartialBlock,
  PartialInlineContent
} from "@blocknote/core"

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

function inlineContentsToMarkdown(
  inlines?: PartialInlineContent<DefaultInlineContentSchema, DefaultStyleSchema>
): string {
  if (!inlines) return ""

  if (typeof inlines === "string") return inlines

  return inlines
    .map((item) => {
      if (typeof item === "string") {
        return item
      }
      if ("type" in item) {
        switch (item.type) {
          case "text": {
            let t = item.text || ""
            if ("marks" in item && Array.isArray(item.marks)) {
              for (const mark of item.marks) {
                switch (mark.type) {
                  case "bold":
                    t = `**${t}**`
                    break
                  case "italic":
                    t = `_${t}_`
                    break
                  case "code":
                    t = `\`${t}\``
                    break
                }
              }
            }
            return t
          }
          case "link": {
            const inner = inlineContentsToMarkdown(item.content)
            return `[${inner}](${item.href})`
          }
          default:
            return ""
        }
      }

      return ""
    })
    .join("")
}

export function blocksToMarkdown(blocks?: PartialBlock[]): string {
  if (!blocks || blocks.length === 0) return ""
  return blocks
    .map((block) => {
      const contentMd = inlineContentsToMarkdown(block.content as any)

      switch (block.type) {
        case "paragraph":
          return contentMd
        case "heading":
          const level = (block as any).level || 1
          return `${"#".repeat(level)} ${contentMd}`
        case "bulletListItem":
          return `- ${contentMd}`
        case "numberedListItem":
          return `1. ${contentMd}`
        case "checkListItem":
          const checked = (block as any)?.props?.checked ? "x" : " "
          return `- [${checked}] ${contentMd}`
        case "quote":
          return `> ${contentMd}`
        case "codeBlock":
          return `\`\`\`\n${contentMd}\n\`\`\``
        case "table":
          // TODO
          return "[Table content not supported]"
        case "file":
          const fileName = (block as any).fileName || "file"
          const fileUrl = (block as any).url || ""
          return `[File: ${fileName}](${fileUrl})`
        case "image":
          const alt = (block as any).alt || ""
          const src = (block as any).src || ""
          return `![${alt}](${src})`
        case "video":
          const videoSrc = (block as any).src || ""
          return `[Video](${videoSrc})`

        case "audio":
          const audioSrc = (block as any).src || ""
          return `[Audio](${audioSrc})`
        default:
          return contentMd || ""
      }
    })
    .join("\n\n")
}
