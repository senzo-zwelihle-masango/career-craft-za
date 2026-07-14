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
import { Container } from "@/components/ui/container"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File01Icon,
  File02Icon,
  BriefcaseIcon,
  ArrowRight01Icon,
  SparklesIcon,
  UserGroupIcon,
  Message01Icon,
} from "@hugeicons/core-free-icons"
import { STATUS_CONFIG } from "@/lib/data/application-tracker/data"
import { PLAN_CREDITS, PLAN_LABELS } from "@/lib/data/user/plans"
import { formatDistanceToNow } from "date-fns"

type ActivityItem = {
  id: string
  type: "cv" | "cover-letter" | "application" | "post"
  title: string
  subtitle?: string
  updatedAt: Date
}

function CircularGauge({
  value,
  max,
  size = 80,
}: {
  value: number
  max: number
  size?: number
}) {
  const pct = Math.min((value / max) * 100, 100)
  const sw = 6
  const r = (size - sw * 2) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  const cx = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={sw}
      />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={sw}
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cx})`}
      />
      <text
        x={cx}
        y={cx - 4}
        textAnchor="middle"
        className="fill-foreground"
        fontSize={size * 0.22}
        fontWeight="bold"
      >
        {value}
      </text>
      <text
        x={cx}
        y={cx + size * 0.14}
        textAnchor="middle"
        className="fill-muted-foreground"
        fontSize={size * 0.11}
      >
        / {max === Infinity ? "∞" : max}
      </text>
    </svg>
  )
}

function PipelineSegment({ status, pct }: { status: string; pct: number }) {
  const alpha: Record<string, string> = {
    WISHLIST: "0.15",
    APPLIED: "0.35",
    INTERVIEWING: "0.55",
    OFFER: "0.75",
    REJECTED: "0.95",
  }
  return (
    <div
      className="h-full transition-all"
      style={{
        width: `${pct}%`,
        backgroundColor: `oklch(var(--primary) / ${alpha[status] || "0.3"})`,
      }}
    />
  )
}

function PipelineBar({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((s, v) => s + v, 0)
  if (total === 0) return null

  const order = ["WISHLIST", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"]

  return (
    <div className="space-y-3">
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {order.map((key) => {
          const val = counts[key] || 0
          if (val === 0) return null
          return (
            <PipelineSegment key={key} status={key} pct={(val / total) * 100} />
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-5">
        {order.map((key) => {
          const val = counts[key] || 0
          if (val === 0) return null
          const cfg = STATUS_CONFIG[key as keyof typeof STATUS_CONFIG]
          const alpha: Record<string, string> = {
            WISHLIST: "0.15",
            APPLIED: "0.35",
            INTERVIEWING: "0.55",
            OFFER: "0.75",
            REJECTED: "0.95",
          }
          return (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: `oklch(var(--primary) / ${alpha[key] || "0.3"})`,
                }}
              />
              <span className="text-muted-foreground">{cfg?.label}</span>
              <span className="ml-auto font-medium tabular-nums">{val}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActivityList({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={`${item.type}-${item.id}`} className="flex items-start gap-3">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
            <HugeiconsIcon
              icon={
                item.type === "cv"
                  ? File01Icon
                  : item.type === "cover-letter"
                    ? File02Icon
                    : item.type === "post"
                      ? Message01Icon
                      : BriefcaseIcon
              }
              className="size-3.5 text-muted-foreground"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm leading-tight font-medium">
              {item.title}
            </p>
            {item.subtitle && (
              <p className="truncate text-xs text-muted-foreground">
                {item.subtitle}
              </p>
            )}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDistanceToNow(item.updatedAt, { addSuffix: true })}
          </span>
        </div>
      ))}
    </div>
  )
}

export default async function OverviewPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const userId = session.user.id

  const [
    user,
    cvCount,
    letterCount,
    appCount,
    statusGroups,
    recentCvs,
    recentLetters,
    recentApps,
    communityPostCount,
    recentPosts,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, aiCredits: true, plan: true },
    }),
    prisma.curriculumVitae.count({ where: { userId } }),
    prisma.coverLetter.count({ where: { userId } }),
    prisma.jobApplication.count({ where: { userId } }),
    prisma.jobApplication.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
    prisma.curriculumVitae.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true, company: true, updatedAt: true },
    }),
    prisma.communityPost.count({ where: { userId } }),
    prisma.communityPost.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true, updatedAt: true },
    }),
  ])

  if (!user) return null

  const plan = (user.plan as string) || "FREE"
  const maxCredits = PLAN_CREDITS[plan as keyof typeof PLAN_CREDITS] ?? 10
  const maxCvs = plan === "PRO" ? Infinity : 1
  const maxLetters = plan === "PRO" ? Infinity : 1

  const statusCounts: Record<string, number> = {}
  for (const g of statusGroups) {
    statusCounts[g.status] = g._count
  }

  const recentItems: ActivityItem[] = [
    ...recentCvs.map((c) => ({
      id: c.id,
      type: "cv" as const,
      title: c.title,
      updatedAt: c.updatedAt,
    })),
    ...recentLetters.map((l) => ({
      id: l.id,
      type: "cover-letter" as const,
      title: l.title,
      updatedAt: l.updatedAt,
    })),
    ...recentApps.map((a) => ({
      id: a.id,
      type: "application" as const,
      title: a.title,
      subtitle: a.company ?? undefined,
      updatedAt: a.updatedAt,
    })),
    ...recentPosts.map((p) => ({
      id: p.id,
      type: "post" as const,
      title: p.title,
      updatedAt: p.updatedAt,
    })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)

  const totalApps = Object.values(statusCounts).reduce((s, v) => s + v, 0)
  const activeApps =
    (statusCounts["APPLIED"] || 0) + (statusCounts["INTERVIEWING"] || 0)
  const offerRate =
    totalApps > 0
      ? Math.round(((statusCounts["OFFER"] || 0) / totalApps) * 100)
      : 0

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={false}
      className=""
      id="overview"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your job search
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="sm:col-span-2 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Application Pipeline</CardTitle>
            <CardDescription>
              {totalApps} total application{totalApps !== 1 ? "s" : ""}
              {activeApps > 0 && ` · ${activeApps} active`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PipelineBar counts={statusCounts} />
            {totalApps === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No applications tracked yet. Start by adding your first job.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">AI Credits</CardTitle>
            <CardDescription>Remaining this month</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <CircularGauge
              value={user?.aiCredits ?? 0}
              max={maxCredits}
              size={96}
            />
            <p className="text-xs text-muted-foreground">
              {(((user?.aiCredits ?? 0) / maxCredits) * 100).toFixed(0)}%
              remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Offer Rate</CardTitle>
            <CardDescription>Of all applications</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <div className="flex size-24 items-center justify-center">
            <span className="text-4xl font-bold tabular-nums text-primary">
              {offerRate}%
            </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {statusCounts["OFFER"] || 0} offer
              {(statusCounts["OFFER"] || 0) !== 1 ? "s" : ""} from {totalApps}{" "}
              applications
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resource Usage</CardTitle>
            <CardDescription>
              Your current plan:{" "}
              {PLAN_LABELS[plan as keyof typeof PLAN_LABELS] || "Free"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-1">
                <CircularGauge
                  value={cvCount}
                  max={maxCvs === Infinity ? 999 : maxCvs}
                  size={72}
                />
                <div className="flex items-center gap-1.5 text-xs">
                  <HugeiconsIcon icon={File01Icon} className="size-3" />
                  CVs
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CircularGauge
                  value={letterCount}
                  max={maxLetters === Infinity ? 999 : maxLetters}
                  size={72}
                />
                <div className="flex items-center gap-1.5 text-xs ">
                  <HugeiconsIcon icon={File02Icon} className="size-3" />
                  Cover Letters
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CircularGauge value={appCount} max={999} size={72} />
                <div className="flex items-center gap-1.5 text-xs">
                  <HugeiconsIcon icon={BriefcaseIcon} className="size-3" />
                  Applications
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Community</CardTitle>
            <CardDescription>Your posts</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <div className="flex size-24 items-center justify-center">
            <span className="text-4xl font-bold tabular-nums text-primary">
              {communityPostCount}
            </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {communityPostCount === 1 ? "post" : "posts"} shared with the
              community
            </p>
            {communityPostCount > 0 && (
              <a
                href="/community"
                className="mt-2 text-xs text-primary hover:underline"
              >
                View your posts &rarr;
              </a>
            )}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityList items={recentItems} />
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Jump to what matters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/curriculum-vitae"
                className="flex items-center gap-3 rounded-lg border bg-transparent px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <HugeiconsIcon
                  icon={File01Icon}
                  className="size-4 shrink-0 text-primary"
                />
                <span className="flex-1 text-foreground">Create a CV</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </a>
              <a
                href="/cover-letters"
                className="flex items-center gap-3 rounded-lg border bg-transparent px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <HugeiconsIcon
                  icon={File02Icon}
                  className="size-4 shrink-0 text-primary"
                />
                <span className="flex-1 text-foreground">Write Cover Letter</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </a>
              <a
                href="/application-tracker"
                className="flex items-center gap-3 rounded-lg border bg-transparent px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <HugeiconsIcon
                  icon={BriefcaseIcon}
                  className="size-4 shrink-0 text-primary"
                />
                <span className="flex-1 text-foreground">Track Application</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </a>
              <a
                href="/community"
                className="flex items-center gap-3 rounded-lg border bg-transparent px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  className="size-4 shrink-0 text-primary"
                />
                <span className="flex-1 text-foreground">Community</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </a>
              <Link
                href="/pricing"
                className="flex items-center gap-3 rounded-lg border bg-transparent px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <HugeiconsIcon
                  icon={SparklesIcon}
                  className="size-4 shrink-0 text-primary"
                />
                <span className="flex-1 text-foreground">Upgrade Plan</span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
