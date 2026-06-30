"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma/db"

const cvInclude = {
  personalDetails: true,
  sections: {
    include: {
      experienceEntries: { orderBy: { order: "asc" } },
      educationEntries: { orderBy: { order: "asc" } },
      projectEntries: { orderBy: { order: "asc" } },
      skillGroups: { orderBy: { order: "asc" } },
      certificationEntries: { orderBy: { order: "asc" } },
      languageEntries: { orderBy: { order: "asc" } },
      awardEntries: { orderBy: { order: "asc" } },
      referenceEntries: { orderBy: { order: "asc" } },
      customEntries: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  },
} as const

export async function getCvs() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }
  const cvs = await prisma.curriculumVitae.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, pageFormat: true, updatedAt: true, templateId: true, shared: true, shareId: true },
  })
  return { data: JSON.parse(JSON.stringify(cvs)) }
}

function generateShareId() {
  return Array.from({ length: 12 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("")
}

export async function createCv() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const existingCount = await prisma.curriculumVitae.count({ where: { userId: session.user.id } })
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true },
  })

  if (user?.plan === "FREE" && user?.role !== "admin" && existingCount >= 1) {
    return { error: "Free plan limited to 1 CV. Upgrade to create more." }
  }

  const cv = await prisma.curriculumVitae.create({
    data: {
      userId: session.user.id,
      shareId: generateShareId(),
      personalDetails: { create: { fullName: "", jobTitle: "" } },
      sections: {
        create: [
          { type: "SUMMARY", title: "Professional Summary", order: 0, content: "" },
          { type: "SKILLS", title: "Skills", order: 1 },
          { type: "EXPERIENCE", title: "Professional Experience", order: 2 },
          { type: "EDUCATION", title: "Education", order: 3 },
        ],
      },
    },
    include: {
      personalDetails: true,
      sections: { include: { experienceEntries: true, educationEntries: true, projectEntries: true, skillGroups: true, certificationEntries: true, languageEntries: true, awardEntries: true, referenceEntries: true, customEntries: true } },
    },
  })

  revalidatePath("/curriculum-vitaes")
  return { data: JSON.parse(JSON.stringify(cv)) }
}

export async function getCv(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const cv = await prisma.curriculumVitae.findFirst({
    where: { id, userId: session.user.id },
    include: cvInclude,
  })
  if (!cv) return { error: "Not found" }
  return { data: JSON.parse(JSON.stringify(cv)) }
}

export async function updateCv(id: string, json: Record<string, unknown>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const cv = await prisma.curriculumVitae.findFirst({ where: { id, userId: session.user.id } })
  if (!cv) return { error: "Not found" }

  if ((json.personalDetails as { update?: unknown })?.update) {
    await prisma.personalDetails.update({
      where: { curriculumVitaeId: id },
      data: (json.personalDetails as { update: unknown }).update as never,
    })
    delete json.personalDetails
  }

  const sectionsData = json.sections as { update: Array<{ where: { id: string }; data: Record<string, unknown> }> } | undefined
  if (sectionsData?.update) {
    for (const update of sectionsData.update) {
      const { where, data: entryData } = update

      const e = entryData as Record<string, unknown>
      if (e.experienceEntries && typeof e.experienceEntries === "object") {
        const ee = e.experienceEntries as { create?: unknown[]; update?: Array<{ where: { id: string }; data: unknown }>; delete?: Array<{ id: string }> }
        if (ee.create) {
          for (const entry of ee.create) {
            await prisma.experienceEntry.create({ data: { ...entry as never, sectionId: where.id } })
          }
        }
        if (ee.update) {
          for (const entry of ee.update) {
            await prisma.experienceEntry.update({ where: { id: entry.where.id }, data: entry.data as never })
          }
        }
        if (ee.delete) {
          for (const del of ee.delete) {
            await prisma.experienceEntry.delete({ where: { id: del.id } })
          }
        }
      }
      if (e.educationEntries && typeof e.educationEntries === "object") {
        const ed = e.educationEntries as { create?: unknown[]; update?: Array<{ where: { id: string }; data: unknown }>; delete?: Array<{ id: string }> }
        if (ed.create) {
          for (const entry of ed.create) {
            const { gpa, field, ...clean } = entry as { gpa?: unknown; field?: unknown }
            await prisma.educationEntry.create({ data: { ...clean as never, sectionId: where.id } })
          }
        }
        if (ed.update) {
          for (const entry of ed.update) {
            const { gpa, field, ...clean } = entry.data as { gpa?: unknown; field?: unknown }
            await prisma.educationEntry.update({ where: { id: entry.where.id }, data: clean as never })
          }
        }
        if (ed.delete) {
          for (const del of ed.delete) {
            await prisma.educationEntry.delete({ where: { id: del.id } })
          }
        }
      }
      if (e.skillGroups && typeof e.skillGroups === "object") {
        const sg = e.skillGroups as { create?: unknown[]; update?: Array<{ where: { id: string }; data: unknown }>; delete?: Array<{ id: string }> }
        if (sg.create) {
          for (const group of sg.create) {
            await prisma.skillGroup.create({ data: { ...group as never, sectionId: where.id } })
          }
        }
        if (sg.update) {
          for (const group of sg.update) {
            await prisma.skillGroup.update({ where: { id: group.where.id }, data: group.data as never })
          }
        }
        if (sg.delete) {
          for (const del of sg.delete) {
            await prisma.skillGroup.delete({ where: { id: del.id } })
          }
        }
      }
      if (e.projectEntries && typeof e.projectEntries === "object") {
        const pe = e.projectEntries as { create?: unknown[]; update?: Array<{ where: { id: string }; data: unknown }>; delete?: Array<{ id: string }> }
        if (pe.create) {
          for (const entry of pe.create) {
            await prisma.projectEntry.create({ data: { ...entry as never, sectionId: where.id } })
          }
        }
        if (pe.update) {
          for (const entry of pe.update) {
            await prisma.projectEntry.update({ where: { id: entry.where.id }, data: entry.data as never })
          }
        }
        if (pe.delete) {
          for (const del of pe.delete) {
            await prisma.projectEntry.delete({ where: { id: del.id } })
          }
        }
      }
      if (e.customEntries && typeof e.customEntries === "object") {
        const ce = e.customEntries as { create?: unknown[]; update?: Array<{ where: { id: string }; data: unknown }>; delete?: Array<{ id: string }> }
        if (ce.create) {
          for (const entry of ce.create) {
            await prisma.customEntry.create({ data: { ...entry as never, sectionId: where.id } })
          }
        }
        if (ce.update) {
          for (const entry of ce.update) {
            await prisma.customEntry.update({ where: { id: entry.where.id }, data: entry.data as never })
          }
        }
        if (ce.delete) {
          for (const del of ce.delete) {
            await prisma.customEntry.delete({ where: { id: del.id } })
          }
        }
      }

      await prisma.curriculumVitaeSection.update({ where: { id: where.id }, data: e as never })
    }
    delete json.sections
  }

  const updated = await prisma.curriculumVitae.update({
    where: { id },
    data: json as never,
    include: cvInclude,
  })

  return { data: JSON.parse(JSON.stringify(updated)) }
}

export async function deleteCv(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const cv = await prisma.curriculumVitae.findFirst({ where: { id, userId: session.user.id } })
  if (!cv) return { error: "Not found" }

  await prisma.curriculumVitae.delete({ where: { id } })
  revalidatePath("/curriculum-vitaes")
  return { success: true }
}

export async function duplicateCv(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const original = await prisma.curriculumVitae.findFirst({
    where: { id, userId: session.user.id },
    include: {
      personalDetails: true,
      sections: {
        include: { experienceEntries: true, educationEntries: true, projectEntries: true, skillGroups: true, certificationEntries: true, languageEntries: true, awardEntries: true, referenceEntries: true, customEntries: true },
      },
    },
  })
  if (!original) return { error: "Not found" }

  const duplicate = await prisma.curriculumVitae.create({
    data: {
      userId: session.user.id,
      shareId: generateShareId(),
      title: `${original.title} (Copy)`,
      templateId: original.templateId,
      pageFormat: original.pageFormat,
      language: original.language,
      dateFormat: original.dateFormat,
      fontFamily: original.fontFamily,
      fontScale: original.fontScale,
      spacingScale: original.spacingScale,
      accentColor: original.accentColor,
      contentWidth: original.contentWidth,
      showDividers: original.showDividers,
      headingStyle: original.headingStyle,
      headingWeight: original.headingWeight,
      showSectionIcons: original.showSectionIcons,
      personalDetails: original.personalDetails
        ? {
            create: {
              fullName: original.personalDetails.fullName,
              jobTitle: original.personalDetails.jobTitle,
              email: original.personalDetails.email,
              phone: original.personalDetails.phone,
              location: original.personalDetails.location,
              photoUrl: original.personalDetails.photoUrl,
              links: Array.isArray(original.personalDetails.links) ? original.personalDetails.links : [],
            },
          }
        : undefined,
      sections: {
        create: original.sections.map((section) => ({
          type: section.type,
          title: section.title,
          order: section.order,
          visible: section.visible,
          content: section.content,
          experienceEntries: {
            create: section.experienceEntries.map((e) => ({
              company: e.company, role: e.role, location: e.location,
              startDate: e.startDate, endDate: e.endDate, current: e.current,
              bullets: e.bullets, order: e.order,
            })),
          },
          educationEntries: {
            create: section.educationEntries.map((e) => ({
              institution: e.institution, degree: e.degree, location: e.location,
              startDate: e.startDate, endDate: e.endDate, order: e.order,
            })),
          },
          projectEntries: {
            create: section.projectEntries.map((p) => ({
              name: p.name, link: p.link, description: p.description,
              technologies: p.technologies, order: p.order,
            })),
          },
          skillGroups: {
            create: section.skillGroups.map((s) => ({
              label: s.label, skills: s.skills, order: s.order,
            })),
          },
          certificationEntries: {
            create: section.certificationEntries.map((c) => ({
              name: c.name, issuer: c.issuer, issueDate: c.issueDate,
              expiryDate: c.expiryDate, credentialId: c.credentialId,
              credentialUrl: c.credentialUrl, order: c.order,
            })),
          },
          languageEntries: {
            create: section.languageEntries.map((l) => ({
              name: l.name, proficiency: l.proficiency, order: l.order,
            })),
          },
          awardEntries: {
            create: section.awardEntries.map((a) => ({
              title: a.title, issuer: a.issuer, date: a.date,
              description: a.description, order: a.order,
            })),
          },
          referenceEntries: {
            create: section.referenceEntries.map((r) => ({
              name: r.name, jobTitle: r.jobTitle, company: r.company,
              email: r.email, phone: r.phone, order: r.order,
            })),
          },
          customEntries: {
            create: section.customEntries.map((c) => ({
              title: c.title, subtitle: c.subtitle, link: c.link,
              startDate: c.startDate, endDate: c.endDate,
              location: c.location, description: c.description, order: c.order,
            })),
          },
        })),
      },
    },
    include: {
      personalDetails: true,
      sections: {
        include: { experienceEntries: true, educationEntries: true, projectEntries: true, skillGroups: true, certificationEntries: true, languageEntries: true, awardEntries: true, referenceEntries: true },
      },
    },
  })

  revalidatePath("/curriculum-vitaes")
  return { data: JSON.parse(JSON.stringify(duplicate)) }
}

export async function addSection(cvId: string, type: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const cv = await prisma.curriculumVitae.findFirst({ where: { id: cvId, userId: session.user.id } })
  if (!cv) return { error: "Not found" }

  const maxOrder = await prisma.curriculumVitaeSection.findFirst({
    where: { curriculumVitaeId: cvId },
    orderBy: { order: "desc" },
    select: { order: true },
  })

  const section = await prisma.curriculumVitaeSection.create({
    data: {
      curriculumVitaeId: cvId,
      type: type as string,
      title: type.charAt(0) + type.slice(1).toLowerCase(),
      order: (maxOrder?.order ?? -1) + 1,
    },
    include: { experienceEntries: true, educationEntries: true, projectEntries: true, skillGroups: true, certificationEntries: true, languageEntries: true, awardEntries: true, referenceEntries: true, customEntries: true },
  })

  return { data: JSON.parse(JSON.stringify(section)) }
}

export async function updateSectionVisibility(cvId: string, sections: { where: { id: string }; data: { visible: boolean } }[]) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const cv = await prisma.curriculumVitae.findFirst({ where: { id: cvId, userId: session.user.id } })
  if (!cv) return { error: "Not found" }

  for (const update of sections) {
    await prisma.curriculumVitaeSection.update({
      where: { id: update.where.id, curriculumVitaeId: cvId },
      data: update.data,
    })
  }

  return { success: true }
}

export async function syncCv(id: string, data: Record<string, unknown>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const cv = await prisma.curriculumVitae.findFirst({
    where: { id, userId: session.user.id },
    include: {
      sections: { select: { id: true, type: true } },
    },
  })
  if (!cv) return { error: "Not found" }

  const allowedFields = [
    "title", "templateId", "pageFormat", "language", "dateFormat",
    "fontFamily", "fontScale", "spacingScale", "accentColor",
    "contentWidth", "showDividers", "headingStyle", "headingWeight",
    "showSectionIcons", "shared", "footer",
    "headerLayout", "entryStyle", "showEntryDates", "showEntryLocation",
    "showPhoto",
  ]

  const updateData: Record<string, unknown> = {}
  for (const key of allowedFields) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  await prisma.curriculumVitae.update({ where: { id }, data: updateData as never })

  if (data.personalDetails) {
    const { id: pdId, curriculumVitaeId: _, ...pdData } = data.personalDetails as Record<string, unknown>
    await prisma.personalDetails.upsert({
      where: { curriculumVitaeId: id },
      create: { curriculumVitaeId: id, ...pdData },
      update: pdData,
    })
  }

  if (data.sections) {
    const existingSectionIds = new Map(cv.sections.map((s) => [s.id, s.type]))

    const sections = data.sections as Array<Record<string, unknown>>
    for (const section of sections) {
      if (!existingSectionIds.has(section.id)) continue

      const sectionTyped = section as { id: string; title?: unknown; content?: unknown; visible?: unknown; order?: unknown; experienceEntries?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }>; educationEntries?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }>; projectEntries?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }>; skillGroups?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }>; certificationEntries?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }>; languageEntries?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }>; awardEntries?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }>; referenceEntries?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }>; customEntries?: Array<{ id: string; sectionId?: unknown; [key: string]: unknown }> }
      const { experienceEntries, educationEntries, projectEntries, skillGroups, certificationEntries, languageEntries, awardEntries, referenceEntries, customEntries, ...sectionData } = sectionTyped
      await prisma.curriculumVitaeSection.update({
        where: { id: section.id },
        data: {
          title: sectionData.title,
          content: sectionData.content,
          visible: sectionData.visible,
          order: sectionData.order,
        },
      })

      if (experienceEntries) {
        const existingEntries = await prisma.experienceEntry.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingEntries.map((e) => e.id))
        const incomingIds = new Set(experienceEntries.map((e) => e.id))

        for (const entry of experienceEntries) {
          const { id: eid, sectionId: _, ...ed } = entry
          if (existingIds.has(eid)) {
            await prisma.experienceEntry.update({ where: { id: eid }, data: ed })
          }
        }

        for (const entry of existingEntries) {
          if (!incomingIds.has(entry.id)) {
            await prisma.experienceEntry.delete({ where: { id: entry.id } })
          }
        }
      }

      if (educationEntries) {
        const existingEntries = await prisma.educationEntry.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingEntries.map((e) => e.id))
        const incomingIds = new Set(educationEntries.map((e) => e.id))

        for (const entry of educationEntries) {
          const { id: eid, sectionId: _, ...ed } = entry
          if (existingIds.has(eid)) {
            await prisma.educationEntry.update({ where: { id: eid }, data: ed })
          }
        }

        for (const entry of existingEntries) {
          if (!incomingIds.has(entry.id)) {
            await prisma.educationEntry.delete({ where: { id: entry.id } })
          }
        }
      }

      if (projectEntries) {
        const existingEntries = await prisma.projectEntry.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingEntries.map((e) => e.id))
        const incomingIds = new Set(projectEntries.map((e) => e.id))

        for (const entry of projectEntries) {
          const { id: eid, sectionId: _, ...ed } = entry
          if (existingIds.has(eid)) {
            await prisma.projectEntry.update({ where: { id: eid }, data: ed })
          }
        }

        for (const entry of existingEntries) {
          if (!incomingIds.has(entry.id)) {
            await prisma.projectEntry.delete({ where: { id: entry.id } })
          }
        }
      }

      if (skillGroups) {
        const existingGroups = await prisma.skillGroup.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingGroups.map((g) => g.id))
        const incomingIds = new Set(skillGroups.map((g) => g.id))

        for (const group of skillGroups) {
          const { id: gid, sectionId: _, ...gd } = group
          if (existingIds.has(gid)) {
            await prisma.skillGroup.update({ where: { id: gid }, data: gd })
          }
        }

        for (const group of existingGroups) {
          if (!incomingIds.has(group.id)) {
            await prisma.skillGroup.delete({ where: { id: group.id } })
          }
        }
      }

      if (certificationEntries) {
        const existingEntries = await prisma.certificationEntry.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingEntries.map((e) => e.id))
        const incomingIds = new Set(certificationEntries.map((e) => e.id))

        for (const entry of certificationEntries) {
          const { id: eid, sectionId: _, ...ed } = entry
          if (existingIds.has(eid)) {
            await prisma.certificationEntry.update({ where: { id: eid }, data: ed })
          }
        }

        for (const entry of existingEntries) {
          if (!incomingIds.has(entry.id)) {
            await prisma.certificationEntry.delete({ where: { id: entry.id } })
          }
        }
      }

      if (languageEntries) {
        const existingEntries = await prisma.languageEntry.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingEntries.map((e) => e.id))
        const incomingIds = new Set(languageEntries.map((e) => e.id))

        for (const entry of languageEntries) {
          const { id: eid, sectionId: _, ...ed } = entry
          if (existingIds.has(eid)) {
            await prisma.languageEntry.update({ where: { id: eid }, data: ed })
          }
        }

        for (const entry of existingEntries) {
          if (!incomingIds.has(entry.id)) {
            await prisma.languageEntry.delete({ where: { id: entry.id } })
          }
        }
      }

      if (awardEntries) {
        const existingEntries = await prisma.awardEntry.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingEntries.map((e) => e.id))
        const incomingIds = new Set(awardEntries.map((e) => e.id))

        for (const entry of awardEntries) {
          const { id: eid, sectionId: _, ...ed } = entry
          if (existingIds.has(eid)) {
            await prisma.awardEntry.update({ where: { id: eid }, data: ed })
          }
        }

        for (const entry of existingEntries) {
          if (!incomingIds.has(entry.id)) {
            await prisma.awardEntry.delete({ where: { id: entry.id } })
          }
        }
      }

      if (referenceEntries) {
        const existingEntries = await prisma.referenceEntry.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingEntries.map((e) => e.id))
        const incomingIds = new Set(referenceEntries.map((e) => e.id))

        for (const entry of referenceEntries) {
          const { id: eid, sectionId: _, ...ed } = entry
          if (existingIds.has(eid)) {
            await prisma.referenceEntry.update({ where: { id: eid }, data: ed })
          }
        }

        for (const entry of existingEntries) {
          if (!incomingIds.has(entry.id)) {
            await prisma.referenceEntry.delete({ where: { id: entry.id } })
          }
        }
      }

      if (customEntries) {
        const existingEntries = await prisma.customEntry.findMany({
          where: { sectionId: section.id },
          select: { id: true },
        })
        const existingIds = new Set(existingEntries.map((e) => e.id))
        const incomingIds = new Set(customEntries.map((e) => e.id))

        for (const entry of customEntries) {
          const { id: eid, sectionId: _, ...ed } = entry
          if (existingIds.has(eid)) {
            await prisma.customEntry.update({ where: { id: eid }, data: ed })
          } else {
            await prisma.customEntry.create({ data: { sectionId: section.id, ...ed, order: ed.order ?? 0 } })
          }
        }

        for (const entry of existingEntries) {
          if (!incomingIds.has(entry.id)) {
            await prisma.customEntry.delete({ where: { id: entry.id } })
          }
        }
      }
    }
  }

  return { success: true }
}

export async function getSharedCv(shareId: string) {
  const cv = await prisma.curriculumVitae.findFirst({
    where: { shareId, shared: true },
    include: cvInclude,
  })
  if (!cv) return { error: "Not found" }
  return { data: JSON.parse(JSON.stringify(cv)) }
}

export async function incrementCvViews(id: string) {
  await prisma.curriculumVitae.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  })
  return { success: true }
}

export async function incrementCvDownloads(id: string) {
  await prisma.curriculumVitae.update({
    where: { id },
    data: { downloadCount: { increment: 1 } },
  })
  return { success: true }
}

export async function reorderSections(
  cvId: string,
  orderedIds: string[],
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const cv = await prisma.curriculumVitae.findFirst({ where: { id: cvId, userId: session.user.id } })
  if (!cv) return { error: "Not found" }

  for (let i = 0; i < orderedIds.length; i++) {
    await prisma.curriculumVitaeSection.update({
      where: { id: orderedIds[i], curriculumVitaeId: cvId },
      data: { order: i },
    })
  }

  return { success: true }
}

export async function deleteSection(cvId: string, sectionId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: "Unauthorized" }

  const cv = await prisma.curriculumVitae.findFirst({ where: { id: cvId, userId: session.user.id } })
  if (!cv) return { error: "Not found" }

  await prisma.curriculumVitaeSection.delete({ where: { id: sectionId, curriculumVitaeId: cvId } })

  return { success: true }
}