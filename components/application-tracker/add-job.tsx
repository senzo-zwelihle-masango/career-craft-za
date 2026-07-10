"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "sonner"
import {
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODEL_LABELS,
  STATUS_CONFIG,
  SALARY_PERIOD_LABELS,
} from "@/lib/data/application-tracker/data"

interface ListItem {
  id: string
  title: string
}

interface Props {
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  resumes: ListItem[]
  coverLetters: ListItem[]
  onClose?: () => void
  initial?: Record<string, unknown>
}

const AddJob = ({
  onSubmit,
  resumes,
  coverLetters,
  onClose,
  initial,
}: Props) => {
  const [title, setTitle] = useState((initial?.title as string) || "")
  const [company, setCompany] = useState((initial?.company as string) || "")
  const [location, setLocation] = useState((initial?.location as string) || "")
  const [salaryMin, setSalaryMin] = useState(
    (initial?.salaryMin as string)?.toString() || ""
  )
  const [salaryMax, setSalaryMax] = useState(
    (initial?.salaryMax as string)?.toString() || ""
  )
  const [salaryCurrency, setSalaryCurrency] = useState(
    (initial?.salaryCurrency as string) || "ZAR"
  )
  const [salaryPeriod, setSalaryPeriod] = useState(
    (initial?.salaryPeriod as string) || ""
  )
  const [jobUrl, setJobUrl] = useState((initial?.jobUrl as string) || "")
  const [employmentType, setEmploymentType] = useState(
    (initial?.employmentType as string) || ""
  )
  const [workModel, setWorkModel] = useState(
    (initial?.workModel as string) || ""
  )
  const [source, setSource] = useState((initial?.source as string) || "")
  const [skillsStr, setSkillsStr] = useState(
    ((initial?.skills as string[]) || [])?.join(", ") || ""
  )
  const [notes, setNotes] = useState((initial?.notes as string) || "")
  const [cvId, setResumeId] = useState((initial?.resumeId as string) || "")
  const [coverLetterId, setCoverLetterId] = useState(
    (initial?.coverLetterId as string) || ""
  )
  const [status, setStatus] = useState(
    (initial?.status as string) || "WISHLIST"
  )
  const [appliedAt, setAppliedAt] = useState(
    initial?.appliedAt ? (initial.appliedAt as string).split("T")[0] : ""
  )
  const [followUpAt, setFollowUpAt] = useState(
    initial?.followUpAt ? (initial.followUpAt as string).split("T")[0] : ""
  )
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !company.trim()) {
      toast.error("Title and company are required")
      return
    }
    setSubmitting(true)
    await onSubmit({
      title: title.trim(),
      company: company.trim(),
      location: location.trim() || null,
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      salaryMax: salaryMax ? parseInt(salaryMax) : null,
      salaryCurrency,
      salaryPeriod: salaryPeriod || null,
      jobUrl: jobUrl.trim() || null,
      employmentType: employmentType || null,
      workModel: workModel || null,
      source: source.trim() || null,
      skills: skillsStr
        ? skillsStr
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      notes: notes.trim() || null,
      curriculumVitaeId: cvId || null,
      coverLetterId: coverLetterId || null,
      status,
      appliedAt: appliedAt || null,
      followUpAt: followUpAt || null,
    })
    setSubmitting(false)
    if (!initial) {
      setTitle("")
      setCompany("")
      setLocation("")
      setSalaryMin("")
      setSalaryMax("")
      setJobUrl("")
      setEmploymentType("")
      setWorkModel("")
      setSource("")
      setSkillsStr("")
      setNotes("")
      setResumeId("")
      setCoverLetterId("")
      setStatus("WISHLIST")
      setAppliedAt("")
      setFollowUpAt("")
      setSalaryPeriod("")
    }
    onClose?.()
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-sm font-medium">
            Job title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Frontend Engineer"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-sm font-medium">
            Company
          </Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Acme Inc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="employmentType" className="text-sm font-medium">
            Employment type
          </Label>
          <Select
            value={employmentType}
            onValueChange={(v) => v != null && setEmploymentType(v)}
          >
            <SelectTrigger id="employmentType">
              <span className="flex flex-1 text-left">
                {EMPLOYMENT_TYPE_LABELS[employmentType] || "None"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([k, l]) => (
                <SelectItem key={k} value={k}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="workModel" className="text-sm font-medium">
            Work model
          </Label>
          <Select
            value={workModel}
            onValueChange={(v) => v != null && setWorkModel(v)}
          >
            <SelectTrigger id="workModel">
              <span className="flex flex-1 text-left">
                {WORK_MODEL_LABELS[workModel] || "None"}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {Object.entries(WORK_MODEL_LABELS).map(([k, l]) => (
                <SelectItem key={k} value={k}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Remote, SF"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="source" className="text-sm font-medium">
            Source
          </Label>
          <Input
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="LinkedIn, Indeed, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="salaryMin" className="text-sm font-medium">
            Salary min
          </Label>
          <Input
            id="salaryMin"
            type="number"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="salaryMax" className="text-sm font-medium">
            Salary max
          </Label>
          <Input
            id="salaryMax"
            type="number"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="salaryCurrency" className="text-sm font-medium">
            Currency
          </Label>
          <Input
            id="salaryCurrency"
            value={salaryCurrency}
            onChange={(e) => setSalaryCurrency(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="salaryPeriod" className="text-sm font-medium">
            Period
          </Label>
          <Select value={salaryPeriod} onValueChange={(v) => v != null && setSalaryPeriod(v)}>
            <SelectTrigger id="salaryPeriod" className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SALARY_PERIOD_LABELS).map(([k, l]) => (
                <SelectItem key={k} value={k}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="jobUrl" className="text-sm font-medium">
            Job URL
          </Label>
          <Input
            id="jobUrl"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="skills" className="text-sm font-medium">
            Skills (comma-separated)
          </Label>
          <Input
            id="skills"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="React, TypeScript"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="appliedAt" className="text-sm font-medium">
            Applied date
          </Label>
          <DatePicker
            value={appliedAt}
            onChange={setAppliedAt}
            placeholder="Select date"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="followUpAt" className="text-sm font-medium">
            Follow-up date
          </Label>
          <DatePicker
            value={followUpAt}
            onChange={setFollowUpAt}
            placeholder="Select date"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="resumeId" className="text-sm font-medium">
            Linked CV
          </Label>
          <Select
            value={cvId}
            onValueChange={(v) => v != null && setResumeId(v)}
          >
            <SelectTrigger id="resumeId">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {resumes.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coverLetterId" className="text-sm font-medium">
            Linked cover letter
          </Label>
          <Select
            value={coverLetterId}
            onValueChange={(v) => v != null && setCoverLetterId(v)}
          >
            <SelectTrigger id="coverLetterId">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {coverLetters.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status" className="text-sm font-medium">
          Status
        </Label>
        <Select value={status} onValueChange={(v) => v != null && setStatus(v)}>
          <SelectTrigger id="status">
            <span className="flex flex-1 text-left">
              {(
                STATUS_CONFIG as Record<
                  string,
                  { label: string }
                >
              )[status]?.label || status}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WISHLIST">Wishlist</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
            <SelectItem value="OFFER">Offer</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : initial
              ? "Save changes"
              : "Add application"}
        </Button>
      </div>
    </form>
  )
}

export default AddJob
