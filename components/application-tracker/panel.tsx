"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { JobWithRelations } from "@/lib/data/editor/application-tracker"
import { STATUS_CONFIG } from "@/lib/data/editor/application-tracker"
import { OverviewContent } from "@/components/application-tracker/panel/overview-content"
import { TimelineContent } from "@/components/application-tracker/panel/timeline-content"
import { NotesContent } from "@/components/application-tracker/panel/notes-content"
import { ContactsContent } from "@/components/application-tracker/panel/contacts-content"
import { InterviewsContent } from "@/components/application-tracker/panel/interviews-content"

interface Props {
  job: JobWithRelations
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}

const Panel = ({ job, onClose, onUpdate, onDelete }: Props) => {
  const [tab, setTab] = useState("overview")

  const cfg = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG]

  return (
    <div className="flex h-full flex-col px-2">
      <Card>
        {/* ── Header ── */}
        <div className="flex shrink-0 items-start justify-between gap-3 px-6 pt-5 pb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn("h-2.5 w-2.5 shrink-0 rounded-full", cfg?.dot)}
              />
              <h2 className="truncate text-base font-semibold">{job.title}</h2>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {job.company}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </Button>
          </div>
        </div>
        <CardContent>
          {/* ── Tabs ── */}
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList className="h-auto shrink-0 gap-0 rounded-none border-b border-border/50 bg-transparent px-5">
              {["overview", "timeline", "notes", "contacts", "interviews"].map(
                (t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="rounded-none border-b-2 border-transparent bg-transparent px-2.5 py-2 text-xs data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    {t === "overview"
                      ? "Overview"
                      : t.charAt(0).toUpperCase() + t.slice(1)}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="overview" className="m-0 space-y-6 p-6">
                <OverviewContent
                  job={job}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </TabsContent>
              <TabsContent value="timeline" className="m-0 p-6">
                <TimelineContent job={job} onUpdate={onUpdate} />
              </TabsContent>
              <TabsContent value="notes" className="m-0 p-6">
                <NotesContent job={job} onUpdate={onUpdate} />
              </TabsContent>
              <TabsContent value="contacts" className="m-0 p-6">
                <ContactsContent job={job} onUpdate={onUpdate} />
              </TabsContent>
              <TabsContent value="interviews" className="m-0 space-y-5 p-6">
                <InterviewsContent job={job} onUpdate={onUpdate} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Panel
