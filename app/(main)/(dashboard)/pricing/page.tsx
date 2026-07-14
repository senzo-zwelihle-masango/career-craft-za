import { HugeiconsIcon } from "@hugeicons/react"
import { CheckIcon } from "@hugeicons/core-free-icons"
import { Container } from "@/components/ui/container"
import { PageHeading } from "@/components/ui/page-heading"
import { Card } from "@/components/ui/custom-card"
import { Button } from "@/components/ui/button"
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

export default function PricingPage() {
  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      bleed="none"
      centered={false}
    >
      <PageHeading
        title="Pricing"
        subtitle="Choose the plan that fits your needs. All plans include a 14-day free trial."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            variant={plan.highlighted ? "default" : "mixed"}
            className={cn(
              "relative flex flex-col p-6",
              plan.highlighted && "ring-2 ring-primary"
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
            <Link href="#link">
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </Container>
  )
}
