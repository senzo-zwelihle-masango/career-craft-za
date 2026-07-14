"use client"

import Link from "next/link"
import { VoteButton } from "./vote-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Message01Icon } from "@hugeicons/core-free-icons"

interface PostCardProps {
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

export function PostCard({ post }: PostCardProps) {
  const userVote = post.votes?.[0]?.value ?? null
  const score = post._count.votes

  return (
    <div className="group flex gap-2 px-3 py-2.5 transition-colors hover:bg-muted/40">
      <div className="flex shrink-0 pt-0.5">
        <VoteButton postId={post.id} score={score} userVote={userVote} />
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/community/${post.id}`} className="block">
          <h3 className="text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground/70">
          {post.body.replace(/<[^>]*>/g, "")}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground/50">
          <span className="flex items-center gap-1">
            <Avatar className="size-4">
              <AvatarImage src={post.user.image ?? undefined} />
              <AvatarFallback className="text-[6px] font-medium">{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground/60">{post.user.name}</span>
          </span>
          <span>{timeAgo(post.createdAt)}</span>
          {new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 1000 && (
            <span className="text-[10px] italic text-muted-foreground/40">(edited)</span>
          )}
          <Link
            href={`/community/${post.id}`}
            className="flex items-center gap-1 hover:text-foreground/60 transition-colors"
          >
            <HugeiconsIcon icon={Message01Icon} className="size-3.5" />
            {post._count.comments}
          </Link>
        </div>
      </div>
    </div>
  )
}
