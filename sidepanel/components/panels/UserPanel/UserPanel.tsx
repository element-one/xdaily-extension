import { UserSection } from "./UserSection"

export const UserPanel = () => {
  return (
    <div className="flex flex-col w-full gap-y-4">
      <div className="flex-1 min-h-0">
        <UserSection />
      </div>
    </div>
  )
}
