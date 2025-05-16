import { useEffect, useMemo, useRef, useState } from "react"

import { useUserCollections } from "~services/collection"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { type UserCollection } from "~types/collection"
import { MessageType, type AddUserCollectionPayload } from "~types/message"

import { UserItem } from "./UserItem"

export const UserTabContent = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserCollections(15)
  const bottomObserver = useRef<HTMLDivElement>(null)

  const [addedCollection, setAddedCollection] = useState<UserCollection[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (message: AddUserCollectionPayload) => {
        if (message.type === MessageType.ADD_USER_COLLECTION) {
          setAddedCollection((prev) => [message.data, ...prev])
        }
      }
    )
  }, [])

  useEffect(() => {
    if (!hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (bottomObserver.current) observer.observe(bottomObserver.current)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const collection = useMemo(() => {
    return [...addedCollection, ...(data?.pages ? data.pages : [])]
  }, [addedCollection, data])

  return (
    <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden pb-4 hide-scrollbar">
      {collection?.length > 0 ? (
        <section className="flex flex-col gap-4 py-2 flex-1 overflow-y-scroll stylized-scroll">
          {collection.map((kol, index) => (
            <UserItem {...kol} key={index} />
          ))}
        </section>
      ) : (
        <EmptyContent content="Empty Category" />
      )}
      {/* load more */}
      <div ref={bottomObserver} className="h-4 w-full" />
      {isFetchingNextPage && <p className="text-center">loading...</p>}
    </main>
  )
}
