import type {
  JobApplication,
  JobContact,
  JobTimelineEvent,
  JobInterview,
  JobOffer,
  CurriculumVitae,
  CoverLetter,
} from "@/lib/generated/prisma/client"

export type JobWithRelations = JobApplication & {
  contacts: JobContact[]
  timelineEvents: JobTimelineEvent[]
  interviews: JobInterview[]
  offers: JobOffer[]
  curriculumVitae: CurriculumVitae | null
  coverLetter: CoverLetter | null
}

export type FilterState = {
  search: string
  status: string[]
  employmentType: string[]
  workModel: string[]
  archived: boolean | null
}
