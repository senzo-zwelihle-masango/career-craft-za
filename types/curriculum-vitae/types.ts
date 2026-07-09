import type {
  CurriculumVitae,
  PersonalDetails,
  CurriculumVitaeSection,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  SkillGroup,
  CertificationEntry,
  LanguageEntry,
  AwardEntry,
  ReferenceEntry,
  CustomEntry,
} from "@/lib/generated/prisma/client"

export type CvWithRelations = CurriculumVitae & {
  personalDetails: PersonalDetails | null
  sections: (CurriculumVitaeSection & {
    experienceEntries: ExperienceEntry[]
    educationEntries: EducationEntry[]
    projectEntries: ProjectEntry[]
    skillGroups: SkillGroup[]
    certificationEntries: CertificationEntry[]
    languageEntries: LanguageEntry[]
    awardEntries: AwardEntry[]
    referenceEntries: ReferenceEntry[]
    customEntries: CustomEntry[]
  })[]
}

export const SECTION_ICONS: Record<string, string> = {
  SUMMARY: "FileText",
  SKILLS: "Wrench",
  EXPERIENCE: "Briefcase",
  EDUCATION: "GraduationCap",
  PROJECTS: "FolderGit2",
  CERTIFICATIONS: "Award",
  LANGUAGES: "Languages",
  AWARDS: "Trophy",
  REFERENCES: "Quote",
  CUSTOM: "Plus",
}

export const SECTION_LABELS: Record<string, string> = {
  SUMMARY: "Summary",
  SKILLS: "Skills",
  EXPERIENCE: "Professional Experience",
  EDUCATION: "Education",
  PROJECTS: "Projects",
  CERTIFICATIONS: "Certifications",
  LANGUAGES: "Languages",
  AWARDS: "Awards",
  REFERENCES: "References",
  CUSTOM: "Custom",
}

export const DEFAULT_SECTIONS = [
  "SUMMARY",
  "SKILLS",
  "EXPERIENCE",
  "EDUCATION",
  "PROJECTS",
] as const

export const SECTION_TYPES = [
  "SUMMARY",
  "SKILLS",
  "EXPERIENCE",
  "EDUCATION",
  "PROJECTS",
  "CERTIFICATIONS",
  "LANGUAGES",
  "AWARDS",
  "REFERENCES",
  "CUSTOM",
] as const

export const LANGUAGE_OPTIONS = [{ value: "en-GB", label: "English (UK)" }]

export const DATE_FORMAT_OPTIONS = [
  { value: "MM/YYYY", label: "05/2024" },
  { value: "MMM YYYY", label: "Sep 2024" },
  { value: "MMMM YYYY", label: "September 2024" },
  { value: "YYYY-MM", label: "2024-05" },
  { value: "YYYY", label: "2024" },
]
