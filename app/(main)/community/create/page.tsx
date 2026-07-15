import { CreatePostForm } from "@/components/community/create-post-form"
import { PageHeading } from "@/components/ui/page-heading"

export default function CreatePostPage() {
  return (
    <div className="max-w-2xl px-3 py-4">
      <PageHeading
        title="Create a post"
        subtitle="Share advice, ask questions, or post a job opening"
      />
      <CreatePostForm />
    </div>
  )
}
