"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon, Logout01Icon } from "@hugeicons/core-free-icons"
import { UploadButton } from "@/utils/upload/uploadthing"
import { Spinner } from "@/components/ui/spinner"
import {
  updateProfileAction,
  changePasswordAction,
  deleteAccountAction,
  getSettingsPageData,
} from "@/lib/actions/user/settings"
import { useRouter } from "next/navigation"

export default function GeneralPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)

  useEffect(() => {
    getSettingsPageData().then((res) => {
      if (res.data) {
        setName(res.data.name || "")
        setEmail(res.data.email || "")
        setImage(res.data.image || "")
        setEmailVerified(res.data.emailVerified || false)
      }
      setLoading(false)
    })
  }, [])

  async function handleSaveProfile() {
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }
    setSaving(true)
    const res = await updateProfileAction({ name, image })
    if (res.status === "success") {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
    setSaving(false)
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Fill in all password fields")
      return
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setChangingPassword(true)
    const res = await changePasswordAction({ currentPassword, newPassword })
    if (res.status === "success") {
      toast.success(res.message)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      toast.error(res.message)
    }
    setChangingPassword(false)
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    const res = await deleteAccountAction()
    if (res.status === "success") {
      toast.success(res.message)
      router.push("/")
      router.refresh()
    } else {
      toast.error(res.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your name and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarImage
                src={image || `https://avatar.vercel.sh/${email}`}
                alt={name}
              />
              <AvatarFallback>
                {(name || email).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{name || "User"}</p>
              <p className="text-muted-foreground">{email}</p>
              {emailVerified && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Email verified
                </p>
              )}
            </div>
          </div>
          <Field orientation="horizontal">
            <FieldLabel className="w-28">Name</FieldLabel>
            <FieldContent>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9"
              />
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel className="w-28">Photo</FieldLabel>
            <FieldContent>
              <div className="flex flex-wrap items-center gap-3">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.ufsUrl ?? res?.[0]?.url
                    if (url) {
                      setImage(url)
                      toast.success("Photo uploaded")
                    }
                  }}
                  onUploadError={(error) => {
                    toast.error(error.message || "Failed to upload photo")
                  }}
                  className="ut-button:rounded-full ut-button:bg-primary ut-button:text-primary-foreground ut-button:text-xs ut-button:font-medium ut-button:h-8 ut-allowed-content:text-muted-foreground ut-allowed-content:text-xs"
                />
                {image && (
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {image.split("/").pop()}
                  </span>
                )}
              </div>
            </FieldContent>
          </Field>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              size="sm"
              className="h-8"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field orientation="horizontal">
            <FieldLabel className="w-28">Current</FieldLabel>
            <FieldContent>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-9"
              />
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel className="w-28">New</FieldLabel>
            <FieldContent>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-9"
              />
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel className="w-28">Confirm</FieldLabel>
            <FieldContent>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9"
              />
            </FieldContent>
          </Field>
          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword}
              size="sm"
              className="h-8"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="sm" className="h-8" />
              }
            >
              <HugeiconsIcon icon={Logout01Icon} />
              Delete Account
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <HugeiconsIcon icon={AlertCircleIcon} />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all associated
                  data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  variant="destructive"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
