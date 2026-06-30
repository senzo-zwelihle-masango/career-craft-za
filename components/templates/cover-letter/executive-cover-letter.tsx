import type { CoverLetterTemplateData } from "../types"

const a = (accent?: string | null) => accent || "#1f2937"

export function ExecutiveCoverLetter({ data }: { data: CoverLetterTemplateData }) {
  const accent = a(data.accentColor)
  return (
    <div className="bg-white text-black min-h-full">
      <div className="h-1" style={{ backgroundColor: accent }} />
      <div className="mx-8 md:mx-10 lg:mx-12">
        <div className="h-3 border-l border-r" style={{ borderColor: `${accent}40` }} />
      </div>

      <div className="px-8 md:px-10 lg:px-12 pb-8 md:pb-10 lg:pb-12">
        <div className="text-center">
          {data.fullName && <h1 className="text-lg font-bold uppercase tracking-widest" style={{ color: accent }}>{data.fullName}</h1>}
          {data.professionalTitle && <p className="mt-1 text-xs uppercase tracking-wider" style={{ color: `${accent}cc` }}>{data.professionalTitle}</p>}
          {(data.email || data.phone || data.location) && (
            <p className="mt-1 text-xs" style={{ color: `${accent}99` }}>
              {[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}
            </p>
          )}
        </div>

        <div className="mt-4 border-t" style={{ borderColor: `${accent}30` }} />

        {data.date && <div className="mt-4 text-sm">{data.date}</div>}

        {(data.recipientName || data.companyName) && (
          <div className="mt-6 text-sm">
            {data.recipientName && <p>{data.recipientName}</p>}
            {data.companyName && <p>{data.companyName}</p>}
          </div>
        )}

        {data.recipientName && <p className="mt-4 text-sm">Dear {data.recipientName},</p>}

        {data.body ? (
          <div className="mt-4 flex-1 text-sm leading-relaxed whitespace-pre-line text-gray-800">
            {data.body}
          </div>
        ) : (
          <div className="mt-4 flex-1 text-sm italic" style={{ color: `${accent}30` }}>Your cover letter will appear here...</div>
        )}

        {data.fullName && (
          <div className="mt-8 text-sm">
            <p>Yours sincerely,</p>
            <p className="mt-1 font-semibold" style={{ color: accent }}>{data.fullName}</p>
          </div>
        )}
      </div>
    </div>
  )
}
