import React from "react"
import { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File02Icon,
  Wrench01Icon,
  Briefcase01Icon,
  GraduationCapIcon,
Folder02Icon,
  Certificate01Icon,
  LanguageCircleIcon,
  ChampionIcon,
  QuoteUpIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"


import { FieldDef } from "./content-section-entries-editor"

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"]

export interface SectionEditorConfig {
  entriesKey: string
  typeKey: "experienceEntries" | "educationEntries" | "projectEntries" | "certificationEntries" | "languageEntries" | "awardEntries" | "referenceEntries" | "customEntries"
  fieldDefs: FieldDef[]
  newEntryLabel: string
  addButtonLabel: string
  requiredField?: string
  requiredFieldLabel?: string
  extraFields?: Record<string, unknown>
  renderEntry: (entry: Record<string, unknown>) => React.ReactNode
}

export const linkTypeNames: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  website: "Website",
  portfolio: "Portfolio",
  figma: "Figma",
  custom: "Link",
}

export const sectionIcons: Record<string, HugeIcon> = {
  SUMMARY: File02Icon,
  SKILLS: Wrench01Icon,
  EXPERIENCE: Briefcase01Icon,
  EDUCATION: GraduationCapIcon,
  PROJECTS: Folder02Icon,
  CERTIFICATIONS: Certificate01Icon,
  LANGUAGES: LanguageCircleIcon,
  AWARDS: ChampionIcon,
  REFERENCES: QuoteUpIcon,
  CUSTOM: PlusSignIcon,
}

const eFD: FieldDef[] = [
  { key: "role", label: "Role", type: "text" },
  { key: "company", label: "Company", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "startDate", label: "Start date", type: "date" },
  { key: "endDate", label: "End date", type: "date" },
  { key: "current", label: "Currently work here", type: "switch" },
  { key: "description", label: "Description", type: "richtext" },
]

const eduFD: FieldDef[] = [
  { key: "institution", label: "Institution", type: "text" },
  { key: "degree", label: "Degree", type: "text" },
  { key: "startDate", label: "Start date", type: "date" },
  { key: "endDate", label: "End date", type: "date" },
]

const projFD: FieldDef[] = [
  { key: "name", label: "Project name", type: "text" },
  { key: "description", label: "Description", type: "richtext" },
  { key: "url", label: "URL", type: "text" },
]

const certFD: FieldDef[] = [
  { key: "name", label: "Certification name", type: "text" },
  { key: "issuer", label: "Issuer", type: "text" },
  { key: "issueDate", label: "Issue date", type: "date" },
  { key: "expiryDate", label: "Expiry date", type: "date" },
  { key: "credentialId", label: "Credential ID", type: "text" },
  { key: "credentialUrl", label: "Credential URL", type: "text" },
]

const langFD: FieldDef[] = [
  { key: "name", label: "Language", type: "text" },
  { key: "proficiency", label: "Proficiency", type: "text" },
]

const awardFD: FieldDef[] = [
  { key: "title", label: "Award title", type: "text" },
  { key: "issuer", label: "Issuer", type: "text" },
  { key: "date", label: "Date", type: "date" },
  { key: "description", label: "Description", type: "richtext" },
]

const refFD: FieldDef[] = [
  { key: "name", label: "Reference name", type: "text" },
  { key: "jobTitle", label: "Job title", type: "text" },
  { key: "company", label: "Company", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
]

const custFD: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "link", label: "Link", type: "text" },
  { key: "startDate", label: "Start Date", type: "date" },
  { key: "endDate", label: "End Date", type: "date" },
  { key: "location", label: "Location", type: "text" },
  { key: "description", label: "Description", type: "richtext" },
]

export const sectionEditorConfig: Record<string, SectionEditorConfig | null> = {
  EXPERIENCE: {
    entriesKey: "experienceEntries",
    typeKey: "experienceEntries",
    fieldDefs: eFD,
    newEntryLabel: "New experience",
    addButtonLabel: "Experience",
    requiredField: "role",
    requiredFieldLabel: "Role",
    extraFields: { bullets: [] },
    renderEntry: (entry: Record<string, unknown>) => (
      <>
        <p className="text-base text-muted-foreground mt-0.5">{entry.company as string}</p>
        {(entry.startDate || entry.endDate) && (
          <p className="text-sm text-muted-foreground mt-1">
            {entry.startDate as string} - {entry.current ? "Present" : entry.endDate as string}
          </p>
        )}
      </>
    ),
  },
  EDUCATION: {
    entriesKey: "educationEntries",
    typeKey: "educationEntries",
    fieldDefs: eduFD,
    newEntryLabel: "New education",
    addButtonLabel: "Education",
    requiredField: "institution",
    requiredFieldLabel: "Institution",
    renderEntry: (entry: Record<string, unknown>) => (
      <>
        <p className="text-base text-muted-foreground mt-0.5">{entry.institution as string}</p>
        {(entry.startDate || entry.endDate) && (
          <p className="text-sm text-muted-foreground mt-1">{entry.startDate as string} - {entry.endDate as string}</p>
        )}
      </>
    ),
  },
  PROJECTS: {
    entriesKey: "projectEntries",
    typeKey: "projectEntries",
    fieldDefs: projFD,
    newEntryLabel: "New project",
    addButtonLabel: "Project",
    requiredField: "name",
    requiredFieldLabel: "Project name",
    extraFields: { technologies: [] },
    renderEntry: (entry: Record<string, unknown>) => (
      entry.description ? <p className="text-base text-muted-foreground mt-0.5 line-clamp-2">{entry.description as string}</p> : null
    ),
  },
  CERTIFICATIONS: {
    entriesKey: "certificationEntries",
    typeKey: "certificationEntries",
    fieldDefs: certFD,
    newEntryLabel: "New certification",
    addButtonLabel: "Certification",
    requiredField: "name",
    requiredFieldLabel: "Certification name",
    renderEntry: (entry: Record<string, unknown>) => (
      <>
        {entry.issuer && <p className="text-base text-muted-foreground mt-0.5">{entry.issuer as string}</p>}
        {entry.issueDate && (
          <p className="text-sm text-muted-foreground mt-1">
            {entry.issueDate as string}{entry.expiryDate ? ` - ${entry.expiryDate as string}` : ""}
          </p>
        )}
      </>
    ),
  },
  LANGUAGES: {
    entriesKey: "languageEntries",
    typeKey: "languageEntries",
    fieldDefs: langFD,
    newEntryLabel: "New language",
    addButtonLabel: "Language",
    requiredField: "name",
    requiredFieldLabel: "Language name",
    renderEntry: (entry: Record<string, unknown>) => (
      entry.proficiency ? <p className="text-base text-muted-foreground mt-0.5">{entry.proficiency as string}</p> : null
    ),
  },
  AWARDS: {
    entriesKey: "awardEntries",
    typeKey: "awardEntries",
    fieldDefs: awardFD,
    newEntryLabel: "New award",
    addButtonLabel: "Award",
    requiredField: "title",
    requiredFieldLabel: "Award title",
    renderEntry: (entry: Record<string, unknown>) => (
      <>
        {entry.issuer && <p className="text-base text-muted-foreground mt-0.5">{entry.issuer as string}</p>}
        {entry.date && <p className="text-sm text-muted-foreground mt-1">{entry.date as string}</p>}
      </>
    ),
  },
  REFERENCES: {
    entriesKey: "referenceEntries",
    typeKey: "referenceEntries",
    fieldDefs: refFD,
    newEntryLabel: "New reference",
    addButtonLabel: "Reference",
    requiredField: "name",
    requiredFieldLabel: "Reference name",
    renderEntry: (entry: Record<string, unknown>) => (
      <>
        {entry.jobTitle && <p className="text-base text-muted-foreground mt-0.5">{entry.jobTitle as string}</p>}
        {entry.company && <p className="text-sm text-muted-foreground mt-0.5">{entry.company as string}</p>}
      </>
    ),
  },
  CUSTOM: {
    entriesKey: "customEntries",
    typeKey: "customEntries",
    fieldDefs: custFD,
    newEntryLabel: "New entry",
    addButtonLabel: "Entry",
    requiredField: "title",
    requiredFieldLabel: "Title",
    renderEntry: (entry: Record<string, unknown>) => (
      <>
        {entry.subtitle && <p className="text-base text-muted-foreground mt-0.5">{entry.subtitle as string}</p>}
        {(entry.startDate || entry.endDate) && (
          <p className="text-sm text-muted-foreground mt-1">{entry.startDate as string} - {entry.endDate as string}</p>
        )}
        {entry.location && <p className="text-sm text-muted-foreground mt-0.5">{entry.location as string}</p>}
      </>
    ),
  },
}

export function getTitleKey(type: string): string {
  switch (type) {
    case "EXPERIENCE": return "role"
    case "EDUCATION": return "degree"
    case "PROJECTS": return "name"
    case "CERTIFICATIONS": return "name"
    case "LANGUAGES": return "name"
    case "AWARDS": return "title"
    case "REFERENCES": return "name"
    case "CUSTOM": return "title"
    default: return "title"
  }
}