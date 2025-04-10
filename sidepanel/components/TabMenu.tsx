import clsx from "clsx"
import { useState } from "react"

enum TabKey {
  category = "tab_category",
  collection = "tab_collection"
}
type TabItem = {
  key: TabKey
  content: string
}
const TabItems: TabItem[] = [
  {
    key: TabKey.category,
    content: "Category"
  },
  {
    key: TabKey.collection,
    content: "Collection"
  }
] as const

export const TabMenu = () => {
  const [currentItem, setCurrentItem] = useState<TabItem>(TabItems[0])

  const toggleDrawer = (key: TabKey) => {
    const targetItem = TabItems.find((item) => item.key === key)
    if (targetItem) {
      setCurrentItem(targetItem)
    }
  }
  return (
    <div className="inline-flex rounded-md text-muted-foreground w-full bg-muted p-0 items-start justify-start overflow-x-auto overflow-y-hidden relative hide-scrollbar h-11">
      {TabItems.map((item) => {
        return (
          <div
            className={clsx(
              "relative cursor-pointer h-full flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
              currentItem.key === item.key && "text-primary-brand"
            )}
            key={item.key}
            onClick={() => toggleDrawer(item.key)}>
            {item.content}
            {currentItem.key === item.key && (
              <div className="h-[2px] bg-primary-brand absolute top-auto bottom-[2px] left-2 right-2" />
            )}
          </div>
        )
      })}
    </div>
  )
}
