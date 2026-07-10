"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateCv } from "@/lib/actions/user/curriculum-vitae"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, More01Icon } from "@hugeicons/core-free-icons"

function SortableItem({
  id,
  children,
  onDelete,
}: {
  id: string
  children: React.ReactNode
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-xl border-0 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1.5 cursor-grab touch-none text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon icon={More01Icon} />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onDelete}
      >
        <HugeiconsIcon icon={Delete02Icon} />
      </Button>
    </div>
  )
}

export function ContentSortableEntryList({
  cvId,
  sectionId,
  entries = [],
  typeKey,
  children,
  onEntriesChange,
}: {
  cvId: string
  sectionId: string
  entries: { id: string; [key: string]: unknown }[]
  typeKey:
    | "experienceEntries"
    | "educationEntries"
    | "projectEntries"
    | "certificationEntries"
    | "languageEntries"
    | "awardEntries"
    | "referenceEntries"
    | "customEntries"
  children: (entry: Record<string, unknown>) => React.ReactNode
  onEntriesChange?: (entries: Record<string, unknown>[]) => void
}) {
  const router = useRouter()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = entries.findIndex((e) => e.id === active.id)
      const newIndex = entries.findIndex((e) => e.id === over.id)
      const reordered = arrayMove(entries, oldIndex, newIndex)

      onEntriesChange?.(reordered)

      const { error } = await updateCv(cvId, {
        sections: {
          update: [
            {
              where: { id: sectionId },
              data: {
                [typeKey]: {
                  update: reordered.map((e, i) => ({
                    where: { id: e.id },
                    data: { order: i },
                  })),
                },
              },
            },
          ],
        },
      })
      if (!error) {
        router.refresh()
      } else {
        toast.error("Failed to reorder")
      }
    },
    [entries, cvId, sectionId, typeKey, router, onEntriesChange]
  )

  async function handleDelete(entryId: string) {
    const { error } = await updateCv(cvId, {
      sections: {
        update: [
          {
            where: { id: sectionId },
            data: {
              [typeKey]: { delete: [{ id: entryId }] },
            },
          },
        ],
      },
    })
    if (!error) {
      router.refresh()
      toast.success("Deleted")
    } else {
      toast.error("Failed to delete")
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={entries.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {entries.map((entry) => (
            <SortableItem
              key={entry.id}
              id={entry.id}
              onDelete={() => handleDelete(entry.id)}
            >
              {children(entry)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
