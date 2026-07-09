"use client"
import { Button } from "@/components/ui/button"
import { useSignOut } from "./client"

export default function SignoutButton() {
  const handleSignOut = useSignOut()
  return (
    <Button variant={"default"} size={"lg"} onClick={handleSignOut}>
      Sign out
    </Button>
  )
}
