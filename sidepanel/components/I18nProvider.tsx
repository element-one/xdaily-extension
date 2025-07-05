import { useEffect, useState } from "react"

import i18n, { initI18n } from "../../locales/i18n"
import { Loading } from "./ui/Loading"

export function I18nProvider({ children }) {
  const [ready, setReady] = useState(i18n.isInitialized)

  useEffect(() => {
    if (!i18n.isInitialized) {
      initI18n().then(() => setReady(true))
    } else {
      setReady(true)
    }
  }, [])

  if (!ready) {
    return <Loading />
  }

  return <>{children}</>
}
