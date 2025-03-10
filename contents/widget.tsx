import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import cssText from "data-text:~/styles/global.css"
import { BookmarkIcon, XIcon } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { Hide_Widget_Storage_Name } from "~types/enum"
import { BackgroundMessageType } from "~types/message"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const menuItemClassName =
  "focus:bg-slate-100 relative select-none rounded-sm px-2 py-1.5 outline-none transition-colors cursor-pointer gap-2 text-sm font-normal flex flex-row items-center gap-x-2"
const buttonClassname =
  "cursor-pointer bg-white px-4 rounded-l-full py-2 shadow-md border text-slate-900"
const WidgetButton = () => {
  const [isHidden, setIsHidden] = useState(false)

  const toggleSidePanel = () => {
    chrome.runtime.sendMessage({ type: BackgroundMessageType.TOGGLE_PANEL })
  }

  const hideWidget = () => {
    setIsHidden(true)
  }

  if (isHidden) {
    return null
  }

  return (
    <div className="group p-2 pr-0 fixed text-white left-auto right-0 top-20 z-[1000] flex flex-col gap-y-4">
      <div className={buttonClassname} onClick={toggleSidePanel}>
        <BookmarkIcon className="size-7 text-primary-brand" />
      </div>
      <div className="relative -top-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div className="hidden group-hover:block absolute -top-4 left-2 p-1 bg-gray-300 rounded-full">
              <XIcon className="size-2" />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="right-full absolute -translate-x-2 -translate-y-6 bottom-full z-50 min-w-[10rem] overflow-hidden rounded-md border border-thinborder bg-white p-1 text-slate-900 shadow-md">
            <DropdownMenu.Item
              className={menuItemClassName}
              onSelect={hideWidget}>
              <div className="w-full flex flex-row items-center justify-center gap-x-1">
                <div>Hide until next visit</div>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  )
}

export default WidgetButton
