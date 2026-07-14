"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import {
  resolveReport,
  adminDeletePost,
  adminDeleteComment,
} from "@/lib/actions/admin/community-reports"

export interface Report {
  id: string
  reason: string
  description: string | null
  resolved: boolean
  createdAt: string
  user: { id: string; name: string }
  post: {
    id: string
    title: string
    userId: string
    user: { id: string; name: string }
  } | null
  comment: {
    id: string
    body: string
    userId: string
    user: { id: string; name: string }
    post: { id: string; title: string }
  } | null
}

export function ReportTable({ reports }: { reports: Report[] }) {
  const router = useRouter()

  async function handleResolve(id: string) {
    const { error } = await resolveReport(id)
    if (error) toast.error(error)
    else { toast.success("Report resolved"); router.refresh() }
  }

  async function handleDeletePost(postId: string) {
    const { error } = await adminDeletePost(postId)
    if (error) toast.error(error)
    else { toast.success("Post removed"); router.refresh() }
  }

  async function handleDeleteComment(commentId: string) {
    const { error } = await adminDeleteComment(commentId)
    if (error) toast.error(error)
    else { toast.success("Comment removed"); router.refresh() }
  }

  const pending = reports.filter((r) => !r.resolved)
  const resolved = reports.filter((r) => r.resolved)

  return (
    <div className="space-y-8">
      {/* Pending */}
      <section>
        <h2 className="mb-4 text-sm font-medium text-amber-600">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending reports</p>
        ) : (
          <div className="space-y-2">
            {pending.map((report) => (
              <ReportRow
                key={report.id}
                report={report}
                onResolve={handleResolve}
                onDeletePost={handleDeletePost}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </section>

      {/* Resolved */}
      <section>
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Resolved ({resolved.length})
        </h2>
        {resolved.length === 0 ? (
          <p className="text-sm text-muted-foreground">No resolved reports</p>
        ) : (
          <div className="space-y-2">
            {resolved.map((report) => (
              <ReportRow
                key={report.id}
                report={report}
                onResolve={handleResolve}
                onDeletePost={handleDeletePost}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ReportRow({
  report,
  onResolve,
  onDeletePost,
  onDeleteComment,
}: {
  report: Report
  onResolve: (id: string) => void
  onDeletePost: (id: string) => void
  onDeleteComment: (id: string) => void
}) {
  const targetLabel = report.post
    ? `Post: ${report.post.title}`
    : report.comment
      ? `Comment on "${report.comment.post.title}"`
      : "Unknown"

  const authorName = report.post
    ? report.post.user.name
    : report.comment
      ? report.comment.user.name
      : "Unknown"

  return (
    <div className={`rounded-lg border p-4 ${report.resolved ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium capitalize">
              {report.reason}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm font-medium truncate">{targetLabel}</p>
          {report.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {report.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Reported by: {report.user.name}</span>
            <span>Author: {authorName}</span>
          </div>
        </div>

        {!report.resolved && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => onResolve(report.id)}
              className="rounded p-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              title="Dismiss report"
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
            </button>
            {report.post && (
              <button
                onClick={() => onDeletePost(report.post!.id)}
                className="rounded p-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete post"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
              </button>
            )}
            {report.comment && (
              <button
                onClick={() => onDeleteComment(report.comment!.id)}
                className="rounded p-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete comment"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
