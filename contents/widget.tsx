import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import cssText from "data-text:~/styles/global.css"
import { BookmarkIcon, XIcon } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import robotImg from "url:/assets/robot.png" // strange

import { sendToBackground } from "@plasmohq/messaging"

import { useStore } from "~store/store"

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
  "cursor-pointer bg-fill-bg-light p-2 border-r-0 rounded-l-full py-2 shadow-md border border-fill-bg-grey"
const WidgetButton = () => {
  const [isHidden, setIsHidden] = useState(true)
  const { isHideGlobally, onHideGloballyChange, addDisableSite, disableSite } =
    useStore()

  useEffect(() => {
    if (isHideGlobally) {
      setIsHidden(true)
      return
    }
    const isDisable = disableSite.includes(window.location.hostname)
    setIsHidden(isDisable)
  }, [isHideGlobally, disableSite])

  const toggleSidePanel = () => {
    sendToBackground({
      name: "toggle-panel"
    })
  }

  const hideWidget = () => {
    setIsHidden(true)
  }

  const handleDisableGlobally = () => {
    onHideGloballyChange(true)
  }

  const handleDisableSite = () => {
    if (window.location.hostname) {
      addDisableSite(window.location.hostname)
    }
  }

  const handleGoSetting = () => {}

  if (isHidden) {
    return null
  }

  return (
    <div className="font-geist group fixed text-white bg-transparent left-auto right-0 bottom-[232px] z-[1000] flex flex-col">
      <div className={buttonClassname} onClick={toggleSidePanel}>
        <img
          src={robotImg}
          alt="chat robot"
          className="w-8 h-8 shrink-0 scale-x-[-1] object-contain cursor-pointer"
        />
      </div>
      {/* <div className="relative -top-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div className="hidden group-hover:block absolute -top-1 left-2 p-1 bg-gray-300 rounded-full">
              <XIcon className="size-2" />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="right-full absolute -translate-x-2 -translate-y-12 top-0 z-50 min-w-[10rem] overflow-hidden rounded-md border border-thinborder bg-white p-1 text-slate-900 shadow-md">
            <DropdownMenu.Item
              className={menuItemClassName}
              onSelect={hideWidget}>
              <div>Hide until next visit</div>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={menuItemClassName}
              onSelect={handleDisableSite}>
              <div>Disable for this site</div>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={menuItemClassName}
              onSelect={handleDisableGlobally}>
              <div>Disable globally</div>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={clsx(
                menuItemClassName,
                "border-t-[1px] border-slate-600/30"
              )}
              onSelect={handleGoSetting}>
              <div className="text-xs text-slate-700">
                You can change later in settings
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div> */}
    </div>
  )
}

export default WidgetButton
