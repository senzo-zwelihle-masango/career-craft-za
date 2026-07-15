"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/spinner"

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
})

const ForgotPasswordForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  const [sent, setSent] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError(null)
    try {
      await authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: "/reset-password",
        },
        {
          onSuccess: () => {
            setSent(true)
          },
          onError: (ctx) => {
            setServerError(ctx.error.message)
          },
        }
      )
    } catch {
      setServerError("Something went wrong. Please try again.")
    }
  }

  if (sent) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-sm text-balance text-muted-foreground">
              If an account with that email exists, we&apos;ve sent a password
              reset link.
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <a
              href="/sign-in"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Back to sign in
            </a>
          </div>
        </FieldGroup>
      </div>
    )
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="forgot-password-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
              <Input
                {...field}
                id="forgot-email"
                aria-invalid={fieldState.invalid}
                placeholder="m@example.com"
                autoComplete="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Field>
          <Button type="submit" form="forgot-password-form">
            {form.formState.isSubmitting ? <Spinner /> : "Send Reset Link"}
          </Button>
        </Field>

        <div className="text-center text-sm text-muted-foreground">
          <a
            href="/sign-in"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </a>
        </div>
      </FieldGroup>
    </form>
  )
}

export default ForgotPasswordForm
