export const normalizeMarkdownInput = (input: unknown) => {
  if (typeof input === "string") return input
  try {
    return JSON.stringify(input, null, 2)
  } catch {
    return String(input)
  }
}
