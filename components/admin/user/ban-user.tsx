"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShieldUserIcon } from "@hugeicons/core-free-icons"
import { banUserAction } from "@/lib/actions/admin/manage"

interface BanUserModalProps {
  userId: string
  userName?: string
  userEmail?: string
  onBanned?: () => void
}

export default function BanUserModal({
  userId,
  userName,
  userEmail,
  onBanned,
}: BanUserModalProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [expiry, setExpiry] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  const handleBan = async () => {
    startTransition(async () => {
      await banUserAction(userId, {
        banReason: reason || "No reason provided",
        banExpires: expiry ? new Date(expiry) : undefined,
      })
      onBanned?.()
      setOpen(false)
    })
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={ShieldUserIcon} className="size-4" />
        Ban User
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {userName && (
              <div>
                <Label>User</Label>
                <p className="font-medium">
                  {userName} ({userEmail})
                </p>
              </div>
            )}
            <div>
              <Label>Reason</Label>
              <Input
                placeholder="Enter ban reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div>
              <Label>Expiry Date (optional)</Label>
              <Input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={isPending || !reason.trim()}
            >
              {isPending ? "Please wait..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
