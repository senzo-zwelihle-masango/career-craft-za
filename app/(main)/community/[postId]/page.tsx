import { Suspense } from "react"
import { PostDetail } from "@/components/community/post-detail"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await params

  return (
    <div className="px-3 py-4">
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-5 animate-spin text-muted-foreground/30"
            />
          </div>
        }
      >
        <PostDetail postId={postId} />
      </Suspense>
    </div>
  )
}
