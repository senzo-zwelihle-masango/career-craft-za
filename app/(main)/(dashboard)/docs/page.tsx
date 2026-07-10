import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File01Icon,
  File02Icon,
  BriefcaseIcon,
  BrainIcon,
  Settings01Icon,
  ColorsIcon,
} from "@hugeicons/core-free-icons"

const features = [
  {
    title: "CV Builder",
    description:
      "Create professional resumes with customizable templates. Choose from multiple layouts, adjust colors and fonts, and export polished CVs.",
    icon: File01Icon,
  },
  {
    title: "Cover Letters",
    description:
      "Write tailored cover letters using templates that match your CV. Edit content and customize the design side by side.",
    icon: File02Icon,
  },
  {
    title: "Application Tracker",
    description:
      "Track job applications from wishlist to offer. Organize with a kanban board or table view, log interviews, and monitor your pipeline.",
    icon: BriefcaseIcon,
  },
  {
    title: "AI Tools",
    description:
      "Enhance your content with AI-powered suggestions – improve bullet points, generate summaries, check grammar, and get ATS scores.",
    icon: BrainIcon,
  },
]

const sections = [
  {
    title: "Templates",
    description:
      "Each feature comes with professionally designed templates. CVs and cover letters offer multiple layouts with customizable accent colors and fonts. The application tracker works in both table and kanban views.",
    icon: ColorsIcon,
  },
  {
    title: "Customization",
    description:
      "Personalise every aspect of your documents. Change colors, pick fonts, adjust layouts, and see changes in real time with the split-panel preview.",
    icon: Settings01Icon,
  },
]

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>What is Career Craft?</CardTitle>
          <CardDescription>
            Everything you need to manage your job search in one place
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Career Craft helps you build professional CVs, write cover letters,
            track job applications, and improve your content with AI – all from
            a single dashboard.
          </p>
          <p>
            Start by creating a CV from one of the available templates, then use
            it as the foundation for tailored cover letters. Track every
            application from wishlist to offer, and use AI tools to polish your
            content along the way.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>An overview of what you can do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <HugeiconsIcon
                    icon={feature.icon}
                    className="size-4 text-primary"
                  />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Concepts</CardTitle>
          <CardDescription>Understanding how things work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((section) => (
              <div key={section.title} className="rounded-3xl border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <HugeiconsIcon
                    icon={section.icon}
                    className="size-4 text-primary"
                  />
                  <span className="text-sm font-medium">{section.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
