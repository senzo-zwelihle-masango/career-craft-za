import { Suspense } from "react"
import { EditPostForm } from "@/components/community/edit-post-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

export default async function EditPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params

  return (
    <div className="px-3 py-4 max-w-2xl">
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin text-muted-foreground/30" />
          </div>
        }
      >
        <EditPostForm postId={postId} />
      </Suspense>
    </div>
  )
}
