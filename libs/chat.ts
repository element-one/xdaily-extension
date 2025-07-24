import type { ChatMessageData } from "~types/chat"
import type { SparseFormat } from "~types/sheet"

export const normalizeMarkdownInput = (input: unknown) => {
  if (typeof input === "string") return input
  try {
    return JSON.stringify(input, null, 2)
  } catch {
    return String(input)
  }
}

export const extractMarkdownTableFromSparseFormat = (
  sheet: SparseFormat,
  options?: {
    maxLength?: number
  }
): string => {
  if (!sheet.columns.length || !sheet.data.length) {
    return ""
  }

  const maxLength = options?.maxLength ?? 1000

  const colIndices = sheet.columns.map((col) => col.index).sort((a, b) => a - b)
  const headerLine =
    "| " +
    colIndices
      .map((colIndex) => {
        const col = sheet.columns.find((c) => c.index === colIndex)
        return col?.title?.trim() ?? ""
      })
      .join(" | ") +
    " |"

  const separatorLine = "| " + colIndices.map(() => "---").join(" | ") + " |"

  const rowIndices = Array.from(
    new Set(sheet.data.map((cell) => cell.row_index))
  ).sort((a, b) => a - b)

  const contentLines = rowIndices.map((rowIndex) => {
    const cellsInRow = sheet.data.filter((cell) => cell.row_index === rowIndex)
    return (
      "| " +
      colIndices
        .map((colIndex) => {
          const content =
            cellsInRow.find((c) => c.column_index === colIndex)?.payload
              .content ?? ""
          return String(content).trim().replace(/\n/g, "<br>")
        })
        .join(" | ") +
      " |"
    )
  })

  const allLines = [headerLine, separatorLine, ...contentLines]
  let summary = allLines.join("\n")
  if (summary.length > maxLength) {
    summary = summary.slice(0, maxLength) + "\n..."
  }

  return summary
}

export const tryConvertDataToSparseFormat = (
  data: ChatMessageData
): SparseFormat | ChatMessageData => {
  if (!Array.isArray(data) || data.length < 1) {
    return data
  }
  const headerRow = data[0]
  if (!Array.isArray(headerRow)) {
    return data
  }
  const columns: SparseFormat["columns"] = headerRow.map((title, index) => ({
    title: String(title ?? ""),
    id: String(title ?? ""),
    index
  }))

  const rows: SparseFormat["data"] = []
  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex]
    if (!Array.isArray(row)) continue

    for (let columnIndex = 0; columnIndex < headerRow.length; columnIndex++) {
      const content = row[columnIndex] ?? ""
      rows.push({
        row_index: rowIndex - 1,
        column_index: columnIndex,
        payload: {
          content: String(content),
          labels: []
        }
      })
    }
  }
  return {
    columns,
    data: rows
  }
}
