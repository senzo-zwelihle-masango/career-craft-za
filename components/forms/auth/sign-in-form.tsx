"use client"
import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import GradientLogoDark from "@/public/images/auth/gradient-logo-dark.png"
import GradientLogoLight from "@/public/images/auth/gradient-logo-light.png"

const formSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Enter a valid password"),
})

const PROVIDER_LABELS: Record<string, string> = {
  email: "Email",
  google: "Google",
  microsoft: "Microsoft",
  github: "GitHub",
  passkey: "Passkey",
}

const SigninForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter()
  const [socialLoading, setSocialLoading] = React.useState<
    "github" | "google" | "microsoft" | null
  >(null)
  const lastLoginMethod = React.useMemo(() => {
    if (typeof window !== "undefined") {
      try {
        return authClient.getLastUsedLoginMethod()
      } catch {
        return null
      }
    }
    return null
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: async () => {
            toast.success("Sign in successful")
            router.push("/overview")
            router.refresh()
          },

          onError: (ctx) => {
            toast.error(ctx.error.message)
          },
        }
      )
    } catch {
      throw new Error("Something went wrong...please try again.")
    }
  }

  const signInWithGoogle = async () => {
    try {
      setSocialLoading("google")

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/overview",
      })
    } catch {
      toast.error("Failed to sign in with Google")
    } finally {
      setSocialLoading(null)
    }
  }

  const signInWithMicrosoft = async () => {
    try {
      setSocialLoading("microsoft")

      await authClient.signIn.social({
        provider: "microsoft",
        callbackURL: "/overview",
      })
    } catch {
      toast.error("Failed to sign in with Microsoft")
    } finally {
      setSocialLoading(null)
    }
  }

  const signInWithGitHub = async () => {
    try {
      setSocialLoading("github")

      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/overview",
      })
    } catch {
      toast.error("Failed to sign in with Github")
    } finally {
      setSocialLoading(null)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            id="signin-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sign in to your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  {lastLoginMethod
                    ? `Welcome back! Sign in with ${PROVIDER_LABELS[lastLoginMethod] ?? lastLoginMethod} like last time`
                    : "Enter your email and password below to sign in to your account"}
                </p>
              </div>
              {/* email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signin-email">Email</FieldLabel>

                    <Input
                      {...field}
                      id="signin-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="m@example.com"
                      autoComplete="email"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="signin-password">
                        Password
                      </FieldLabel>
                      <a
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>

                    <Input
                      {...field}
                      id="signin-password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
                      type="password"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" form="signin-form">
                  {form.formState.isSubmitting ? (
                    <Spinner className="size-6" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {lastLoginMethod && lastLoginMethod !== "email"
                  ? `Or continue with`
                  : "Or continue with"}
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                {/* google */}
                <div className="relative w-full">
                  {lastLoginMethod === "google" && (
                    <Badge variant="secondary" className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 px-1.5 py-0 text-[10px] leading-none">
                      Recent
                    </Badge>
                  )}
                  <Button
                    variant={lastLoginMethod === "google" ? "default" : "outline"}
                    type="button"
                    onClick={signInWithGoogle}
                    disabled={
                      socialLoading !== null || form.formState.isSubmitting
                    }
                    className={cn(
                      "w-full",
                      lastLoginMethod === "google" ? "pointer-events-auto" : ""
                    )}
                  >
                    {socialLoading === "google" ? (
                      <Spinner />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="0.98em"
                          height="1em"
                          viewBox="0 0 256 262"
                        >
                          <path
                            fill="#4285f4"
                            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                          ></path>
                          <path
                            fill="#34a853"
                            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                          ></path>
                          <path
                            fill="#fbbc05"
                            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                          ></path>
                          <path
                            fill="#eb4335"
                            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                          ></path>
                        </svg>
                      </>
                    )}

                    <span className="sr-only">Sign in with Google</span>
                  </Button>
                </div>

                {/* microsoft */}
                <div className="relative w-full">
                  {lastLoginMethod === "microsoft" && (
                    <Badge variant="secondary" className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 px-1.5 py-0 text-[10px] leading-none">
                      Recent
                    </Badge>
                  )}
                  <Button
                    variant={lastLoginMethod === "microsoft" ? "default" : "outline"}
                    type="button"
                    onClick={signInWithMicrosoft}
                    disabled={
                      socialLoading !== null || form.formState.isSubmitting
                    }
                    className={cn(
                      "w-full",
                      lastLoginMethod === "microsoft" ? "pointer-events-auto" : ""
                    )}
                  >
                    {socialLoading === "microsoft" ? (
                      <Spinner />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                        >
                          <path
                            fill="#f1511b"
                            d="M121.666 121.666H0V0h121.666z"
                        ></path>
                          <path
                            fill="#80cc28"
                            d="M256 121.666H134.335V0H256z"
                        ></path>
                          <path
                            fill="#00adef"
                            d="M121.663 256.002H0V134.336h121.663z"
                        ></path>
                          <path
                            fill="#fbbc09"
                            d="M256 256.002H134.335V134.336H256z"
                        ></path>
                        </svg>
                      </>
                    )}

                    <span className="sr-only">Sign in with Microsoft</span>
                  </Button>
                </div>
                <div className="relative w-full">
                  {lastLoginMethod === "github" && (
                    <Badge variant="secondary" className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 px-1.5 py-0 text-[10px] leading-none">
                      Recent
                    </Badge>
                  )}
                  <Button
                    variant={lastLoginMethod === "github" ? "default" : "outline"}
                    type="button"
                    onClick={signInWithGitHub}
                    disabled={
                      socialLoading !== null || form.formState.isSubmitting
                    }
                    className={cn(
                      "w-full",
                      lastLoginMethod === "github" ? "pointer-events-auto" : ""
                    )}
                  >
                    {socialLoading === "github" ? (
                      <Spinner />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            fill="currentColor"
                          />
                        </svg>
                      </>
                    )}

                    <span className="sr-only">Sign in with GitHub</span>
                  </Button>
                </div>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/sign-up">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden lg:block">
            <Image
              src={GradientLogoDark}
              alt="Gradient Light"
              className="absolute inset-0 hidden h-full w-full object-contain dark:block"
            />
            <Image
              src={GradientLogoLight}
              alt="Gradient Light"
              className="absolute inset-0 h-full w-full object-contain dark:hidden"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

export default SigninForm
