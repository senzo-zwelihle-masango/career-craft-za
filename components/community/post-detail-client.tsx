"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { createComment, deleteComment } from "@/lib/actions/community/community-comments"
import { deletePost } from "@/lib/actions/community/community-posts"
import { VoteButton } from "./vote-button"
import { CommentTree } from "./comment-tree"
import { ReportDialog } from "./report-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export interface CommentData {
  id: string
  body: string
  createdAt: string
  user: { id: string; name: string; image: string | null }
  parentId: string | null
  votes?: { value: number }[]
  _count?: { votes: number }
  replies?: CommentData[]
}

export interface PostDetailClientProps {
  post: {
    id: string
    title: string
    body: string
    createdAt: string
    user: { id: string; name: string; image: string | null }
    _count: { comments: number; votes: number }
    votes?: { value: number }[]
  }
  comments: CommentData[]
  currentUserId: string | null
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

export function PostDetailClient({ post, comments, currentUserId }: PostDetailClientProps) {
  const router = useRouter()
  const [commentText, setCommentText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const userVote = post.votes?.[0]?.value ?? null
  const isOwn = currentUserId === post.user.id

  async function handleComment() {
    if (!commentText.trim()) return
    setSubmitting(true)
    const { error } = await createComment({ body: commentText, postId: post.id })
    setSubmitting(false)
    if (error) {
      toast.error(error)
      return
    }
    setCommentText("")
    toast.success("Comment posted")
  }

  async function handleDelete() {
    setDeleting(true)
    const { error } = await deletePost(post.id)
    setDeleting(false)
    if (error) {
      toast.error(error)
      return
    }
    toast.success("Post deleted")
    router.push("/community")
  }

  return (
    <div className="space-y-4">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-foreground/60 transition-colors"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
        Back to community
      </Link>

      <div className="flex gap-3">
        <div className="flex shrink-0 pt-1">
          <VoteButton postId={post.id} score={post._count.votes} userVote={userVote} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold leading-snug">{post.title}</h1>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground/50">
            <Avatar className="size-4">
              <AvatarImage src={post.user.image ?? undefined} />
              <AvatarFallback className="text-[6px] font-medium">{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground/60">{post.user.name}</span>
            <span>&middot;</span>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
          <div className="mt-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
            {post.body}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground/50">
            <span className="flex items-center gap-1">
              <span>{post._count.comments} comment{post._count.comments !== 1 ? "s" : ""}</span>
            </span>
            {isOwn && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-0 text-xs font-normal hover:text-destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
            <ReportDialog postId={post.id}>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-0 text-xs font-normal"
              >
                Report
              </Button>
            </ReportDialog>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 pt-4">
        <div className="space-y-3">
          <Textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <div className="flex justify-end">
            <Button onClick={handleComment} disabled={submitting || !commentText.trim()} size="sm">
              {submitting && <HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />}
              Comment
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <CommentTree comments={comments} currentUserId={currentUserId} postId={post.id} />
        </div>
      </div>
    </div>
  )
}
