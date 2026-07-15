import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AuthProvider } from "@/components/layout/auth-provider"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect("/sign-in")
  }

  const { user } = session

  return (
    <AuthProvider
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      }}
    >
      <main>{children}</main>
    </AuthProvider>
  )
}
