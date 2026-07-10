import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import {
  PLAN_CREDITS,
  MAX_COVER_LETTERS,
  PLAN_LABELS,
} from "@/lib/data/user/plans"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BrainIcon,
  File01Icon,
  File02Icon,
  BriefcaseIcon,
} from "@hugeicons/core-free-icons"

export default async function LimitsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      aiCredits: true,
      _count: {
        select: {
          curriculumVitaes: true,
          coverLetters: true,
          applications: true,
        },
      },
    },
  })

  if (!user) return null

  const plan = user.plan || "FREE"
  const maxAiCredits = PLAN_CREDITS[plan] ?? 10
  const maxCvs = MAX_COVER_LETTERS[plan] ?? 1
  const maxCoverLetters = MAX_COVER_LETTERS[plan] ?? 1
  const aiPercent = Math.round((user.aiCredits / maxAiCredits) * 100)

  const tiers = [
    {
      value: user.aiCredits,
      max: maxAiCredits,
      label: `${user.aiCredits} / ${maxAiCredits} used`,
      icon: BrainIcon,
    },
    {
      value: user._count.curriculumVitaes,
      max: maxCvs === Infinity ? 999 : maxCvs,
      label: `${user._count.curriculumVitaes} / ${maxCvs === Infinity ? "∞" : maxCvs} used`,
      icon: File01Icon,
    },
    {
      value: user._count.coverLetters,
      max: maxCoverLetters === Infinity ? 999 : maxCoverLetters,
      label: `${user._count.coverLetters} / ${maxCoverLetters === Infinity ? "∞" : maxCoverLetters} used`,
      icon: File02Icon,
    },
    {
      value: user._count.applications,
      max: 999,
      label: `${user._count.applications} used`,
      icon: BriefcaseIcon,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
          <CardDescription>
            Your {PLAN_LABELS[plan] || "Free"} plan usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tiers.map((tier) => {
            const pct = Math.min(Math.round((tier.value / tier.max) * 100), 100)
            return (
              <div key={tier.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={tier.icon}
                      className="size-4 text-primary"
                    />
                    <span className="font-medium">{tier.label}</span>
                  </div>
                  <span className="text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
          <CardDescription>
            Current plan: {PLAN_LABELS[plan] || "Free"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">AI Credits</span>
            <span>
              {user.aiCredits} / {maxAiCredits}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">CVs</span>
            <span>
              {user._count.curriculumVitaes} /{" "}
              {maxCvs === Infinity ? "∞" : maxCvs}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cover Letters</span>
            <span>
              {user._count.coverLetters} /{" "}
              {maxCoverLetters === Infinity ? "∞" : maxCoverLetters}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Applications</span>
            <span>{user._count.applications}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
