import { TweetListSection } from "./TweetListSection"

export const PostPanel = () => {
  return (
    <div className="flex flex-col w-full gap-y-2 flex-1 min-h-0">
      <div className="flex items-center gap-x-1 p-0 relative text-primary-brand">
        <div className=" text-base font-semibold">Posts</div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <TweetListSection />
      </div>
    </div>
  )
}
