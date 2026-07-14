"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { submitReview, getMyReview } from "@/lib/actions/user/feedback-review"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Please write at least 10 characters"),
})

export function ReviewForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyReview()
      .then((res) => {
        if (res.data) setAlreadyReviewed(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { rating: 0, title: "", body: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const { error, data: review } = await submitReview(data)
    setIsSubmitting(false)
    if (error) {
      toast.error(error)
      return
    }
    if (review) {
      setAlreadyReviewed(true)
      toast.success("Review submitted — thank you!")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner className="size-6" />
        </CardContent>
      </Card>
    )
  }

  if (alreadyReviewed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>You&apos;ve already reviewed</CardTitle>
          <CardDescription>
            Thank you for your feedback! We really appreciate it.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Your Experience</CardTitle>
        <CardDescription>
          Help us improve by sharing your thoughts about Career Craft ZA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Rating</FieldLabel>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.onChange(star)}
                        className={`size-8 cursor-pointer transition-colors ${
                          star <= field.value
                            ? "text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-full"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="review-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="review-title"
                    placeholder="Summarise your experience"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="review-body">Your Review</FieldLabel>
                  <Textarea
                    {...field}
                    id="review-body"
                    rows={5}
                    placeholder="What did you like? What could be improved?"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FieldDescription>
              Your review helps us make Career Craft ZA better for everyone.
            </FieldDescription>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="size-5" /> : "Submit Review"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
