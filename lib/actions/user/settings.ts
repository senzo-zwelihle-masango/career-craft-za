"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"
import { ApiResponse } from "@/types/api/response"

export async function updateProfileAction(data: {
  name: string
  image?: string | null
}): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { status: "error", message: "Unauthorized" }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: data.name, image: data.image ?? null },
    })
    return { status: "success", message: "Profile updated" }
  } catch {
    return { status: "error", message: "Failed to update profile" }
  }
}

export async function changePasswordAction(data: {
  currentPassword: string
  newPassword: string
}): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { status: "error", message: "Unauthorized" }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
    })
    return { status: "success", message: "Password changed" }
  } catch {
    return {
      status: "error",
      message: "Failed to change password. Check your current password.",
    }
  }
}

export async function deleteAccountAction(): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { status: "error", message: "Unauthorized" }

  try {
    await prisma.user.delete({ where: { id: session.user.id } })
    return { status: "success", message: "Account deleted" }
  } catch {
    return { status: "error", message: "Failed to delete account" }
  }
}

export async function getSettingsPageData() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { error: "Unauthorized" }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      plan: true,
      aiCredits: true,
      twoFactorEnabled: true,
      createdAt: true,
      _count: {
        select: {
          curriculumVitaes: true,
          coverLetters: true,
          applications: true,
        },
      },
    },
  })

  return { data: JSON.parse(JSON.stringify(user)) }
}
