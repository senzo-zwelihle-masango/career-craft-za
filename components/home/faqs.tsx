import React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { HelpCircleIcon } from "@hugeicons/core-free-icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"

const faqItems = [
  {
    id: "free-forever",
    question: "Is there really a free forever plan?",
    answer:
      "Yes. The Free plan never expires and never requires a credit card. You get 1 CV, 10 AI credits per month, access to 6 templates, the Job Tracker Kanban, unlimited PDF downloads, and the cover letter builder with no time limits.",
  },
  {
    id: "ai-credits",
    question: "How do AI credits work?",
    answer:
      "Each AI action, such as improving a bullet point, generating a summary, suggesting skills, or checking grammar, costs 1 credit. Free users get 10 credits per month. Unused credits don't roll over to the next month.",
  },
  {
    id: "pdf-export",
    question: "Can I export unlimited PDFs?",
    answer:
      "Yes, every plan includes unlimited PDF downloads. Your CV renders in a pixel-perfect, ATS-friendly format that matches the live preview exactly.",
  },
  {
    id: "ats-friendly",
    question: "Are the templates ATS-friendly?",
    answer:
      "All templates are parse-tested against major Applicant Tracking Systems. We avoid columns, graphics, and special characters that confuse parsers. Your CV stays machine-readable while looking great for human reviewers.",
  },
  {
    id: "change-plan",
    question: "Can I upgrade or downgrade anytime?",
    answer:
      "Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades apply at the end of your current billing cycle. All paid plans include a 14-day free trial.",
  },
  {
    id: "job-tracker",
    question: "Is the Job Tracker available on all plans?",
    answer:
      "Yes, the Job Tracker Kanban is completely free on every plan. Track applications across five stages (Wishlist, Applied, Interviewing, Offer, Rejected), link CVs and cover letters, and manage your full job search in one place.",
  },
  {
    id: "data-privacy",
    question: "What happens to my data if I cancel?",
    answer:
      "Your data is never deleted when you downgrade or cancel a paid plan. You simply switch to the Free tier limits. You can upgrade again anytime and pick up right where you left off.",
  },
]

const FAQs = () => {
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
      id="faq"
    >
      <section>
        <div className="mx-auto">
          <div className="grid gap-8 md:grid-cols-5 md:gap-12">
            <div className="md:col-span-2">
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
                FAQS
              </Heading>
              <p className="mt-4 text-balance text-muted-foreground">
                Your questions answered
              </p>
              <p className="mt-6 hidden text-muted-foreground md:block">
                Can&apos;t find what you&apos;re looking for? Contact our{" "}
                <Link
                  href="#"
                  className="font-medium text-primary hover:underline"
                >
                  customer support team
                </Link>
              </p>
            </div>

            <div className="md:col-span-3">
              <Accordion multiple>
                {faqItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={HelpCircleIcon}
                          className="size-4 text-primary"
                        />
                        {item.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-base">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <p className="mt-6 text-muted-foreground md:hidden">
              Can&apos;t find what you&apos;re looking for? Contact our{" "}
              <Link
                href="#"
                className="font-medium text-primary hover:underline"
              >
                customer support team
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Container>
  )
}

export default FAQs
