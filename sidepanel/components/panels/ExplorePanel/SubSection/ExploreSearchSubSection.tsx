import {
  ChevronDown,
  FileTextIcon,
  SearchIcon,
  UsersIcon,
  XIcon
} from "lucide-react"
import { useEffect, useMemo, useState, type FC, type ReactNode } from "react"

import { useDebounce } from "~libs/debounce"
import { userSearchExplore } from "~services/collection"
import DesignTemplateIcon from "~sidepanel/components/icons/DesignTemplateIcon"
import { Avatar } from "~sidepanel/components/ui/Avatar"
import { Button } from "~sidepanel/components/ui/Button"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { InputBox } from "~sidepanel/components/ui/InputBox"
import { Skeleton } from "~sidepanel/components/ui/Skeleton"

enum FilterType {
  PEOPLE = "people",
  FILES = "files",
  CHANNELS = "channels"
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
    type: FilterType.CHANNELS,
    label: "Channels",
    icon: <DesignTemplateIcon className="w-4 h-4 text-green" />
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
  imgContent: ReactNode
  mainText: string
  desc: string
}) => {
  return (
    <div className="transition-all hover:bg-fill-bg-light flex cursor-pointer items-center gap-2 rounded px-4 py-1">
      {imgContent}
      <div className="flex flex-col text-xs">
        <span className="text-text-default-primary">{mainText}</span>
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
    return (
      !isSearchingExplore &&
      !searchData?.people?.length &&
      !searchData?.channels?.length &&
      !searchData?.files?.length &&
      !searchData?.text?.length
    )
  }, [isSearchingExplore, searchData])

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
          <Button key={filter.type} variant="tertiary" className="gap-1">
            {filter.icon}
            <span className="text-text-default-primary">{filter.label}</span>
          </Button>
        ))}
        <Button key="more" variant="tertiary" className="gap-1">
          <span className="text-text-default-primary">More</span>
          <ChevronDown className="text-fill-layer-layer w-4 h-4" />
        </Button>
      </div>
      {isSearchingExplore ? (
        <ExploreSearchSkeleton />
      ) : isEmpty ? (
        <EmptyContent content="No result" />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar flex flex-col">
          {/* people */}
          {!!searchData?.people?.length && (
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
          {/* TODO more section */}
        </div>
      )}
    </div>
  )
}
