"use server"

import prisma from "@/lib/prisma/db"
import { PLAN_CREDITS } from "@/lib/data/user/plans"

export async function checkCredits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, aiCredits: true, role: true },
  })
  if (!user) return { error: "User not found", ok: false as const }

  if (user.role === "admin") {
    return {
      ok: true as const,
      aiCredits: user.aiCredits,
      plan: user.plan,
      role: user.role,
    }
  }

  if (user.aiCredits <= 0) {
    return {
      error: "Out of AI credits. Upgrade your plan to get more.",
      ok: false as const,
    }
  }

  return {
    ok: true as const,
    aiCredits: user.aiCredits,
    plan: user.plan,
    role: user.role,
  }
}

export async function deductCredit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiCredits: true, role: true },
  })
  if (!user || user.role === "admin") return

  await prisma.user.update({
    where: { id: userId },
    data: { aiCredits: { decrement: 1 } },
  })
}

export async function deductCreditAndReturnBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiCredits: true, role: true },
  })
  if (!user || user.role === "admin") return undefined

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { aiCredits: { decrement: 1 } },
    select: { aiCredits: true },
  })
  return updated.aiCredits
}

export async function getUserCredits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, aiCredits: true },
  })
  if (!user) return { error: "User not found" }
  const maxCredits = PLAN_CREDITS[user.plan] ?? 0
  return {
    data: {
      plan: user.plan,
      aiCredits: user.aiCredits,
      maxCredits,
    },
  }
}
