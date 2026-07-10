"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getAdminId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== "admin") return null
  return session.user.id
}

export async function getAllReports() {
  const adminId = await getAdminId()
  if (!adminId) return { error: "Unauthorized" }

  const reports = await prisma.communityReport.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true } },
      post: {
        select: { id: true, title: true, userId: true, user: { select: { id: true, name: true } } },
      },
      comment: {
        select: {
          id: true, body: true, userId: true,
          user: { select: { id: true, name: true } },
          post: { select: { id: true, title: true } },
        },
      },
    },
  })

  return { data: JSON.parse(JSON.stringify(reports)) }
}

export async function resolveReport(reportId: string) {
  const adminId = await getAdminId()
  if (!adminId) return { error: "Unauthorized" }

  await prisma.communityReport.update({
    where: { id: reportId },
    data: { resolved: true },
  })

  revalidatePath("/admin/community-reports")
  return { data: true }
}

export async function dismissReportsForContent(postId?: string, commentId?: string) {
  const adminId = await getAdminId()
  if (!adminId) return { error: "Unauthorized" }
  if (!postId && !commentId) return { error: "Missing target" }

  await prisma.communityReport.updateMany({
    where: {
      resolved: false,
      postId: postId ?? null,
      commentId: commentId ?? null,
    },
    data: { resolved: true },
  })

  revalidatePath("/admin/community-reports")
  return { data: true }
}

export async function adminDeletePost(postId: string) {
  const adminId = await getAdminId()
  if (!adminId) return { error: "Unauthorized" }

  await prisma.communityPost.delete({ where: { id: postId } })
  await dismissReportsForContent(postId)

  revalidatePath("/admin/community-reports")
  revalidatePath("/community")
  return { data: true }
}

export async function adminDeleteComment(commentId: string) {
  const adminId = await getAdminId()
  if (!adminId) return { error: "Unauthorized" }

  await prisma.communityComment.delete({ where: { id: commentId } })
  await dismissReportsForContent(undefined, commentId)

  revalidatePath("/admin/community-reports")
  return { data: true }
}
