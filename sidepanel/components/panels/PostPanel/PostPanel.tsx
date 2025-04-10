import { TabMenu } from "~sidepanel/components/TabMenu"

import { TweetListSection } from "./TweetListSection"

export const PostPanel = () => {
  return (
    <div className="flex flex-col w-full gap-y-2 flex-1 min-h-0">
      <TabMenu />
      <div className="flex-1 min-h-0 flex flex-col">
        <TweetListSection />
      </div>
    </div>
  )
}
