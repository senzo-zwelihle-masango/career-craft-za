import type { CoverLetterTemplateData } from "@/components/editor/cover-letter/templates/types"

export function createDummyCoverLetter(
  templateId: string,
): CoverLetterTemplateData {
  const templates: Record<string, Partial<CoverLetterTemplateData>> = {
    classic: { accentColor: "#1e40af" },
    modern: { accentColor: "#0f766e" },
    minimal: { accentColor: "#6b7280" },
    executive: { accentColor: "#7c2d12" },
    editorial: { accentColor: "#b91c1c" },
    compact: { accentColor: "#1e3a5f" },
  }

  return {
    fullName: "Thandiwe Mokoena",
    professionalTitle: "Senior Product Designer",
    email: "thandiwe.mokoena@example.co.za",
    phone: "+27 82 123 4567",
    location: "Johannesburg, Gauteng",
    date: "15 June 2026",
    recipientName: "Ms N. Naidoo",
    companyName: "Innovation Labs SA",
    body: `I am writing to express my strong interest in the Senior Product Designer position at Innovation Labs SA. With over eight years of experience crafting user-centred digital experiences across fintech, e-commerce, and health-tech sectors, I am confident in my ability to drive meaningful impact within your team.

At my current role as Lead Product Designer at FinTech Solutions, I spearheaded the redesign of our mobile banking platform, resulting in a 40% improvement in user task completion rates and a 25% reduction in support tickets. I thrive in collaborative environments where design thinking meets business strategy.

I would welcome the opportunity to discuss how my background aligns with the goals of Innovation Labs SA. Thank you for your time and consideration.`,
    fontFamily: "serif",
    ...templates[templateId],
  }
}
