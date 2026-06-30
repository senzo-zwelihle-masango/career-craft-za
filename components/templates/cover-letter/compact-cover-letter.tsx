import type { CoverLetterTemplateData } from "../types"

const a = (accent?: string | null) => accent || "#1e3a5f"

export function CompactCoverLetter({ data }: { data: CoverLetterTemplateData }) {
  const accent = a(data.accentColor)
  return (
    <div className="bg-white p-6 md:p-8 text-black min-h-full text-sm">
      <div className="pb-4 mb-4 border-b-2" style={{ borderColor: accent }}>
        <div className="flex items-center justify-between">
          <div>
            {data.fullName && <h1 className="text-base font-bold" style={{ color: accent }}>{data.fullName}</h1>}
            {data.professionalTitle && <p className="text-xs" style={{ color: `${accent}cc` }}>{data.professionalTitle}</p>}
          </div>
          {(data.email || data.phone || data.location) && (
            <div className="text-right text-[10px] leading-snug" style={{ color: `${accent}99` }}>
              {data.email && <p>{data.email}</p>}
              {data.phone && <p>{data.phone}</p>}
              {data.location && <p>{data.location}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between text-xs" style={{ color: `${accent}aa` }}>
        {data.date && <span>{data.date}</span>}
        <span>{data.recipientName || ""}{data.recipientName && data.companyName ? ", " : ""}{data.companyName || ""}</span>
      </div>

      {data.recipientName && <p className="mt-3 text-sm">Dear {data.recipientName},</p>}

      {data.body ? (
        <div className="mt-3 flex-1 text-sm leading-relaxed whitespace-pre-line text-gray-800">
          {data.body}
        </div>
      ) : (
        <div className="mt-3 flex-1 text-sm italic" style={{ color: `${accent}30` }}>Your cover letter will appear here...</div>
      )}

      {data.fullName && (
        <div className="mt-6 text-sm">
          <p>Sincerely,</p>
          <p className="mt-1 font-semibold" style={{ color: accent }}>{data.fullName}</p>
        </div>
      )}
    </div>
  )
}
