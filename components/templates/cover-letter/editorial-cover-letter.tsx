import type { CoverLetterTemplateData } from "../types"

const a = (accent?: string | null) => accent || "#78716c"

export function EditorialCoverLetter({ data }: { data: CoverLetterTemplateData }) {
  const accent = a(data.accentColor)
  return (
    <div className="bg-[#fffaf5] p-8 md:p-10 lg:p-12 text-black min-h-full">
      <div className="text-center">
        {data.fullName && <h1 className="text-xl font-normal tracking-wider" style={{ color: accent }}>{data.fullName}</h1>}
        {data.professionalTitle && <p className="mt-1 text-sm italic" style={{ color: `${accent}cc` }}>{data.professionalTitle}</p>}
        {(data.email || data.phone || data.location) && (
          <p className="mt-2 text-xs italic" style={{ color: `${accent}99` }}>
            {[data.email, data.phone, data.location].filter(Boolean).join("  ·  ")}
          </p>
        )}
      </div>

      <div className="my-6 text-center text-xs tracking-[0.5em]" style={{ color: `${accent}50` }}>✦ ⁂ ✦</div>

      <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}40, transparent)` }} />

      {data.date && <div className="mt-5 text-sm text-center" style={{ color: `${accent}aa` }}>{data.date}</div>}

      {(data.recipientName || data.companyName) && (
        <div className="mt-6 text-sm text-center">
          {data.recipientName && <p>{data.recipientName}</p>}
          {data.companyName && <p>{data.companyName}</p>}
        </div>
      )}

      {data.recipientName && <p className="mt-4 text-sm text-center">Dear {data.recipientName},</p>}

      {data.body ? (
        <div className="mt-4 text-sm leading-relaxed whitespace-pre-line text-gray-800 text-center">
          {data.body}
        </div>
      ) : (
        <div className="mt-4 text-sm italic text-center" style={{ color: `${accent}30` }}>Your cover letter will appear here...</div>
      )}

      {data.fullName && (
        <div className="mt-8 text-sm text-center">
          <p>Sincerely,</p>
          <p className="mt-1 font-medium" style={{ color: accent }}>{data.fullName}</p>
        </div>
      )}
    </div>
  )
}
