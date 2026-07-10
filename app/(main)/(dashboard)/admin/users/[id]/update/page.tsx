import React from "react"
import { notFound } from "next/navigation"

import { Container } from "@/components/ui/container"
import UpdateUserForm from "@/components/admin/user/update-user"

import { getUserById } from "@/lib/actions/admin/user-queries"

type Params = Promise<{ id: string }>

const UpdateUserPage = async ({ params }: { params: Params }) => {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    return notFound()
  }

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="update-user"
      className="my-4"
    >
      <UpdateUserForm
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ?? "user",
          image: user.image ?? "",
        }}
      />
    </Container>
  )
}

export default UpdateUserPage
