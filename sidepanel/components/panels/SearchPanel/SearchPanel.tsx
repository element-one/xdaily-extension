import { Search } from "lucide-react"

import { SearchListItem } from "./SearchListItem"

const MOCK_LIST = new Array(100).fill(0).map((item, index) => ({
  name: `List Item ${index + 1}`,
  description: `This is some description ${index + 1}`,
  img: ""
}))

/**
 * TODO in Search Panel
 * 1. Search
 * 2. Infinite Scroll
 * 3. fetch lists
 * 4. operation for list: operation loading/drop down...etc.
 */
export const SearchPanel = () => {
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
      <section className="flex-1 mt-3 min-h-0 flex flex-col gap-2 py-2">
        {MOCK_LIST.map((item, index) => (
          <SearchListItem
            name={item.name}
            description={item.description}
            key={index}
          />
        ))}
      </section>
    </>
  )
}
