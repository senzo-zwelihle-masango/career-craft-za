"use client"

import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type ReviewUser = { name: string | null; email: string; image: string | null }

type ReviewItem = {
  id: string
  userId: string
  user: ReviewUser
  rating: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

interface ReviewsTableProps {
  reviews: ReviewItem[]
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((item) => (
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
                <Badge variant="outline">{item.rating}/5</Badge>
              </TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell
                className="max-w-md truncate text-sm text-muted-foreground"
                title={item.body}
              >
                {item.body}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(item.createdAt), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
