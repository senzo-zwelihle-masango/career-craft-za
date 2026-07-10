"use server"

import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"

import { ApiResponse } from "@/types/api/response"

// Check and unban expired bans
export async function checkExpiredBansAction(): Promise<ApiResponse> {
  try {
    // Get session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    // Check if user is admin
    if (!session || session.user.role !== "admin") {
      return { status: "error", message: "Unauthorized" }
    }

    // Find users with expired bans
    const expiredBans = await prisma.user.findMany({
      where: {
        banned: true,
        banExpires: {
          not: null,
          lt: new Date(),
        },
      },
    })

    if (expiredBans.length === 0) {
      return { status: "success", message: "No expired bans found" }
    }

    // Unban users with expired bans
    const unbannedUsers = await Promise.all(
      expiredBans.map(async (user) => {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            banned: false,
            banReason: null,
            banExpires: null,
          },
        })

        return updatedUser
      })
    )

    return {
      status: "success",
      message: `Unbanned ${unbannedUsers.length} users with expired bans`,
    }
  } catch {
    return { status: "error", message: "Failed to check expired bans" }
  }
}
