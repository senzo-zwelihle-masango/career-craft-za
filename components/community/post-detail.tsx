import { getPost } from "@/lib/actions/community/community-posts"
import { getComments } from "@/lib/actions/community/community-comments"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { PostDetailClient, type PostDetailClientProps } from "./post-detail-client"

interface PostDetailProps {
  postId: string
}

export async function PostDetail({ postId }: PostDetailProps) {
  const [postResult, commentsResult] = await Promise.all([
    getPost(postId),
    getComments(postId),
  ])

  const session = await auth.api.getSession({ headers: await headers() })
  const currentUserId = session?.user?.id ?? null

  if (postResult.error) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{postResult.error}</p>
      </div>
    )
  }

  return (
    <PostDetailClient
      post={postResult.data! as unknown as PostDetailClientProps["post"]}
      comments={(commentsResult.data ?? []) as unknown as PostDetailClientProps["comments"]}
      currentUserId={currentUserId}
    />
  )
}
