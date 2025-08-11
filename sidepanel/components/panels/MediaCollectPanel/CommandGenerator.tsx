import clsx from "clsx"
import { CopyIcon, Maximize2Icon, Minimize2Icon } from "lucide-react"
import Markdown from "markdown-to-jsx"
import { useRef, useState, type FC } from "react"

import { Button } from "~sidepanel/components/ui/Button"
import { useToast } from "~sidepanel/components/ui/Toast"

export const CommandGenerator: FC = () => {
  const contentRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const { showToast } = useToast()

  const copyToClipboard = () => {
    if (contentRef.current) {
      navigator.clipboard.writeText(contentRef.current.innerText).then(() => {
        showToast({
          type: "success",
          title: "Copied!"
        })
      })
    }
  }

  const toggleExpand = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <div className="border border-fill-bg-input rounded relative p-2 pr-4">
      <div
        ref={contentRef}
        className={clsx(
          "transition-all duration-300 ease-in-out whitespace-pre-wrap",
          expanded
            ? "max-h-[300px] overflow-scroll hide-scrollbar"
            : "max-h-20 overflow-hidden"
        )}>
        <div className="max-w-full markdown-content">
          <Markdown>
            GENERATE AN IMAGE BASED ON THE FOLLOWING STYLE PROMPT: 1. PRIMARY
            COMMAND: A digital art of a #Primary subject. 2. PLACEHOLDERS FOR
            CUSTOMIZATION: Main focus of the image: #Primary subject Secondary
            element: #Secondary element. Additional context or details:
            #Additional context. 3. CORE STYLE & INFLUENCES: Primary Art Style:
            Digital art Primary Genre/Theme: Action-packed fantasy 4. DETAILED
            STYLE MODIFIERS: Color & Palette: Scheme: Vibrant and saturated
            Dominant Colors: Fiery red (approx. CD5C5C), Emerald green (approx.
            50C878) Accent Colors: Midnight blue (approx. 2C3E50), Bright white
            (approx.FFFFFF) Lighting & Shading: Bright, cinematic lighting
            Composition & Framing: Dynamic composition, mid-action shot Texture
            & Material Qualities: Glossy, detailed digital textures Comparative
            Style References: Inspired by action-platformer video games 5.
            TECHNICAL PARAMETERS (MIDJOURNEY & DALL-E): --ar 16:9 --s 750
          </Markdown>
        </div>
      </div>
      {!expanded && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-10"
          style={{
            background: "linear-gradient(to top, black, rgba(0,0,0,0)"
          }}
        />
      )}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Button
          variant="ghost"
          onClick={copyToClipboard}
          className="!p-0 shrink-0">
          <CopyIcon className="w-4 h-4 text-text-default-primary" />
        </Button>
        <Button
          variant="ghost"
          onClick={toggleExpand}
          className="!p-0 shrink-0">
          {expanded ? (
            <Minimize2Icon className="w-4 h-4 text-text-default-primary" />
          ) : (
            <Maximize2Icon className="w-4 h-4 text-text-default-primary" />
          )}
        </Button>
      </div>
    </div>
  )
}
