import clsx from "clsx"
import { useMemo, useState, type ReactNode } from "react"

import { useStore } from "~store/store"
import { BookmarkItemKey } from "~types/enum"

import { TweetListSection } from "./TweetListSection"
import { UserSection } from "./UserSection"

type SearchItem = {
  key: BookmarkItemKey
  content: string
  component: ReactNode
}

const SearchItems: SearchItem[] = [
  {
    key: BookmarkItemKey.TWEET,
    content: "Posts",
    component: <TweetListSection />
  },
  {
    key: BookmarkItemKey.USER,
    content: "Users",
    component: <UserSection />
  }
] as const
export const SearchPanel = () => {
  const { bookmarkKey, setBookmarkKey } = useStore()

  const currentSearchItem = useMemo(() => {
    if (bookmarkKey) {
      return SearchItems.find((item) => item.key === bookmarkKey)
    }
    return undefined
  }, [bookmarkKey])

  const toggleDrawer = (itemKey: BookmarkItemKey) => {
    setBookmarkKey(itemKey)
  }

  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className="inline-flex rounded-md text-muted-foreground w-full bg-muted p-0 items-start justify-start overflow-x-auto overflow-y-hidden relative hide-scrollbar h-11">
        {SearchItems.map((item) => {
          return (
            <div
              className={clsx(
                "relative cursor-pointer h-full flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
                item.key === currentSearchItem.key && "text-primary-brand"
              )}
              key={item.key}
              onClick={() => toggleDrawer(item.key)}>
              {item.content}
              {item.key === currentSearchItem.key && (
                <div className="h-[2px] bg-primary-brand absolute top-auto bottom-[2px] left-2 right-2" />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex-1 min-h-0">{currentSearchItem.component}</div>
    </div>
  )
}
