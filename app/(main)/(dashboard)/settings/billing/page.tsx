import { headers } from "next/headers"
import Link from "next/link"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  PLAN_LABELS,
  PLAN_CREDITS,
  MAX_COVER_LETTERS,
} from "@/lib/data/user/plans"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"

const planFeatures: Record<
  string,
  { label: string; credits: number; cvs: string; coverLetters: string }
> = {
  FREE: { label: "Free", credits: 10, cvs: "1", coverLetters: "1" },
  BASIC: { label: "Basic", credits: 50, cvs: "5", coverLetters: "5" },
  PRO: { label: "Pro", credits: 100, cvs: "∞", coverLetters: "∞" },
}

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const [user, subscription] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, aiCredits: true },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
      },
    }),
  ])

  if (!user && !subscription) return null

  const currentPlan = user?.plan || "FREE"
  const sub = subscription

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are on the {PLAN_LABELS[currentPlan] || "Free"} plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="h-7 px-3 text-sm font-medium">
              {PLAN_LABELS[currentPlan] || "Free"}
            </Badge>
            {sub && (
              <Badge variant="secondary" className="h-7 px-3 text-sm">
                {sub.status}
              </Badge>
            )}
          </div>
          {sub && sub.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              Current period ends:{" "}
              {new Date(sub.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
          <Separator />
          <div className="flex justify-end">
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="h-8">
                <HugeiconsIcon icon={SparklesIcon} />
                {currentPlan === "FREE" ? "Upgrade" : "Manage"} Plan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Compare features across plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.entries(planFeatures).map(([key, feat]) => {
              const isCurrent = key === currentPlan
              return (
                <div
                  key={key}
                  className="rounded-3xl border p-4 transition-colors"
                  data-current={isCurrent || undefined}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium">{feat.label}</span>
                    {isCurrent && (
                      <Badge variant="secondary" className="h-5 text-[10px]">
                        Current
                      </Badge>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        className="size-3.5 text-emerald-600 dark:text-emerald-400"
                      />
                      <span className="text-muted-foreground">
                        {feat.credits} AI credits / mo
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        className="size-3.5 text-emerald-600 dark:text-emerald-400"
                      />
                      <span className="text-muted-foreground">
                        {feat.cvs} CVs
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        className="size-3.5 text-emerald-600 dark:text-emerald-400"
                      />
                      <span className="text-muted-foreground">
                        {feat.coverLetters} cover letters
                      </span>
                    </li>
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
