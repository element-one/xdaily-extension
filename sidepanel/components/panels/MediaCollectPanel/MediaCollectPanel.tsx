import type { FC } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { MessageType } from "~types/message"

export const MediaCollectPanel: FC = () => {
  const notifyCollectorEnableStatus = (enable: boolean) => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs
            .sendMessage(tab.id, {
              type: MessageType.TOGGLE_COLLECT_MEDIA,
              enable: enable
            })
            .catch(() => {})
        }
      })
    })
  }
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full w-full">
      <Button onClick={() => notifyCollectorEnableStatus(true)}>START</Button>
      <Button onClick={() => notifyCollectorEnableStatus(false)}>STOP</Button>
    </div>
  )
}
