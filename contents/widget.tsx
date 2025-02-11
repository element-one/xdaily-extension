import cssText from "data-text:~/styles/global.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const buttonClassname =
  "cursor-pointer bg-white px-4 rounded-l-full py-2 shadow-md border text-slate-900"
const WidgetButton = () => {
  const toggleSidePanel = () => {
    chrome.runtime.sendMessage({ type: "toggle_side_panel" })
  }
  return (
    <div className="p-2 pr-0 fixed text-white left-auto right-0 bottom-10 z-[1000] flex flex-col gap-y-4">
      <div className={buttonClassname}>Button 1</div>
      <div className={buttonClassname}>Button 2</div>
      <div className={buttonClassname} onClick={toggleSidePanel}>
        Toggle
      </div>
    </div>
  )
}

export default WidgetButton
