import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import { auth } from "@/lib/auth"
import SignupForm from "@/components/forms/auth/sign-up-form"
import Logo from "@/components/svg/icons/logo"
import GradientLogoDark from "@/public/images/auth/gradient-logo-dark.png"
import GradientLogoLight from "@/public/images/auth/gradient-logo-light.png"

export default async function SignupPage() {
  // check user session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if theres a session redirect to  root page
  if (session) {
    return redirect("/")
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md">
              <Logo className="size-6" />
            </div>
            Career Craft ZA
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden opacity-30 lg:block">
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
    </div>
  )
}
