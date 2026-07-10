import React from "react"
import CreateUserForm from "@/components/admin/user/create-user"
import { Container } from "@/components/ui/container"

const CreateUserPage = () => {
  return (
    <Container
      id="create-user"
      size={"2xl"}
      alignment={"none"}
      height={"screen"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      className="my-4"
    >
      <CreateUserForm />
    </Container>
  )
}

export default CreateUserPage
