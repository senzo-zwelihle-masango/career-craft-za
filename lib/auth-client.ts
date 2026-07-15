import { createAuthClient } from "better-auth/react"
import { twoFactorClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"
import { adminClient } from "better-auth/client/plugins"
import { organizationClient } from "better-auth/client/plugins"
import { lastLoginMethodClient } from "better-auth/client/plugins"
import { ac, roles } from "@/utils/auth/permissions"

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    twoFactorClient(),
    passkeyClient(),
    adminClient({
      ac,
      roles,
    }),
    organizationClient(),
    lastLoginMethodClient(),
  ],
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
})
