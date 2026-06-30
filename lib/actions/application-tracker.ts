"use server"

import { auth } from "@/lib/auth"
import prisma from "../prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

const jobInclude = {
  contacts: { orderBy: { order: "asc" } },
  timelineEvents: { orderBy: { eventDate: "desc" } },
  interviews: { orderBy: { order: "asc" } },
  offers: { orderBy: { receivedAt: "desc" } },
} as const

/* ─── Auth helper ─── */
async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user.id
}

/* ─── Core CRUD ─── */

export async function getJobApplications() {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const jobs = await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { order: "asc" },
    include: jobInclude,
  })
  return { data: JSON.parse(JSON.stringify(jobs)) }
}

export async function getJobApplication(id: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const job = await prisma.jobApplication.findFirst({
    where: { id, userId },
    include: jobInclude,
  })
  if (!job) return { error: "Not found" }
  return { data: JSON.parse(JSON.stringify(job)) }
}

export async function createJobApplication(data: {
  title: string
  company: string
  location?: string | null
  salaryMin?: number | null
  salaryMax?: number | null
  salaryCurrency?: string | null
  jobUrl?: string | null
  description?: string | null
  companyWebsite?: string | null
  companyDescription?: string | null
  employmentType?: string | null
  workModel?: string | null
  source?: string | null
  skills?: string[]
  color?: string | null
  notes?: string | null
  status?: string | null
  appliedAt?: string | null
  followUpAt?: string | null
  resumeId?: string | null
  coverLetterId?: string | null
}) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const count = await prisma.jobApplication.count({ where: { userId } })

  const job = await prisma.jobApplication.create({
    data: {
      userId,
      title: data.title,
      company: data.company,
      location: data.location || null,
      salaryMin: data.salaryMin ?? null,
      salaryMax: data.salaryMax ?? null,
      salaryCurrency: data.salaryCurrency || null,
      jobUrl: data.jobUrl || null,
      description: data.description || null,
      companyWebsite: data.companyWebsite || null,
      companyDescription: data.companyDescription || null,
      employmentType: data.employmentType as string || null,
      workModel: data.workModel as string || null,
      source: data.source || null,
      skills: data.skills || [],
      color: data.color || null,
      notes: data.notes || null,
      curriculumVitaeId: data.resumeId || null,
      coverLetterId: data.coverLetterId || null,
      status: (data.status as string) || "WISHLIST",
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
      order: count,
      timelineEvents: {
        create: {
          userId,
          type: "created",
          title: "Application created",
          description: `Added ${data.title} at ${data.company}`,
        },
      },
    },
    include: jobInclude,
  })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(job)) }
}

export async function updateJobApplication(id: string, data: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const existing = await prisma.jobApplication.findFirst({ where: { id, userId } })
  if (!existing) return { error: "Not found" }

  const updateData: Record<string, unknown> = { ...data }
  delete updateData.id

  if (updateData.appliedAt === "") updateData.appliedAt = null
  else if (updateData.appliedAt) updateData.appliedAt = new Date(updateData.appliedAt)

  if (updateData.followUpAt === "") updateData.followUpAt = null
  else if (updateData.followUpAt) updateData.followUpAt = new Date(updateData.followUpAt)

  // Track status changes as timeline events
  if (updateData.status && updateData.status !== existing.status) {
    const statusLabels: Record<string, string> = {
      WISHLIST: "Wishlist",
      APPLIED: "Applied",
      INTERVIEWING: "Interviewing",
      OFFER: "Offer",
      REJECTED: "Rejected",
    }
    updateData.timelineEvents = {
      create: {
        userId,
        type: "status-change",
        title: `Status changed to ${statusLabels[updateData.status as string] || updateData.status}`,
        description: `Moved from ${statusLabels[existing.status] || existing.status}`,
      },
    }
  }

  const updated = await prisma.jobApplication.update({
    where: { id },
    data: updateData as never,
    include: jobInclude,
  })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(updated)) }
}

export async function deleteJobApplication(id: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const job = await prisma.jobApplication.findFirst({ where: { id, userId } })
  if (!job) return { error: "Not found" }

  await prisma.jobApplication.delete({ where: { id } })
  revalidatePath("/application-tracker")
  return { success: true }
}

export async function archiveJobApplication(id: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const existing = await prisma.jobApplication.findFirst({ where: { id, userId } })
  if (!existing) return { error: "Not found" }

  const updated = await prisma.jobApplication.update({
    where: { id },
    data: {
      archived: !existing.archived,
      archivedAt: existing.archived ? null : new Date(),
    },
    include: jobInclude,
  })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(updated)) }
}

/* ─── Bulk Actions ─── */

export async function bulkUpdateJobs(ids: string[], action: string, value?: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const own = await prisma.jobApplication.findMany({
    where: { id: { in: ids }, userId },
    select: { id: true, title: true, company: true },
  })
  const ownIds = own.map((j) => j.id)

  switch (action) {
    case "status": {
      if (!value) return { error: "Status value required" }
      const statusLabels: Record<string, string> = {
        WISHLIST: "Wishlist",
        APPLIED: "Applied",
        INTERVIEWING: "Interviewing",
        OFFER: "Offer",
        REJECTED: "Rejected",
      }
      await prisma.$transaction(
        ownIds.map((id) =>
          prisma.jobApplication.update({
            where: { id },
            data: {
              status: value as string,
              timelineEvents: {
                create: {
                  userId,
                  type: "status-change",
                  title: `Status changed to ${statusLabels[value] || value}`,
                },
              },
            },
          }),
        ),
      )
      break
    }
    case "archive":
      await prisma.jobApplication.updateMany({
        where: { id: { in: ownIds } },
        data: { archived: true, archivedAt: new Date() },
      })
      break
    case "restore":
      await prisma.jobApplication.updateMany({
        where: { id: { in: ownIds } },
        data: { archived: false, archivedAt: null },
      })
      break
    case "delete":
      await prisma.jobApplication.deleteMany({ where: { id: { in: ownIds } } })
      break
    default:
      return { error: "Unknown action" }
  }

  revalidatePath("/application-tracker")
  return { success: true }
}

/* ─── Contacts ─── */

export async function createContact(jobId: string, data: {
  name: string; role?: string; email?: string; phone?: string
  notes?: string; linkedInUrl?: string
}) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const count = await prisma.jobContact.count({ where: { jobApplicationId: jobId } })
  const contact = await prisma.jobContact.create({
    data: { ...data, userId, jobApplicationId: jobId, order: count },
  })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(contact)) }
}

export async function updateContact(id: string, data: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const contact = await prisma.jobContact.findFirst({ where: { id, userId } })
  if (!contact) return { error: "Not found" }
  const updated = await prisma.jobContact.update({ where: { id }, data: data as never })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(updated)) }
}

export async function deleteContact(id: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const contact = await prisma.jobContact.findFirst({ where: { id, userId } })
  if (!contact) return { error: "Not found" }
  await prisma.jobContact.delete({ where: { id } })
  revalidatePath("/application-tracker")
  return { success: true }
}

/* ─── Timeline Events ─── */

export async function createTimelineEvent(jobId: string, data: {
  type: string; title: string; description?: string; eventDate?: string
}) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const event = await prisma.jobTimelineEvent.create({
    data: {
      userId,
      jobApplicationId: jobId,
      type: data.type,
      title: data.title,
      description: data.description || null,
      eventDate: data.eventDate ? new Date(data.eventDate) : new Date(),
    },
  })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(event)) }
}

export async function deleteTimelineEvent(id: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const event = await prisma.jobTimelineEvent.findFirst({ where: { id, userId } })
  if (!event) return { error: "Not found" }
  await prisma.jobTimelineEvent.delete({ where: { id } })
  revalidatePath("/application-tracker")
  return { success: true }
}

/* ─── Interviews ─── */

export async function createInterview(jobId: string, data: {
  round: string; title?: string; scheduledAt: string; durationMinutes?: number | null
  location?: string; meetingLink?: string; interviewers?: string[]
  notes?: string; type?: string; completed?: boolean
}) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const count = await prisma.jobInterview.count({ where: { jobApplicationId: jobId } })
  const interview = await prisma.jobInterview.create({
    data: {
      jobApplicationId: jobId,
      round: data.round,
      title: data.title || null,
      scheduledAt: new Date(data.scheduledAt),
      durationMinutes: data.durationMinutes ?? null,
      location: data.location || null,
      meetingLink: data.meetingLink || null,
      interviewers: data.interviewers || [],
      notes: data.notes || null,
      type: data.type || "video",
      completed: data.completed || false,
      order: count,
    },
  })
  // Also add a timeline event
  await prisma.jobTimelineEvent.create({
    data: {
      userId,
      jobApplicationId: jobId,
      type: "interview",
      title: `${data.type === "phone" ? "Phone" : data.type === "onsite" ? "On-site" : "Video"} interview scheduled`,
      description: data.title || `${data.round} round`,
      eventDate: new Date(data.scheduledAt),
    },
  })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(interview)) }
}

export async function updateInterview(id: string, data: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const iv = await prisma.jobInterview.findFirst({
    where: { id, jobApplication: { userId } },
  })
  if (!iv) return { error: "Not found" }
  const updateData: Record<string, unknown> = { ...data }
  delete updateData.id
  if (updateData.scheduledAt) updateData.scheduledAt = new Date(updateData.scheduledAt)
  const updated = await prisma.jobInterview.update({ where: { id }, data: updateData as never })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(updated)) }
}

export async function deleteInterview(id: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const iv = await prisma.jobInterview.findFirst({
    where: { id, jobApplication: { userId } },
  })
  if (!iv) return { error: "Not found" }
  await prisma.jobInterview.delete({ where: { id } })
  revalidatePath("/application-tracker")
  return { success: true }
}

/* ─── Offers ─── */

export async function createOffer(jobId: string, data: {
  salaryMin?: number | null; salaryMax?: number | null; salaryCurrency?: string
  equityInfo?: string; bonusInfo?: string; benefits?: string[]
  deadline?: string | null; status?: string; notes?: string
}) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const offer = await prisma.jobOffer.create({
    data: {
      jobApplicationId: jobId,
      salaryMin: data.salaryMin ?? null,
      salaryMax: data.salaryMax ?? null,
      salaryCurrency: data.salaryCurrency || null,
      equityInfo: data.equityInfo || null,
      bonusInfo: data.bonusInfo || null,
      benefits: data.benefits || [],
      deadline: data.deadline ? new Date(data.deadline) : null,
      status: data.status || "pending",
      notes: data.notes || null,
    },
  })
  // Timeline event
  await prisma.jobTimelineEvent.create({
    data: {
      userId,
      jobApplicationId: jobId,
      type: "offer",
      title: "Offer received",
      description: data.salaryMin && data.salaryMax
        ? `Salary range: ${data.salaryCurrency || "ZAR"} ${data.salaryMin} - ${data.salaryMax}`
        : undefined,
    },
  })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(offer)) }
}

export async function updateOffer(id: string, data: Record<string, unknown>) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const offer = await prisma.jobOffer.findFirst({
    where: { id, jobApplication: { userId } },
  })
  if (!offer) return { error: "Not found" }
  const updateData: Record<string, unknown> = { ...data }
  delete updateData.id
  if (updateData.deadline) updateData.deadline = new Date(updateData.deadline)
  if (updateData.respondedAt) updateData.respondedAt = new Date(updateData.respondedAt)
  const updated = await prisma.jobOffer.update({ where: { id }, data: updateData as never })
  revalidatePath("/application-tracker")
  return { data: JSON.parse(JSON.stringify(updated)) }
}

export async function deleteOffer(id: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const offer = await prisma.jobOffer.findFirst({
    where: { id, jobApplication: { userId } },
  })
  if (!offer) return { error: "Not found" }
  await prisma.jobOffer.delete({ where: { id } })
  revalidatePath("/application-tracker")
  return { success: true }
}

/* ─── Saved Searches ─── */

export async function getSavedSearches() {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const searches = await prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  })
  return { data: JSON.parse(JSON.stringify(searches)) }
}

export async function createSavedSearch(data: { name: string; filters: Record<string, unknown> }) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const count = await prisma.savedSearch.count({ where: { userId } })
  const search = await prisma.savedSearch.create({
    data: { ...data, userId, order: count },
  })
  return { data: JSON.parse(JSON.stringify(search)) }
}

export async function updateSavedSearch(id: string, data: { name?: string; filters?: Record<string, unknown> }) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const existing = await prisma.savedSearch.findFirst({ where: { id, userId } })
  if (!existing) return { error: "Not found" }
  const updated = await prisma.savedSearch.update({ where: { id }, data })
  return { data: JSON.parse(JSON.stringify(updated)) }
}

export async function deleteSavedSearch(id: string) {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }
  const existing = await prisma.savedSearch.findFirst({ where: { id, userId } })
  if (!existing) return { error: "Not found" }
  await prisma.savedSearch.delete({ where: { id } })
  return { success: true }
}

/* ─── Analytics ─── */

export async function getJobAnalytics() {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const all = await prisma.jobApplication.findMany({
    where: { userId },
    select: {
      status: true,
      createdAt: true,
      appliedAt: true,
      interviews: { select: { id: true, completed: true } },
      offers: { select: { id: true, status: true } },
    },
  })

  const total = all.length
  const statusCounts: Record<string, number> = {}
  for (const j of all) {
    statusCounts[j.status] = (statusCounts[j.status] || 0) + 1
  }

  const interviewsScheduled = all.reduce((s, j) => s + j.interviews.length, 0)
  const interviewsCompleted = all.reduce((s, j) => s + j.interviews.filter((i) => i.completed).length, 0)
  const offersReceived = all.reduce((s, j) => s + j.offers.length, 0)
  const offersAccepted = all.reduce((s, j) => s + j.offers.filter((o) => o.status === "accepted").length, 0)

  const applied = all.filter((j) => j.status !== "WISHLIST" && j.status !== "REJECTED")
  const responseRate = applied.length > 0
    ? Math.round((all.filter((j) => j.status === "INTERVIEWING" || j.status === "OFFER").length / applied.length) * 100)
    : 0

  const interviewToOffer = all.filter((j) => j.interviews.length > 0 && j.offers.length > 0).length
  const interviewConversion = all.filter((j) => j.interviews.length > 0).length > 0
    ? Math.round((interviewToOffer / all.filter((j) => j.interviews.length > 0).length) * 100)
    : 0

  return {
    data: {
      total,
      statusCounts,
      interviewsScheduled,
      interviewsCompleted,
      offersReceived,
      offersAccepted,
      responseRate,
      interviewConversion,
      wishes: statusCounts["WISHLIST"] || 0,
      applied: statusCounts["APPLIED"] || 0,
      interviewing: statusCounts["INTERVIEWING"] || 0,
      offers: statusCounts["OFFER"] || 0,
      rejected: statusCounts["REJECTED"] || 0,
    },
  }
}

/* ─── Resume Usage Analytics ─── */

export async function getResumeUsageAnalytics() {
  const userId = await getUserId()
  if (!userId) return { error: "Unauthorized" }

  const jobs = await prisma.jobApplication.findMany({
      where: { userId, curriculumVitaeId: { not: null } },
    select: {
      curriculumVitaeId: true,
      title: true,
      company: true,
      status: true,
      curriculumVitae: { select: { title: true, updatedAt: true } },
      appliedAt: true,
    },
    orderBy: { appliedAt: "desc" },
  })

  // Group by resume
  const byResume: Record<string, { resumeTitle: string; count: number; statuses: Record<string, number> }> = {}
  for (const j of jobs) {
    const id = j.curriculumVitaeId!
    if (!byResume[id]) {
      byResume[id] = { resumeTitle: j.curriculumVitae?.title || "Untitled", count: 0, statuses: {} }
    }
    byResume[id].count++
    byResume[id].statuses[j.status] = (byResume[id].statuses[j.status] || 0) + 1
  }

  const resumeAnalytics = Object.entries(byResume).map(([id, data]) => ({
    curriculumVitaeId: id,
    ...data,
  }))

  return { data: resumeAnalytics }
}
