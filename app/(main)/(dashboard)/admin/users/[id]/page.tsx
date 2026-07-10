import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { format } from "date-fns"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeftDoubleIcon,
  ShieldUserIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BanUserModal from "@/components/admin/user/ban-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { getUserById } from "@/lib/actions/admin/user-queries"

type Params = Promise<{ id: string }>

const UserDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }
  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="user-details"
      className="my-4"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            render={<Link href="/admin/users" />}
          >
            <HugeiconsIcon icon={ArrowLeftDoubleIcon} className="size-4" />
          </Button>
          <Heading size={"sm"} margin={"none"}>
            User Details
          </Heading>
        </div>
        <div className="flex gap-2">
          {user.banned ? (
            <Button variant="outline" disabled>
              <HugeiconsIcon icon={ShieldUserIcon} className="size-4" />
              Banned
            </Button>
          ) : (
            <BanUserModal
              userId={user.id}
              userName={user.name}
              userEmail={user.email}
            />
          )}
          <Button variant="destructive">
            <HugeiconsIcon icon={Delete02Icon} className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  className="rounded-full"
                  src={
                    user.image ?? "/assets/placeholders/avatar-placeholder.png"
                  }
                  width={60}
                  height={60}
                  alt={user.name}
                />
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Role</p>
                  <Badge
                    variant={
                      user.role === "admin" ? "destructive" : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm">Plan</p>
                  <Badge variant="outline">{user.plan}</Badge>
                </div>

                <div>
                  <p className="text-sm">Status</p>
                  {user.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm">AI Credits</p>
                  <p className="font-medium">{user.aiCredits}</p>
                </div>
              </div>

              {user.banned && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm">Ban Reason</p>
                    <p className="font-medium">
                      {user.banReason ?? "No reason provided"}
                    </p>
                  </div>
                  {user.banExpires && (
                    <div>
                      <p className="text-sm">Ban Expires</p>
                      <p className="font-medium">
                        {format(new Date(user.banExpires), "PPpp")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  nativeButton={false}
                  render={<Link href={`/admin/users/${user.id}/update`} />}
                >
                  Edit User
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{user._count.sessions}</p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user._count.accounts}</p>
                  <p className="text-sm text-muted-foreground">Accounts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user._count.reviews}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p>{format(new Date(user.createdAt), "PPpp")}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p>{format(new Date(user.updatedAt), "PPpp")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="py-4 text-center text-muted-foreground">
                No recent activity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default UserDetailsPage
