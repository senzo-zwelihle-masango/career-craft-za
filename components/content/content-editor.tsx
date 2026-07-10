"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useEditorStore } from "@/lib/data/curriculum-vitae/store"
import { toast } from "sonner"
import {
  updateCv,
  updateSectionVisibility,
  deleteSection,
} from "@/lib/actions/user/curriculum-vitae"
import ContentPersonalDetails from "./content-personal-details"
import {
  getTitleKey,
  linkTypeNames,
  sectionEditorConfig,
  sectionIcons,
} from "./content-section-config"
import { ContentSectionCard } from "./content-section-card"
import { FileText } from "@hugeicons/core-free-icons"
import { ContentSummaryEditor } from "./content-summary-editor"
import { ContentSkillsEditor } from "./content-skill-editor"
import { ContentSectionEntriesEditor } from "./content-section-entries-editor"
import { ContentEntryDialog } from "./content-entry-dialog"
import { ContentSectionDialog } from "./content-section-dialog"

interface CVData {
  id: string
  title: string
  templateId: string
  personalDetails: {
    id: string
    fullName: string
    jobTitle: string
    email: string | null
    phone: string | null
    location: string | null
    photoUrl: string | null
    nationality: string | null
    links: Array<{ type: string; url: string; label?: string }>
  } | null
  sections: SectionData[]
}

interface SectionData {
  id: string
  type: string
  title: string
  order: number
  visible: boolean
  content: string | null
  experienceEntries: Record<string, unknown>[]
  educationEntries: Record<string, unknown>[]
  projectEntries: Record<string, unknown>[]
  skillGroups: Record<string, unknown>[]
  certificationEntries: Record<string, unknown>[]
  languageEntries: Record<string, unknown>[]
  awardEntries: Record<string, unknown>[]
  referenceEntries: Record<string, unknown>[]
  customEntries: Record<string, unknown>[]
}
const ContentEditor = ({ cv }: { cv: CVData }) => {
  const router = useRouter()
  const setStoreCV = useEditorStore((s) => s.setCv)
  const storeCV = useEditorStore((s) => s.cv)

  const [details, setDetails] = useState<{
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    nationality: string
    photoUrl: string | null
    links: Array<{ type: string; url: string; label?: string }>
  }>({
    fullName: cv.personalDetails?.fullName ?? "",
    jobTitle: cv.personalDetails?.jobTitle ?? "",
    email: cv.personalDetails?.email ?? "",
    phone: cv.personalDetails?.phone ?? "",
    location: cv.personalDetails?.location ?? "",
    nationality: cv.personalDetails?.nationality ?? "",
    photoUrl: cv.personalDetails?.photoUrl ?? null,
    links: cv.personalDetails?.links ?? [],
  })

  const [summaryContent, setSummaryContent] = useState(
    cv.sections.find((s) => s.type === "SUMMARY")?.content ?? ""
  )

  useEffect(() => {
    setStoreCV(cv as never)
  }, [cv])

  useEffect(() => {
    if (!storeCV) return
    const updated = JSON.parse(JSON.stringify(storeCV))
    if (updated.personalDetails) {
      updated.personalDetails.fullName = details.fullName
      updated.personalDetails.jobTitle = details.jobTitle
      updated.personalDetails.email = details.email
      updated.personalDetails.phone = details.phone
      updated.personalDetails.location = details.location
      updated.personalDetails.nationality = details.nationality
      updated.personalDetails.links = details.links
      updated.personalDetails.photoUrl = details.photoUrl
    }
    setStoreCV(updated)
  }, [details, storeCV?.personalDetails?.id])

  useEffect(() => {
    if (!storeCV) return
    const updated = JSON.parse(JSON.stringify(storeCV))
    const s = updated.sections?.find(
      (s: { type: string }) => s.type === "SUMMARY"
    )
    if (s) s.content = summaryContent
    setStoreCV(updated)
  }, [summaryContent])

  async function onSaveRename(sectionId: string, newTitle: string) {
    const { error } = await updateCv(cv.id, {
      sections: {
        update: [{ where: { id: sectionId }, data: { title: newTitle } }],
      },
    })
    if (error) toast.error("Failed to rename section")
  }

  async function onToggleVisibility(sectionId: string, visible: boolean) {
    const { error } = await updateSectionVisibility(cv.id, [
      { where: { id: sectionId }, data: { visible } },
    ])
    if (error) toast.error("Failed to update visibility")
  }

  async function onRemoveSection(sectionId: string) {
    const { error } = await deleteSection(cv.id, sectionId)
    if (!error) toast.success("Section removed")
    else toast.error("Failed to remove section")
  }

  function getEntryCount(section: SectionData): number {
    return (
      section.experienceEntries?.length ||
      section.educationEntries?.length ||
      section.projectEntries?.length ||
      section.skillGroups?.length ||
      section.certificationEntries?.length ||
      section.languageEntries?.length ||
      section.awardEntries?.length ||
      section.referenceEntries?.length ||
      0
    )
  }

  return (
    <div>
      {/* cards */}
      <div className="space-y-4 md:space-y-6">
        {/* personal details */}
        <ContentPersonalDetails
          cvId={cv.id}
          details={details}
          setDetails={setDetails}
          linkTypeNames={linkTypeNames}
        />

        {/* card sections */}

        <div className="space-y-4">
          {cv.sections.map((section) => {
            const Icon = sectionIcons[section.type] ?? FileText
            const entryCount = getEntryCount(section)
            const cfg = sectionEditorConfig[section.type]
            // summary
            if (section.type === "SUMMARY") {
              return (
                <ContentSectionCard
                  key={section.id}
                  section={section}
                  icon={Icon}
                  entryCount={entryCount}
                  onSaveRename={onSaveRename}
                  onToggleVisibility={onToggleVisibility}
                  onRemove={onRemoveSection}
                >
                  <ContentSummaryEditor
                    cvId={cv.id}
                    sections={cv.sections}
                    summaryContent={summaryContent}
                    setSummaryContent={setSummaryContent}
                  />
                </ContentSectionCard>
              )
            }

            // skills
            if (section.type === "SKILLS") {
              return (
                <ContentSectionCard
                  key={section.id}
                  section={section}
                  icon={Icon}
                  entryCount={entryCount}
                  onSaveRename={onSaveRename}
                  onToggleVisibility={onToggleVisibility}
                  onRemove={onRemoveSection}
                >
                  <ContentSkillsEditor
                    cvId={cv.id}
                    sectionId={section.id}
                    skillGroups={section.skillGroups}
                  />
                </ContentSectionCard>
              )
            }

            if (!cfg) return null

            const entries = (section[cfg.entriesKey as keyof SectionData] ??
              []) as { id: string; [key: string]: unknown }[]
            const titleKey = getTitleKey(section.type)

            return (
              <ContentSectionCard
                key={section.id}
                section={section}
                icon={Icon}
                entryCount={entryCount}
                onSaveRename={onSaveRename}
                onToggleVisibility={onToggleVisibility}
                onRemove={onRemoveSection}
              >
                <ContentSectionEntriesEditor
                  cvId={cv.id}
                  sectionId={section.id}
                  entries={entries}
                  typeKey={cfg.typeKey}
                  fieldDefs={cfg.fieldDefs}
                  newEntryLabel={cfg.newEntryLabel}
                  addButtonLabel={cfg.addButtonLabel}
                  requiredField={cfg.requiredField}
                  requiredFieldLabel={cfg.requiredFieldLabel}
                  extraFields={cfg.extraFields}
                  renderEntry={(entry) => (
                    <>
                      <div className="flex items-center gap-3">
                        <p className="truncate text-base font-medium">
                          {(entry[titleKey] as string) ||
                            (entry.title as string) ||
                            (entry.name as string)}
                        </p>
                        <ContentEntryDialog
                          cvId={cv.id}
                          sectionId={section.id}
                          entry={
                            entry as {
                              id: string
                              sectionId: string
                              [key: string]: unknown
                            }
                          }
                          fields={cfg.fieldDefs}
                          typeKey={cfg.typeKey}
                        />
                      </div>
                      {cfg.renderEntry(entry)}
                    </>
                  )}
                />
              </ContentSectionCard>
            )
          })}
        </div>

        {/* add custom section */}
        <div className="pt-2">
          <ContentSectionDialog
            cvId={cv.id}
            existingTypes={cv.sections.map((s) => s.type)}
          />
        </div>
      </div>
    </div>
  )
}

export default ContentEditor
