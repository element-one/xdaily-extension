import clsx from "clsx"
import { FileTextIcon, SearchIcon, UsersIcon, XIcon } from "lucide-react"
import { useEffect, useMemo, useState, type FC, type ReactNode } from "react"

import { formatRelativeTime } from "~libs/date"
import { useDebounce } from "~libs/debounce"
import { userSearchExplore } from "~services/collection"
import DesignTemplateIcon from "~sidepanel/components/icons/DesignTemplateIcon"
import DocIcon from "~sidepanel/components/icons/DocIcon"
import ExcelIcon from "~sidepanel/components/icons/ExcelIcon"
import PdfIcon from "~sidepanel/components/icons/PdfIcon"
import PPTIcon from "~sidepanel/components/icons/PPTIcon"
import TextIcon from "~sidepanel/components/icons/TextIcon"
import { Avatar } from "~sidepanel/components/ui/Avatar"
import { Button } from "~sidepanel/components/ui/Button"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { InputBox } from "~sidepanel/components/ui/InputBox"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"

enum FilterType {
  PEOPLE = "people",
  FILES = "files",
  TEXT = "text",
  POST = "post"
}
const Filters = [
  {
    type: FilterType.PEOPLE,
    label: "People",
    icon: <UsersIcon className="text-orange w-4 h-4" />
  },
  {
    type: FilterType.FILES,
    label: "Files",
    icon: <FileTextIcon className="w-4 h-4 text-primary-brand" />
  },
  {
    type: FilterType.TEXT,
    label: "Text",
    icon: <FileTextIcon className="w-4 h-4 text-green" />
  },
  {
    type: FilterType.POST,
    label: "Post",
    icon: (
      <svg
        className="text-purple shrink-0"
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.79102 2.66736H6.65768C6.08663 2.66736 5.69843 2.66788 5.39838 2.69239C5.1061 2.71627 4.95663 2.75956 4.85236 2.81268C4.60148 2.94052 4.39751 3.14449 4.26967 3.39537C4.21655 3.49964 4.17326 3.64911 4.14938 3.94138C4.12487 4.24144 4.12435 4.62964 4.12435 5.20069V10.8007C4.12435 11.3717 4.12487 11.7599 4.14938 12.06C4.17326 12.3523 4.21655 12.5017 4.26967 12.606C4.39751 12.8569 4.60148 13.0609 4.85236 13.1887C4.95663 13.2418 5.1061 13.2851 5.39838 13.309C5.69843 13.3335 6.08663 13.334 6.65768 13.334H8.12435C8.49254 13.334 8.79102 13.6325 8.79102 14.0007C8.79102 14.3689 8.49254 14.6674 8.12435 14.6674H6.63013C6.09349 14.6674 5.65059 14.6674 5.2898 14.6379C4.91507 14.6073 4.5706 14.5416 4.24704 14.3767C3.74528 14.121 3.33733 13.7131 3.08167 13.2113C2.91681 12.8878 2.8511 12.5433 2.82048 12.1686C2.791 11.8078 2.79101 11.3649 2.79102 10.8282V5.17316C2.79101 4.63652 2.791 4.1936 2.82048 3.83281C2.8511 3.45808 2.91681 3.11361 3.08167 2.79005C3.33733 2.28829 3.74528 1.88034 4.24704 1.62468C4.5706 1.45982 4.91507 1.39411 5.2898 1.36349C5.6506 1.33401 6.0935 1.33402 6.63015 1.33403L8.86679 1.334C9.29012 1.3338 9.60998 1.33365 9.91844 1.40771C10.1905 1.47303 10.4507 1.58078 10.6893 1.72699C10.9597 1.89274 11.1858 2.11902 11.485 2.4185L12.3732 3.30671C12.6727 3.6059 12.899 3.83198 13.0647 4.10246C13.2109 4.34105 13.3187 4.60117 13.384 4.87327C13.4581 5.18172 13.4579 5.50158 13.4577 5.92491L13.4577 8.66736C13.4577 9.03555 13.1592 9.33403 12.791 9.33403C12.4228 9.33403 12.1243 9.03555 12.1243 8.66736V6.00069H10.791C9.68645 6.00069 8.79102 5.10526 8.79102 4.00069V2.66736ZM11.831 4.66736C11.7509 4.57262 11.6229 4.44209 11.3824 4.20151L10.5902 3.40936C10.3496 3.16877 10.2191 3.04082 10.1243 2.96071V4.00069C10.1243 4.36888 10.4228 4.66736 10.791 4.66736H11.831Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.9869 10.8613C13.2473 10.6009 13.6694 10.6009 13.9297 10.8613L15.2631 12.1946C15.5234 12.455 15.5234 12.8771 15.2631 13.1374L13.9297 14.4708C13.6694 14.7311 13.2473 14.7311 12.9869 14.4708C12.7266 14.2104 12.7266 13.7883 12.9869 13.5279L13.1822 13.3327H10.7917C10.4235 13.3327 10.125 13.0342 10.125 12.666C10.125 12.2978 10.4235 11.9993 10.7917 11.9993L13.1822 11.9993L12.9869 11.8041C12.7266 11.5437 12.7266 11.1216 12.9869 10.8613Z"
          fill="currentColor"
        />
      </svg>
    )
  }
]

const ExploreSearchSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 px-4">
      <Skeleton className="h-[18px] w-12" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-11 flex items-center gap-2 rounded-lg">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex flex-1 flex-col text-sm">
              <Skeleton className="mb-1 h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ListItem = ({
  imgContent,
  mainText,
  desc
}: {
  imgContent?: ReactNode
  mainText: string
  desc: string
}) => {
  return (
    <div className="transition-all hover:bg-fill-bg-light flex cursor-pointer items-center gap-2 rounded px-4 py-1">
      {!!imgContent && imgContent}
      <div className="flex flex-col text-xs min-w-0 flex-1">
        <div className="text-text-default-primary line-clamp-1 w-full break-all">
          {mainText}
        </div>
        <span className="text-text-default-secondary">{desc}</span>
      </div>
    </div>
  )
}

interface ExploreSearchSubSectionProps {
  onClose: () => void
}
export const ExploreSearchSubSection: FC<ExploreSearchSubSectionProps> = ({
  onClose
}) => {
  const [searchValue, setSearchValue] = useState("")
  const [tag, setTag] = useState<FilterType | "all">("all")

  const {
    mutateAsync: searchExplore,
    isPending: isSearchingExplore,
    data: searchData
  } = userSearchExplore()

  const handleSearch = useDebounce((searchValue: string) => {
    searchExplore({ keywords: searchValue })
  }, 800)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    handleSearch(e.target.value)
  }

  useEffect(() => {
    searchExplore({ keywords: "" })
  }, [])

  const handleCloseExplore = () => {
    onClose()
  }

  const isEmpty = useMemo(() => {
    if (tag === "all") {
      return (
        !isSearchingExplore &&
        !searchData?.people?.length &&
        !searchData?.post?.length &&
        !searchData?.files?.length
      )
    } else if (tag === FilterType.PEOPLE) {
      return !isSearchingExplore && !searchData?.people?.length
    } else if (tag === FilterType.POST) {
      return !isSearchingExplore && !searchData?.post?.length
    } else if (tag === FilterType.FILES) {
      return (
        !isSearchingExplore &&
        !searchData?.files?.some((file) => file.type !== "text")
      )
    } else if (tag === FilterType.TEXT) {
      return (
        !isSearchingExplore &&
        !searchData?.files?.some((file) => file.type === "text")
      )
    }
  }, [isSearchingExplore, searchData, tag])

  const fileData = useMemo(() => {
    return (searchData?.files ?? [])
      .filter((file) => file.type !== "text")
      .map((item) => {
        const urlParts = (item.fileUrl ?? "").split("/")
        const fileName = urlParts[urlParts.length - 1]
        const fileType = item.type
        let fileIcon = <></>
        if (fileType.includes("pdf")) {
          fileIcon = <PdfIcon className="w-6 h-6 text-red" />
        } else if (fileType.includes("word") || fileType.includes("document")) {
          fileIcon = <DocIcon className="w-6 h-6 text-green" />
        } else if (
          fileType.includes("excel") ||
          fileType.includes("spreadsheet")
        ) {
          fileIcon = <ExcelIcon className="w-6 h-6 text-blue" />
        } else if (fileType.includes("image")) {
          fileIcon = <PPTIcon className="w-6 h-6 text-purple" />
        } else if (fileType.includes("text")) {
          fileIcon = <TextIcon className="w-6 h-6 text-cyan" />
        } else {
          fileIcon = (
            <div className="w-6 h-6 bg-gray-500/50 rounded-full flex items-center justify-center">
              <FileTextIcon className="w-3 text-gray-500" />
            </div>
          )
        }
        return {
          ...item,
          fileName,
          fileIcon
        }
      })
  }, [searchData])

  const textData = useMemo(() => {
    return (searchData?.files ?? []).filter((file) => file.type === "text")
  }, [searchData])

  const getUserName = (userId: string) => {
    const user = searchData?.people?.find((person) => person.userId === userId)
    if (!user) return ""
    return `@${user.screenName}`
  }

  const toggleTag = (type: FilterType) => {
    setTag((prev) => (prev === type ? "all" : type))
  }

  const showTag = (type: FilterType) => {
    return tag === "all" || tag === type
  }

  return (
    <div className="flex flex-col h-full bg-fill-bg-deep gap-4">
      <div className="px-4 pb-3 flex w-full items-center justify-between border-b border-fill-bg-input shrink-0">
        <div className="relative flex-1 gap-2 flex items-center">
          <SearchIcon className="w-5 h-5 text-text-default-regular shrink-0" />
          <InputBox
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search for reports"
            className="!bg-fill-bg-deep h-6 border-none"
          />
        </div>
        <button
          onClick={handleCloseExplore}
          className="bg-fill-bg-input hover:bg-fill-bg-light ml-4 flex w-6 h-6 cursor-pointer items-center justify-center rounded-full">
          <XIcon className="w-4 h-4 text-text-default-secondary" />
        </button>
      </div>
      <div className="px-4 flex gap-3 min-w-0 w-full overflow-y-auto hide-scrollbar shrink-0">
        {Filters.map((filter) => (
          <Button
            onClick={() => toggleTag(filter.type)}
            key={filter.type}
            variant="tertiary"
            className={clsx(
              "gap-1",
              tag === filter.type && "border-primary-brand"
            )}>
            {filter.icon}
            <span className="text-text-default-primary">{filter.label}</span>
          </Button>
        ))}
      </div>
      {isSearchingExplore ? (
        <ExploreSearchSkeleton />
      ) : isEmpty ? (
        <EmptyContent content="No result" />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar flex flex-col">
          {/* people */}
          {!!searchData?.people?.length && showTag(FilterType.PEOPLE) && (
            <section className="flex flex-col pb-3 border-b border-fill-bg-input">
              <div className="text-xs text-text-default-secondary mb-2 px-4">
                People
              </div>
              <div className="space-y-1">
                {searchData.people.map((person) => (
                  <ListItem
                    key={person.id}
                    imgContent={
                      <Avatar
                        url={person.avatar}
                        alt={person.screenName}
                        className="w-8 h-8"
                      />
                    }
                    mainText={person.name}
                    desc={person.bio}
                  />
                ))}
              </div>
            </section>
          )}
          {/* files */}
          {!!fileData?.length && showTag(FilterType.FILES) && (
            <section className="flex flex-col pb-3 border-b border-fill-bg-input mt-3">
              <div className="text-xs text-text-default-secondary mb-2 px-4">
                Files
              </div>
              <div className="space-y-1">
                {fileData.map((file) => (
                  <ListItem
                    key={file.id}
                    imgContent={
                      <div className="mr-2 shrink-0">{file.fileIcon}</div>
                    }
                    mainText={file.fileName}
                    desc={formatRelativeTime(file.createdAt as any as string)}
                  />
                ))}
              </div>
            </section>
          )}
          {/* Text */}
          {!!textData?.length && showTag(FilterType.TEXT) && (
            <section className="flex flex-col pb-3 border-b border-fill-bg-input mt-3">
              <div className="text-xs text-text-default-secondary mb-2 px-4">
                Text
              </div>
              <div className="space-y-1">
                {textData.map((text) => (
                  <ListItem
                    key={text.id}
                    mainText={text.content}
                    desc={formatRelativeTime(text.createdAt as any as string)}
                  />
                ))}
              </div>
            </section>
          )}
          {/* people */}
          {!!searchData?.post?.length && showTag(FilterType.POST) && (
            <section className="flex flex-col pb-3 border-b border-fill-bg-input mt-3">
              <div className="text-xs text-text-default-secondary mb-2 px-4">
                Post
              </div>
              <div className="space-y-1">
                {searchData.post.map((post) => (
                  <div
                    key={post.tweetId}
                    className="transition-all hover:bg-fill-bg-light flex cursor-pointer items-center gap-2 rounded px-4 py-1">
                    <div className="flex flex-col text-xs min-w-0 flex-1">
                      <div className="text-primary-brand text-sm">
                        {getUserName(post.userId)}
                      </div>
                      <div className="text-text-default-primary line-clamp-2 w-full break-all">
                        {post.content}
                      </div>
                      <span className="text-text-default-secondary">
                        {formatRelativeTime(post.timestamp as any as string)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
