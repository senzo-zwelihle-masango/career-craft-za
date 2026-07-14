"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { submitFeedback } from "@/lib/actions/user/feedback-review"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const formSchema = z.object({
  type: z.enum(["BUG_REPORT", "FEATURE_REQUEST", "GENERAL"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z
    .string()
    .min(10, "Please provide more detail (at least 10 characters)"),
})

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: "GENERAL", title: "", body: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const { error } = await submitFeedback(data)
    setIsSubmitting(false)
    if (error) {
      toast.error(error)
      return
    }
    toast.success("Feedback submitted — thank you!")
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Feedback</CardTitle>
        <CardDescription>
          Found a bug? Have a feature request? Let us know.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="feedback-type">Type</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <span className="flex flex-1 text-left">
                        {field.value === "BUG_REPORT"
                          ? "Bug Report"
                          : field.value === "FEATURE_REQUEST"
                            ? "Feature Request"
                            : "General"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL">General</SelectItem>
                      <SelectItem value="BUG_REPORT">Bug Report</SelectItem>
                      <SelectItem value="FEATURE_REQUEST">
                        Feature Request
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="feedback-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="feedback-title"
                    placeholder="Brief summary of your feedback"
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
                  <FieldLabel htmlFor="feedback-body">Details</FieldLabel>
                  <Textarea
                    {...field}
                    id="feedback-body"
                    rows={5}
                    placeholder="Describe your feedback in detail..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner className="size-5" />
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
