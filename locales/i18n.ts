import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { Storage } from "@plasmohq/storage"

import { updateUserLang } from "~services/user"
import { useStore } from "~store/store"
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

export async function initI18n(passedInLang?: string) {
  const supportedLangs = ["en", "zh"]
  const fallbackLang = "en"

  let setLang = await getStoredLanguage()
  if (passedInLang && supportedLangs.includes(passedInLang)) {
    setLang = passedInLang
  }

  const browserLang = navigator?.language?.split("-")?.[0] ?? fallbackLang
  const initialLang =
    setLang ||
    (supportedLangs.includes(browserLang) ? browserLang : fallbackLang)

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
        chrome.tabs
          .sendMessage(tab.id, {
            type: MessageType.LANGUAGE_CHANGED,
            language: newLang
          })
          .catch(() => {})
      }
    })
  })
}

export async function changeAppLanguage(newLang: string) {
  await i18n.changeLanguage(newLang)
  setStoredLanguage(newLang)
  notifyLanguageChangeToTabs(newLang)
  updateUserLang(newLang as "en" | "zh")
  const { updateUserInfo, userInfo } = useStore.getState()
  if (userInfo) {
    updateUserInfo({
      ...userInfo,
      lang: newLang
    })
  }
  console.log(`[i18n] language changed to ${newLang}`)
}

export default i18n
