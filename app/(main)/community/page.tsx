import { Suspense } from "react"
import { CommunityHub } from "@/components/community/community-hub"
import { PageHeading } from "@/components/ui/page-heading"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

export default function CommunityPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/20 px-3 py-3">
        <PageHeading
          title="Community"
          subtitle="Share advice, job postings, and connect with others"
        />
      </div>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-5 animate-spin text-muted-foreground/30"
            />
          </div>
        }
      >
        <CommunityHub />
      </Suspense>
    </div>
  )
}
