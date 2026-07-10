"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  Loading03Icon,
  PlusSignIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateCv } from "@/lib/actions/user/curriculum-vitae"

interface SkillsEditorProps {
  cvId: string
  sectionId: string
  skillGroups: Record<string, unknown>[]
}

export function ContentSkillsEditor({
  cvId,
  sectionId,
  skillGroups,
}: SkillsEditorProps) {
  const router = useRouter()
  const [newSkillGroup, setNewSkillGroup] = useState<Record<string, unknown>>(
    {}
  )
  const [saving, setSaving] = useState<string | null>(null)

  async function addSkillGroup() {
    const entry = newSkillGroup[sectionId] as
      Record<string, unknown> | undefined
    const entrySkills = entry?.skills as string | undefined
    if (!entrySkills?.trim()) {
      toast.error("Skills are required")
      return
    }
    setSaving(sectionId)
    const skills = entrySkills
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean)
    const { error } = await updateCv(cvId, {
      sections: {
        update: [
          {
            where: { id: sectionId },
            data: {
              skillGroups: {
                create: [
                  { label: (entry?.label as string) ?? "", skills, order: 0 },
                ],
              },
            },
          },
        ],
      },
    })
    setSaving(null)
    if (!error) {
      setNewSkillGroup({ ...newSkillGroup, [sectionId]: {} })
      router.refresh()
      toast.success("Skills added")
    } else {
      toast.error("Failed to add skills")
    }
  }

  async function toggleSkillGroupVisibility(groupId: string, visible: boolean) {
    const { error } = await updateCv(cvId, {
      sections: {
        update: [
          {
            where: { id: sectionId },
            data: {
              skillGroups: {
                update: [{ where: { id: groupId }, data: { visible } }],
              },
            },
          },
        ],
      },
    })
    if (!error) router.refresh()
  }

  async function deleteSkillGroup(groupId: string) {
    const { error } = await updateCv(cvId, {
      sections: {
        update: [
          {
            where: { id: sectionId },
            data: {
              skillGroups: { delete: [{ id: groupId }] },
            },
          },
        ],
      },
    })
    if (!error) {
      router.refresh()
      toast.success("Deleted")
    }
  }

  return (
    <div className="space-y-4">
      {(skillGroups ?? []).map((g) => {
        const group = g as {
          id: string
          label?: string
          skills?: string[]
          visible?: boolean
        }
        return (
          <div
            key={group.id}
            className="flex items-start justify-between rounded-xl border-0 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
          >
            <div className="min-w-0 flex-1">
              {group.label && (
                <p className="text-base font-medium">{group.label}</p>
              )}
              <p className="mt-1 text-base text-muted-foreground">
                {group.skills?.join(", ")}
              </p>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
                onClick={() =>
                  toggleSkillGroupVisibility(
                    group.id as string,
                    group.visible !== false ? false : true
                  )
                }
                title={group.visible !== false ? "Hide from CV" : "Show on CV"}
              >
                {group.visible !== false ? (
                  <HugeiconsIcon icon={ViewIcon} />
                ) : (
                  <HugeiconsIcon icon={ViewOffSlashIcon} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => deleteSkillGroup(group.id as string)}
                title="Delete skill group"
              >
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            </div>
          </div>
        )
      })}
      <div className="space-y-4 rounded-xl border-0 bg-zinc-50/50 p-5 shadow-sm dark:bg-zinc-800/30">
        <p className="text-sm font-semibold text-muted-foreground">
          New skill group
        </p>
        <div className="space-y-1.5">
          <Label className="text-sm">Category</Label>
          <Input
            placeholder="e.g. Frontend"
            value={
              ((newSkillGroup[sectionId] as Record<string, unknown>)
                ?.label as string) ?? ""
            }
            onChange={(e) =>
              setNewSkillGroup({
                ...newSkillGroup,
                [sectionId]: {
                  ...(newSkillGroup[sectionId] as Record<string, unknown>),
                  label: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Skills</Label>
          <Textarea
            className="min-h-[80px]"
            placeholder="e.g. React, TypeScript, Tailwind CSS"
            value={
              ((newSkillGroup[sectionId] as Record<string, unknown>)
                ?.skills as string) ?? ""
            }
            onChange={(e) =>
              setNewSkillGroup({
                ...newSkillGroup,
                [sectionId]: {
                  ...(newSkillGroup[sectionId] as Record<string, unknown>),
                  skills: e.target.value,
                },
              })
            }
          />
        </div>
        <Button onClick={addSkillGroup} disabled={saving === sectionId}>
          {saving === sectionId ? (
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          ) : (
            <HugeiconsIcon icon={PlusSignIcon} />
          )}
          Add Skill Group
        </Button>
      </div>
    </div>
  )
}
