"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  Menu01FreeIcons,
  File01Icon,
  PencilRulerIcon,
  ArrowLeft01Icon,
  Pdf02Icon,
  Doc02Icon,
  DocumentCodeIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthUser } from "@/components/layout/auth-provider"
import { useSignOut } from "@/utils/auth/client"
import Logo from "@/components/svg/icons/logo"
import {
  Settings01Icon,
  CreditCardIcon,
  Logout01Icon,
} from "@hugeicons/core-free-icons"

const menuItems = [
  { name: "Content", href: "content", icon: File01Icon },
  { name: "Customize", href: "customize", icon: PencilRulerIcon },
]

interface Props {
  letterId: string
  title: string
  onDownloadPdf?: () => void
  onDownloadDocx?: () => void
  onDownloadJson?: () => void
}

const CoverLetterNavigationBar = ({
  letterId,
  title,
  onDownloadPdf,
  onDownloadDocx,
  onDownloadJson,
}: Props) => {
  const pathname = usePathname()
  const activeTab = pathname.split("/").pop() || "content"
  const [menuState, setMenuState] = React.useState(false)

  const user = useAuthUser()
  const handleSignOut = useSignOut()

  const displayName =
    user?.name && user.name.length > 0
      ? user.name
      : (user?.email?.split("@")[0] ?? "")

  const avatarFallback = displayName.charAt(0).toUpperCase()

  const avatarSrc =
    user?.image ?? `https://avatar.vercel.sh/${user?.email ?? ""}`

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div className="mx-auto mt-0 rounded-b-2xl border bg-background/50 px-2 backdrop-blur-lg transition-all duration-300 md:px-4 lg:px-4">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <div className="flex items-center gap-3">
                <Link
                  href="/cover-letters"
                  aria-label="Back to cover letters"
                  className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="size-5" />
                </Link>
                <Link
                  href="/overview"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <Logo className="size-6" />
                </Link>
              </div>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <HugeiconsIcon
                  icon={Menu01FreeIcons}
                  className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0"
                />
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100"
                />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => {
                  const isActive = activeTab === item.href
                  return (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 duration-150 ${
                          isActive
                            ? "text-accent-foreground"
                            : "hover:text-accent-foreground"
                        }`}
                      >
                        <HugeiconsIcon icon={item.icon} className="size-4" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 text-muted-foreground duration-150 hover:text-accent-foreground"
                      >
                        <HugeiconsIcon icon={item.icon} className="size-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 md:w-fit">
                <span className="hidden max-w-[180px] truncate text-sm font-medium lg:inline">
                  {title}
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button />}>
                    <span className="hidden sm:inline">Download</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={onDownloadPdf}
                      className="flex items-center gap-3 py-2 text-sm"
                    >
                      <HugeiconsIcon icon={Pdf02Icon} className="size-4" /> PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onDownloadDocx}
                      className="flex items-center gap-3 py-2 text-sm"
                    >
                      <HugeiconsIcon icon={Doc02Icon} className="size-4" /> DOCX
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onDownloadJson}
                      className="flex items-center gap-3 py-2 text-sm"
                    >
                      <HugeiconsIcon
                        icon={DocumentCodeIcon}
                        className="size-4"
                      />{" "}
                      JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button className="rounded-full ring-2 ring-transparent transition-all outline-none focus-visible:ring-ring" />
                    }
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={avatarSrc} alt={displayName} />
                      <AvatarFallback className="rounded-full text-xs">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56"
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5">
                        <Avatar className="size-8">
                          <AvatarImage src={avatarSrc} alt={displayName} />
                          <AvatarFallback className="rounded-full text-xs">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {displayName}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <HugeiconsIcon
                          icon={Settings01Icon}
                          className="size-4"
                        />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HugeiconsIcon
                          icon={CreditCardIcon}
                          className="size-4"
                        />
                        Billing
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default CoverLetterNavigationBar
