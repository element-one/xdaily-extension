import { Search } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { useTweetCollections } from "~services/collection"
import { type TweetCollection } from "~types/collection"
import {
  ContentMessageType,
  type AddTweetCollectionPayload
} from "~types/message"

import { TweetListItem } from "./TweetListItem"

/**
 * TODO in Search Panel
 * 1. Search
 * 4. operation for list: operation loading/drop down...etc.
 */
export const TweetListSection = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTweetCollections(15)
  const bottomObserver = useRef<HTMLDivElement>(null)

  const [addedCollection, setAddedCollection] = useState<TweetCollection[]>([])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (message: AddTweetCollectionPayload) => {
        if (message.type === ContentMessageType.ADD_COLLECTION) {
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
    <>
      <div className="flex flex-col w-full">
        <div className="relative w-full">
          <Search className="absolute h-4 w-4 text-muted-foreground left-2.5 top-1/2 -translate-y-1/2" />
          <input
            className="flex h-10 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-active file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8 w-full"
            placeholder="Search your current collections"
          />
        </div>
      </div>
      {collection?.length > 0 ? (
        <section className="mt-3 flex flex-col gap-2 py-2">
          {collection.map((item, index) => (
            <TweetListItem key={index} {...item} />
          ))}
        </section>
      ) : (
        <section className="h-[50vh] flex items-center justify-center mt-3">
          Collection is empty
        </section>
      )}

      {/* load more */}
      <div ref={bottomObserver} className="h-10" />
      {isFetchingNextPage && <p className="text-center">loading...</p>}
    </>
  )
}
