import type { CoverLetterTemplateData } from "@/types/templates/types"

const a = (accent?: string | null) => accent || "#1f2937"

export function ModernCoverLetter({ data }: { data: CoverLetterTemplateData }) {
  const accent = a(data.accentColor)
  return (
    <div className="min-h-full bg-white text-black">
      <div className="h-2" style={{ backgroundColor: accent }} />

      <div className="p-8 md:p-10 lg:p-12">
        {(data.fullName || data.professionalTitle) && (
          <div>
            {data.fullName && (
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ color: accent }}
              >
                {data.fullName}
              </h1>
            )}
            {data.professionalTitle && (
              <p className="mt-0.5 text-sm text-gray-500">
                {data.professionalTitle}
              </p>
            )}
          </div>
        )}
        {(data.email || data.phone || data.location) && (
          <div className="mt-1 text-xs" style={{ color: `${accent}99` }}>
            {[data.email, data.phone, data.location]
              .filter(Boolean)
              .join("  |  ")}
          </div>
        )}

        {data.date && <div className="mt-6 text-sm">{data.date}</div>}

        {(data.recipientName || data.companyName) && (
          <div className="mt-6 text-sm">
            {data.recipientName && <p>{data.recipientName}</p>}
            {data.companyName && <p>{data.companyName}</p>}
          </div>
        )}

        {data.recipientName && (
          <p className="mt-4 text-sm">Dear {data.recipientName},</p>
        )}

        {data.body ? (
          <div className="mt-4 flex-1 text-sm leading-relaxed whitespace-pre-line text-gray-800">
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
            <p>Sincerely,</p>
            <p className="mt-1 font-semibold" style={{ color: accent }}>
              {data.fullName}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
