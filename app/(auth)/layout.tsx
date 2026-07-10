import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // check user session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if theres a session redirect to  root page
  if (session) {
    return redirect("/")
  }
  return <main>{children}</main>
}
