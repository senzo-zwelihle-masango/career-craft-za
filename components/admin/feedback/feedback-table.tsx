"use client"

import { useState, useTransition } from "react"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { updateFeedbackStatus } from "@/lib/actions/admin/feedback-review"

type FeedbackUser = { name: string | null; email: string; image: string | null }

type FeedbackItem = {
  id: string
  userId: string
  user: FeedbackUser
  type: "BUG_REPORT" | "FEATURE_REQUEST" | "GENERAL" | "REVIEW"
  status: "PENDING" | "REVIEWED" | "RESOLVED"
  title: string
  body: string
  rating: number | null
  createdAt: string
  updatedAt: string
}

interface FeedbackTableProps {
  feedback: FeedbackItem[]
}

const typeLabel: Record<string, string> = {
  BUG_REPORT: "Bug Report",
  FEATURE_REQUEST: "Feature Request",
  GENERAL: "General",
  REVIEW: "Review",
}

const statusColor: Record<string, "secondary" | "default" | "outline"> = {
  PENDING: "secondary",
  REVIEWED: "default",
  RESOLVED: "outline",
}

export function FeedbackTable({ feedback: initial }: FeedbackTableProps) {
  const [items, setItems] = useState<FeedbackItem[]>(initial)
  const [, startTransition] = useTransition()

  const handleStatusChange = (
    id: string,
    status: "PENDING" | "REVIEWED" | "RESOLVED"
  ) => {
    startTransition(async () => {
      await updateFeedbackStatus(id, status)
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {item.user.name ?? "Unknown"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {typeLabel[item.type] ?? item.type}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate" title={item.body}>
                {item.title}
              </TableCell>
              <TableCell>
                <Badge variant={statusColor[item.status] ?? "secondary"}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {item.rating != null ? `${item.rating}/5` : "–"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(item.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" className="h-8 w-8 p-0" />}
                  >
                    <HugeiconsIcon
                      icon={MoreHorizontalIcon}
                      className="size-4"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(item.id, "PENDING")}
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle01Icon}
                          className="size-4"
                        />
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(item.id, "REVIEWED")}
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle01Icon}
                          className="size-4"
                        />
                        Reviewed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(item.id, "RESOLVED")}
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle01Icon}
                          className="size-4"
                        />
                        Resolved
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
