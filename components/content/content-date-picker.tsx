"use client"

import { format, parse, startOfYear, endOfYear } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon } from "@hugeicons/core-free-icons"

export function ContentDatePicker({
  value,
  onChange,
  placeholder = "MM/YYYY",
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}) {
  const date = value ? parse(value, "MM/yyyy", new Date()) : undefined
  const displayDate = date && !isNaN(date.getTime()) ? date : undefined

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="h-11 w-full justify-start px-4 text-left text-base font-normal"
          />
        }
      >
        <HugeiconsIcon icon={Calendar01Icon} className="shrink-0" />
        {displayDate ? (
          format(displayDate, "MM/yyyy")
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={(d) => onChange(d ? format(d, "MM/yyyy") : "")}
          captionLayout="dropdown"
          startMonth={startOfYear(new Date(1970, 0, 1))}
          endMonth={endOfYear(new Date(new Date().getFullYear() + 5, 0, 1))}
        />
      </PopoverContent>
    </Popover>
  )
}
