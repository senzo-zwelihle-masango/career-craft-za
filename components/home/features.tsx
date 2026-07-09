"use client"

import React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Chart03Icon,
  PenTool01Icon,
  Layers01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { BorderBeam } from "../ui/border-beam"

const Features = () => {
  type ImageKey = "item-1" | "item-2" | "item-3" | "item-4"
  const [activeItem, setActiveItem] = React.useState<ImageKey>("item-1")

  const images: Record<string, { image: string; alt: string }> = {
    "item-1": {
      image: "/images/home/templates.png",
      alt: "Professional Templates",
    },
    "item-2": {
      image: "/images/home/customize.png",
      alt: "Customize Layout And Design",
    },
    "item-3": {
      image: "/images/home/dashboard-populated.png",
      alt: "Unlimited Downloads",
    },
    "item-4": {
      image: "/images/home/dashboard-application-tracker.png",
      alt: "Application Tracker Dashboard",
    },
  }
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
      className=""
      id="features"
    >
      <section>
        <div className="absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block"></div>
        <div className="mx-auto space-y-8 md:space-y-16 lg:space-y-20">
          <div className="relative z-10 max-w-2xl space-y-6">
            <Heading
              as="h1"
              font={"none"}
              size={"6xl"}
              weight={"medium"}
              tracking={"normal"}
              leading={"normal"}
              transform={"normal"}
              italic={false}
              margin={"none"}
            >
              Features
            </Heading>
            <p>
              Everything you need to build, connect, and scale your integrations
              effortlessly.
            </p>
          </div>

          <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
            <Accordion
              value={[activeItem]}
              onValueChange={(value) => {
                if (value.length > 0) setActiveItem(value[0] as ImageKey)
              }}
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <HugeiconsIcon icon={SparklesIcon} className="size-4" />
                    Professional Templates
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Choose from a library of professionally designed,
                  ATS-optimised CV templates. Each layout is crafted to pass
                  applicant tracking systems while making a strong impression on
                  recruiters.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <HugeiconsIcon icon={PenTool01Icon} className="size-4" />
                    Full Customization
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Tailor every aspect of your CV, from colours and fonts to
                  section layouts. Our intuitive editor gives you complete
                  control without requiring design skills.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <HugeiconsIcon icon={Layers01Icon} className="size-4" />
                    Unlimited Exports
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Download your CVs as PDF or DOCX with no limits. Create
                  multiple versions tailored to different roles and industries,
                  all stored securely in your account.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <HugeiconsIcon icon={Chart03Icon} className="size-4" />
                    Application Tracking
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Keep track of every job application in one place. Log company
                  details, interview dates, and follow-up reminders so you never
                  miss an opportunity.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="relative flex overflow-hidden rounded-3xl border bg-background p-2">
              <div className="absolute inset-0 right-0 ml-auto w-15 border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
              <div className="relative aspect-76/59 w-full rounded-2xl bg-background">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeItem}-id`}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md"
                  >
                    <Image
                      src={images[activeItem].image}
                      className="size-full object-cover object-left-top dark:mix-blend-lighten"
                      alt={images[activeItem].alt}
                      width={1207}
                      height={929}
                      quality={95}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <BorderBeam
                duration={6}
                size={200}
                className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
              />
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}

export default Features
