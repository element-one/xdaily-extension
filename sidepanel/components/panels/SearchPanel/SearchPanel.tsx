import { Search } from "lucide-react"
import { useEffect, useRef } from "react"

import { getTweetCollection, useTweetCollections } from "~services/collection"
import { MessageType } from "~types/enum"

import { SearchListItem } from "./SearchListItem"

/**
 * TODO in Search Panel
 * 1. Search
 * 4. operation for list: operation loading/drop down...etc.
 */
export const SearchPanel = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useTweetCollections(15)

  const bottomObserver = useRef<HTMLDivElement>(null)

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

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === MessageType.REFETCH_COLLECTION) {
      refetch()
    }
  })

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
      {data?.pages?.length > 0 ? (
        <section className="mt-3 flex flex-col gap-2 py-2">
          {data.pages.map((item, index) => (
            <SearchListItem
              name={item.content}
              description={item.content}
              key={index}
            />
          ))}
        </section>
      ) : (
        <section className="flex-1 min-h-0 flex items-center justify-center mt-3">
          Collection is empty
        </section>
      )}

      {/* load more */}
      <div ref={bottomObserver} className="h-10" />
      {isFetchingNextPage && <p className="text-center">loading...</p>}
    </>
  )
}
