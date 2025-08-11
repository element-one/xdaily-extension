import * as Dialog from "@radix-ui/react-dialog"
import { useState, type FC } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { ImageWithFallback } from "~sidepanel/components/ui/ImageWithFallback"
import { InputBox } from "~sidepanel/components/ui/InputBox"

const data = [
  {
    coverUrl: "",
    title: "demo"
  }
]

export const MediaListCont: FC = () => {
  const [open, onOpenChange] = useState(false)

  return (
    <main className="w-full h-full flex flex-col">
      <Button className="w-full mb-2" onClick={() => onOpenChange(true)}>
        Create New List
      </Button>
      {data.length > 0 && (
        <div className="grid grid-cols-2">
          {data.map((item, index) => (
            <div
              className="col-span-1 h-36 rounded overflow-hidden p-1 flex flex-col gap-1 border border-fill-bg-input hover:border-primary-brand cursor-pointer"
              key={index}>
              <div className="flex-1 min-h-0 overflow-hidden">
                <ImageWithFallback
                  src={item.coverUrl}
                  alt={item.title}
                  className="size-full object-contain rounded"
                  fallbackClassName="size-full rounded"
                />
              </div>
              <div className="line-clamp-1 text-text-default-primary text-sm font-semibold">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      )}
      {!data.length && (
        <div className="flex-1 min-h-0">
          <EmptyContent hideImage content="Empty List" />
        </div>
      )}
      {/* create new list modal */}
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-fill-bg-light rounded-lg p-6  border border-fill-bg-input space-y-4 text-text-default-primary">
            <Dialog.Title className="text-base">New List</Dialog.Title>
            <Dialog.Description>
              Create a new list to save your images
            </Dialog.Description>
            <div className="space-y-2">
              <InputBox placeholder="Insert List Name" />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => onOpenChange(false)}>Create</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}
