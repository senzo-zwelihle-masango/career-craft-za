import ResetPasswordForm from "@/components/forms/auth/reset-password-form"

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await props.searchParams

  if (!token) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold">Invalid reset link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <a
            href="/forgot-password"
            className="mt-4 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Request a new reset link
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
