import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckIcon } from "@hugeicons/core-free-icons"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Card } from "../ui/custom-card"
import { Button } from "../ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PLAN_CREDITS } from "@/lib/data/user/plans"

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "R0",
    period: "/month",
    features: [
      "1 CV",
      "All templates",
      "Unlimited PDF downloads",
      "Basic customization",
      `${PLAN_CREDITS.FREE} AI credits`,
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Basic",
    description: "For active job seekers",
    price: "R10",
    period: "/month",
    features: [
      "Unlimited CVs",
      "All templates",
      "Job Tracker Kanban",
      "Cover letter builder",
      "Priority support",
      `${PLAN_CREDITS.BASIC} AI credits`,
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Pro",
    description: "For serious career growth",
    price: "R20",
    period: "",
    features: [
      "Everything in Basic",
      "Cover letter builder",
      "DOCX export",
      `${PLAN_CREDITS.PRO} AI credits`,
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

const Pricing = () => {
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
      id="pricing"
    >
      <section className="@container bg-background py-24">
        <div className="mx-auto">
          <div>
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
              Pricing
            </Heading>
            <p className="mt-4 max-w-md text-balance text-muted-foreground">
              Choose the plan that fits your needs. All plans include a 14-day
              free trial.
            </p>
          </div>
          <div className="mt-12 grid gap-3 @3xl:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                variant={plan.highlighted ? "default" : "mixed"}
                className={cn(
                  "relative flex flex-col p-6 last:col-span-full",
                  plan.highlighted && "ring-primary"
                )}
              >
                <div>
                  <h3 className="font-medium text-foreground">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <div className="mt-6">
                  <span className="text-4xl font-medium">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <HugeiconsIcon
                        icon={CheckIcon}
                        className="mt-0.5 size-4 shrink-0 text-primary"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="mt-8 w-full"
                >
                  <Link href="/overview">{plan.cta}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Container>
  )
}

export default Pricing
