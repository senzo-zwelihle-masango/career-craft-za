"use client"

import { useState, useCallback } from "react"
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
import { createPost } from "@/lib/actions/community/community-posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContentRichTextEditor } from "@/components/content/content-rich-text-editor"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export function CreatePostForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  async function onSubmit(data: CreatePostSchemaType) {
    setIsSubmitting(true)
    const { error, data: post } = await createPost(data)
    setIsSubmitting(false)

    if (error) {
      toast.error(error)
      return
    }

    toast.success("Post created")
    router.push(`/community/${(post as { id: string }).id}`)
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
          Post
        </Button>
      </div>
    </form>
  )
}
