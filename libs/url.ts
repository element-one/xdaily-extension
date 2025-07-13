export const getI18nUrl = (path: string, language: string) => {
  const base = process.env.PLASMO_PUBLIC_MAIN_SITE
  const langPrefix = language === "zh" ? "/zh" : ""
  return `${base}${langPrefix}${path}`
}
