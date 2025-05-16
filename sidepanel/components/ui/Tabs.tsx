// components/ui/tabs.tsx

import * as RadixTabs from "@radix-ui/react-tabs"
import clsx from "clsx"
import { forwardRef, type ComponentPropsWithoutRef } from "react"

const Tabs = Object.assign(
  (props: ComponentPropsWithoutRef<typeof RadixTabs.Root>) => (
    <RadixTabs.Root {...props} />
  ),
  {
    List: forwardRef<
      HTMLDivElement,
      ComponentPropsWithoutRef<typeof RadixTabs.List>
    >(({ className, ...props }, ref) => (
      <RadixTabs.List
        ref={ref}
        className={clsx("inline-flex gap-2", className)}
        {...props}
      />
    ))
  }
)
Tabs.List.displayName = "TabsList"

const TabTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(({ className, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={clsx(
      "px-[18px] py-2 text-xs text-text-default-primary transition-all border rounded-lg border-fill-bg-input bg-fill-bg-light",
      "data-[state=active]:border-primary-brand",
      className
    )}
    {...props}
  />
))
TabTrigger.displayName = "TabTrigger"

const TabContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={clsx(
      "mt-6 data-[state=active]:flex hidden flex-col flex-1 min-h-0 overflow-y-auto stylized-scroll ",
      className
    )}
    {...props}
  />
))
TabContent.displayName = "TabContent"

export { Tabs, TabTrigger, TabContent }
