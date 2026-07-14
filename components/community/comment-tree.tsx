"use client"

import { useState } from "react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { createComment, deleteComment } from "@/lib/actions/community/community-comments"
import { VoteButton } from "./vote-button"
import { ReportDialog } from "./report-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CommentData {
  id: string
  body: string
  createdAt: string
  user: { id: string; name: string; image: string | null }
  parentId: string | null
  votes?: { value: number }[]
  _count?: { votes: number }
  replies?: CommentData[]
}

interface CommentTreeProps {
  comments: CommentData[]
  currentUserId?: string | null
  postId: string
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  return new Date(date).toLocaleDateString()
}

function CommentItem({
  comment,
  currentUserId,
  postId,
  depth = 0,
}: {
  comment: CommentData
  currentUserId?: string | null
  postId: string
  depth?: number
}) {
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const userVote = comment.votes?.[0]?.value ?? null
  const score = comment._count?.votes ?? 0
  const isOwn = currentUserId === comment.user.id
  const hasReplies = comment.replies && comment.replies.length > 0

  async function handleReply() {
    if (!replyText.trim()) return
    setSubmitting(true)
    const { error } = await createComment({ body: replyText, postId, parentId: comment.id })
    setSubmitting(false)
    if (error) {
      toast.error(error)
      return
    }
    setReplyText("")
    setReplying(false)
    toast.success("Reply posted")
  }

  async function handleDelete() {
    const { error } = await deleteComment(comment.id)
    if (error) {
      toast.error(error)
      return
    }
    setDeleted(true)
    toast.success("Comment deleted")
  }

  if (deleted) return null

  return (
    <div className={`${depth > 0 ? "ml-2" : ""}`}>
      <div className="relative flex gap-2 py-2">
        {depth > 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border/40" />
        )}
        <div className={`flex shrink-0 pt-0.5 ${depth > 0 ? "ml-[13px]" : ""}`}>
          <VoteButton commentId={comment.id} score={score} userVote={userVote} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs">
            <Avatar className="size-4">
              <AvatarImage src={comment.user.image ?? undefined} />
              <AvatarFallback className="text-[6px] font-medium">{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground text-[11px]">{comment.user.name}</span>
            <span className="text-muted-foreground/50 text-[11px]">{timeAgo(comment.createdAt)}</span>
          </div>
          <div className="mt-0.5 text-sm text-foreground/80 whitespace-pre-wrap">{comment.body}</div>
          <div className="mt-1 flex items-center gap-3">
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-0 text-[11px] font-normal"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? "Expand" : `Collapse (${comment.replies!.length})`}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-0 text-[11px] font-normal"
              onClick={() => setReplying(!replying)}
            >
              Reply
            </Button>
            {isOwn && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-0 text-[11px] font-normal hover:text-destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <ReportDialog commentId={comment.id}>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-0 text-[11px] font-normal"
              >
                Report
              </Button>
            </ReportDialog>
          </div>

          {replying && !collapsed && (
            <div className="mt-2 space-y-2">
              <Textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply} disabled={submitting || !replyText.trim()}>
                  {submitting && <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />}
                  Reply
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReplying(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!collapsed && hasReplies && (
            <div className="mt-0">
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  postId={postId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CommentTree({ comments, currentUserId, postId }: CommentTreeProps) {
  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-xs text-muted-foreground/50">
        No comments yet. Be the first to share your thoughts!
      </p>
    )
  }

  return (
    <div className="divide-y divide-border/20">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} currentUserId={currentUserId} postId={postId} />
      ))}
    </div>
  )
}
