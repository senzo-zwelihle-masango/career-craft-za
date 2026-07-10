import React from "react"
import Link from "next/link"

import { HugeiconsIcon } from "@hugeicons/react"
import { UserGroupIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"

import UsersTable from "@/components/admin/user/data-table"

import { fetchAllUsers } from "@/lib/actions/admin/user-queries"

const Users = async () => {
  const users = await fetchAllUsers()
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered={false}
    >
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <Heading
          as="h1"
          font={"none"}
          size={"4xl"}
          weight={"semibold"}
          tracking={"normal"}
          leading={"normal"}
          transform={"normal"}
          italic={false}
          margin={"none"}
        >
          Users
        </Heading>
        <Button
          nativeButton={false}
          render={<Link href="/admin/users/create" />}
        >
          Create User
        </Button>
      </div>

      {/* main */}
      {users.length === 0 ? (
        <div className="my-40 flex flex-col items-center justify-center">
          <Heading size="sm" margin="md">
            No Users Found!
          </Heading>
          <HugeiconsIcon icon={UserGroupIcon} className="size-20" />
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </Container>
  )
}

export default Users
