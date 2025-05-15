import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { UserIcon } from "lucide-react"

import { useStore } from "~store/store"

import { Avatar } from "./ui/Avatar"

export const UserNavbarItem = () => {
  const userInfo = useStore((state) => state.userInfo)

  const jumpToProfilePage = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}`
    })
  }
  if (!userInfo) {
    return null
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="w-9 h-9 flex items-center justify-center outline-none select-none">
        <Avatar url={userInfo.profileImageUrl} alt={userInfo?.username} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={0}
        className="z-50 min-w-[268px] mr-4 overflow-hidden rounded-md border-[1px] border-fill-bg-input bg-fill-bg-light text-text-default-primary shadow-md">
        <DropdownMenu.Item
          className="focus:bg-transparent outline-none select-none p-3 flex flex-row items-center justify-start gap-2"
          onSelect={jumpToProfilePage}>
          <Avatar
            url={userInfo.profileImageUrl}
            alt={userInfo?.username}
            className="w-8 h-8"
          />
          <div className="text-xs font-normal">
            <div>@{userInfo?.username}</div>
            <div className="text-primary-brand">{userInfo?.email}</div>
          </div>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="focus:bg-fill-bg-deep relative select-none rounded-sm px-3 py-2 outline-none transition-colors cursor-pointer"
          onSelect={jumpToProfilePage}>
          <div className="w-full gap-1 text-sm font-light flex flex-row items-center justify-start">
            <UserIcon className="w-[14px] h-[14px] text-orange" />
            <div>My Account</div>
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
