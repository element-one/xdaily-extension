import clsx from "clsx"
import { AtomIcon } from "lucide-react"
import { useEffect, useState, type FC } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { ImageWithFallback } from "~sidepanel/components/ui/ImageWithFallback"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import type { ScanningMedia } from "~types/media"
import { MessageType, type MessagePayload } from "~types/message"

// const MOCKING = [
//   {
//     src: "https://pbs.twimg.com/profile_images/872816390197067776/fGtCd3Du_x96.jpg",
//     type: "img",
//     tweetUrl: ""
//   },
//   {
//     src: "https://pbs.twimg.com/profile_images/1919403571558088704/IsDv1zbW_x96.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/ohdeadshit/status/1950525249902248129"
//   },
//   {
//     src: "https://pbs.twimg.com/profile_images/1950810205123444737/-Ns8yFXG_x96.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/TheWildAnimal_/status/1950721852449726869"
//   },
//   {
//     src: "https://pbs.twimg.com/ext_tw_video_thumb/1950721820505608192/pu/img/Yn2RT-lJSxNIBAka.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/TheWildAnimal_/status/1950721852449726869"
//   },
//   {
//     src: "https://pbs.twimg.com/profile_images/1702393983937208321/LDgd70_f_x96.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/shitposts_mp4/status/1950843891718209541"
//   },
//   {
//     src: "https://abs-0.twimg.com/emoji/v2/svg/1f39e.svg",
//     type: "img",
//     tweetUrl: "https://x.com/shitposts_mp4/status/1950843891718209541"
//   },
//   {
//     src: "https://pbs.twimg.com/amplify_video_thumb/1950694436368740352/img/pPjCg64TLiiIoALZ.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/shitposts_mp4/status/1950843891718209541"
//   },
//   {
//     src: "https://pbs.twimg.com/profile_images/1916806393358643200/UC69nrbY_x96.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/Onshitx/status/1950990712050491829"
//   },
//   {
//     src: "https://pbs.twimg.com/ext_tw_video_thumb/1950990580298686464/pu/img/bOlr0dxkesM0FpIA.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/Onshitx/status/1950990712050491829"
//   },
//   {
//     src: "https://pbs.twimg.com/profile_images/1915757825822703616/C5UJFVbv_x96.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/SuddenDeaIh/status/1951088154796236850"
//   },
//   {
//     src: "https://abs-0.twimg.com/emoji/v2/svg/2620.svg",
//     type: "img",
//     tweetUrl: "https://x.com/SuddenDeaIh/status/1951088154796236850"
//   },
//   {
//     src: "https://pbs.twimg.com/ext_tw_video_thumb/1951088094666485761/pu/img/XUZ9Z6RjX4MWIgsR.jpg",
//     type: "img",
//     tweetUrl: "https://x.com/SuddenDeaIh/status/1951088154796236850"
//   },
//   {
//     src: "blob:https://x.com/ae53d933-8d79-4189-bf79-e977c69e7f20",
//     type: "video",
//     tweetUrl: "https://x.com/ohdeadshit/status/1950525249902248129"
//   },
//   {
//     src: "blob:https://x.com/9a314cf8-b161-450e-8503-1b0d8f73545f",
//     type: "video",
//     tweetUrl: "https://x.com/TheWildAnimal_/status/1950721852449726869"
//   },
//   {
//     src: "blob:https://x.com/453402c9-6769-4636-bf4c-b7f7599cff1d",
//     type: "video",
//     tweetUrl: "https://x.com/shitposts_mp4/status/1950843891718209541"
//   },
//   {
//     src: "blob:https://x.com/6917128d-2676-4ded-bea2-02db44ac4cf5",
//     type: "video",
//     tweetUrl: "https://x.com/Onshitx/status/1950990712050491829"
//   },
//   {
//     src: "blob:https://x.com/42a30456-8e26-42d5-ac71-df9c116d0da5",
//     type: "video",
//     tweetUrl: "https://x.com/SuddenDeaIh/status/1951088154796236850"
//   }
// ]

export const MediaCollectPanel: FC = () => {
  // TODO a global status
  const [isEnable, setEnable] = useState(false)
  const [addedMedia, setAddedMedia] = useState<ScanningMedia[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: MessagePayload) => {
      if (message.type === MessageType.ADD_COLLECTING_MEDIA) {
        setAddedMedia((prev) => [...message.data, ...prev])
      }
    })
  }, [])

  const toggleCollectorEnableStatus = () => {
    setEnable(!isEnable)
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs
            .sendMessage(tab.id, {
              type: MessageType.TOGGLE_COLLECT_MEDIA,
              enable: !isEnable
            })
            .catch(() => {})
        }
      })
    })
  }

  // TODO i18n
  return (
    // <div className="flex flex-col justify-center items-center gap-4 h-full w-full">
    //   <Button onClick={() => notifyCollectorEnableStatus(true)}>START</Button>
    //   <Button onClick={() => notifyCollectorEnableStatus(false)}>STOP</Button>
    // </div>
    <div className="flex flex-col h-full gap-3">
      <PanelHeader
        title="Media"
        extraRightContent={
          <Button
            variant="ghost"
            className="!p-0 h-fit"
            onClick={toggleCollectorEnableStatus}>
            <AtomIcon
              className={clsx(
                "w-5 h-5 text-purple",
                isEnable && "animate-spin"
              )}
            />
          </Button>
        }
      />
      <main className="columns-2 gap-2 p-2 space-y-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 hide-scrollbar">
        {addedMedia.map((media, index) => {
          if (media.type === "img") {
            return (
              <ImageWithFallback
                src={media.src}
                key={index}
                alt={`img-${index}`}
                className="w-full rounded-md break-inside-avoid"
                fallbackClassName="w-full rounded-md"
              />
            )
          }
          return (
            <div
              key={index}
              className="w-full pb-[100%] border border-purple rounded-md relative">
              <div className="absolute inset-0 flex items-center justify-center">
                VIDEO
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
