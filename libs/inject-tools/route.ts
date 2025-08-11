import { MessageType } from "~types/message"

interface Config {
  listenToTabChange?: boolean
}
export const onRouteChange = (callback, config?: Config) => {
  const { listenToTabChange = false } = config || {}

  let lastHref = location.href

  const check = () => {
    if (location.href !== lastHref) {
      lastHref = location.href
      callback()
    }
  }

  // hook pushState / replaceState
  const originalPush = history.pushState
  history.pushState = function () {
    originalPush.apply(this, arguments)
    setTimeout(check, 0)
  }

  const originalReplace = history.replaceState
  history.replaceState = function () {
    originalReplace.apply(this, arguments)
    setTimeout(check, 0)
  }

  window.addEventListener("popstate", check)

  if (listenToTabChange) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === MessageType.TAB_CHANGE) {
        callback()
      }
    })
  }

  // also poll as fallback
  const intervalId = setInterval(check, 1000)

  return () => {
    history.pushState = originalPush
    history.replaceState = originalReplace
    window.removeEventListener("popstate", check)
    clearInterval(intervalId)
  }
}
