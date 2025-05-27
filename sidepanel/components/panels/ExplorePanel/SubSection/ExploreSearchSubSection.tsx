import clsx from "clsx"
import { FileTextIcon, SearchIcon, UsersIcon, XIcon } from "lucide-react"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode
} from "react"

import { formatRelativeTime } from "~libs/date"
import { useDebounce } from "~libs/debounce"
import { userSearchExplore } from "~services/collection"
import DesignTemplateIcon from "~sidepanel/components/icons/DesignTemplateIcon"
import DocIcon from "~sidepanel/components/icons/DocIcon"
import ExcelIcon from "~sidepanel/components/icons/ExcelIcon"
import PdfIcon from "~sidepanel/components/icons/PdfIcon"
import PostIcon from "~sidepanel/components/icons/PostIcon"
import PPTIcon from "~sidepanel/components/icons/PPTIcon"
import TextIcon from "~sidepanel/components/icons/TextIcon"
import TextTabIcon from "~sidepanel/components/icons/TextTabIcon"
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
    icon: <TextTabIcon className="w-4 h-4 text-green" />
  },
  {
    type: FilterType.POST,
    label: "Post",
    icon: <PostIcon className="w-4 h-4 text-purple" />
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
  const {
    mutateAsync: searchExplore,
    isPending: isSearchingExplore,
    data: searchData
  } = userSearchExplore()

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const [searchValue, setSearchValue] = useState("")
  const [tag, setTag] = useState<FilterType | "all">("all")

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
    tabRefs.current[type]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    })
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
            ref={(el) => (tabRefs.current[filter.type] = el)}
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
