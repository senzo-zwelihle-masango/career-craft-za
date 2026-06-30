import type { CoverLetterTemplateData } from "../types"



const a = (accent?: string | null) => accent || "#1f2937"

export function ClassicCoverLetter({ data }: { data: CoverLetterTemplateData }) {
  const accent = a(data.accentColor)
  return (
    <div className="bg-white p-8 md:p-10 lg:p-12 text-black min-h-full">
      {/* Sender */}
      {(data.fullName || data.professionalTitle) && (
        <div className="text-right">
          {data.fullName && <h1 className="text-lg font-bold" style={{ color: accent }}>{data.fullName}</h1>}
          {data.professionalTitle && <p className="text-sm text-gray-500 italic">{data.professionalTitle}</p>}
        </div>
      )}
      {(data.email || data.phone || data.location) && (
        <div className="mt-1 text-right text-xs" style={{ color: `${accent}99` }}>
          {[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}
        </div>
      )}

      <div className="mt-4 border-b" style={{ borderColor: `${accent}30` }} />

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
          <p>Sincerely,</p>
          <p className="mt-1 font-semibold" style={{ color: accent }}>{data.fullName}</p>
        </div>
      )}
    </div>
  )
}
