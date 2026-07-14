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
import {
  STATUS_CONFIG,
  type JobWithRelations,
} from "@/lib/data/application-tracker/data"
// import { STATUS_CONFIG } from "@/lib/data/editor/application-tracker"
import { OverviewContent } from "@/components/application-tracker/panel/overview-content"
import { TimelineContent } from "@/components/application-tracker/panel/timeline-content"
import { NotesContent } from "@/components/application-tracker/panel/notes-content"
import { ContactsContent } from "@/components/application-tracker/panel/contacts-content"
import { InterviewsContent } from "@/components/application-tracker/panel/interviews-content"
import { AiPrepContent } from "@/components/application-tracker/panel/ai-prep-content"

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
    <div className="flex flex-1 flex-col">
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
            <TabsList className="w-full justify-center overflow-x-auto max-md:justify-start">
              {["overview", "timeline", "notes", "contacts", "interviews", "ai-prep"].map(
                (t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
           
                  >
                    {t === "overview"
                      ? "Overview"
                      : t === "ai-prep"
                        ? "AI Prep"
                        : t.charAt(0).toUpperCase() + t.slice(1)}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
              <TabsContent value="ai-prep" className="m-0 space-y-5 p-6">
                <AiPrepContent job={job} onUpdate={onUpdate} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Panel
