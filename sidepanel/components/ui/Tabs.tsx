import * as RadixTabs from "@radix-ui/react-tabs"
import clsx from "clsx"
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef
} from "react"

type TabsContextType = {
  distributeEvenly: boolean
}

const TabsContext = createContext<TabsContextType>({
  distributeEvenly: false
})
export const useTabsContext = () => useContext(TabsContext)

const Tabs = Object.assign(
  ({
    distributeEvenly = false,
    ...props
  }: ComponentPropsWithoutRef<typeof RadixTabs.Root> & {
    distributeEvenly?: boolean
  }) => (
    <TabsContext.Provider value={{ distributeEvenly }}>
      <RadixTabs.Root {...props} />
    </TabsContext.Provider>
  ),
  {
    List: forwardRef<
      HTMLDivElement,
      ComponentPropsWithoutRef<typeof RadixTabs.List>
    >(({ className, ...props }, ref) => (
      <RadixTabs.List
        ref={ref}
        // scrollable
        className={clsx(
          "flex gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar",
          className
        )}
        {...props}
      />
    ))
  }
)
Tabs.List.displayName = "TabsList"

const TabTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(({ className, ...props }, ref) => {
  const { distributeEvenly } = useTabsContext()
  const internalRef = useRef<HTMLButtonElement | null>(null)

  const combinedRef = (node: HTMLButtonElement) => {
    internalRef.current = node
    if (typeof ref === "function") {
      ref(node)
    } else if (ref) {
      ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }
  }

  useEffect(() => {
    const el = internalRef.current
    if (!el) return

    const observer = new MutationObserver(() => {
      if (el.dataset.state === "active") {
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest"
        })
      }
    })

    observer.observe(el, {
      attributes: true,
      attributeFilter: ["data-state"]
    })

    return () => observer.disconnect()
  }, [])

  return (
    <RadixTabs.Trigger
      ref={combinedRef}
      className={clsx(
        "py-2 text-xs text-text-default-primary transition-all border rounded-lg border-fill-bg-input bg-fill-bg-light",
        "data-[state=active]:border-primary-brand data-[state=active]:bg-fill-bg-light",
        distributeEvenly
          ? "flex-1 inline-flex text-center px-0 items-center justify-center"
          : "px-[18px]",
        className
      )}
      {...props}
    />
  )
})
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
