import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { AtomIcon } from "lucide-react"
import { useEffect, useState, type FC } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import type { ScanningMedia } from "~types/media"
import { MessageType, type MessagePayload } from "~types/message"

import { MediaCont } from "./MediaCont"

enum TabKey {
  EXPLORE = "explore",
  LIST = "list"
}

const tabs = [
  {
    key: TabKey.EXPLORE,
    labelI18nKey: "studio_panel.design",
    label: "Explore"
  },
  {
    key: TabKey.LIST,
    labelI18nKey: "studio_panel.tools",
    label: "List"
  }
]

export const MediaCollectPanel: FC = () => {
  // TODO a global status
  const [isEnable, setEnable] = useState(false)
  const [addedMedia, setAddedMedia] = useState<ScanningMedia[]>([])
  const [open, onOpenChange] = useState(false)
  const [editingMedia, setEditingMedia] = useState<ScanningMedia>()
  const [tabKey, setTabKey] = useState<TabKey>(TabKey.EXPLORE)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message: MessagePayload) => {
      if (message.type === MessageType.ADD_COLLECTING_MEDIA) {
        setAddedMedia((prev) => [...message.data, ...prev])
      }
      if (message.type === MessageType.DIRECT_EDIT_MEDIA) {
        const media = message.data
        setAddedMedia((prev) => [media, ...prev])
        setEditingMedia(media)
        setTimeout(() => {
          onOpenChange(true)
        }, 0)
      }
    })
    setAddedMedia([])
    setEnable(true)
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs
            .sendMessage(tab.id, {
              type: MessageType.TOGGLE_COLLECT_MEDIA,
              enable: true
            })
            .catch(() => {})
        }
      })
    })
    return () => {
      // stop scanning when leave the panel
      setAddedMedia([])
      setEnable(false)
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs
              .sendMessage(tab.id, {
                type: MessageType.TOGGLE_COLLECT_MEDIA,
                enable: false
              })
              .catch(() => {})
          }
        })
      })
    }
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
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={clsx(
              "text-text-default-primary border flex cursor-pointer items-center rounded-lg px-2 py-1 text-sm",
              tabKey === tab.key
                ? "bg-fill-bg-light  border-fill-bg-input"
                : "bg-transparent border-transparent"
            )}
            onClick={() => {
              setTabKey(tab.key)
            }}>
            {tab.label}
          </button>
        ))}
      </div>
      {tabKey === TabKey.EXPLORE && (
        <>
          {addedMedia.length > 0 && (
            <main className="columns-2 gap-2 p-2 space-y-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 hide-scrollbar">
              {addedMedia.map((media, index) => (
                <MediaCont
                  key={`${media.src}${index}`}
                  handleClick={() => editMedia(media)}
                  media={media}
                />
              ))}
              {/* edit modal */}
              <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-fill-bg-light rounded-lg p-6  border border-fill-bg-input space-y-4 text-text-default-primary">
                    <Dialog.Title className="text-base">
                      Edit Media
                    </Dialog.Title>
                    <div className="space-y-2">
                      {editingMedia && <MediaCont media={editingMedia} />}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => onOpenChange(false)}>close</Button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </main>
          )}
          {!addedMedia.length && (
            <EmptyContent hideImage content="Start Collecting..." />
          )}
        </>
      )}
      {tabKey === TabKey.LIST && (
        <main className="w-full h-full flex items-center justify-center">
          <EmptyContent hideImage content="Empty List" />
        </main>
      )}
    </div>
  )
}
