import { Search } from "lucide-react"

import { BoardPanelItem, type BoardPanelItemProps } from "./BoardPanelItem"

const MOCK_LIST: BoardPanelItemProps[] = [
  {
    folderCount: 1,
    folderName: "ChatGPT",
    items: [
      {
        img: "",
        title: "First Item Title",
        description: "First Item description",
        href: ""
      }
    ]
  },
  {
    folderCount: 3,
    folderName: "ChatGPT2",
    items: [
      {
        img: "",
        title: "First Item Title",
        description: "First Item description",
        href: ""
      },
      {
        img: "",
        title: "Second Item Title",
        description: "First Item description",
        href: ""
      },
      {
        img: "",
        title: "Third Item Title",
        description: "First Item description",
        href: ""
      }
    ]
  }
]

export const BoardPanel = () => {
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
          <BoardPanelItem
            key={index}
            folderCount={item.folderCount}
            folderName={item.folderName}
            items={item.items}
          />
        ))}
      </section>
    </>
  )
}
