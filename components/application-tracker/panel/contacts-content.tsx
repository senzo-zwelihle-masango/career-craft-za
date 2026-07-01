"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  Edit03Icon,
  Link01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { JobWithRelations } from "@/lib/data/editor/application-tracker"
import {
  createContact,
  updateContact,
  deleteContact,
} from "@/lib/actions/application-tracker"

export function ContactsContent({
  job,
  onUpdate,
}: {
  job: JobWithRelations
  onUpdate: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<{
    id: string
    name: string
    role: string | null
    email: string | null
    phone: string | null
    linkedInUrl: string | null
    notes: string | null
  } | null>(null)
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    linkedInUrl: "",
    notes: "",
  })

  function reset() {
    setForm({
      name: "",
      role: "",
      email: "",
      phone: "",
      linkedInUrl: "",
      notes: "",
    })
  }

  async function handleAdd() {
    if (!form.name.trim()) {
      toast.error("Name is required")
      return
    }
    const { error } = await createContact(job.id, form)
    if (error) {
      toast.error(error)
      return
    }
    reset()
    setAdding(false)
    onUpdate()
    toast.success("Contact added")
  }

  async function handleUpdate() {
    if (!editing || !form.name.trim()) return
    const { error } = await updateContact(editing.id, form)
    if (error) {
      toast.error(error)
      return
    }
    setEditing(null)
    reset()
    onUpdate()
    toast.success("Updated")
  }

  function startEdit(c: {
    id: string
    name: string
    role: string | null
    email: string | null
    phone: string | null
    linkedInUrl: string | null
    notes: string | null
  }) {
    setEditing(c)
    setForm({
      name: c.name,
      role: c.role || "",
      email: c.email || "",
      phone: c.phone || "",
      linkedInUrl: c.linkedInUrl || "",
      notes: c.notes || "",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Contacts
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => {
            reset()
            setAdding(!adding)
            setEditing(null)
          }}
        >
          <HugeiconsIcon icon={PlusSignIcon} /> Add
        </Button>
      </div>

      {(adding || editing) && (
        <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name *"
            className="h-9 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Role"
              className="h-9 text-sm"
            />
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="h-9 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone"
              className="h-9 text-sm"
            />
            <Input
              value={form.linkedInUrl}
              onChange={(e) =>
                setForm({ ...form, linkedInUrl: e.target.value })
              }
              placeholder="LinkedIn URL"
              className="h-9 text-sm"
            />
          </div>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes"
            rows={2}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 text-sm"
              onClick={editing ? handleUpdate : handleAdd}
            >
              {editing ? "Update" : "Add"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-sm"
              onClick={() => {
                setAdding(false)
                setEditing(null)
                reset()
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {job.contacts.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No contacts yet
        </p>
      ) : (
        <div className="divide-y divide-border/40">
          {job.contacts.map((c) => (
            <div
              key={c.id}
              className="group flex items-start justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{c.name}</p>
                {c.role && (
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                )}
                {(c.email || c.phone) && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {[c.email, c.phone].filter(Boolean).join(" · ")}
                  </p>
                )}
                {c.linkedInUrl && (
                  <a
                    href={c.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-center gap-0.5 text-xs text-blue-600 hover:underline"
                  >
                    LinkedIn <HugeiconsIcon icon={Link01Icon} />
                  </a>
                )}
              </div>
              <div className="ml-2 flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => startEdit(c)}
                >
                  <HugeiconsIcon icon={Edit03Icon} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={async () => {
                    await deleteContact(c.id)
                    onUpdate()
                  }}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
