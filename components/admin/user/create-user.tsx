"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { toast } from "sonner"

import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

import { tryCatch } from "@/hooks/use-try-catch"

import { createUserSchema, CreateUserSchemaType } from "@/schemas/admin/user"

import { PhoneInput } from "@/components/ui/phone-input"
import Image from "next/image"
import { UploadDropzone } from "@/utils/upload/uploadthing"
import { Role } from "@/lib/generated/prisma/enums"
import { createUserAction } from "@/lib/actions/admin/user"

const CreateUserForm = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<CreateUserSchemaType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      image: "",
    },
  })

  function onSubmit(values: CreateUserSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createUserAction(values))

      if (error) {
        toast.error("Unexpected error occurred. please try again")
        return
      }

      if (result.status === "success") {
        toast.success(result.message)
        form.reset()
        router.push("/admin/users")
      } else if (result.status === "error") {
        toast.error(result.message)
      }
    })
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-user-name">Name</FieldLabel>
              <Input
                {...field}
                id="create-user-name"
                aria-invalid={fieldState.invalid}
                placeholder="jane doe"
              />
              <FieldDescription>
                This is the public display name.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-user-email">Email</FieldLabel>
              <Input
                {...field}
                id="create-user-email"
                aria-invalid={fieldState.invalid}
                placeholder="janedoe@example.com"
              />
              <FieldDescription>This is the public email.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>User Role</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Image</FieldLabel>
              <div>
                {field.value ? (
                  <div className="relative w-fit">
                    <Image
                      src={field.value}
                      alt="user image"
                      width={200}
                      height={200}
                      quality={95}
                      className="rounded-md border object-cover"
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full"
                      onClick={() => field.onChange("")}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} />
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0].ufsUrl)
                      toast.success("Image uploaded successfully!")
                    }}
                    onUploadError={() => {
                      toast.error("Something went wrong. Please try again.")
                    }}
                    className="mt-4 ut-button:rounded-full ut-button:bg-primary ut-allowed-content:text-muted-foreground"
                  />
                )}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Please wait...
              <Spinner />
            </>
          ) : (
            <>
              <HugeiconsIcon icon={PlusSignIcon} />
              Create User
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default CreateUserForm
