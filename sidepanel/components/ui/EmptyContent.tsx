import type { FC } from "react"

interface EmptyContentProps {
  content: string
  hideImage?: boolean
  textClassName?: string
}
export const EmptyContent: FC<EmptyContentProps> = ({
  content,
  hideImage = false,
  textClassName = ""
}) => {
  return (
    <div className="text-text-default-secondary w-full h-full flex items-center justify-center text-xs flex-col gap-2 bg-fill-bg-deep">
      {!hideImage && (
        <div>
          <svg
            width="70"
            height="73"
            viewBox="0 0 70 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.44531 0H46.112L63.4453 17.4953V72H6.44531V0Z"
              fill="url(#paint0_linear_31014_10780)"
            />
            <rect
              width="6.64198"
              height="6.64198"
              transform="matrix(0.707949 -0.706263 0.707949 0.706263 2 17.6914)"
              fill="#56647B"
            />
            <rect
              width="3.74627"
              height="3.74627"
              transform="matrix(0.707949 -0.706263 0.707949 0.706263 64.6956 35.0742)"
              fill="#56647B"
            />
            <rect
              width="3.74627"
              height="3.74627"
              transform="matrix(0.707949 -0.706263 0.707949 0.706263 1 68.6465)"
              fill="#57647C"
            />
            <rect
              width="4.99503"
              height="4.99503"
              transform="matrix(0.707949 -0.706263 0.707949 0.706263 48 53.5273)"
              fill="#181920"
            />
            <path
              d="M46 0L63.5 17.5L46 18V0Z"
              fill="url(#paint1_linear_31014_10780)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_31014_10780"
                x1="37.4453"
                y1="5.40433e-09"
                x2="37.3738"
                y2="72.2926"
                gradientUnits="userSpaceOnUse">
                <stop stopColor="#3A3E4C" />
                <stop offset="1" stopColor="#2F343C" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_31014_10780"
                x1="55"
                y1="7.65037e-07"
                x2="70.2024"
                y2="23.2793"
                gradientUnits="userSpaceOnUse">
                <stop stopColor="#687284" />
                <stop offset="1" stopColor="#181A1E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
      <span className={textClassName}>{content}</span>
    </div>
  )
}
