"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import {
  createPostSchema,
  type CreatePostSchemaType,
} from "@/schemas/community/post"
import { updatePost, getPost } from "@/lib/actions/community/community-posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContentRichTextEditor } from "@/components/content/content-rich-text-editor"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export function EditPostForm({ postId }: { postId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<CreatePostSchemaType>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", body: "" },
  })

  const [bodyContent, setBodyContent] = useState("")

  const handleBodyChange = useCallback(
    (html: string) => {
      setBodyContent(html)
      form.setValue("body", html, { shouldValidate: true })
    },
    [form]
  )

  useEffect(() => {
    async function load() {
      const { data, error } = await getPost(postId)
      if (error || !data) {
        toast.error(error || "Post not found")
        router.push("/community")
        return
      }
      const post = data as { title: string; body: string }
      form.reset({ title: post.title, body: post.body })
      setBodyContent(post.body)
      setLoading(false)
    }
    load()
  }, [postId, form, router])

  async function onSubmit(data: CreatePostSchemaType) {
    setIsSubmitting(true)
    const { error } = await updatePost(postId, data)
    setIsSubmitting(false)

    if (error) {
      toast.error(error)
      return
    }

    toast.success("Post updated")
    router.push(`/community/${postId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <HugeiconsIcon
          icon={Loading03Icon}
          className="size-5 animate-spin text-muted-foreground/30"
        />
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="What's on your mind?"
        />
        {form.formState.errors.title && (
          <FieldError
            errors={[{ message: form.formState.errors.title.message }]}
          />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="body">Body</FieldLabel>
        <ContentRichTextEditor
          value={bodyContent}
          onChange={handleBodyChange}
          placeholder="Share your advice, experience, or question..."
          minHeight={300}
        />
        {form.formState.errors.body && (
          <FieldError
            errors={[{ message: form.formState.errors.body.message }]}
          />
        )}
      </Field>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-4 animate-spin"
            />
          )}
          Save changes
        </Button>
      </div>
    </form>
  )
}
