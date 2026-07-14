"use client"

import { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { vote } from "@/lib/actions/community/community-votes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoteButtonProps {
  postId?: string
  commentId?: string
  score: number
  userVote: number | null
}

export function VoteButton({ postId, commentId, score, userVote }: VoteButtonProps) {
  const [optimisticScore, setOptimisticScore] = useState(score)
  const [optimisticVote, setOptimisticVote] = useState(userVote)

  const handleVote = useCallback(async (value: number) => {
    const prevVote = optimisticVote
    const prevScore = optimisticScore

    if (optimisticVote === value) {
      setOptimisticVote(null)
      setOptimisticScore(optimisticScore - value)
    } else {
      setOptimisticVote(value)
      setOptimisticScore(optimisticScore - (prevVote ?? 0) + value)
    }

    const { error } = await vote({ postId, commentId, value })
    if (error) {
      setOptimisticVote(prevVote)
      setOptimisticScore(prevScore)
    }
  }, [optimisticVote, optimisticScore, postId, commentId])

  return (
    <div className="flex flex-col items-center gap-px">
      <Button
        variant="ghost"
        size="icon-xs"
        className={cn(
          "rounded-sm hover:bg-blue-500/10",
          optimisticVote === 1 ? "text-blue-500" : "text-muted-foreground/40"
        )}
        onClick={() => handleVote(1)}
      >
        <HugeiconsIcon icon={ArrowUp01Icon} className="size-4!" />
      </Button>
      <span
        className={cn(
          "min-w-[2ch] text-center text-[11px] font-semibold tabular-nums leading-none py-0.5",
          optimisticVote === 1 ? "text-blue-500" : optimisticVote === -1 ? "text-red-500" : "text-muted-foreground/60"
        )}
      >
        {optimisticScore}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        className={cn(
          "rounded-sm hover:bg-red-500/10",
          optimisticVote === -1 ? "text-red-500" : "text-muted-foreground/40"
        )}
        onClick={() => handleVote(-1)}
      >
        <HugeiconsIcon icon={ArrowDown01Icon} className="size-4!" />
      </Button>
    </div>
  )
}
