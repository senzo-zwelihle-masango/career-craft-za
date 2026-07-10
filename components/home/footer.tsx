import React from "react"
import Link from "next/link"
import Logo from "../svg/icons/logo"

const links = [
  {
    title: "Home",
    href: "#home",
  },
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Templates",
    href: "#templates",
  },

  {
    title: "Pricing",
    href: "#pricing",
  },
]

const FooterMenu = () => {
  return (
    <footer className="border-b bg-background py-12">
      <div className="mx-auto px-6 md:px-8 lg:px-8">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="order-last flex items-center gap-3 md:order-first">
            <Link href="#" aria-label="go home">
              <Logo className="size-9" />
            </Link>
            <span className="block text-center text-sm text-muted-foreground">
              © {2026} Career Craft ZA, All rights reserved
            </span>
          </div>

          <div className="order-first flex flex-wrap gap-x-6 gap-y-4 md:order-last">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="block text-muted-foreground duration-150 hover:text-primary"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterMenu
