'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Toggle } from '@/components/ui/toggle'
import { HugeiconsIcon } from '@hugeicons/react'
import { Moon02Icon, Sun01Icon } from '@hugeicons/core-free-icons'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  return (
    <Toggle
    size={"sm"}
      variant="outline"
      className="group data-[state=on]:hover:bg-muted size-9 rounded-full data-[state=on]:bg-transparent"
      pressed={theme === 'dark'}
      onPressedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >

      <HugeiconsIcon icon={Moon02Icon}  className="size-4 shrink-0 scale-0 opacity-0 transition-all group-aria-pressed:scale-100 group-aria-pressed:opacity-100"       aria-hidden="true"/>
      <HugeiconsIcon icon={Sun01Icon}  className="absolute size-4 shrink-0 scale-100 opacity-100 transition-all group-aria-pressed:scale-0 group-aria-pressed:opacity-0"   aria-hidden="true"/>
    </Toggle>
  )
}

export default ThemeSwitcher