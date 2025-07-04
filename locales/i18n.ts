import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./en/translation.json"
import zh from "./zh/translation.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh }
  },
  lng: navigator?.language?.split("-")?.[0] ?? "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
})

export default i18n
