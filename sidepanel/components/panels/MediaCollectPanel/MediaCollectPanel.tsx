import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { AtomIcon } from "lucide-react"
import { useEffect, useState, type FC } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { ImageWithFallback } from "~sidepanel/components/ui/ImageWithFallback"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import type { ScanningMedia } from "~types/media"
import { MessageType, type MessagePayload } from "~types/message"

export const MediaCollectPanel: FC = () => {
  // TODO a global status
  const [isEnable, setEnable] = useState(false)
  const [addedMedia, setAddedMedia] = useState<ScanningMedia[]>([])
  const [open, onOpenChange] = useState(false)
  const [editingMedia, setEditingMedia] = useState<ScanningMedia>()

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: MessagePayload) => {
      if (message.type === MessageType.ADD_COLLECTING_MEDIA) {
        setAddedMedia((prev) => [...message.data, ...prev])
      }
    })
  }, [])

  const toggleCollectorEnableStatus = () => {
    if (!isEnable) {
      // clean media before start again
      setAddedMedia([])
    }
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

  const editMedia = (media: ScanningMedia) => {
    setEditingMedia(media)
    onOpenChange(true)
  }

  // TODO i18n
  return (
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
                onClick={() => editMedia(media)}
                src={media.src}
                key={index}
                alt={`img-${index}`}
                className="w-full rounded-md break-inside-avoid cursor-pointer"
                fallbackClassName="w-full rounded-md"
              />
            )
          }
          return (
            <div
              key={index}
              onClick={() => editMedia(media)}
              className="w-full pb-[100%] border border-purple rounded-md relative cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                VIDEO
              </div>
            </div>
          )
        })}
        {/* edit modal */}
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-fill-bg-light rounded-lg p-6  border border-fill-bg-input space-y-4 text-text-default-primary">
              <Dialog.Title className="text-base">Edit Media</Dialog.Title>
              <div className="space-y-2">
                {editingMedia && editingMedia.type === "img" && (
                  <ImageWithFallback
                    src={editingMedia.src}
                    className="w-full rounded-md break-inside-avoid cursor-pointer"
                    fallbackClassName="w-full rounded-md"
                  />
                )}
                {editingMedia && editingMedia.type === "video" && (
                  <div className="w-full pb-[100%] border border-purple rounded-md relative cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center">
                      VIDEO
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={() => onOpenChange(false)}>close</Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </main>
    </div>
  )
}
