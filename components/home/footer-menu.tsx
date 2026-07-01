import React from "react"
import Logo from "../svg/icons/logo"
import Link from "next/link"

const links = [
  { label: "Home", href: "#link" },
  { label: "Features", href: "#link" },
  { label: "Templates", href: "#link" },
  { label: "Pricing", href: "#link" },
  { label: "About", href: "#link" },
]

const FooterMenu = () => {
  return (
    <footer className="@container bg-background py-12">
      <div className="mx-auto px-4 md:px-6 lg:px-6">
        <div className="border-y py-8">
          <div className="flex flex-col gap-6 @xl:flex-row @xl:items-center">
            <Link href="/" aria-label="home">
              <Logo className="h-5 w-fit" />
            </Link>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 @xl:ml-auto">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-4 pt-8 @xl:flex-row @xl:justify-between">
          <p className="text-sm text-muted-foreground">&copy; {2026} Career Craft.</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterMenu
