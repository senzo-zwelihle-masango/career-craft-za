"use client"

import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"

export function useSignOut() {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
          toast.success("Signed out successfully.")
        },
      },
    })
  }

  return handleSignOut
}
