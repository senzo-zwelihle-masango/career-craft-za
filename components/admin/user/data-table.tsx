"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoreHorizontalIcon,
  ViewIcon,
  PencilEdit02Icon,
  ShieldUserIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import BanUserModal from "./ban-user"

import { deleteUserAction, unbanUserAction } from "@/lib/actions/admin/manage"

type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: string | null
  plan: string
  aiCredits: number
  _count: {
    curriculumVitaes: number
    coverLetters: number
  }
  createdAt: string
  updatedAt: string
}

interface UsersTableProps {
  users: User[]
}

export default function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [, startTransition] = useTransition()

  const [banModalUserId, setBanModalUserId] = useState<string | null>(null)

  const handleUnban = (userId: string) => {
    startTransition(async () => {
      await unbanUserAction(userId)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, banned: false } : u))
      )
    })
  }

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      await deleteUserAction(userId)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CVs</TableHead>
              <TableHead>Cover Letters</TableHead>
              <TableHead>AI Credits</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      className="rounded-full"
                      src={
                        item.image ??
                        "/assets/placeholders/avatar-placeholder.png"
                      }
                      unoptimized
                      width={30}
                      height={30}
                      alt={item.name}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground">
                    {item.email}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.role === "admin" ? "destructive" : "secondary"
                    }
                  >
                    {item.role ?? "user"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.plan}</Badge>
                </TableCell>
                <TableCell>
                  {item.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </TableCell>
                <TableCell>{item._count.curriculumVitaes}</TableCell>
                <TableCell>{item._count.coverLetters}</TableCell>
                <TableCell>{item.aiCredits}</TableCell>
                <TableCell>
                  {format(new Date(item.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" className="h-8 w-8 p-0" />
                      }
                    >
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        className="size-4"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          render={<Link href={`/admin/users/${item.id}`} />}
                        >
                          <HugeiconsIcon icon={ViewIcon} className="size-4" />{" "}
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          render={
                            <Link href={`/admin/users/${item.id}/update`} />
                          }
                        >
                          <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            className="size-4"
                          />{" "}
                          Update
                        </DropdownMenuItem>
                        {item.banned ? (
                          <DropdownMenuItem
                            onClick={() => handleUnban(item.id)}
                          >
                            <HugeiconsIcon
                              icon={ShieldUserIcon}
                              className="size-4"
                            />{" "}
                            Unban
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => setBanModalUserId(item.id)}
                          >
                            <HugeiconsIcon
                              icon={ShieldUserIcon}
                              className="size-4"
                            />{" "}
                            Ban
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-4" />{" "}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {banModalUserId && (
        <BanUserModal
          userId={banModalUserId}
          onBanned={() =>
            setUsers((prev) =>
              prev.map((u) =>
                u.id === banModalUserId ? { ...u, banned: true } : u
              )
            )
          }
        />
      )}
    </>
  )
}
