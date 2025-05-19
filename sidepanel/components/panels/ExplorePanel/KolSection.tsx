import { useEffect, useMemo, useRef, useState, type FC } from "react"

import { useKolCollections } from "~services/collection"
import { Button } from "~sidepanel/components/ui/Button"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"

import { KolItem } from "./KolItem"

const allCategory = {
  id: "",
  name: "All"
}

export const KolSection: FC = () => {
  // TODO search category
  const [currentCategory, setCurrentCategory] = useState<string>(allCategory.id)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useKolCollections(15, currentCategory)
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

  const collection = useMemo(() => {
    return [...(data?.pages ? data.pages : [])]
  }, [data])

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Category"
        rightContent={
          <Button variant="ghost" className="!p-0 h-fit">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.58877 3.334L15.4166 3.33421C15.4792 3.33421 15.5415 3.34127 15.6024 3.35518L15.6924 3.38117C16.1788 3.55177 16.5589 3.93785 16.722 4.42687C16.8687 4.867 16.8246 5.34593 16.6053 5.74957L16.5257 5.88117L16.4499 5.97811L12.4999 10.3217V15.8342C12.4999 16.4897 11.7856 16.8767 11.2429 16.5521L11.1666 16.5009L7.83327 14.0009C7.64966 13.8632 7.53216 13.6569 7.50565 13.4317L7.49994 13.3342V10.3225L3.54999 5.97811L3.47415 5.88117C3.18736 5.45283 3.11491 4.9159 3.27792 4.42687C3.42611 3.9823 3.75373 3.62281 4.17753 3.43295L4.30222 3.38279L4.39219 3.35622L4.4916 3.33921C4.5264 3.33534 4.55768 3.3338 4.58877 3.334ZM15.0861 5.00093H4.91357L8.95019 9.44036C9.0664 9.56819 9.13942 9.72829 9.16054 9.89807L9.16691 10.0009V12.9176L10.8336 14.1676V10.0009C10.8336 9.82817 10.8872 9.66059 10.9858 9.52075L11.0503 9.44036L15.0861 5.00093Z"
                fill="white"
                fillOpacity="0.8"
              />
            </svg>
          </Button>
        }
      />
      <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden py-4 hide-scrollbar">
        {collection?.length > 0 ? (
          <section className="flex flex-col gap-4 py-2 flex-1 overflow-y-scroll stylized-scroll">
            {collection.map((kol, index) => (
              <KolItem item={kol} key={index} />
            ))}
          </section>
        ) : (
          <EmptyContent content="Empty Category" />
        )}
        {/* load more */}
        <div ref={bottomObserver} className="h-4 w-full" />
        {isFetchingNextPage && <p className="text-center">loading...</p>}
      </main>
    </div>
  )
}
