import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const steps = [
  {
    number: "01",
    title: "Create a CV",
    body: "Go to CVs and click Create. Pick a template, fill in your details, and customise the colours and fonts. Your CV saves automatically as you work.",
  },
  {
    number: "02",
    title: "Write a Cover Letter",
    body: "Open the cover letters section and create a new one. Link it to your CV so the design stays consistent. Edit the content on one side and preview it on the other.",
  },
  {
    number: "03",
    title: "Track Applications",
    body: "Add jobs to the application tracker as you find them. Move them through stages – Wishlist, Applied, Interviewing, Offer, Rejected – and log interviews, contacts, and notes.",
  },
  {
    number: "04",
    title: "Use AI Tools",
    body: "Open your CV and select AI Tools. Choose from Improve Bullet, Generate Summary, Suggest Skills, Grammar Check, or ATS Score. Each suggestion uses one AI credit.",
  },
  {
    number: "05",
    title: "Manage Settings",
    body: "Update your profile, change your password, check your plan limits, and manage organisations from the Settings page.",
  },
]

export default function GettingStartedPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>
          Follow these steps to start using Career Craft
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {step.number}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
