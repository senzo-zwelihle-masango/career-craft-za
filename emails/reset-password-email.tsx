import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
} from "react-email"

interface ResetPasswordEmailProps {
  name?: string
  url?: string
}

export default function ResetPasswordEmail({
  name = "there",
  url = "https://careercraft.co.za",
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={heading}>Reset your password</Heading>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Someone requested a password reset for your Career Craft account.
              If this was you, click the button below to set a new password.
            </Text>
            <Button href={url} style={button}>
              Reset Password
            </Button>
            <Text style={text}>
              If you didn&apos;t request this, you can safely ignore this email.
              This link expires in 1 hour.
            </Text>
            <Text style={footer}>
              Career Craft ZA
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
}

const section = {
  textAlign: "center" as const,
}

const heading = {
  fontSize: "28px",
  fontWeight: "600",
  lineHeight: "1.3",
  color: "#1a1a2e",
}

const text = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#4a4a6a",
  textAlign: "left" as const,
}

const button = {
  backgroundColor: "#1a1a2e",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "50px",
  textDecoration: "none",
  textAlign: "center" as const,
  marginTop: "24px",
  marginBottom: "24px",
  paddingTop: "12px",
  paddingBottom: "12px",
  paddingLeft: "32px",
  paddingRight: "32px",
  display: "inline-block",
}

const footer = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#6b7280",
  marginTop: "32px",
  textAlign: "center" as const,
}
