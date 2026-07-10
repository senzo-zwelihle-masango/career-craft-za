"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma/db"

import { ApiResponse } from "@/types/api/response"

import {
  createUserSchema,
  CreateUserSchemaType,
  editUserSchema,
  EditUserSchemaType,
} from "@/schemas/admin/user"

export async function createUserAction(
  values: CreateUserSchemaType
): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  if (session.user.role !== "admin") {
    redirect("/unauthorized")
  }

  //   mutation
  try {
    // schema validation
    const validation = createUserSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      }
    }

    // mutation
    const newUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        ...validation.data,
        aiCredits: 10,
      },
    })

    return {
      status: "success",
      message: "User Created Successfully",
    }
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create new user, please try again.",
    }
  }
}

export async function updateUserAction(
  data: EditUserSchemaType,
  userId: string
): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  if (session.user.role !== "admin") {
    redirect("/unauthorized")
  }

  try {
    // schema validation
    const result = editUserSchema.safeParse(data)

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid form data",
      }
    }

    // mutation
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...result.data,
      },
    })

    return {
      status: "success",
      message: "User Updated Successfully",
    }
  } catch (error) {
    return {
      status: "error",
      message: "Failed to update user, please try again.",
    }
  }
}
