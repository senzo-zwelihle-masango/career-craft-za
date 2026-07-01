import { CvPreview } from "@/components/templates/cv-preview"
import { getSharedCv, incrementCvViews } from "@/lib/actions/curriculum-vitae"
import { notFound } from "next/navigation"

export default async function SharedCvPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params
  const result = await getSharedCv(shareId)
  if (!result.data) notFound()

  await incrementCvViews(result.data.id)

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto w-full max-w-[210mm] shadow-xl">
        <div className="relative w-full" style={{ paddingBottom: `${(297 / 210) * 100}%` }}>
          <div className="absolute inset-0 overflow-hidden bg-white">
            <CvPreview cv={result.data} />
          </div>
        </div>
      </div>
    </div>
  )
}
