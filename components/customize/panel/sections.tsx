"use client"

import { useEditorStore } from "@/lib/data/curriculum-vitae/store"
import {
  updateSectionVisibility,
  reorderSections,
} from "@/lib/actions/user/curriculum-vitae"
import { Switch } from "@/components/ui/switch"
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
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { PanelTip, PANEL_TIPS } from "../_shared"
import type { CvWithRelations } from "@/types/curriculum-vitae/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { GripVerticalIcon } from "@hugeicons/core-free-icons"

function SortableSectionItem({
  section,
  onToggleVisibility,
}: {
  section: { id: string; title: string; visible: boolean }
  onToggleVisibility: (id: string, visible: boolean) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg border p-2 ${isDragging ? "z-10" : ""}`}
    >
      <button
        className="cursor-grab touch-none text-muted-foreground/40 hover:text-muted-foreground"
        {...attributes}
        {...listeners}
      >
        <HugeiconsIcon icon={GripVerticalIcon} />
      </button>
      <span className="flex-1 truncate text-sm">{section.title}</span>
      <Switch
        checked={section.visible}
        onCheckedChange={(v) => onToggleVisibility(section.id, v)}
      />
    </div>
  )
}

export function SectionsPanel() {
  const r = useEditorStore((s) => s.cv)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )
  if (!r) return null
  const resume = r

  async function toggleVisibility(sectionId: string, visible: boolean) {
    useEditorStore.getState().updateCv({
      sections: resume.sections.map((s) =>
        s.id === sectionId ? { ...s, visible } : s
      ),
    } as Partial<CvWithRelations>)
    await updateSectionVisibility(resume.id, [
      { where: { id: sectionId }, data: { visible } },
    ])
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const sections = [...resume.sections].sort((a, b) => a.order - b.order)
    const oldIndex = sections.findIndex((s) => s.id === active.id)
    const newIndex = sections.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...sections]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    const updatedSections = reordered.map((s, i) => ({ ...s, order: i }))
    useEditorStore
      .getState()
      .updateCv({ sections: updatedSections } as Partial<CvWithRelations>)
    await reorderSections(
      resume.id,
      reordered.map((s) => s.id)
    )
  }

  const sorted = [...resume.sections].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Section visibility & order</p>
        <PanelTip tip={PANEL_TIPS.Sections} />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sorted.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sorted.map((s) => (
              <SortableSectionItem
                key={s.id}
                section={s}
                onToggleVisibility={toggleVisibility}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
