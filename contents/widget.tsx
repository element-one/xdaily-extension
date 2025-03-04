import cssText from "data-text:~/styles/global.css"
import { BookmarkIcon } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"

import { MessageType } from "~types/enum"

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
    chrome.runtime.sendMessage({ type: MessageType.TOGGLE_PANEL })
  }
  return (
    <div className="p-2 pr-0 fixed text-white left-auto right-0 top-20 z-[1000] flex flex-col gap-y-4">
      <div className={buttonClassname} onClick={toggleSidePanel}>
        <BookmarkIcon className="size-7 text-primary-brand" />
      </div>
    </div>
  )
}

export default WidgetButton
