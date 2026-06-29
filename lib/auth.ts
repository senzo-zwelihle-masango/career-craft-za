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

    // reset password email
  },

  // email verification

  // rate limit
  rateLimit: {
    enabled: true,
    window: 10, // time window in seconds
    max: 2, // max requests in the window
    //...other options
  },

  // session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
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
})
