import cssText from "data-text:~/styles/global.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"
import robotImg from "url:/assets/robot.png" // strange

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false
}

const SHADOW_HOST_ID = "xdaily-awesome-widget"
export const getShadowHostId: PlasmoGetShadowHostId = () => SHADOW_HOST_ID

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const WidgetButton = () => {
  if (typeof window !== "undefined" && window.top !== window.self) {
    return null
  }

  const toggleSidePanel = () => {
    sendToBackground({
      name: "toggle-panel"
    })
  }

  return (
    <div className="font-geist group fixed text-white bg-transparent left-auto right-0 bottom-[232px] z-[1000] flex flex-col">
      <div
        className="cursor-pointer bg-fill-bg-light p-2 border-r-0 rounded-l-full py-2 shadow-md border border-fill-bg-grey"
        onClick={toggleSidePanel}>
        <img
          src={robotImg}
          alt="chat robot"
          className="w-8 h-8 shrink-0 scale-x-[-1] object-contain cursor-pointer"
        />
      </div>
    </div>
  )
}

export default WidgetButton
