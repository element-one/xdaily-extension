import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { Storage } from "@plasmohq/storage"

import { MessageType } from "~types/message"

import en from "./en/translation.json"
import zh from "./zh/translation.json"

const LANG_STORAGE_KEY = "language"

const storage = new Storage()

const getStoredLanguage = () => {
  return storage.get(LANG_STORAGE_KEY)
}

const setStoredLanguage = async (lang: string) => {
  return storage.set(LANG_STORAGE_KEY, lang)
}

export async function initI18n() {
  const storedLang = await getStoredLanguage()

  const fallbackLang = "en"
  const browserLang = navigator?.language?.split("-")?.[0] ?? fallbackLang
  const initialLang = storedLang || browserLang

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      zh: { translation: zh }
    },
    lng: initialLang,
    fallbackLng: fallbackLang,
    interpolation: {
      escapeValue: false
    }
  })

  console.log(`[i18n] initialized with lang=${initialLang}`)
}

function notifyLanguageChangeToTabs(newLang) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: MessageType.LANGUAGE_CHANGED,
          language: newLang
        })
      }
    })
  })
}

export async function changeAppLanguage(newLang: string) {
  await i18n.changeLanguage(newLang)
  setStoredLanguage(newLang)
  notifyLanguageChangeToTabs(newLang)
  console.log(`[i18n] language changed to ${newLang}`)
}

initI18n()

export default i18n
