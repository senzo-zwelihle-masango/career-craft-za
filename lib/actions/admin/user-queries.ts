import { unstable_noStore as noStore } from "next/cache"
import prisma from "@/lib/prisma/db"

export async function fetchAllUsers() {
  noStore()
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      banned: true,
      banReason: true,
      banExpires: true,
      plan: true,
      aiCredits: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          curriculumVitaes: true,
          coverLetters: true,
        },
      },
    },
  })
  return users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    banExpires: u.banExpires?.toISOString() ?? null,
    plan: u.plan,
  }))
}

export async function getUserById(id: string) {
  noStore()
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      banned: true,
      banReason: true,
      banExpires: true,
      plan: true,
      aiCredits: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          sessions: true,
          accounts: true,
          reviews: true,
        },
      },
    },
  })
  if (!user) return null
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    banExpires: user.banExpires?.toISOString() ?? null,
  }
}
