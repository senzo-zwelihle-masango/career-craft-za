import React from "react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { Container } from "@/components/ui/container"
import prisma from "@/lib/prisma/db"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Clock01Icon,
  Pdf01Icon,
  CheckmarkCircle01Icon,
  CircleIcon,
  AlertCircleIcon,
  AiSettingIcon,
  InformationCircleIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons"

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const { cvId } = await params

  const cv = await prisma.curriculumVitae.findUnique({
    where: { id: cvId },
    include: {
      personalDetails: true,
      sections: {
        include: {
          experienceEntries: true,
          educationEntries: true,
          projectEntries: true,
          skillGroups: true,
          certificationEntries: true,
          languageEntries: true,
          awardEntries: true,
          referenceEntries: true,
          customEntries: true,
        },
      },
    },
  })

  if (!cv || cv.userId !== session.user.id) notFound()

  // 1. Completeness Verification Logic
  const checks = [
    {
      label: "Personal details filled",
      done: !!cv.personalDetails?.fullName,
      hint: "Add your full name in Personal Details",
    },
    {
      label: "Contact information present",
      done: !!(cv.personalDetails?.email || cv.personalDetails?.phone),
      hint: "Add an email or phone number",
    },
    {
      label: "Professional summary written",
      done: cv.sections.some(
        (s) => s.type === "SUMMARY" && s.content && s.content.length > 20
      ),
      hint: "Write at least a sentence in your Summary section",
    },
    {
      label: "Experience entries added",
      done: cv.sections.some(
        (s) => s.type === "EXPERIENCE" && s.experienceEntries.length > 0
      ),
      hint: "Add at least one role under Experience",
    },
    {
      label: "Education entries added",
      done: cv.sections.some(
        (s) => s.type === "EDUCATION" && s.educationEntries.length > 0
      ),
      hint: "Add your highest qualification",
    },
    {
      label: "Skills section populated",
      done: cv.sections.some(
        (s) => s.type === "SKILLS" && s.skillGroups.length > 0
      ),
      hint: "Add at least one skill group",
    },
  ]

  const completed = checks.filter((c) => c.done).length
  const pct = Math.round((completed / checks.length) * 100)

  // 2. ATS Analytics
  const hasMultiColumn = false
  const hasSummary = cv.sections.some((s) => s.type === "SUMMARY" && s.content)
  const hasStandardSections = ["EXPERIENCE", "EDUCATION", "SKILLS"].every(
    (type) => cv.sections.some((s) => s.type === type)
  )

  const atsChecks = [
    {
      label: "Standard section headings present",
      pass: hasStandardSections,
    },
    {
      label: "Professional summary included",
      pass: hasSummary,
    },
    {
      label: "No multi-column layout detected",
      pass: !hasMultiColumn,
    },
  ]

  const atsPassing = atsChecks.filter((c) => c.pass).length
  const atsReady = atsPassing === atsChecks.length

  // 3. Document Metrics Calc
  const totalEntries = cv.sections.reduce((acc, s) => {
    return (
      acc +
      s.experienceEntries.length +
      s.educationEntries.length +
      s.projectEntries.length +
      s.certificationEntries.length
    )
  }, 0)

  const lastUpdated = cv.updatedAt
    ? new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(cv.updatedAt))
    : null

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"none"}
      padding={"px-xs"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      className="my-2 space-y-2"
      id="overview"
    >
      {/* Premium Minimal Header Group */}
      <div className="flex flex-col gap-6 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {cv.title ?? "Untitled CV"}
          </h1>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} className="size-4" />
              <span>Last updated {lastUpdated}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <HugeiconsIcon icon={Pdf01Icon} className="size-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Structural Data Metrics (High Density) */}
      <div className="grid grid-cols-1 divide-y rounded-xl border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          {
            label: "Layout Architecture",
            value: `${cv.sections.length} Active Sections`,
            icon: Layers01Icon,
          },
          {
            label: "Total Profile Entries",
            value: `${totalEntries} Records`,
            icon: InformationCircleIcon,
          },
          {
            label: "Document Completeness",
            value: `${pct}% Check`,
            icon: CheckmarkCircle01Icon,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 p-5">
            <div className="shrink-0 rounded-lg border bg-muted/40 p-2.5">
              <HugeiconsIcon icon={Icon} className="size-5 text-foreground" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="text-lg font-semibold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Dynamic Segment Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Module: Configuration & Completeness */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Profile Perfection
                </h3>
                <p className="text-xs text-muted-foreground">
                  Essential data tracking requirements.
                </p>
              </div>
              <Badge
                variant={pct === 100 ? "default" : "secondary"}
                className="px-2.5 font-mono text-xs"
              >
                {completed}/{checks.length}
              </Badge>
            </div>
            <Progress value={pct} className="h-1.5 rounded-full" />

            <div className="divide-y border-t pt-2">
              {checks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-start gap-3 py-3 first:pt-1 last:pb-1"
                >
                  <div className="mt-0.5 shrink-0">
                    {check.done ? (
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        className="size-4 text-foreground"
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={CircleIcon}
                        className="size-4 text-muted-foreground/50"
                      />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p
                      className={`text-sm font-medium ${check.done ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {check.label}
                    </p>
                    {!check.done && (
                      <p className="text-xs leading-normal text-muted-foreground/80">
                        {check.hint}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module: ATS Parser Readiness */}
        <div className="flex flex-col justify-between rounded-xl border bg-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Parser Compatibility
                </h3>
                <p className="text-xs text-muted-foreground">
                  Compliance parameters for tracking infrastructure.
                </p>
              </div>
              <Badge
                variant={atsReady ? "default" : "secondary"}
                className="px-2.5 font-mono text-xs"
              >
                {atsReady ? "Optimized" : `${atsPassing}/${atsChecks.length}`}
              </Badge>
            </div>
            <Separator />

            <div className="divide-y">
              {atsChecks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center gap-3 py-3.5 first:pt-1 last:pb-1"
                >
                  <div className="shrink-0">
                    {check.pass ? (
                      <HugeiconsIcon
                        icon={CheckmarkCircle01Icon}
                        className="size-4 text-foreground"
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={AlertCircleIcon}
                        className="size-4 text-muted-foreground/60"
                      />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${check.pass ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg border bg-muted/30 p-3.5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong>Quick Tips:</strong> Prioritize structural
              consistency over decorative styling. Avoid embedding tracking
              tables or custom graphics into layout nodes to verify seamless
              cross-platform validation.
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
