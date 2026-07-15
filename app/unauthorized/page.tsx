import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Shield01Icon } from "@hugeicons/core-free-icons"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Container } from "@/components/ui/container"

export default async function UnauthorizedPage(props: {
  searchParams?: Promise<{ reason?: string }>
}) {
  const searchParams = await props.searchParams
  const isBanned = searchParams?.reason === "banned"

  return (
    <Container
      size={"2xl"}
      alignment={"center"}
      height={"full"}
      padding={"none"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      centered
      id="unauthorized"
    >
      <Empty>
        <EmptyHeader>
          {isBanned && (
            <HugeiconsIcon
              icon={Shield01Icon}
              className="mx-auto mb-2 size-12 text-destructive"
            />
          )}
          <EmptyTitle>
            {isBanned ? "Account Suspended" : "401 - Unauthorized"}
          </EmptyTitle>
          <EmptyDescription>
            {isBanned
              ? "Your account has been suspended. You no longer have access to this application."
              : "You have attempted to access a page for which you are not authorized."}
          </EmptyDescription>
        </EmptyHeader>
        {isBanned && (
          <EmptyContent>
            <EmptyDescription>
              If you believe this is a mistake, please{" "}
              <a
                href="mailto:support@careercraftza.com"
                className="text-primary hover:underline"
              >
                contact support
              </a>
              .
            </EmptyDescription>
          </EmptyContent>
        )}
        {!isBanned && (
          <EmptyContent>
            <InputGroup className="sm:w-3/4">
              <InputGroupInput placeholder="Try searching for pages..." />
              <InputGroupAddon>
                <HugeiconsIcon icon={Search01Icon} />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>/</Kbd>
              </InputGroupAddon>
            </InputGroup>
            <EmptyDescription>
              Need help?{" "}
              <a href="mailto:support@careercraftza.com">Contact support</a>
            </EmptyDescription>
          </EmptyContent>
        )}
      </Empty>
    </Container>
  )
}
