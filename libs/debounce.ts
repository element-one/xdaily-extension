/**
 * Creates a debounced function
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 * @param options Configuration options
 * @returns Debounced function
 */
import * as React from "react"

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait = 300,
  options: {
    leading?: boolean // Whether to call the function at the beginning of the delay
    trailing?: boolean // Whether to call the function at the end of the delay
    maxWait?: number // Maximum wait time
  } = {}
): T & { cancel: () => void; flush: () => void } {
  const { leading = false, trailing = true, maxWait } = options

  let timer: NodeJS.Timeout | null = null
  let lastCallTime: number | null = null
  let lastInvokeTime = 0
  let lastArgs: unknown[] | null = null
  let lastThis: unknown = null
  let result: unknown

  // Check if the function should be invoked
  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = lastCallTime ? time - lastCallTime : Infinity
    const timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    )
  }

  // Actually invoke the function
  function invokeFunc(time: number): unknown {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = null
    lastInvokeTime = time

    result = func.apply(thisArg as ThisParameterType<T>, args as Parameters<T>)
    return result
  }

  // Execute the delayed function
  function trailingEdge(time: number): unknown {
    timer = null

    if (trailing && lastArgs) {
      return invokeFunc(time)
    }

    lastArgs = lastThis = null
    return result
  }

  // Immediately execute the function
  function flush(): unknown {
    return timer === null ? result : trailingEdge(Date.now())
  }

  // Cancel execution
  function cancel(): void {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = null
  }

  // Debounced function
  function debounced(this: unknown, ...args: Parameters<T>): unknown {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timer === null) {
        if (leading) {
          return invokeFunc(time)
        }
        if (trailing) {
          timer = setTimeout(() => trailingEdge(Date.now()), wait)
        }
      } else if (maxWait !== undefined) {
        timer = setTimeout(
          () => trailingEdge(Date.now()),
          Math.min(wait, maxWait - (time - lastInvokeTime))
        )
      }
    }

    if (timer === null) {
      timer = setTimeout(() => trailingEdge(Date.now()), wait)
    }

    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush

  return debounced as unknown as T & { cancel: () => void; flush: () => void }
}

/**
 * React hook for creating a debounced function
 * @param fn The function to debounce
 * @param delay Delay time in milliseconds
 * @param deps Dependencies array that will recreate the debounced function when changed
 * @returns Debounced function
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
  deps: React.DependencyList = []
): T {
  const fnRef = React.useRef<T>(fn)
  const debounceRef = React.useRef<(T & { cancel: () => void }) | null>(null)

  // Update function reference when fn changes
  React.useEffect(() => {
    fnRef.current = fn
  }, [fn])

  // Create or recreate the debounced function when dependencies change
  React.useEffect(() => {
    const wrappedFn = ((...args: Parameters<T>) => {
      return fnRef.current(...args)
    }) as T

    debounceRef.current = debounce(wrappedFn, delay) as T & {
      cancel: () => void
    }

    // Cleanup function to cancel debounce on unmount or deps change
    return () => {
      debounceRef.current?.cancel()
      debounceRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps])

  // Return a stable function reference that delegates to the current debounced function
  return React.useCallback(
    ((...args: Parameters<T>) => {
      return debounceRef.current?.(...args)
    }) as T,
    [debounceRef]
  )
}

/**
 * React hook for creating a debounced value
 * @param value The value to debounce
 * @param delay Delay time in milliseconds
 * @returns Debounced value
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
