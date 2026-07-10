"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"
import { HugeiconsIcon } from "@hugeicons/react"
import { Building03Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { Spinner } from "@/components/ui/spinner"

export default function TeamPage() {
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await authClient.organization.list()
      if (data) {
        const withMembers = await Promise.all(
          data.map(async (org) => {
            const { data: members } = await authClient.organization.listMembers(
              { query: { organizationId: org.id } }
            )
            return { ...org, members: members || [] }
          })
        )
        setOrgs(withMembers)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            Teams and organizations you belong to
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <HugeiconsIcon
                icon={Building03Icon}
                className="mb-3 size-10 text-muted-foreground"
              />
              <p className="mb-1 text-sm font-medium">No organizations yet</p>
              <p className="mb-4 text-xs text-muted-foreground">
                Create an organization to collaborate with others
              </p>
              <Button size="sm" className="h-8 gap-1.5">
                <HugeiconsIcon icon={PlusSignIcon} />
                Create Organization
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orgs.map((org) => (
                <div key={org.id} className="rounded-3xl border p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Avatar size="sm">
                      {org.logo ? (
                        <AvatarImage src={org.logo} alt={org.name} />
                      ) : null}
                      <AvatarFallback>
                        {org.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {org.slug}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {org.members.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-2xl bg-muted/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarImage
                              src={
                                member.user.image ||
                                `https://avatar.vercel.sh/${member.user.email}`
                              }
                              alt={member.user.name}
                            />
                            <AvatarFallback>
                              {member.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{member.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="h-5 text-[10px]">
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
