import FAQs from "@/components/home/faqs"
import Features from "@/components/home/features"
import Hero from "@/components/home/hero"
import Pricing from "@/components/home/pricing"
import Templates from "@/components/home/templates"
import React from "react"

export default function Home() {
  return (
    <div className="relative mb-40 space-y-40">
      {/* hero */}
      <Hero />
      {/* features */}
      <Features />
      {/* templates */}
      <Templates />
      {/* pricing */}
      <Pricing />
      {/* faqs */}
      <FAQs />
    </div>
  )
}
