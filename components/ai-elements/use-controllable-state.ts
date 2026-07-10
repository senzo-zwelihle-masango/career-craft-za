"use client"

import { useControlled } from "@base-ui/utils/useControlled"
import { useCallback, useRef } from "react"

interface UseControllableStateProps<T> {
  prop?: NoInfer<T>
  defaultProp?: NoInfer<T>
  onChange?: (state: T, ...args: any[]) => void
}

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateProps<T>): [T, (newValue: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useControlled({
    controlled: prop,
    default: defaultProp,
    name: "useControllableState",
  })

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const handleSetValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      let resolvedValue: T
      if (typeof newValue === "function") {
        resolvedValue = (newValue as (prev: T) => T)(value)
      } else {
        resolvedValue = newValue
      }
      setValue(newValue)
      onChangeRef.current?.(resolvedValue)
    },
    [setValue, value]
  )

  return [value, handleSetValue] as [T, (newValue: T | ((prev: T) => T)) => void]
}
