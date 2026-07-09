import type { CvWithRelations } from "@/types/curriculum-vitae/types"

export type { CvWithRelations }

export interface TemplateMeta {
  slug: string
  name: string
  description: string
  categories: string[]
  columnLayout:
    | "single"
    | "two-col-sidebar-left"
    | "two-col-sidebar-right"
    | "two-col-equal"
  supportsPhoto: boolean
  sidebarSectionTypes: string[]
  isPro: boolean
  popular: boolean
  defaultConfig: {
    fontFamily: string
    accentColor: string
    headingStyle: string
    headingWeight: string
    showDividers: boolean
  }
}

export interface CoverLetterTemplateData {
  fullName?: string
  professionalTitle?: string
  email?: string
  phone?: string
  location?: string
  date?: string
  recipientName?: string
  companyName?: string
  body?: string
  fontFamily?: string
  accentColor?: string | null
  matchCv?: boolean
}
