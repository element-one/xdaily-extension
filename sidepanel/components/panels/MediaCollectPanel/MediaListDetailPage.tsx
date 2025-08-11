import { ChevronLeftIcon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react"
import type { FC } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "~sidepanel/components/ui/DropdownMenu"
import { EmptyContent } from "~sidepanel/components/ui/EmptyContent"
import { ImageWithFallback } from "~sidepanel/components/ui/ImageWithFallback"
import { PanelHeader } from "~sidepanel/components/ui/PanelHeader"
import type { ScanningMedia } from "~types/media"

import { CommandGenerator } from "./CommandGenerator"
import { MediaCont } from "./MediaCont"
import { ResponsiveColumns } from "./ResponsiveColumns"

const mockData = [
  {
    src: "https://pbs.twimg.com/profile_images/872816390197067776/fGtCd3Du_x96.jpg",
    type: "img",
    tweetUrl: ""
  },
  {
    src: "https://pbs.twimg.com/profile_images/906968425553186817/0ar7Vv30_bigger.jpg",
    type: "img",
    tweetUrl: ""
  },
  {
    src: "https://pbs.twimg.com/profile_banners/710463119886262272/1754154067/1080x360",
    type: "img",
    tweetUrl: ""
  },
  {
    src: "https://pbs.twimg.com/profile_images/1494841994572562433/I-j4N9Z7_400x400.jpg",
    type: "img",
    tweetUrl: ""
  },
  {
    src: "https://abs-0.twimg.com/emoji/v2/svg/1f4d4.svg",
    type: "img",
    tweetUrl: ""
  },
  {
    src: "https://pbs.twimg.com/profile_images/1494841994572562433/I-j4N9Z7_x96.jpg",
    type: "img",
    tweetUrl: "https://x.com/cburniske/status/1912746702123250107"
  },
  {
    src: "https://pbs.twimg.com/profile_images/1946593361084682240/aFawSR3a_x96.jpg",
    type: "img",
    tweetUrl: "https://x.com/gossipaddress/status/1954732212840185927"
  },
  {
    src: "https://pbs.twimg.com/profile_images/1494841994572562433/I-j4N9Z7_normal.jpg",
    type: "img",
    tweetUrl: "https://x.com/gossipaddress/status/1954732212840185927"
  },
  {
    src: "https://pbs.twimg.com/profile_images/1857553234417836032/z8HTlSzj_normal.jpg",
    type: "img",
    tweetUrl: "https://x.com/cburniske/status/1954731614505955431"
  },
  {
    src: "https://abs-0.twimg.com/emoji/v2/svg/270d.svg",
    type: "img",
    tweetUrl: "https://x.com/cburniske/status/1954731614505955431"
  },
  {
    src: "https://abs-0.twimg.com/emoji/v2/svg/1f914.svg",
    type: "img",
    tweetUrl: "https://x.com/cburniske/status/1954727870540231020"
  },
  {
    src: "https://pbs.twimg.com/profile_images/1821930636384288768/p_0W-VqN_normal.jpg",
    type: "img",
    tweetUrl: "https://x.com/cburniske/status/1953895040755151275"
  },
  {
    src: "https://abs-0.twimg.com/emoji/v2/svg/1f6e1.svg",
    type: "img",
    tweetUrl: "https://x.com/cburniske/status/1953895040755151275"
  },
  {
    src: "https://pbs.twimg.com/profile_images/1516832438818770944/n77EwnKU_x96.png",
    type: "img",
    tweetUrl: ""
  },
  {
    src: "https://pbs.twimg.com/profile_images/1944131484433993728/p_fsWT_w_bigger.png",
    type: "img",
    tweetUrl: ""
  },
  {
    src: "https://pbs.twimg.com/profile_images/1945370420191875072/o5Ep8CTf_x96.png",
    type: "img",
    tweetUrl: ""
  },
  {
    src: "https://pbs.twimg.com/profile_images/1726604328578732032/IlumNl_N_x96.jpg",
    type: "img",
    tweetUrl: ""
  }
] as ScanningMedia[]

interface MediaListDetailPageProps {
  onBack: () => void
}
export const MediaListDetailPage: FC<MediaListDetailPageProps> = ({
  onBack
}) => {
  const handleBack = () => {
    onBack()
  }
  return (
    <main className="flex flex-col h-full py-4 pl-4 pr-0 absolute inset-0 bg-fill-bg-deep">
      <PanelHeader
        title={
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" className="!p-0" onClick={handleBack}>
              <ChevronLeftIcon className="w-5 h-5 text-text-default-primary" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="!p-0">
                  <EllipsisVerticalIcon className="w-5 h-5 text-text-default-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Trash2Icon className="text-red w-4 h-4" />
                    <span>Delete</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem className="font-semibold focus:bg-transparent outline-none select-none w-full justify-center">
                        Are you sure you?
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="!text-red w-full justify-center"
                        onSelect={() => {}}>
                        Yes, Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem className="w-full justify-center">
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />
      <div className="min-h-0 flex-1 overflow-hidden">
        <section className="flex flex-col relative h-full w-full gap-4 py-4">
          {/* title */}
          <div className="flex gap-4 items-center">
            <ImageWithFallback
              src=""
              className="w-14 h-14 rounded"
              fallbackClassName="w-14 h-14 rounded"
            />
            <div className="font-semibold text-base">demo title</div>
          </div>
          <div className="sticky top-0 gap-4">
            {/* command */}
            <CommandGenerator />
          </div>

          {/* images */}
          <div className="flex flex-col gap-4 min-h-0 flex-1 overflow-scroll">
            <div className="flex items-center justify-end">
              {mockData.length} images
            </div>
            {mockData.length > 0 && (
              <ResponsiveColumns classNames="px-0 overflow-scroll hide-scrollbar">
                {mockData.map((media, index) => (
                  <MediaCont
                    key={`${media.src}${index}`}
                    handleClick={() => {}}
                    media={media}
                  />
                ))}
              </ResponsiveColumns>
            )}
            {!mockData.length && (
              <EmptyContent hideImage content="No Media Data" />
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
