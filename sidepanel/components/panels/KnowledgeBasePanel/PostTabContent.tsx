import { Search } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { useTweetCollections } from "~services/collection"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { type TweetCollection } from "~types/collection"
import { MessageType, type AddTweetCollectionPayload } from "~types/message"

import { TweetItem } from "./TweetItem"

// import { TweetListItem } from "./TweetListItem"

export const PostTabContent = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTweetCollections(15)
  const bottomObserver = useRef<HTMLDivElement>(null)

  const [addedCollection, setAddedCollection] = useState<TweetCollection[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (message: AddTweetCollectionPayload) => {
        if (message.type === MessageType.ADD_COLLECTION) {
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
        <section className="mt-3 flex flex-col gap-2 py-2 overflow-y-scroll  stylized-scroll">
          {collection.map((item, index) => (
            <TweetItem key={index} {...item} />
          ))}
        </section>
      ) : (
        <EmptyContent content="Post is empty" />
      )}
      <div ref={bottomObserver} className="h-10" />
      {isFetchingNextPage && <p className="text-center">loading...</p>}
    </main>
  )
}
