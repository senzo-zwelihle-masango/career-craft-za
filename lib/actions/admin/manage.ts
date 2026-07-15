"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"

import { ApiResponse } from "@/types/api/response"

import { banUserSchema, BanUserSchemaType } from "@/schemas/admin/ban"

// Ban user
export async function banUserAction(
  userId: string,
  values: BanUserSchemaType
): Promise<ApiResponse> {
  try {
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return { status: "error", message: "Unauthorized" }
    }

    const validation = banUserSchema.safeParse(values)
    if (!validation.success) {
      return { status: "error", message: "Invalid form data" }
    }

    // Use Better Auth's native banUser API which sets banned flag,
    // stores ban reason/expiry, and deletes all user sessions
    await auth.api.banUser({
      headers: await headers(),
      body: {
        userId,
        banReason: validation.data.banReason,
        banExpiresIn: validation.data.banExpires
          ? Math.floor(
              (validation.data.banExpires.getTime() - Date.now()) / 1000
            )
          : undefined,
      },
    })

    return { status: "success", message: "User banned successfully" }
  } catch {
    return { status: "error", message: "Failed to ban user" }
  }
}

// Unban user
export async function unbanUserAction(userId: string): Promise<ApiResponse> {
  try {
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return { status: "error", message: "Unauthorized" }
    }

    // Use Better Auth's native unbanUser API which clears the ban
    // and restores the user
    await auth.api.unbanUser({
      headers: await headers(),
      body: { userId },
    })

    return { status: "success", message: "User unbanned successfully" }
  } catch {
    return { status: "error", message: "Failed to unban user" }
  }
}

// Delete user
export async function deleteUserAction(userId: string): Promise<ApiResponse> {
  try {
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return { status: "error", message: "Unauthorized" }
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    })

    return { status: "success", message: "User deleted successfully" }
  } catch {
    return { status: "error", message: "Failed to delete user" }
  }
}
