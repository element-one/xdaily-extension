import { TweetListSection } from "./TweetListSection"

export const PostPanel = () => {
  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className="flex-1 min-h-0">
        <TweetListSection />
      </div>
    </div>
  )
}
