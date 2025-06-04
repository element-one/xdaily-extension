import type { SparseFormat } from "~types/sheet"

export const normalizeMarkdownInput = (input: unknown) => {
  if (typeof input === "string") return input
  try {
    return JSON.stringify(input, null, 2)
  } catch {
    return String(input)
  }
}

export const extractSummaryFromSparseFormat = (
  sheet: SparseFormat,
  options?: {
    maxLength?: number
  }
) => {
  if (!sheet.columns.length || !sheet.data.length) {
    return ""
  }

  const maxLength = options?.maxLength ?? 1000

  const rowIndices = Array.from(
    new Set(sheet.data.map((cell) => cell.row_index))
  ).sort((a, b) => a - b)

  const colIndices = sheet.columns.map((col) => col.index).sort((a, b) => a - b)

  const lines = rowIndices.map((rowIndex) => {
    const cellsInRow = sheet.data.filter((cell) => cell.row_index === rowIndex)
    const cellsSorted = colIndices.map((colIndex) => {
      const cell = cellsInRow.find((c) => c.column_index === colIndex)
      return cell?.payload.content ?? ""
    })
    return cellsSorted.join("\t")
  })

  let summary = lines.join("\n")

  if (summary.length > maxLength) {
    summary = summary.slice(0, maxLength) + "..."
  }

  return summary
}
