import type { CoverLetterTemplateData } from "@/types/templates/types"

const a = (accent?: string | null) => accent || "#1f2937"

export function MinimalCoverLetter({
  data,
}: {
  data: CoverLetterTemplateData
}) {
  const accent = a(data.accentColor)
  return (
    <div className="min-h-full bg-white p-8 text-black md:p-10 lg:p-12">
      {data.fullName && (
        <h1
          className="text-base font-medium tracking-wide"
          style={{ color: accent }}
        >
          {data.fullName}
        </h1>
      )}
      {data.professionalTitle && (
        <p
          className="mt-0.5 text-xs tracking-widest uppercase"
          style={{ color: `${accent}99` }}
        >
          {data.professionalTitle}
        </p>
      )}

      {(data.email || data.phone || data.location) && (
        <div className="mt-2 text-xs" style={{ color: `${accent}80` }}>
          {[data.email, data.phone, data.location]
            .filter(Boolean)
            .join("  ·  ")}
        </div>
      )}

      <div className="mt-4 border-b" style={{ borderColor: `${accent}15` }} />

      {data.date && (
        <div className="mt-4 text-xs" style={{ color: `${accent}99` }}>
          {data.date}
        </div>
      )}

      {(data.recipientName || data.companyName) && (
        <div className="mt-5 text-sm">
          {data.recipientName && <p>{data.recipientName}</p>}
          {data.companyName && <p>{data.companyName}</p>}
        </div>
      )}

      {data.recipientName && (
        <p className="mt-4 text-sm">Dear {data.recipientName},</p>
      )}

      {data.body ? (
        <div className="mt-4 flex-1 text-sm leading-relaxed whitespace-pre-line text-gray-700">
          {data.body}
        </div>
      ) : (
        <div
          className="mt-4 flex-1 text-sm italic"
          style={{ color: `${accent}30` }}
        >
          Your cover letter will appear here...
        </div>
      )}

      {data.fullName && (
        <div className="mt-8 text-sm">
          <p>Best regards,</p>
          <p className="mt-1 font-semibold" style={{ color: accent }}>
            {data.fullName}
          </p>
        </div>
      )}
    </div>
  )
}
