"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Call02Icon,
  Camera01Icon,
  Cancel01Icon,
  Loading03Icon,
  Location01Icon,
  Mail01Icon,
  PencilEdit02Icon,
  Plus,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateCv } from "@/lib/actions/user/curriculum-vitae"
import { Separator } from "@/components/ui/separator"
import { PhoneInput } from "@/components/ui/phone-input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TipsDrawer } from "./content-tips-drawer"
import { linkTypeNames } from "./content-section-config"

const linkTypeOptions = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "figma", label: "Figma" },
  { value: "custom", label: "Custom" },
]

interface PersonalDetailsCardProps {
  cvId: string
  details: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    nationality: string
    photoUrl: string | null
    links: Array<{ type: string; url: string; label?: string }>
  }
  setDetails: (
    d:
      | {
          fullName: string
          jobTitle: string
          email: string
          phone: string
          location: string
          nationality: string
          photoUrl: string | null
          links: Array<{ type: string; url: string; label?: string }>
        }
      | ((prev: {
          fullName: string
          jobTitle: string
          email: string
          phone: string
          location: string
          nationality: string
          photoUrl: string | null
          links: Array<{ type: string; url: string; label?: string }>
        }) => {
          fullName: string
          jobTitle: string
          email: string
          phone: string
          location: string
          nationality: string
          photoUrl: string | null
          links: Array<{ type: string; url: string; label?: string }>
        })
  ) => void
  linkTypeNames: Record<string, string>
}

const ContentPersonalDetails = ({
  cvId,
  details,
  setDetails,
  linkTypeNames,
}: PersonalDetailsCardProps) => {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  async function saveDetails() {
    setSaving(true)
    const { error } = await updateCv(cvId, {
      personalDetails: { update: details },
    })
    setSaving(false)
    if (!error) {
      setEditing(false)
      toast.success("Personal details saved")
      router.refresh()
    } else {
      toast.error("Failed to save personal details")
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>
          <TipsDrawer sectionType="personal-details" side="right" />
        </CardDescription>
        <CardAction>
          {editing && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size={"icon-lg"}
                    variant="ghost"
                    onClick={() => setEditing(false)}
                  />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} />
              </TooltipTrigger>
              <TooltipContent>Cancel editing</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size={"icon-lg"}
                  onClick={() => {
                    if (editing) saveDetails()
                    else setEditing(true)
                  }}
                />
              }
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
            </TooltipTrigger>
            <TooltipContent>
              {editing ? "Save details" : "Edit details"}
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <Separator />
      {/* user details */}
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <div>
              {details.photoUrl ? (
                <img
                  src={details.photoUrl}
                  alt=""
                  className="h-20 w-20 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                  <HugeiconsIcon
                    icon={Camera01Icon}
                    className="h-6 w-6 text-muted-foreground/50"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Full Name</Label>
              <Input
                value={details.fullName}
                onChange={(e) =>
                  setDetails({ ...details, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Professional Title</Label>
              <Input
                value={details.jobTitle}
                onChange={(e) =>
                  setDetails({ ...details, jobTitle: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm">Email</Label>
                <Input
                  value={details.email}
                  onChange={(e) =>
                    setDetails({ ...details, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Phone</Label>
                <PhoneInput
                  value={details.phone}
                  onChange={(value) => setDetails({ ...details, phone: value })}
                  defaultCountry="ZA"
                  international
                  countryCallingCodeEditable={false}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Location</Label>
              <Input
                value={details.location}
                onChange={(e) =>
                  setDetails({ ...details, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Nationality</Label>
              <Input
                value={details.nationality}
                onChange={(e) =>
                  setDetails({ ...details, nationality: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm">Links</Label>
              <div className="space-y-3">
                {(Array.isArray(details.links) ? details.links : []).map(
                  (
                    link: { type: string; url: string; label?: string },
                    i: number
                  ) => (
                    <div key={i} className="space-y-2 rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <Select
                          value={link.type}
                          onValueChange={(v) => {
                            const newLinks = [
                              ...(Array.isArray(details.links)
                                ? details.links
                                : []),
                            ]
                            newLinks[i] = {
                              ...newLinks[i],
                              type: v ?? "custom",
                              label:
                                v !== "custom" ? undefined : newLinks[i].label,
                            }
                            setDetails({ ...details, links: newLinks })
                          }}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {linkTypeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [
                              ...(Array.isArray(details.links)
                                ? details.links
                                : []),
                            ]
                            newLinks[i] = {
                              ...newLinks[i],
                              url: e.target.value,
                            }
                            setDetails({ ...details, links: newLinks })
                          }}
                          placeholder="https://..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 shrink-0 text-destructive"
                          onClick={() => {
                            const newLinks = (
                              Array.isArray(details.links) ? details.links : []
                            ).filter((_: unknown, j: number) => j !== i)
                            setDetails({ ...details, links: newLinks })
                          }}
                        >
                          <HugeiconsIcon
                            icon={Cancel01Icon}
                            className="size-4"
                          />
                        </Button>
                      </div>
                      {link.type === "custom" && (
                        <Input
                          value={link.label || ""}
                          onChange={(e) => {
                            const newLinks = [
                              ...(Array.isArray(details.links)
                                ? details.links
                                : []),
                            ]
                            newLinks[i] = {
                              ...newLinks[i],
                              label: e.target.value,
                            }
                            setDetails({ ...details, links: newLinks })
                          }}
                          placeholder="e.g. Stack Overflow"
                          className="text-xs"
                        />
                      )}
                    </div>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newLinks = [
                    ...(Array.isArray(details.links) ? details.links : []),
                    { type: "linkedin", url: "" },
                  ]
                  setDetails({ ...details, links: newLinks })
                }}
              >
                <HugeiconsIcon icon={Plus} />
                Add link
              </Button>
            </div>

            <Button onClick={saveDetails} disabled={saving}>
              {saving && (
                <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
              )}
              Save Personal Details
            </Button>
          </>
        ) : (
          <div className="space-y-4 text-base">
            <div className="flex items-center gap-4">
              {details.photoUrl ? (
                <img
                  src={details.photoUrl}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                  <HugeiconsIcon
                    icon={Camera01Icon}
                    className="h-5 w-5 text-muted-foreground/40"
                  />
                </div>
              )}
              <div>
                <p className="text-lg font-semibold">
                  {details.fullName || "No name"}
                </p>
                <p className="text-muted-foreground">
                  {details.jobTitle || "No title"}
                </p>
              </div>
            </div>

            {details.email && (
              <p className="flex gap-x-2">
                <HugeiconsIcon icon={Mail01Icon} />

                {details.email}
              </p>
            )}
            {details.phone && (
              <p className="flex gap-x-2">
                <HugeiconsIcon icon={Call02Icon} />

                {details.phone}
              </p>
            )}
            {details.location && (
              <p className="flex gap-x-2">
                <HugeiconsIcon icon={Location01Icon} />

                {details.location}
              </p>
            )}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {details.links?.map(
                (
                  link: { type: string; url: string; label?: string },
                  i: number
                ) => (
                  <span key={i}>
                    {link.label || linkTypeNames[link.type] || link.type}
                  </span>
                )
              )}
              {details.nationality && <span>{details.nationality}</span>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ContentPersonalDetails
