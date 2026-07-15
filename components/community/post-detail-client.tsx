"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Loading03Icon,
  ArrowLeft01Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"
import {
  createComment,
  deleteComment,
} from "@/lib/actions/community/community-comments"
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
    updatedAt: string
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

export function PostDetailClient({
  post,
  comments,
  currentUserId,
}: PostDetailClientProps) {
  const router = useRouter()
  const [commentText, setCommentText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const userVote = post.votes?.[0]?.value ?? null
  const isOwn = currentUserId === post.user.id

  async function handleComment() {
    if (!commentText.trim()) return
    setSubmitting(true)
    const { error } = await createComment({
      body: commentText,
      postId: post.id,
    })
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
        className="inline-flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-foreground/60"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
        Back to community
      </Link>

      <div className="flex gap-3">
        <div className="flex shrink-0 pt-1">
          <VoteButton
            postId={post.id}
            score={post._count.votes}
            userVote={userVote}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg leading-snug font-semibold">{post.title}</h1>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground/50">
            <Avatar className="size-4">
              <AvatarImage src={post.user.image ?? undefined} />
              <AvatarFallback className="text-[6px] font-medium">
                {post.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground/60">{post.user.name}</span>
            <span>&middot;</span>
            <span>{timeAgo(post.createdAt)}</span>
            {new Date(post.updatedAt).getTime() -
              new Date(post.createdAt).getTime() >
              1000 && (
              <span className="text-[10px] text-muted-foreground/40 italic">
                (edited)
              </span>
            )}
          </div>
          <div
            className="post-body mt-4 text-sm leading-relaxed text-foreground/80"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground/50">
            <span className="flex items-center gap-1">
              <span>
                {post._count.comments} comment
                {post._count.comments !== 1 ? "s" : ""}
              </span>
            </span>
            {isOwn && (
              <>
                <Link
                  href={`/community/${post.id}/edit`}
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground/60"
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} className="size-3.5" />
                  Edit
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-0 text-xs font-normal hover:text-destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </>
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
            <Button
              onClick={handleComment}
              disabled={submitting || !commentText.trim()}
              size="sm"
            >
              {submitting && (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="size-3.5 animate-spin"
                />
              )}
              Comment
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <CommentTree
            comments={comments}
            currentUserId={currentUserId}
            postId={post.id}
          />
        </div>
      </div>
      <style jsx global>{`
        .post-body ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .post-body ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .post-body li {
          display: list-item;
          margin: 0.25em 0;
        }
        .post-body ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }
        .post-body ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .post-body ul[data-type="taskList"] li > label {
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .post-body ul[data-type="taskList"] li > div {
          flex: 1;
        }
        .post-body h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.75em 0 0.5em;
        }
        .post-body h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75em 0 0.5em;
        }
        .post-body h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.75em 0 0.5em;
        }
        .post-body h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.75em 0 0.5em;
        }
        .post-body p {
          margin: 0.5em 0;
        }
        .post-body blockquote {
          border-left: 3px solid hsl(var(--border));
          padding-left: 1em;
          margin: 0.5em 0;
          color: hsl(var(--muted-foreground));
        }
        .post-body pre {
          background: hsl(var(--muted));
          border-radius: 0.375rem;
          padding: 0.75em 1em;
          overflow-x: auto;
          margin: 0.5em 0;
        }
        .post-body code {
          font-size: 0.875em;
          background: hsl(var(--muted));
          padding: 0.125em 0.25em;
          border-radius: 0.25rem;
        }
        .post-body pre code {
          background: none;
          padding: 0;
        }
        .post-body a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .post-body a:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}
