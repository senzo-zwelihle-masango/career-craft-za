"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
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

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

interface ResetPasswordFormProps extends React.ComponentProps<"form"> {
  token: string
}

const ResetPasswordForm = ({
  className,
  token,
  ...props
}: ResetPasswordFormProps) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await authClient.resetPassword(
        {
          newPassword: data.password,
          token,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successfully")
            router.push("/sign-in")
            router.refresh()
          },
          onError: (ctx) => {
            toast.error(ctx.error.message)
          },
        }
      )
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="reset-password-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-password">New Password</FieldLabel>
              <Input
                {...field}
                id="reset-password"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-confirm">Confirm Password</FieldLabel>
              <Input
                {...field}
                id="reset-confirm"
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" form="reset-password-form">
            {form.formState.isSubmitting ? <Spinner /> : "Reset Password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default ResetPasswordForm
