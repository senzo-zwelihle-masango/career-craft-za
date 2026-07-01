import type { CvWithRelations } from "@/lib/data/editor/types"

function base(templateId: string, overrides: Partial<CvWithRelations>): CvWithRelations {
  return {
    id: "dummy",
    userId: "dummy",
    title: "",
    templateId,
    pageFormat: "A4" as const,
    language: "en-GB",
    dateFormat: "MM/YYYY",
    fontFamily: "serif",
    fontScale: 1,
    spacingScale: 1,
    accentColor: "#1f2937",
    contentWidth: "standard",
    showDividers: true,
    headingStyle: "normal",
    headingWeight: "bold",
    showSectionIcons: false,
    footer: null,
    headerLayout: "stacked",
    entryStyle: "bullet",
    showEntryDates: true,
    showEntryLocation: true,
    showPhoto: false,
    shared: false,
    shareId: null,
    viewCount: 0,
    downloadCount: 0,
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    personalDetails: null!,
    sections: [],
    ...overrides,
  }
}

function section(
  id: string,
  curriculumVitaeId: string,
  type: string,
  title: string,
  order: number,
  extra?: Partial<CvWithRelations["sections"][0]>,
): CvWithRelations["sections"][0] {
  return {
    id,
    curriculumVitaeId,
    type: type as CvWithRelations["sections"][0]["type"],
    title,
    order,
    visible: true,
    content: null,
    experienceEntries: [],
    educationEntries: [],
    projectEntries: [],
    skillGroups: [],
    certificationEntries: [],
    languageEntries: [],
    awardEntries: [],
    referenceEntries: [],
    ...extra,
  } as CvWithRelations["sections"][0]
}

const thandiweMokoena: CvWithRelations = base("classic", {
  accentColor: "#1e40af",
  fontFamily: "serif",
  showPhoto: true,
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Thandiwe Mokoena", jobTitle: "Senior Product Designer",
    email: "thandiwe.mokoena@example.co.za", phone: "+27 82 123 4567",
    location: "Johannesburg, Gauteng",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/thandiwemokoena" },
      { type: "website", url: "thandiwemokoena.design" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content: "Senior Product Designer with 8+ years of experience crafting user-centric digital products across fintech and e-commerce. Proven track record of leading design systems, improving conversion rates by 40%, and mentoring cross-functional teams. Passionate about accessible design and data-driven decision making.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Skills", 1, {
      skillGroups: [
        { id: "dummy-sg1", sectionId: "dummy-skills", label: "Design", skills: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Accessibility"], visible: true, order: 0 },
        { id: "dummy-sg2", sectionId: "dummy-skills", label: "Tools", skills: ["Figma", "Adobe Creative Suite", "Principle", "Framer", "Storybook"], visible: true, order: 1 },
      ],
    }),
    section("dummy-experience", "dummy", "EXPERIENCE", "Professional Experience", 2, {
      experienceEntries: [
        { id: "dummy-exp1", sectionId: "dummy-experience", company: "Yoco", role: "Senior Product Designer", location: "Cape Town, Western Cape", startDate: "01/2021", endDate: "", current: true, description: "", bullets: [
          "Led the redesign of the core payments platform, resulting in a 40% increase in merchant engagement and a 25% reduction in support tickets",
          "Established and maintained a comprehensive design system adopted by 4 product teams, reducing design-to-dev handoff time by 60%",
          "Mentored 3 junior designers through structured growth programmes and regular design critiques",
        ], order: 0 },
        { id: "dummy-exp2", sectionId: "dummy-experience", company: "Takealot", role: "Product Designer", location: "Cape Town, Western Cape", startDate: "03/2018", endDate: "12/2020", current: false, description: "", bullets: [
          "Designed and shipped 3 major product features from concept to launch, serving 2M+ monthly active users",
          "Conducted 50+ user research sessions across urban and rural South African markets, translating insights into actionable design improvements",
          "Collaborated with engineering to implement a component library, reducing UI development time by 35%",
        ], order: 1 },
      ],
    }),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        { id: "dummy-edu1", sectionId: "dummy-education", institution: "University of Cape Town", degree: "B.Soc.Sci. in Computer Science & Interaction Design", location: null, startDate: "02/2014", endDate: "11/2017", order: 0 },
        { id: "dummy-edu2", sectionId: "dummy-education", institution: "Stellenbosch University", degree: "B.Des.Hons in Visual Communication", location: null, startDate: "02/2018", endDate: "11/2019", order: 1 },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Projects", 4, {
      projectEntries: [
        { id: "dummy-prj1", sectionId: "dummy-projects", name: "Accessibility Audit Tool", link: null, description: "Open-source tool that scans design files for accessibility issues, used by 200+ design teams across Africa.", technologies: ["TypeScript", "React", "Figma Plugin API"], order: 0 },
      ],
    }),
    section("dummy-certifications", "dummy", "CERTIFICATIONS", "Certifications", 5, {
      certificationEntries: [
        { id: "dummy-cert1", sectionId: "dummy-certifications", name: "Google UX Design Professional Certificate", issuer: "Google", issueDate: "03/2022", credentialId: "ABC-123", credentialUrl: null, expiryDate: null, order: 0 },
        { id: "dummy-cert2", sectionId: "dummy-certifications", name: "Certified Usability Analyst (CUA)", issuer: "Human Factors International", issueDate: "08/2020", credentialId: null, credentialUrl: null, expiryDate: null, order: 1 },
      ],
    }),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        { id: "dummy-lang1", sectionId: "dummy-languages", name: "English", proficiency: "Native", order: 0 },
        { id: "dummy-lang2", sectionId: "dummy-languages", name: "Zulu", proficiency: "Conversational", order: 1 },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        { id: "dummy-award1", sectionId: "dummy-awards", title: "Best Digital Product Design", issuer: "Design Indaba", date: "03/2024", description: "Awarded for innovative payment experience redesign", order: 0 },
        { id: "dummy-award2", sectionId: "dummy-awards", title: "Emerging Designer of the Year", issuer: "Loeries Awards", date: "11/2019", description: "Recognised for outstanding portfolio and industry impact", order: 1 },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        { id: "dummy-ref1", sectionId: "dummy-references", name: "Sarah van der Merwe", jobTitle: "VP of Design", company: "Yoco", email: "sarah@yoco.com", phone: "+27 82 111 2222", order: 0 },
        { id: "dummy-ref2", sectionId: "dummy-references", name: "Thabo Moloi", jobTitle: "Head of Product", company: "Takealot", email: "thabo@takealot.com", phone: "+27 83 333 4444", order: 1 },
      ],
    }),
  ],
})

const johanDeVilliers: CvWithRelations = base("modern-sidebar", {
  accentColor: "#0f766e",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Johan de Villiers", jobTitle: "Marketing Director",
    email: "johan.devilliers@example.co.za", phone: "+27 72 234 5678",
    location: "Cape Town, Western Cape",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/johandevilliers" },
      { type: "website", url: "johandevilliers.co.za" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content: "Results-driven Marketing Director with over a decade of experience driving brand growth and demand generation for B2B and B2C brands across Africa. Expertise in multi-channel campaign strategy, team leadership, and revenue marketing with a consistent track record of exceeding pipeline targets.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Skills", 1, {
      skillGroups: [
        { id: "dummy-sg1", sectionId: "dummy-skills", label: "Marketing", skills: ["Demand Generation", "Content Strategy", "SEO/SEM", "Marketing Automation", "Brand Strategy"], visible: true, order: 0 },
        { id: "dummy-sg2", sectionId: "dummy-skills", label: "Tools", skills: ["HubSpot", "Marketo", "Salesforce", "Google Analytics", "Tableau"], visible: true, order: 1 },
      ],
    }),
    section("dummy-experience", "dummy", "EXPERIENCE", "Professional Experience", 2, {
      experienceEntries: [
        { id: "dummy-exp1", sectionId: "dummy-experience", company: "Naspers", role: "Marketing Director", location: "Cape Town, Western Cape", startDate: "06/2020", endDate: "", current: true, description: "", bullets: [
          "Built and led a 12-person marketing team across content, demand gen, and brand, growing pipeline contribution by 180% in two years",
          "Launched an account-based marketing programme that increased enterprise deal size by 45% across sub-Saharan Africa",
          "Reduced cost-per-lead by 60% through strategic channel optimisation and audience segmentation",
        ], order: 0 },
        { id: "dummy-exp2", sectionId: "dummy-experience", company: "Vodacom", role: "Senior Marketing Manager", location: "Midrand, Gauteng", startDate: "03/2017", endDate: "05/2020", current: false, description: "", bullets: [
          "Developed and executed go-to-market strategy for 4 product launches, each exceeding revenue targets by 30%+",
          "Implemented marketing automation workflows that increased lead-to-MQL conversion by 55%",
        ], order: 1 },
      ],
    }),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        { id: "dummy-edu1", sectionId: "dummy-education", institution: "University of Stellenbosch", degree: "M.B.A., Marketing", location: null, startDate: "02/2013", endDate: "12/2014", order: 0 },
        { id: "dummy-edu2", sectionId: "dummy-education", institution: "University of Pretoria", degree: "B.Com. in Marketing Management", location: null, startDate: "02/2009", endDate: "11/2012", order: 1 },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Projects", 4, {
      projectEntries: [
        { id: "dummy-prj1", sectionId: "dummy-projects", name: "Pan-African Brand Repositioning", link: null, description: "Led the end-to-end rebranding initiative across 12 African markets, unifying brand messaging and visual identity.", technologies: ["Brand Strategy", "Market Research", "Campaign Management"], order: 0 },
      ],
    }),
    section("dummy-certifications", "dummy", "CERTIFICATIONS", "Certifications", 5, {
      certificationEntries: [
        { id: "dummy-cert1", sectionId: "dummy-certifications", name: "Google Digital Marketing & E-commerce Certificate", issuer: "Google", issueDate: "06/2023", credentialId: null, credentialUrl: null, expiryDate: null, order: 0 },
        { id: "dummy-cert2", sectionId: "dummy-certifications", name: "HubSpot Inbound Marketing Certification", issuer: "HubSpot Academy", issueDate: "01/2023", credentialId: null, credentialUrl: null, expiryDate: null, order: 1 },
      ],
    }),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        { id: "dummy-lang1", sectionId: "dummy-languages", name: "Afrikaans", proficiency: "Native", order: 0 },
        { id: "dummy-lang2", sectionId: "dummy-languages", name: "English", proficiency: "Native", order: 1 },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        { id: "dummy-award1", sectionId: "dummy-awards", title: "Marketing Leader of the Year", issuer: "Marketing Achievement Awards SA", date: "11/2023", description: "Recognised for exceptional demand generation and team leadership", order: 0 },
        { id: "dummy-award2", sectionId: "dummy-awards", title: "Best Integrated Campaign", issuer: "ASA Awards", date: "06/2022", description: "Pan-African brand campaign reaching 15M+ impressions", order: 1 },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        { id: "dummy-ref1", sectionId: "dummy-references", name: "Pieter Botha", jobTitle: "CEO", company: "Naspers", email: "pieter@naspers.com", phone: "+27 82 444 5555", order: 0 },
        { id: "dummy-ref2", sectionId: "dummy-references", name: "Michelle Ndlovu", jobTitle: "Chief Marketing Officer", company: "Vodacom", email: "michelle@vodacom.co.za", phone: "+27 83 666 7777", order: 1 },
      ],
    }),
  ],
})

const drNalediKhumalo: CvWithRelations = base("minimal", {
  accentColor: "#166534",
  fontFamily: "sans-serif",
  showPhoto: true,
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Dr. Naledi Khumalo", jobTitle: "Chief Medical Officer",
    email: "naledi.khumalo@example.co.za", phone: "+27 83 345 6789",
    location: "Durban, KwaZulu-Natal",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/drnaledikhumalo" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content: "Board-certified physician and healthcare executive with 15+ years of experience in clinical practice, medical research, and healthcare administration across both public and private sectors in South Africa. Proven leader in driving quality improvement initiatives, implementing evidence-based protocols, and leading multi-disciplinary teams.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Skills", 1, {
      skillGroups: [
        { id: "dummy-sg1", sectionId: "dummy-skills", label: "Clinical", skills: ["Internal Medicine", "Clinical Research", "Evidence-Based Practice", "Quality Improvement", "Patient Safety"], visible: true, order: 0 },
        { id: "dummy-sg2", sectionId: "dummy-skills", label: "Leadership", skills: ["Healthcare Administration", "Strategic Planning", "Team Leadership", "Regulatory Compliance", "Health Informatics"], visible: true, order: 1 },
      ],
    }),
    section("dummy-experience", "dummy", "EXPERIENCE", "Professional Experience", 2, {
      experienceEntries: [
        { id: "dummy-exp1", sectionId: "dummy-experience", company: "Netcare Group", role: "Chief Medical Officer", location: "Durban, KwaZulu-Natal", startDate: "03/2019", endDate: "", current: true, description: "", bullets: [
          "Oversee clinical operations across 5 private hospitals with 1,200+ beds and 500+ physicians",
          "Led implementation of AI-assisted diagnostic tools, reducing average diagnosis time by 35%",
          "Championed hospital-wide patient safety initiative that reduced adverse events by 28%",
        ], order: 0 },
        { id: "dummy-exp2", sectionId: "dummy-experience", company: "Addington Hospital", role: "Medical Director, Internal Medicine", location: "Durban, KwaZulu-Natal", startDate: "07/2014", endDate: "02/2019", current: false, description: "", bullets: [
          "Managed a department of 80+ physicians and 200+ support staff across 3 outpatient clinics",
          "Designed and implemented a chronic disease management programme that improved patient outcomes by 40% in underserved communities",
        ], order: 1 },
      ],
    }),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        { id: "dummy-edu1", sectionId: "dummy-education", institution: "University of KwaZulu-Natal", degree: "M.B.Ch.B.", location: null, startDate: "02/2004", endDate: "12/2008", order: 0 },
        { id: "dummy-edu2", sectionId: "dummy-education", institution: "University of the Witwatersrand", degree: "M.Med. in Internal Medicine", location: null, startDate: "02/2010", endDate: "12/2013", order: 1 },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Research & Initiatives", 4, {
      projectEntries: [
        { id: "dummy-prj1", sectionId: "dummy-projects", name: "Rural Telemedicine Pilot", link: null, description: "Led the implementation of telemedicine services across 15 rural clinics in KwaZulu-Natal, improving specialist access for 50,000+ patients.", technologies: ["Clinical Research", "Telemedicine", "Change Management"], order: 0 },
      ],
    }),
    section("dummy-certifications", "dummy", "CERTIFICATIONS", "Certifications", 5, {
      certificationEntries: [
        { id: "dummy-cert1", sectionId: "dummy-certifications", name: "Board Certified Internal Medicine", issuer: "Health Professions Council of SA", issueDate: "01/2014", credentialId: "MP-12345", credentialUrl: null, expiryDate: null, order: 0 },
        { id: "dummy-cert2", sectionId: "dummy-certifications", name: "Advanced Healthcare Leadership", issuer: "Harvard Medical School Online", issueDate: "08/2021", credentialId: null, credentialUrl: null, expiryDate: null, order: 1 },
      ],
    }),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        { id: "dummy-lang1", sectionId: "dummy-languages", name: "English", proficiency: "Native", order: 0 },
        { id: "dummy-lang2", sectionId: "dummy-languages", name: "Zulu", proficiency: "Native", order: 1 },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        { id: "dummy-award1", sectionId: "dummy-awards", title: "Excellence in Clinical Leadership", issuer: "Netcare Group", date: "12/2023", description: "Awarded for outstanding leadership in patient safety and quality improvement", order: 0 },
        { id: "dummy-award2", sectionId: "dummy-awards", title: "Community Health Champion", issuer: "KwaZulu-Natal Department of Health", date: "09/2021", description: "Recognised for contributions to rural healthcare access", order: 1 },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        { id: "dummy-ref1", sectionId: "dummy-references", name: "Dr. Richard Naidoo", jobTitle: "CEO", company: "Netcare Group", email: "richard@netcare.co.za", phone: "+27 82 888 9999", order: 0 },
        { id: "dummy-ref2", sectionId: "dummy-references", name: "Prof. Susan Clark", jobTitle: "Head of Clinical Research", company: "University of KwaZulu-Natal", email: "clarks@ukzn.ac.za", phone: "+27 83 111 2222", order: 1 },
      ],
    }),
  ],
})

const fatimaEssack: CvWithRelations = base("executive", {
  accentColor: "#831843",
  fontFamily: "serif",
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Fatima Essack", jobTitle: "Chief Financial Officer",
    email: "fatima.essack@example.co.za", phone: "+27 84 456 7890",
    location: "Johannesburg, Gauteng",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/fatimaessackcfo" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Executive Summary", 0, {
      content: "Seasoned CFO with 20+ years of experience in financial strategy, M&A, and operational excellence across JSE-listed and high-growth private companies. Track record of driving revenue growth, securing capital, and building high-performance finance teams. CA(SA) with deep expertise in capital markets and corporate governance.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Core Competencies", 1, {
      skillGroups: [
        { id: "dummy-sg1", sectionId: "dummy-skills", label: "Financial", skills: ["Financial Planning & Analysis", "Mergers & Acquisitions", "Capital Raising", "Risk Management", "Treasury"], visible: true, order: 0 },
        { id: "dummy-sg2", sectionId: "dummy-skills", label: "Leadership", skills: ["Board Relations", "Investor Relations", "Organisational Design", "Strategic Planning", "Change Management"], visible: true, order: 1 },
      ],
    }),
    section("dummy-experience", "dummy", "EXPERIENCE", "Professional Experience", 2, {
      experienceEntries: [
        { id: "dummy-exp1", sectionId: "dummy-experience", company: "Standard Bank Group", role: "Chief Financial Officer", location: "Johannesburg, Gauteng", startDate: "01/2018", endDate: "", current: true, description: "", bullets: [
          "Led financial strategy for a R280B banking group with operations across 20 African countries",
          "Executed 6 acquisitions totalling R18B, integrating finance operations and realising R1.2B in synergies",
          "Restructured debt portfolio, reducing cost of capital by 150bps and saving R450M annually",
        ], order: 0 },
        { id: "dummy-exp2", sectionId: "dummy-experience", company: "Discovery Limited", role: "VP of Finance", location: "Sandton, Gauteng", startDate: "04/2013", endDate: "12/2017", current: false, description: "", bullets: [
          "Built the finance function from 3 to 35 people as the company scaled from R5B to R20B in revenue",
          "Led the financial due diligence and listing preparation for the Vitality IPO",
        ], order: 1 },
      ],
    }),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        { id: "dummy-edu1", sectionId: "dummy-education", institution: "University of the Witwatersrand", degree: "B.Com. in Accounting", location: null, startDate: "02/2000", endDate: "11/2003", order: 0 },
        { id: "dummy-edu2", sectionId: "dummy-education", institution: "SAICA", degree: "Chartered Accountant CA(SA)", location: null, startDate: "01/2004", endDate: "12/2006", order: 1 },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Transactions", 4, {
      projectEntries: [
        { id: "dummy-prj1", sectionId: "dummy-projects", name: "Cross-Border Acquisition & Integration", link: null, description: "Led financial due diligence and post-merger integration for a R4.5B acquisition of a East African banking group.", technologies: ["M&A", "Financial Modelling", "Integration"], order: 0 },
      ],
    }),
    section("dummy-certifications", "dummy", "CERTIFICATIONS", "Certifications", 5, {
      certificationEntries: [
        { id: "dummy-cert1", sectionId: "dummy-certifications", name: "Chartered Accountant CA(SA)", issuer: "SAICA", issueDate: "12/2006", credentialId: "CA-56789", credentialUrl: null, expiryDate: null, order: 0 },
        { id: "dummy-cert2", sectionId: "dummy-certifications", name: "Certified Financial Analyst (CFA)", issuer: "CFA Institute", issueDate: "06/2009", credentialId: null, credentialUrl: null, expiryDate: null, order: 1 },
      ],
    }),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        { id: "dummy-lang1", sectionId: "dummy-languages", name: "English", proficiency: "Native", order: 0 },
        { id: "dummy-lang2", sectionId: "dummy-languages", name: "Afrikaans", proficiency: "Conversational", order: 1 },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        { id: "dummy-award1", sectionId: "dummy-awards", title: "CFO of the Year", issuer: "Financial Mail", date: "11/2023", description: "Recognised for financial strategy and governance excellence", order: 0 },
        { id: "dummy-award2", sectionId: "dummy-awards", title: "Women in Finance Leadership Award", issuer: "SA Institute of Chartered Accountants", date: "03/2022", description: "Honoured for advancing women in financial leadership", order: 1 },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        { id: "dummy-ref1", sectionId: "dummy-references", name: "Tendai Mbatha", jobTitle: "Group CEO", company: "Standard Bank Group", email: "tendai@standardbank.co.za", phone: "+27 82 333 4444", order: 0 },
        { id: "dummy-ref2", sectionId: "dummy-references", name: "Adrian Gore", jobTitle: "Founder & CEO", company: "Discovery Limited", email: "adrian@discovery.co.za", phone: "+27 83 555 6666", order: 1 },
      ],
    }),
  ],
})

const lwaziNkosi: CvWithRelations = base("creative", {
  accentColor: "#c026d3",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Lwazi Nkosi", jobTitle: "Creative Director",
    email: "lwazi.nkosi@example.co.za", phone: "+27 73 567 8901",
    location: "Cape Town, Western Cape",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/lwazinkosi" },
      { type: "website", url: "lwazinkosi.studio" },
      { type: "portfolio", url: "lwazinkosi.studio/work" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Creative Vision", 0, {
      content: "Award-winning Creative Director with 12+ years of experience shaping brand identities and leading multidisciplinary creative teams across Africa. Passionate about storytelling, experiential design, and pushing creative boundaries while delivering measurable business results. Work featured in Design Indaba, Loeries, and D&AD.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Expertise", 1, {
      skillGroups: [
        { id: "dummy-sg1", sectionId: "dummy-skills", label: "Creative", skills: ["Brand Identity", "Art Direction", "Visual Storytelling", "Typography", "Motion Design"], visible: true, order: 0 },
        { id: "dummy-sg2", sectionId: "dummy-skills", label: "Tools", skills: ["Adobe Creative Suite", "Cinema 4D", "Figma", "After Effects", "Blender"], visible: true, order: 1 },
      ],
    }),
    section("dummy-experience", "dummy", "EXPERIENCE", "Experience", 2, {
      experienceEntries: [
        { id: "dummy-exp1", sectionId: "dummy-experience", company: "Native VML", role: "Creative Director", location: "Cape Town, Western Cape", startDate: "02/2019", endDate: "", current: true, description: "", bullets: [
          "Led creative strategy for 30+ national and pan-African brands, including 2 DStv campaign launches",
          "Grew agency revenue from R80M to R240M by winning 12 new accounts and expanding existing relationships",
          "Built and mentored a team of 25 designers, copywriters, and art directors across 3 offices",
        ], order: 0 },
        { id: "dummy-exp2", sectionId: "dummy-experience", company: "King James Group", role: "Associate Creative Director", location: "Cape Town, Western Cape", startDate: "06/2015", endDate: "01/2019", current: false, description: "", bullets: [
          "Conceptualised and executed integrated campaigns for major South African brands including MTN and Standard Bank",
          "Campaign won 3 Loerie Awards and 5 D&AD Pencils",
        ], order: 1 },
      ],
    }),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        { id: "dummy-edu1", sectionId: "dummy-education", institution: "Cape Peninsula University of Technology", degree: "BTech in Graphic Design", location: null, startDate: "02/2010", endDate: "11/2013", order: 0 },
        { id: "dummy-edu2", sectionId: "dummy-education", institution: "Open Window Institute", degree: "Advanced Diploma in Art Direction", location: null, startDate: "02/2014", endDate: "11/2015", order: 1 },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Selected Work", 4, {
      projectEntries: [
        { id: "dummy-prj1", sectionId: "dummy-projects", name: "Brand Refresh — Africa Tech Festival", link: null, description: "Complete brand overhaul for a 15,000-attendee annual conference, including visual identity, signage, app design, and motion graphics.", technologies: ["Brand Strategy", "Art Direction", "Motion Design"], order: 0 },
      ],
    }),
    section("dummy-certifications", "dummy", "CERTIFICATIONS", "Certifications", 5, {
      certificationEntries: [
        { id: "dummy-cert1", sectionId: "dummy-certifications", name: "Adobe Certified Professional - Visual Design", issuer: "Adobe", issueDate: "09/2023", credentialId: null, credentialUrl: null, expiryDate: null, order: 0 },
        { id: "dummy-cert2", sectionId: "dummy-certifications", name: "Certified Brand Strategist", issuer: "Brand Council SA", issueDate: "03/2021", credentialId: null, credentialUrl: null, expiryDate: null, order: 1 },
      ],
    }),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        { id: "dummy-lang1", sectionId: "dummy-languages", name: "English", proficiency: "Native", order: 0 },
        { id: "dummy-lang2", sectionId: "dummy-languages", name: "Zulu", proficiency: "Fluent", order: 1 },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        { id: "dummy-award1", sectionId: "dummy-awards", title: "Loerie Grand Prix", issuer: "Loeries Awards", date: "09/2023", description: "Awarded for groundbreaking campaign across multiple categories", order: 0 },
        { id: "dummy-award2", sectionId: "dummy-awards", title: "D&AD Yellow Pencil", issuer: "D&AD", date: "05/2022", description: "Yellow Pencil for innovative brand experience design", order: 1 },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        { id: "dummy-ref1", sectionId: "dummy-references", name: "Graham Neill", jobTitle: "CEO", company: "Native VML", email: "graham@nativevml.co.za", phone: "+27 82 777 8888", order: 0 },
        { id: "dummy-ref2", sectionId: "dummy-references", name: "Lindiwe Mthembu", jobTitle: "Group Marketing Director", company: "MTN SA", email: "lindiwe@mtn.co.za", phone: "+27 83 999 0000", order: 1 },
      ],
    }),
  ],
})

const siphoDlamini: CvWithRelations = base("compact", {
  accentColor: "#1e40af",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Sipho Dlamini", jobTitle: "Senior Software Engineer",
    email: "sipho.dlamini@example.co.za", phone: "+27 82 678 9012",
    location: "Stellenbosch, Western Cape",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/sipholdlamini" },
      { type: "website", url: "siphodlamini.dev" },
      { type: "github", url: "github.com/sipho-dev" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Summary", 0, {
      content: "Full-stack engineer with 10+ years building distributed systems and consumer-scale applications at leading tech companies. Passionate about developer productivity, system reliability, and mentoring engineering teams. Open-source contributor and conference speaker at PyConZA and JSConf Africa.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Technical Skills", 1, {
      skillGroups: [
        { id: "dummy-sg1", sectionId: "dummy-skills", label: "Languages", skills: ["TypeScript", "Python", "Go", "Rust", "Java"], visible: true, order: 0 },
        { id: "dummy-sg2", sectionId: "dummy-skills", label: "Infrastructure", skills: ["AWS", "Kubernetes", "Terraform", "Docker", "Kafka"], visible: true, order: 1 },
      ],
    }),
    section("dummy-experience", "dummy", "EXPERIENCE", "Experience", 2, {
      experienceEntries: [
        { id: "dummy-exp1", sectionId: "dummy-experience", company: "Yoco", role: "Senior Software Engineer", location: "Cape Town, Western Cape", startDate: "03/2021", endDate: "", current: true, description: "", bullets: [
          "Designed and built the next-generation payment processing pipeline handling R50B+ in annual transaction volume",
          "Reduced p99 latency by 60% through distributed tracing optimisation and database query restructuring",
          "Tech-led a team of 8 engineers, establishing engineering best practices and conducting system design reviews",
        ], order: 0 },
        { id: "dummy-exp2", sectionId: "dummy-experience", company: "Takealot", role: "Software Engineer III", location: "Cape Town, Western Cape", startDate: "08/2017", endDate: "02/2021", current: false, description: "", bullets: [
          "Built real-time inventory management system supporting 500+ warehouses across South Africa",
          "Migrated monolithic inventory service to event-driven microservices architecture, improving deploy frequency by 10x",
        ], order: 1 },
      ],
    }),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        { id: "dummy-edu1", sectionId: "dummy-education", institution: "Stellenbosch University", degree: "B.Sc. in Computer Science", location: null, startDate: "02/2011", endDate: "11/2014", order: 0 },
        { id: "dummy-edu2", sectionId: "dummy-education", institution: "University of Cape Town", degree: "M.Sc. in Computer Science", location: null, startDate: "02/2015", endDate: "11/2016", order: 1 },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Open Source", 4, {
      projectEntries: [
        { id: "dummy-prj1", sectionId: "dummy-projects", name: "kvstore-rs", link: "github.com/sipho-dev/kvstore-rs", description: "Embedded key-value store written in Rust with zero-copy deserialisation. 2,500+ GitHub stars.", technologies: ["Rust", "LSM Trees", "Zero-Copy"], order: 0 },
        { id: "dummy-prj2", sectionId: "dummy-projects", name: "PyZA Talks", link: null, description: "Community platform for tracking and discovering Python talks across African meetups and conferences.", technologies: ["TypeScript", "React", "Python"], order: 1 },
      ],
    }),
    section("dummy-certifications", "dummy", "CERTIFICATIONS", "Certifications", 5, {
      certificationEntries: [
        { id: "dummy-cert1", sectionId: "dummy-certifications", name: "AWS Solutions Architect - Associate", issuer: "Amazon Web Services", issueDate: "06/2023", credentialId: "AWS-AS-12345", credentialUrl: null, expiryDate: null, order: 0 },
        { id: "dummy-cert2", sectionId: "dummy-certifications", name: "Kubernetes Administrator (CKA)", issuer: "CNCF", issueDate: "03/2022", credentialId: "CKA-67890", credentialUrl: null, expiryDate: null, order: 1 },
      ],
    }),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        { id: "dummy-lang1", sectionId: "dummy-languages", name: "English", proficiency: "Native", order: 0 },
        { id: "dummy-lang2", sectionId: "dummy-languages", name: "Zulu", proficiency: "Native", order: 1 },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        { id: "dummy-award1", sectionId: "dummy-awards", title: "Best Engineering Contribution", issuer: "Yoco Tech Awards", date: "12/2023", description: "For designing the next-gen payment processing pipeline", order: 0 },
        { id: "dummy-award2", sectionId: "dummy-awards", title: "Open Source Contributor of the Year", issuer: "PyConZA", date: "10/2022", description: "Recognised for contributions to the Python and Rust open source community in Africa", order: 1 },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        { id: "dummy-ref1", sectionId: "dummy-references", name: "Katherine Mills", jobTitle: "VP of Engineering", company: "Yoco", email: "katherine@yoco.com", phone: "+27 82 123 4567", order: 0 },
        { id: "dummy-ref2", sectionId: "dummy-references", name: "James Nkuna", jobTitle: "Engineering Director", company: "Takealot", email: "james@takealot.com", phone: "+27 83 765 4321", order: 1 },
      ],
    }),
  ],
})

const amaraOkafor: CvWithRelations = base("gradient-cap", {
  accentColor: "#0891b2",
  fontFamily: "sans-serif",
  showPhoto: true,
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Amara Okafor", jobTitle: "Data Science Lead",
    email: "amara.okafor@example.ng", phone: "+234 802 345 6789",
    location: "Lagos, Nigeria",
    photoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/amaraokafor" },
      { type: "github", url: "github.com/amara-ai" },
    ],
  },
  sections: lwaziNkosi.sections,
})

const kwameAsante: CvWithRelations = base("bold-stamp", {
  accentColor: "#7c3aed",
  fontFamily: "serif",
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Kwame Asante", jobTitle: "Corporate Counsel",
    email: "kwame.asante@example.gh", phone: "+233 302 456 7890",
    location: "Accra, Ghana",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/kwameasante" },
    ],
  },
  sections: fatimaEssack.sections,
})

const tumiMoshesh: CvWithRelations = base("sidebar-ink", {
  accentColor: "#d97706",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd", curriculumVitaeId: "dummy",
    fullName: "Tumi Moshesh", jobTitle: "Operations Director",
    email: "tumi.moshesh@example.co.za", phone: "+27 71 234 5678",
    location: "Gaborone, Botswana",
    photoUrl: "https://images.unsplash.com/photo-1598550874175-4d0ef314c0c9?w=400&h=500&fit=crop", photoObjectPosition: null, photoCrop: null, nationality: null, updatedAt: new Date(), links: [
      { type: "linkedin", url: "linkedin.com/in/tumimoshesh" },
    ],
  },
  sections: johanDeVilliers.sections,
})

const PROFILES: Record<string, CvWithRelations> = {
  "clean-line": thandiweMokoena,
  classic: thandiweMokoena,
  "sidebar-slate": johanDeVilliers,
  "modern-sidebar": johanDeVilliers,
  "editorial-rule": drNalediKhumalo,
  minimal: drNalediKhumalo,
  "exec-formal": fatimaEssack,
  executive: fatimaEssack,
  "gradient-cap": amaraOkafor,
  creative: lwaziNkosi,
  "dense-two-col": siphoDlamini,
  compact: siphoDlamini,
  "structured-pro": thandiweMokoena,
  "centred-serif": amaraOkafor,
  "accent-band": johanDeVilliers,
  "split-head": tumiMoshesh,
  "ruled-editorial": amaraOkafor,
  "bold-stamp": kwameAsante,
  "sidebar-ink": tumiMoshesh,
  "photo-header-float": thandiweMokoena,
  "photo-centred": drNalediKhumalo,
  "condensed-rule": siphoDlamini,
  "graduate-first": kwameAsante,
  "student-sidebar": fatimaEssack,
  "clean-start": drNalediKhumalo,
}

export function createCurriculumVitae(templateId = "clean-line"): CvWithRelations {
  return PROFILES[templateId] ?? thandiweMokoena
}
