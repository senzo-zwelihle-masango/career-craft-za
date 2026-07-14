import Link from "next/link"
import { getPosts } from "@/lib/actions/community/community-posts"
import { PostCard } from "./post-card"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, BubbleChatSpark01Icon } from "@hugeicons/core-free-icons"
import { ScrollArea } from "@/components/ui/scroll-area"

export async function CommunityHub() {
  const { data: posts } = await getPosts("newest")
  const postList = posts as Array<{
    id: string
    title: string
    body: string
    createdAt: string
    user: { id: string; name: string; image: string | null }
    _count: { comments: number; votes: number }
    votes?: { value: number }[]
  }> | undefined

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/20 px-3 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground/50">
            {postList?.length ?? 0} post{(postList?.length ?? 0) !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-px">
            <Button size="sm" variant="secondary" className="rounded-r-none text-xs" disabled>
              New
            </Button>
            <Button size="sm" variant="ghost" className="rounded-l-none text-xs" disabled>
              Top
            </Button>
          </div>
        </div>
        <Link href="/community/create">
          <Button size="sm">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            New post
          </Button>
        </Link>
      </div>

      {/* Content */}
      {(!postList || postList.length === 0) ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <HugeiconsIcon icon={BubbleChatSpark01Icon} className="size-6 text-muted-foreground/30" />
          </div>
          <div className="text-center max-w-xs">
            <p className="text-sm font-medium text-foreground">No posts yet</p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Be the first to start a conversation — share advice, ask questions, or post a job opening
            </p>
          </div>
          <Link href="/community/create">
            <Button>
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              Create the first post
            </Button>
          </Link>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/20">
            {postList.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
