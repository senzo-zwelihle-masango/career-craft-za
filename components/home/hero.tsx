"use client"

import React from "react"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import CardSwap, { Card } from "../ui/card-swap"
import { TemplatePreview } from "../curriculum-vitae/templates/template-preview"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { AnimatedGroup } from "../ui/motion-primitives/animated-group"
import { TextEffect } from "../ui/motion-primitives/text-effect"

// active templates
const templates = [
  "clean-line",
  "sidebar-slate",
  "gradient-cap",
  "dense-two-col",
] as const

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const Hero = () => {
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"screen"}
      padding={"px-md"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={false}
      className="relative overflow-hidden"
      id="home"
    >
      <section>
        <div className="pt-12 pb-24 md:pb-32 lg:pt-44 lg:pb-56">
          <div className="relative mx-auto flex flex-col lg:block">
            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
              <AnimatedGroup variants={transitionVariants}>
                <Link
                  href="/"
                  className="mx-auto flex w-fit items-center gap-2 rounded-full border p-1 pr-3 lg:ml-0"
                >
                  <span className="rounded-full bg-muted px-2 py-1 text-xs">
                    New
                  </span>
                  <span className="text-sm"> Career Craft ZA</span>
                  <span className="block h-4 w-px bg-(--color-border)"></span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              </AnimatedGroup>

              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="mt-8 max-w-2xl text-5xl font-medium text-balance md:text-6xl lg:mt-16"
              >
                Professional CV&apos;s Without The Complexity
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mt-8 max-w-2xl text-pretty"
              >
                Build polished, ATS-friendly CVs with powerful customization,
                modern templates, and instant PDF downloads.
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start"
              >
                <div>
                  <Button size="lg">
                    <Link href="#link">
                      <span className="text-nowrap">Start Building</span>
                    </Link>
                  </Button>
                  <Button key={2} size="lg" variant="ghost">
                    <Link href="#link">
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </Button>
                </div>
              </AnimatedGroup>
            </div>
            <div className="mask-radial-from-35% mask-radial-to-70% max-lg:order-first max-lg:mx-auto max-lg:-mb-20 max-lg:size-120 lg:absolute lg:inset-0 lg:-inset-y-56 lg:ml-auto lg:w-166 lg:translate-x-28 @max-lg:-translate-x-20">
              {/* <div className="absolute inset-0 z-1 bg-zinc-950 opacity-80 mix-blend-overlay" /> */}
              <div className="relative size-full object-cover object-right lg:h-150">
                <CardSwap
                  cardDistance={60}
                  verticalDistance={70}
                  delay={5000}
                  pauseOnHover={false}
                >
                  {templates.map((id) => (
                    <Card key={id} className="border-0">
                      <div className="overflow-hidden rounded-xl shadow-2xl">
                        <TemplatePreview templateId={id} scale={0.55} />
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}

export default Hero
