import type {
  JobApplication,
  JobContact,
  JobTimelineEvent,
  JobInterview,
  JobOffer,
} from "@/lib/generated/prisma/client"




export type JobWithRelations = JobApplication & {
  contacts: JobContact[]
  timelineEvents: JobTimelineEvent[]
  interviews: JobInterview[]
  offers: JobOffer[]
}

export type FilterState = {
  search: string
  status: string[]
  employmentType: string[]
  workModel: string[]
  archived: boolean | null
}

export const defaultFilter: FilterState = {
  search: "",
  status: [],
  employmentType: [],
  workModel: [],
  archived: null,
}

export const STATUS_CONFIG = {
  WISHLIST: { label: "Wishlist", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-900", dot: "bg-slate-400" },
  APPLIED: { label: "Applied", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", dot: "bg-blue-500" },
  INTERVIEWING: { label: "Interviewing", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30", dot: "bg-amber-500" },
  OFFER: { label: "Offer", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", dot: "bg-emerald-500" },
  REJECTED: { label: "Rejected", color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30", dot: "bg-red-400" },
} as const

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
  FREELANCE: "Freelance",
}

export const WORK_MODEL_LABELS: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
}

export const INTERVIEW_ROUND_LABELS: Record<string, string> = {
  phone: "Phone Screen",
  technical: "Technical",
  behavioural: "Behavioural",
  onsite: "On-site",
  final: "Final",
  other: "Other",
}

export const OFFER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  negotiated: "Negotiating",
  expired: "Expired",
}
