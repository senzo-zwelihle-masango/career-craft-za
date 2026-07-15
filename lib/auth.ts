import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { twoFactor } from "better-auth/plugins"
import { passkey } from "@better-auth/passkey"
import { admin } from "better-auth/plugins"
import { organization } from "better-auth/plugins"
import { lastLoginMethod } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"
import { ac, roles } from "@/utils/auth/permissions"
import prisma from "@/lib/prisma/db"
import { env } from "@/env/server"
import { createElement } from "react"
import { render } from "react-email"
import ResetPasswordEmail from "@/emails/reset-password-email"
import { resend } from "@/lib/email/resend"

export const auth = betterAuth({
  // database
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  // app name
  appName: "Career Craft",

  // basic authentication
  emailAndPassword: {
    enabled: true,
    sendOnSignUp: false,
    requireEmailVerification: false,

    sendResetPassword: async ({ user, url }) => {
      const html = await render(
        createElement(ResetPasswordEmail, { name: user.name, url })
      )
      const { error } = await resend.emails.send({
        from: "Career Craft <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        html,
      })
      if (error) {
        console.error("Failed to send reset password email", error)
        throw new Error("Failed to send reset password email")
      }
    },
  },

  // email verification

  // rate limit
  rateLimit: {
    enabled: true,
    window: 10,
    max: 10,
    customRules: {
      "/get-session": {
        window: 10,
        max: 30,
      },
      "*/get-session": {
        window: 10,
        max: 30,
      },
    },
  },

  // session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  // social providers
  socialProviders: {
    github: {
      prompt: "select_account",
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
    microsoft: {
      clientId: env.MICROSOFT_CLIENT_ID as string,
      clientSecret: env.MICROSOFT_CLIENT_SECRET as string,
      // Optional
      tenantId: "common",
      authority: "https://login.microsoftonline.com", // Authentication authority URL
      prompt: "select_account", // Forces account selection
    },
  },

  // plugins
  plugins: [
    twoFactor(),
    passkey(),
    admin({
      ac,
      roles,
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    organization(),
    lastLoginMethod(),
    nextCookies(),
  ],

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const { PLAN_CREDITS } = await import("@/lib/data/user/plans")
          const credits = PLAN_CREDITS.FREE ?? 10
          await prisma.user.update({
            where: { id: user.id },
            data: { aiCredits: credits },
          })
        },
      },
    },
  },
})
