export const onRouteChange = (callback) => {
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
    check()
  }

  const originalReplace = history.replaceState
  history.replaceState = function () {
    originalReplace.apply(this, arguments)
    check()
  }

  window.addEventListener("popstate", check)

  // also poll as fallback
  const intervalId = setInterval(check, 1000)
  return () => {
    history.pushState = originalPush
    history.replaceState = originalReplace
    window.removeEventListener("popstate", check)
    clearInterval(intervalId)
  }
}
