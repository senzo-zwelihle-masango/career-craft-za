"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  getCoverLetter,
  updateCoverLetter,
  generateCoverLetter,
} from "@/lib/actions/cover-letter"
import { getCvs } from "@/lib/actions/curriculum-vitae"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/ui/date-picker"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { toast } from "sonner"

import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { CoverLetterPreview } from "@/components/cover-letter/cover-letter-preview"


export default function CoverLetterContentPage() {
  const params = useParams()
  const letterId = params.id as string
  const [form, setForm] = useState({
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    date: "",
    recipientName: "",
    companyName: "",
    body: "",
    cvId: "",
  })
  const [cvs, setCvs] = useState<{ id: string; title: string }[]>([])
  const [fontFamily, setFontFamily] = useState("serif")
  const [templateId, setTemplateId] = useState("classic")
  const [accentColor, setAccentColor] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    ;(async () => {
      const letterRes = await getCoverLetter(letterId)
      if (letterRes.data) {
        const data = letterRes.data
        setForm({
          fullName: data.fullName || "",
          professionalTitle: data.professionalTitle || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          date: data.date || "",
          recipientName: data.recipientName || "",
          companyName: data.companyName || "",
          body: data.body || "",
          cvId: data.curriculumVitaeId || "",
        })
        setFontFamily(data.fontFamily || "serif")
        setTemplateId(data.templateId || "classic")
        setAccentColor(data.accentColor || null)
      }
    })()
    getCvs().then((res) => {
      if (res.data) setCvs(res.data)
    })
  }, [letterId])

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    saveField(field, value)
  }

  async function saveField(field: string, value: string) {
    const { error } = await updateCoverLetter(letterId, { [field]: value })
    if (error) toast.error("Failed to save")
  }

  async function handleGenerate() {
    if (!form.cvId) {
      toast.error("Please link a CV first")
      return
    }
    if (!form.companyName.trim()) {
      toast.error("Please enter a company name")
      return
    }
    setGenerating(true)
    const { data, error } = await generateCoverLetter(
      form.cvId,
      form.companyName.trim(),
      form.recipientName.trim()
    )
    if (data) {
      setForm((prev) => ({ ...prev, body: data }))
      await updateCoverLetter(letterId, { body: data })
      toast.success("Cover letter generated")
    } else {
      toast.error(error || "Generation failed")
    }
    setGenerating(false)
  }
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"none"}
      padding={"px-xs"}
      gap={"none"}
      flow={"none"}
      bleed={"none"}
      id="content"
      className="flex flex-col md:flex-row"
    >
      {/* form */}
      <div className="w-full overflow-y-auto border-b p-4 md:w-[480px] md:min-w-0 md:flex-shrink-0 md:border-r md:border-b-0 md:p-6">
        <div className="mx-auto max-w-xl space-y-5 md:max-w-none">
          {/* Personal details */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Your Details
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full name</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Professional title</Label>
                  <Input
                    value={form.professionalTitle}
                    onChange={(e) =>
                      updateField("professionalTitle", e.target.value)
                    }
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="john@example.com"
                  type="email"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+27 82 123 4567"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Cape Town, South Africa"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Date</Label>
                <DatePicker
                  value={form.date}
                  onChange={(v) => updateField("date", v)}
                  placeholder={new Date().toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Recipient */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Recipient
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Recipient name</Label>
                  <Input
                    value={form.recipientName}
                    onChange={(e) =>
                      updateField("recipientName", e.target.value)
                    }
                    placeholder="Hiring Manager"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Company name</Label>
                  <Input
                    value={form.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Link to CV (optional)</Label>
                <Select
                  value={form.cvId}
                  onValueChange={(v) => updateField("cvId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a CV" />
                  </SelectTrigger>
                  <SelectContent>
                    {cvs.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Body</Label>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="animate-spin"
                  />
                ) : (
                  <HugeiconsIcon icon={SparklesIcon} />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              value={form.body}
              onChange={(e) => updateField("body", e.target.value)}
              placeholder="Dear Hiring Manager,..."
              className="min-h-[350px] text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* preview panel */}
      <div className="hidden flex-1 overflow-y-auto p-4 md:flex lg:p-6">
        <div className="mx-auto w-full max-w-[210mm]">
          <CoverLetterPreview
            fullName={form.fullName}
            professionalTitle={form.professionalTitle}
            email={form.email}
            phone={form.phone}
            location={form.location}
            date={form.date}
            recipientName={form.recipientName}
            companyName={form.companyName}
            body={form.body}
            fontFamily={fontFamily}
            templateId={templateId}
            accentColor={accentColor}
          />
        </div>
      </div>
    </Container>
  )
}
