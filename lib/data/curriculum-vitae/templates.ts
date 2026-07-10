import type { CvWithRelations } from "@/types/curriculum-vitae/types"

function base(
  templateId: string,
  overrides: Partial<CvWithRelations>
): CvWithRelations {
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
    lineHeight: 1,
    elementSpacing: 1,
    marginHorizontal: 1,
    marginVertical: 1,
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
  extra?: Partial<CvWithRelations["sections"][0]>
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
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Thandiwe Mokoena",
    jobTitle: "Senior Product Designer",
    email: "thandiwe.mokoena@example.co.za",
    phone: "+27 82 123 4567",
    location: "Johannesburg, Gauteng",
    photoUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [
      { type: "linkedin", url: "linkedin.com/in/thandiwemokoena" },
      { type: "website", url: "thandiwemokoena.design" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Senior Product Designer with 8+ years of experience crafting user-centric digital products across fintech and e-commerce. Proven track record of leading design systems, improving conversion rates by 40%, and mentoring cross-functional teams. Passionate about accessible design and data-driven decision making.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Skills", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Design",
          skills: [
            "User Research",
            "Wireframing",
            "Prototyping",
            "Design Systems",
            "Accessibility",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Tools",
          skills: [
            "Figma",
            "Adobe Creative Suite",
            "Principle",
            "Framer",
            "Storybook",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Yoco",
            role: "Senior Product Designer",
            location: "Cape Town, Western Cape",
            startDate: "01/2021",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Led the redesign of the core payments platform, resulting in a 40% increase in merchant engagement and a 25% reduction in support tickets",
              "Established and maintained a comprehensive design system adopted by 4 product teams, reducing design-to-dev handoff time by 60%",
              "Mentored 3 junior designers through structured growth programmes and regular design critiques",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Takealot",
            role: "Product Designer",
            location: "Cape Town, Western Cape",
            startDate: "03/2018",
            endDate: "12/2020",
            current: false,
            description: "",
            bullets: [
              "Designed and shipped 3 major product features from concept to launch, serving 2M+ monthly active users",
              "Conducted 50+ user research sessions across urban and rural South African markets, translating insights into actionable design improvements",
              "Collaborated with engineering to implement a component library, reducing UI development time by 35%",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of Cape Town",
          degree: "B.Soc.Sci. in Computer Science & Interaction Design",
          type: null,
          location: null,
          startDate: "02/2014",
          endDate: "11/2017",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "Stellenbosch University",
          degree: "B.Des.Hons in Visual Communication",
          type: null,
          location: null,
          startDate: "02/2018",
          endDate: "11/2019",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Projects", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Accessibility Audit Tool",
          link: null,
          description:
            "Open-source tool that scans design files for accessibility issues, used by 200+ design teams across Africa.",
          technologies: ["TypeScript", "React", "Figma Plugin API"],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Google UX Design Professional Certificate",
            issuer: "Google",
            issueDate: "03/2022",
            credentialId: "ABC-123",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Certified Usability Analyst (CUA)",
            issuer: "Human Factors International",
            issueDate: "08/2020",
            credentialId: null,
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Zulu",
          proficiency: "Conversational",
          order: 1,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Best Digital Product Design",
          issuer: "Design Indaba",
          date: "03/2024",
          description: "Awarded for innovative payment experience redesign",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Emerging Designer of the Year",
          issuer: "Loeries Awards",
          date: "11/2019",
          description:
            "Recognised for outstanding portfolio and industry impact",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Sarah van der Merwe",
          jobTitle: "VP of Design",
          company: "Yoco",
          email: "sarah@yoco.com",
          phone: "+27 82 111 2222",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Thabo Moloi",
          jobTitle: "Head of Product",
          company: "Takealot",
          email: "thabo@takealot.com",
          phone: "+27 83 333 4444",
          order: 1,
        },
      ],
    }),
  ],
})

const johanDeVilliers: CvWithRelations = base("modern-sidebar", {
  accentColor: "#0f766e",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Johan de Villiers",
    jobTitle: "Marketing Director",
    email: "johan.devilliers@example.co.za",
    phone: "+27 72 234 5678",
    location: "Cape Town, Western Cape",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [
      { type: "linkedin", url: "linkedin.com/in/johandevilliers" },
      { type: "website", url: "johandevilliers.co.za" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Results-driven Marketing Director with over a decade of experience driving brand growth and demand generation for B2B and B2C brands across Africa. Expertise in multi-channel campaign strategy, team leadership, and revenue marketing with a consistent track record of exceeding pipeline targets.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Skills", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Marketing",
          skills: [
            "Demand Generation",
            "Content Strategy",
            "SEO/SEM",
            "Marketing Automation",
            "Brand Strategy",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Tools",
          skills: [
            "HubSpot",
            "Marketo",
            "Salesforce",
            "Google Analytics",
            "Tableau",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Naspers",
            role: "Marketing Director",
            location: "Cape Town, Western Cape",
            startDate: "06/2020",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Built and led a 12-person marketing team across content, demand gen, and brand, growing pipeline contribution by 180% in two years",
              "Launched an account-based marketing programme that increased enterprise deal size by 45% across sub-Saharan Africa",
              "Reduced cost-per-lead by 60% through strategic channel optimisation and audience segmentation",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Vodacom",
            role: "Senior Marketing Manager",
            location: "Midrand, Gauteng",
            startDate: "03/2017",
            endDate: "05/2020",
            current: false,
            description: "",
            bullets: [
              "Developed and executed go-to-market strategy for 4 product launches, each exceeding revenue targets by 30%+",
              "Implemented marketing automation workflows that increased lead-to-MQL conversion by 55%",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of Stellenbosch",
          degree: "M.B.A., Marketing",
          type: null,
          location: null,
          startDate: "02/2013",
          endDate: "12/2014",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "University of Pretoria",
          degree: "B.Com. in Marketing Management",
          type: null,
          location: null,
          startDate: "02/2009",
          endDate: "11/2012",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Projects", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Pan-African Brand Repositioning",
          link: null,
          description:
            "Led the end-to-end rebranding initiative across 12 African markets, unifying brand messaging and visual identity.",
          technologies: [
            "Brand Strategy",
            "Market Research",
            "Campaign Management",
          ],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Google Digital Marketing & E-commerce Certificate",
            issuer: "Google",
            issueDate: "06/2023",
            credentialId: null,
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "HubSpot Inbound Marketing Certification",
            issuer: "HubSpot Academy",
            issueDate: "01/2023",
            credentialId: null,
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "Afrikaans",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 1,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Marketing Leader of the Year",
          issuer: "Marketing Achievement Awards SA",
          date: "11/2023",
          description:
            "Recognised for exceptional demand generation and team leadership",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Best Integrated Campaign",
          issuer: "ASA Awards",
          date: "06/2022",
          description: "Pan-African brand campaign reaching 15M+ impressions",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Pieter Botha",
          jobTitle: "CEO",
          company: "Naspers",
          email: "pieter@naspers.com",
          phone: "+27 82 444 5555",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Michelle Ndlovu",
          jobTitle: "Chief Marketing Officer",
          company: "Vodacom",
          email: "michelle@vodacom.co.za",
          phone: "+27 83 666 7777",
          order: 1,
        },
      ],
    }),
  ],
})

const drNalediKhumalo: CvWithRelations = base("minimal", {
  accentColor: "#166534",
  fontFamily: "sans-serif",
  showPhoto: true,
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Dr. Naledi Khumalo",
    jobTitle: "Chief Medical Officer",
    email: "naledi.khumalo@example.co.za",
    phone: "+27 83 345 6789",
    location: "Durban, KwaZulu-Natal",
    photoUrl:
          "https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [{ type: "linkedin", url: "linkedin.com/in/drnaledikhumalo" }],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Board-certified physician and healthcare executive with 15+ years of experience in clinical practice, medical research, and healthcare administration across both public and private sectors in South Africa. Proven leader in driving quality improvement initiatives, implementing evidence-based protocols, and leading multi-disciplinary teams.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Skills", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Clinical",
          skills: [
            "Internal Medicine",
            "Clinical Research",
            "Evidence-Based Practice",
            "Quality Improvement",
            "Patient Safety",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Leadership",
          skills: [
            "Healthcare Administration",
            "Strategic Planning",
            "Team Leadership",
            "Regulatory Compliance",
            "Health Informatics",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Netcare Group",
            role: "Chief Medical Officer",
            location: "Durban, KwaZulu-Natal",
            startDate: "03/2019",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Oversee clinical operations across 5 private hospitals with 1,200+ beds and 500+ physicians",
              "Led implementation of AI-assisted diagnostic tools, reducing average diagnosis time by 35%",
              "Championed hospital-wide patient safety initiative that reduced adverse events by 28%",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Addington Hospital",
            role: "Medical Director, Internal Medicine",
            location: "Durban, KwaZulu-Natal",
            startDate: "07/2014",
            endDate: "02/2019",
            current: false,
            description: "",
            bullets: [
              "Managed a department of 80+ physicians and 200+ support staff across 3 outpatient clinics",
              "Designed and implemented a chronic disease management programme that improved patient outcomes by 40% in underserved communities",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of KwaZulu-Natal",
          degree: "M.B.Ch.B.",
          type: null,
          location: null,
          startDate: "02/2004",
          endDate: "12/2008",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "University of the Witwatersrand",
          degree: "M.Med. in Internal Medicine",
          type: null,
          location: null,
          startDate: "02/2010",
          endDate: "12/2013",
          order: 1,
        },
      ],
    }),
    section(
      "dummy-projects",
      "dummy",
      "PROJECTS",
      "Research & Initiatives",
      4,
      {
        projectEntries: [
          {
            id: "dummy-prj1",
            sectionId: "dummy-projects",
            name: "Rural Telemedicine Pilot",
            link: null,
            description:
              "Led the implementation of telemedicine services across 15 rural clinics in KwaZulu-Natal, improving specialist access for 50,000+ patients.",
            technologies: [
              "Clinical Research",
              "Telemedicine",
              "Change Management",
            ],
            order: 0,
          },
        ],
      }
    ),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Board Certified Internal Medicine",
            issuer: "Health Professions Council of SA",
            issueDate: "01/2014",
            credentialId: "MP-12345",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Advanced Healthcare Leadership",
            issuer: "Harvard Medical School Online",
            issueDate: "08/2021",
            credentialId: null,
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Zulu",
          proficiency: "Native",
          order: 1,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Excellence in Clinical Leadership",
          issuer: "Netcare Group",
          date: "12/2023",
          description:
            "Awarded for outstanding leadership in patient safety and quality improvement",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Community Health Champion",
          issuer: "KwaZulu-Natal Department of Health",
          date: "09/2021",
          description:
            "Recognised for contributions to rural healthcare access",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Dr. Richard Naidoo",
          jobTitle: "CEO",
          company: "Netcare Group",
          email: "richard@netcare.co.za",
          phone: "+27 82 888 9999",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Prof. Susan Clark",
          jobTitle: "Head of Clinical Research",
          company: "University of KwaZulu-Natal",
          email: "clarks@ukzn.ac.za",
          phone: "+27 83 111 2222",
          order: 1,
        },
      ],
    }),
  ],
})

const fatimaEssack: CvWithRelations = base("executive", {
  accentColor: "#831843",
  fontFamily: "serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Fatima Essack",
    jobTitle: "Chief Financial Officer",
    email: "fatima.essack@example.co.za",
    phone: "+27 84 456 7890",
    location: "Johannesburg, Gauteng",
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [{ type: "linkedin", url: "linkedin.com/in/fatimaessackcfo" }],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Executive Summary", 0, {
      content:
        "Seasoned CFO with 20+ years of experience in financial strategy, M&A, and operational excellence across JSE-listed and high-growth private companies. Track record of driving revenue growth, securing capital, and building high-performance finance teams. CA(SA) with deep expertise in capital markets and corporate governance.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Core Competencies", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Financial",
          skills: [
            "Financial Planning & Analysis",
            "Mergers & Acquisitions",
            "Capital Raising",
            "Risk Management",
            "Treasury",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Leadership",
          skills: [
            "Board Relations",
            "Investor Relations",
            "Organisational Design",
            "Strategic Planning",
            "Change Management",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Standard Bank Group",
            role: "Chief Financial Officer",
            location: "Johannesburg, Gauteng",
            startDate: "01/2018",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Led financial strategy for a R280B banking group with operations across 20 African countries",
              "Executed 6 acquisitions totalling R18B, integrating finance operations and realising R1.2B in synergies",
              "Restructured debt portfolio, reducing cost of capital by 150bps and saving R450M annually",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Discovery Limited",
            role: "VP of Finance",
            location: "Sandton, Gauteng",
            startDate: "04/2013",
            endDate: "12/2017",
            current: false,
            description: "",
            bullets: [
              "Built the finance function from 3 to 35 people as the company scaled from R5B to R20B in revenue",
              "Led the financial due diligence and listing preparation for the Vitality IPO",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of the Witwatersrand",
          degree: "B.Com. in Accounting",
          type: null,
          location: null,
          startDate: "02/2000",
          endDate: "11/2003",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "SAICA",
          degree: "Chartered Accountant CA(SA)",
          type: null,
          location: null,
          startDate: "01/2004",
          endDate: "12/2006",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Transactions", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Cross-Border Acquisition & Integration",
          link: null,
          description:
            "Led financial due diligence and post-merger integration for a R4.5B acquisition of a East African banking group.",
          technologies: ["M&A", "Financial Modelling", "Integration"],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Chartered Accountant CA(SA)",
            issuer: "SAICA",
            issueDate: "12/2006",
            credentialId: "CA-56789",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Certified Financial Analyst (CFA)",
            issuer: "CFA Institute",
            issueDate: "06/2009",
            credentialId: null,
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Afrikaans",
          proficiency: "Conversational",
          order: 1,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "CFO of the Year",
          issuer: "Financial Mail",
          date: "11/2023",
          description:
            "Recognised for financial strategy and governance excellence",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Women in Finance Leadership Award",
          issuer: "SA Institute of Chartered Accountants",
          date: "03/2022",
          description: "Honoured for advancing women in financial leadership",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Tendai Mbatha",
          jobTitle: "Group CEO",
          company: "Standard Bank Group",
          email: "tendai@standardbank.co.za",
          phone: "+27 82 333 4444",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Adrian Gore",
          jobTitle: "Founder & CEO",
          company: "Discovery Limited",
          email: "adrian@discovery.co.za",
          phone: "+27 83 555 6666",
          order: 1,
        },
      ],
    }),
  ],
})

const lwaziNkosi: CvWithRelations = base("creative", {
  accentColor: "#c026d3",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Lwazi Nkosi",
    jobTitle: "Creative Director",
    email: "lwazi.nkosi@example.co.za",
    phone: "+27 73 567 8901",
    location: "Cape Town, Western Cape",
    photoUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [
      { type: "linkedin", url: "linkedin.com/in/lwazinkosi" },
      { type: "website", url: "lwazinkosi.studio" },
      { type: "portfolio", url: "lwazinkosi.studio/work" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Creative Vision", 0, {
      content:
        "Award-winning Creative Director with 12+ years of experience shaping brand identities and leading multidisciplinary creative teams across Africa. Passionate about storytelling, experiential design, and pushing creative boundaries while delivering measurable business results. Work featured in Design Indaba, Loeries, and D&AD.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Expertise", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Creative",
          skills: [
            "Brand Identity",
            "Art Direction",
            "Visual Storytelling",
            "Typography",
            "Motion Design",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Tools",
          skills: [
            "Adobe Creative Suite",
            "Cinema 4D",
            "Figma",
            "After Effects",
            "Blender",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section("dummy-experience", "dummy", "EXPERIENCE", "Experience", 2, {
      experienceEntries: [
        {
          id: "dummy-exp1",
          sectionId: "dummy-experience",
          company: "Native VML",
          role: "Creative Director",
          location: "Cape Town, Western Cape",
          startDate: "02/2019",
          endDate: "",
          current: true,
          description: "",
          bullets: [
            "Led creative strategy for 30+ national and pan-African brands, including 2 DStv campaign launches",
            "Grew agency revenue from R80M to R240M by winning 12 new accounts and expanding existing relationships",
            "Built and mentored a team of 25 designers, copywriters, and art directors across 3 offices",
          ],
          order: 0,
        },
        {
          id: "dummy-exp2",
          sectionId: "dummy-experience",
          company: "King James Group",
          role: "Associate Creative Director",
          location: "Cape Town, Western Cape",
          startDate: "06/2015",
          endDate: "01/2019",
          current: false,
          description: "",
          bullets: [
            "Conceptualised and executed integrated campaigns for major South African brands including MTN and Standard Bank",
            "Campaign won 3 Loerie Awards and 5 D&AD Pencils",
          ],
          order: 1,
        },
      ],
    }),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "Cape Peninsula University of Technology",
          degree: "BTech in Graphic Design",
          type: null,
          location: null,
          startDate: "02/2010",
          endDate: "11/2013",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "Open Window Institute",
          degree: "Advanced Diploma in Art Direction",
          type: null,
          location: null,
          startDate: "02/2014",
          endDate: "11/2015",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Selected Work", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Brand Refresh – Africa Tech Festival",
          link: null,
          description:
            "Complete brand overhaul for a 15,000-attendee annual conference, including visual identity, signage, app design, and motion graphics.",
          technologies: ["Brand Strategy", "Art Direction", "Motion Design"],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Adobe Certified Professional - Visual Design",
            issuer: "Adobe",
            issueDate: "09/2023",
            credentialId: null,
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Certified Brand Strategist",
            issuer: "Brand Council SA",
            issueDate: "03/2021",
            credentialId: null,
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Zulu",
          proficiency: "Fluent",
          order: 1,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Loerie Grand Prix",
          issuer: "Loeries Awards",
          date: "09/2023",
          description:
            "Awarded for groundbreaking campaign across multiple categories",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "D&AD Yellow Pencil",
          issuer: "D&AD",
          date: "05/2022",
          description: "Yellow Pencil for innovative brand experience design",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Graham Neill",
          jobTitle: "CEO",
          company: "Native VML",
          email: "graham@nativevml.co.za",
          phone: "+27 82 777 8888",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Lindiwe Mthembu",
          jobTitle: "Group Marketing Director",
          company: "MTN SA",
          email: "lindiwe@mtn.co.za",
          phone: "+27 83 999 0000",
          order: 1,
        },
      ],
    }),
  ],
})

const siphoDlamini: CvWithRelations = base("compact", {
  accentColor: "#1e40af",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Sipho Dlamini",
    jobTitle: "Senior Software Engineer",
    email: "sipho.dlamini@example.co.za",
    phone: "+27 82 678 9012",
    location: "Stellenbosch, Western Cape",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [
      { type: "linkedin", url: "linkedin.com/in/sipholdlamini" },
      { type: "website", url: "siphodlamini.dev" },
      { type: "github", url: "github.com/sipho-dev" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Summary", 0, {
      content:
        "Full-stack engineer with 10+ years building distributed systems and consumer-scale applications at leading tech companies. Passionate about developer productivity, system reliability, and mentoring engineering teams. Open-source contributor and conference speaker at PyConZA and JSConf Africa.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Technical Skills", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Languages",
          skills: ["TypeScript", "Python", "Go", "Rust", "Java"],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Infrastructure",
          skills: ["AWS", "Kubernetes", "Terraform", "Docker", "Kafka"],
          visible: true,
          order: 1,
        },
      ],
    }),
    section("dummy-experience", "dummy", "EXPERIENCE", "Experience", 2, {
      experienceEntries: [
        {
          id: "dummy-exp1",
          sectionId: "dummy-experience",
          company: "Yoco",
          role: "Senior Software Engineer",
          location: "Cape Town, Western Cape",
          startDate: "03/2021",
          endDate: "",
          current: true,
          description: "",
          bullets: [
            "Designed and built the next-generation payment processing pipeline handling R50B+ in annual transaction volume",
            "Reduced p99 latency by 60% through distributed tracing optimisation and database query restructuring",
            "Tech-led a team of 8 engineers, establishing engineering best practices and conducting system design reviews",
          ],
          order: 0,
        },
        {
          id: "dummy-exp2",
          sectionId: "dummy-experience",
          company: "Takealot",
          role: "Software Engineer III",
          location: "Cape Town, Western Cape",
          startDate: "08/2017",
          endDate: "02/2021",
          current: false,
          description: "",
          bullets: [
            "Built real-time inventory management system supporting 500+ warehouses across South Africa",
            "Migrated monolithic inventory service to event-driven microservices architecture, improving deploy frequency by 10x",
          ],
          order: 1,
        },
      ],
    }),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "Stellenbosch University",
          degree: "B.Sc. in Computer Science",
          type: null,
          location: null,
          startDate: "02/2011",
          endDate: "11/2014",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "University of Cape Town",
          degree: "M.Sc. in Computer Science",
          type: null,
          location: null,
          startDate: "02/2015",
          endDate: "11/2016",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Open Source", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "kvstore-rs",
          link: "github.com/sipho-dev/kvstore-rs",
          description:
            "Embedded key-value store written in Rust with zero-copy deserialisation. 2,500+ GitHub stars.",
          technologies: ["Rust", "LSM Trees", "Zero-Copy"],
          order: 0,
        },
        {
          id: "dummy-prj2",
          sectionId: "dummy-projects",
          name: "PyZA Talks",
          link: null,
          description:
            "Community platform for tracking and discovering Python talks across African meetups and conferences.",
          technologies: ["TypeScript", "React", "Python"],
          order: 1,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "AWS Solutions Architect - Associate",
            issuer: "Amazon Web Services",
            issueDate: "06/2023",
            credentialId: "AWS-AS-12345",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Kubernetes Administrator (CKA)",
            issuer: "CNCF",
            issueDate: "03/2022",
            credentialId: "CKA-67890",
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Zulu",
          proficiency: "Native",
          order: 1,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Best Engineering Contribution",
          issuer: "Yoco Tech Awards",
          date: "12/2023",
          description: "For designing the next-gen payment processing pipeline",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Open Source Contributor of the Year",
          issuer: "PyConZA",
          date: "10/2022",
          description:
            "Recognised for contributions to the Python and Rust open source community in Africa",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Katherine Mills",
          jobTitle: "VP of Engineering",
          company: "Yoco",
          email: "katherine@yoco.com",
          phone: "+27 82 123 4567",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "James Nkuna",
          jobTitle: "Engineering Director",
          company: "Takealot",
          email: "james@takealot.com",
          phone: "+27 83 765 4321",
          order: 1,
        },
      ],
    }),
  ],
})

const amaraOkafor: CvWithRelations = base("gradient-cap", {
  accentColor: "#0891b2",
  fontFamily: "sans-serif",
  showPhoto: true,
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Amara Okafor",
    jobTitle: "Data Science Lead",
    email: "amara.okafor@example.ng",
    phone: "+234 802 345 6789",
    location: "Lagos, Nigeria",
    photoUrl:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [
      { type: "linkedin", url: "linkedin.com/in/amaraokafor" },
      { type: "github", url: "github.com/amara-ai" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Data Science Lead with 9+ years of experience building machine learning systems and leading data teams across fintech and payments in Africa. Track record of deploying ML models that drive revenue, reduce fraud, and improve customer experiences. Passionate about building data-driven cultures and mentoring the next generation of African data scientists.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Core Competencies", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Data Science",
          skills: [
            "Machine Learning",
            "Statistical Modelling",
            "Natural Language Processing",
            "Computer Vision",
            "Time Series Analysis",
            "A/B Testing",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Engineering",
          skills: [
            "Python",
            "TensorFlow / PyTorch",
            "Apache Spark",
            "SQL",
            "Docker",
            "Airflow",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Flutterwave",
            role: "Lead Data Scientist",
            location: "Lagos, Nigeria",
            startDate: "04/2021",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Architected and deployed an ML-driven fraud detection system that reduced payment fraud by 62% while maintaining a 99.8% approval rate across 30+ African markets",
              "Led a team of 12 data scientists and ML engineers, establishing MLOps practices that cut model deployment time from weeks to hours",
              "Built a customer churn prediction model serving 200K+ merchants, driving a 15% reduction in churn through targeted interventions",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Cellulant",
            role: "Senior Data Scientist",
            location: "Nairobi, Kenya",
            startDate: "06/2017",
            endDate: "03/2021",
            current: false,
            description: "",
            bullets: [
              "Designed a real-time credit scoring engine for mobile money users, enabling micro-loans to 500K+ previously unbanked customers",
              "Built recommendation systems that increased cross-sell conversion by 35% across digital payment products",
              "Created dashboards and data pipelines that reduced reporting time from days to minutes for the executive team",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of Nigeria, Nsukka",
          degree: "B.Sc. in Statistics (First Class Honours)",
          type: null,
          location: null,
          startDate: "10/2010",
          endDate: "07/2014",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "ALX Africa",
          degree: "Data Science Fellowship",
          type: null,
          location: null,
          startDate: "01/2016",
          endDate: "06/2016",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Projects", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Real-Time Fraud Detection Engine",
          link: null,
          description:
            "End-to-end ML system processing 2M+ transactions daily across 30 African countries, reducing fraud losses by R120M annually.",
          technologies: ["Python", "TensorFlow", "Kafka", "Redis"],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "TensorFlow Developer Certificate",
            issuer: "Google",
            issueDate: "08/2023",
            credentialId: "TF-87654",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "AWS Certified Machine Learning – Specialty",
            issuer: "Amazon Web Services",
            issueDate: "03/2022",
            credentialId: "ML-54321",
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Igbo",
          proficiency: "Native",
          order: 1,
        },
        {
          id: "dummy-lang3",
          sectionId: "dummy-languages",
          name: "Yoruba",
          proficiency: "Conversational",
          order: 2,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Best Data Science Innovation",
          issuer: "Flutterwave Tech Awards",
          date: "12/2023",
          description: "For the real-time fraud detection engine",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Africa Data Scientist of the Year",
          issuer: "Africa Tech Summit",
          date: "06/2022",
          description: "Recognised for contributions to financial inclusion through ML",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Chioma Eze",
          jobTitle: "Chief Technology Officer",
          company: "Flutterwave",
          email: "chioma@flutterwave.com",
          phone: "+234 803 111 2222",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Yemi Ojo",
          jobTitle: "VP of Engineering",
          company: "Cellulant",
          email: "yemi@cellulant.com",
          phone: "+254 712 333 4444",
          order: 1,
        },
      ],
    }),
  ],
})

const kwameAsante: CvWithRelations = base("bold-stamp", {
  accentColor: "#7c3aed",
  fontFamily: "serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Kwame Asante",
    jobTitle: "Corporate Counsel",
    email: "kwame.asante@example.gh",
    phone: "+233 302 456 7890",
    location: "Accra, Ghana",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [{ type: "linkedin", url: "linkedin.com/in/kwameasante" }],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Senior Corporate Counsel with 10+ years of experience advising multinational corporations on complex cross-border transactions, regulatory compliance, and corporate governance across West Africa. Proven track record in M&A, fintech regulation, and intellectual property strategy. Admitted to the Ghana Bar and recognised for pragmatic, business-oriented legal counsel.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Legal Expertise", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Corporate Law",
          skills: [
            "Mergers & Acquisitions",
            "Contract Negotiation",
            "Corporate Governance",
            "Joint Ventures",
            "Capital Markets",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Regulatory",
          skills: [
            "Fintech Regulation",
            "Data Protection & Privacy",
            "Competition Law",
            "Employment Law",
            "IP Protection",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Orrick, Herrington & Sutcliffe",
            role: "Senior Legal Counsel",
            location: "Accra, Ghana",
            startDate: "02/2020",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Lead legal counsel on 8 cross-border M&A transactions totalling $450M in enterprise value across Ghana, Nigeria, and Côte d'Ivoire",
              "Advised 15+ fintech clients on regulatory compliance, licensing, and data protection frameworks under the Bank of Ghana's digital agenda",
              "Built the West Africa IP portfolio for a multinational client, securing 40+ trademark registrations and managing infringement litigation",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Bentsi-Enchill, Letsa & Ankomah",
            role: "Corporate Associate",
            location: "Accra, Ghana",
            startDate: "06/2014",
            endDate: "01/2020",
            current: false,
            description: "",
            bullets: [
              "Managed due diligence and contract drafting for the $120M acquisition of a Ghanaian telecom tower portfolio by a pan-African infrastructure fund",
              "Advised on Ghana's first-ever mobile money interoperability framework, working closely with the Bank of Ghana and mobile network operators",
              "Led the firm's pro bono practice, providing legal clinics to 200+ small business owners across underserved communities",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of Ghana, Legon",
          degree: "LL.B. (Bachelor of Laws)",
          type: null,
          location: null,
          startDate: "09/2007",
          endDate: "06/2010",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "Ghana School of Law",
          degree: "Barrister-at-Law (BL)",
          type: null,
          location: null,
          startDate: "09/2010",
          endDate: "06/2012",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Transactions", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Cross-Border Fintech Licensing Programme",
          link: null,
          description:
            "Led regulatory licensing across 5 West African markets for a pan-African payments platform, reducing time-to-market by 60%.",
          technologies: [
            "Regulatory Strategy",
            "Cross-Border Compliance",
            "Policy Advocacy",
          ],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Barrister & Solicitor of the Supreme Court of Ghana",
            issuer: "General Legal Council",
            issueDate: "09/2012",
            credentialId: "GLC-24680",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Certified Data Protection Officer",
            issuer: "DPO Institute",
            issueDate: "06/2022",
            credentialId: "DPO-GH-13579",
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Twi",
          proficiency: "Native",
          order: 1,
        },
        {
          id: "dummy-lang3",
          sectionId: "dummy-languages",
          name: "French",
          proficiency: "Professional",
          order: 2,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Rising Star in Corporate Law",
          issuer: "Chambers Africa Awards",
          date: "05/2023",
          description: "Recognised for excellence in cross-border M&A and fintech regulation",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Pro Bono Lawyer of the Year",
          issuer: "Ghana Bar Association",
          date: "11/2021",
          description: "For outstanding pro bono contributions to small business legal access",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Nana Ama Asare",
          jobTitle: "Managing Partner",
          company: "Orrick Ghana Office",
          email: "nana.asare@orrick.com",
          phone: "+233 302 555 6666",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Kojo Thompson",
          jobTitle: "General Counsel",
          company: "AGC Networks Ghana",
          email: "kojo.thompson@agcgh.com",
          phone: "+233 244 777 8888",
          order: 1,
        },
      ],
    }),
  ],
})

const tumiMoshesh: CvWithRelations = base("sidebar-ink", {
  accentColor: "#d97706",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Tumi Moshesh",
    jobTitle: "Operations Director",
    email: "tumi.moshesh@example.co.za",
    phone: "+27 71 234 5678",
    location: "Gaborone, Botswana",
    photoUrl:
      "https://images.unsplash.com/photo-1598550874175-4d0ef314c0c9?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [{ type: "linkedin", url: "linkedin.com/in/tumimoshesh" }],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Accomplished Operations Director with 14+ years of experience in supply chain management, logistics optimisation, and operational excellence across Southern Africa. Expertise in driving efficiency gains through Lean Six Sigma methodologies, scaling distribution networks, and leading high-performance teams in fast-paced environments.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Core Competencies", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Operations",
          skills: [
            "Supply Chain Management",
            "Logistics Optimisation",
            "Warehouse Management",
            "Inventory Planning",
            "Process Improvement",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Leadership",
          skills: [
            "Team Leadership",
            "Strategic Planning",
            "Budget Management",
            "Vendor Negotiation",
            "KPI Dashboards",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "DHL Supply Chain",
            role: "Operations Director, Southern Africa",
            location: "Gaborone, Botswana",
            startDate: "03/2019",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Direct operations across 8 distribution centres in 5 SADC countries, managing 600+ staff and a fleet of 200+ vehicles",
              "Implemented Lean Six Sigma programmes that reduced operational costs by 22% and improved on-time delivery from 88% to 98%",
              "Led the integration of a regional competitor acquisition, consolidating 3 warehouses into 1 automated hub within 6 months",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Botswana Meat Commission",
            role: "Supply Chain Manager",
            location: "Lobatse, Botswana",
            startDate: "06/2013",
            endDate: "02/2019",
            current: false,
            description: "",
            bullets: [
              "Transformed cold-chain logistics serving export markets in Europe and Asia, reducing spoilage losses by 35% and achieving HACCP certification",
              "Negotiated freight contracts with 3 major shipping lines, reducing logistics costs by R18M annually",
              "Implemented an ERP-based inventory tracking system across 12 regional collection points",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of Botswana",
          degree: "B.Bus.Sc. in Supply Chain Management",
          type: null,
          location: null,
          startDate: "02/2006",
          endDate: "11/2009",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "Gordon Institute of Business Science (GIBS)",
          degree: "MBA",
          type: null,
          location: null,
          startDate: "01/2014",
          endDate: "12/2015",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Initiatives", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Regional Distribution Network Optimisation",
          link: null,
          description:
            "Redesigned the Southern Africa distribution network, consolidating 12 regional hubs into 8 automated centres and saving R45M annually.",
          technologies: [
            "Network Modelling",
            "Lean Six Sigma",
            "WMS Implementation",
          ],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Lean Six Sigma Black Belt",
            issuer: "International Association for Six Sigma Certification",
            issueDate: "08/2021",
            credentialId: "LSSBB-87654",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Project Management Professional (PMP)",
            issuer: "PMI",
            issueDate: "03/2019",
            credentialId: "PMP-543210",
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Setswana",
          proficiency: "Native",
          order: 1,
        },
        {
          id: "dummy-lang3",
          sectionId: "dummy-languages",
          name: "Zulu",
          proficiency: "Fluent",
          order: 2,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Supply Chain Leader of the Year",
          issuer: "Botswana Logistics Awards",
          date: "11/2023",
          description: "For transformative impact on regional logistics operations",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "CEO Award for Operational Excellence",
          issuer: "DHL Supply Chain SSA",
          date: "09/2022",
          description: "Recognised for outstanding cost reduction and service improvement",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Thabo Mogotsi",
          jobTitle: "Regional Director",
          company: "DHL Supply Chain SSA",
          email: "thabo.mogotsi@dhl.com",
          phone: "+27 82 444 5555",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Lerato Moilwa",
          jobTitle: "CEO",
          company: "Botswana Meat Commission",
          email: "lerato@bmc.co.bw",
          phone: "+267 71 222 3333",
          order: 1,
        },
      ],
    }),
  ],
})

const thaboMokoena: CvWithRelations = base("structured-pro", {
  accentColor: "#1e3a5f",
  fontFamily: "serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Thabo Mokoena",
    jobTitle: "Chartered Accountant CA(SA)",
    email: "thabo.mokoena@example.co.za",
    phone: "+27 82 111 2233",
    location: "Pretoria, Gauteng",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [
      { type: "linkedin", url: "linkedin.com/in/thabomokoena-ca" },
      { type: "website", url: "thabomokoena.co.za" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Chartered Accountant CA(SA) with 12+ years of experience in audit, financial reporting, and corporate finance across Big 4 firms and JSE-listed companies. Deep expertise in IFRS, financial controls, and regulatory compliance. Proven track record of leading complex audits, managing stakeholder relationships, and driving process improvements.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Core Competencies", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Accounting & Audit",
          skills: [
            "IFRS & GAAP",
            "External Audit",
            "Internal Controls",
            "Financial Reporting",
            "Risk Assessment",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Corporate Finance",
          skills: [
            "Financial Modelling",
            "Due Diligence",
            "Tax Planning",
            "Treasury Management",
            "Board Reporting",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "PwC South Africa",
            role: "Senior Manager, Audit",
            location: "Johannesburg, Gauteng",
            startDate: "07/2018",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Lead audit engagement teams for 8 JSE-listed clients across mining, financial services, and retail sectors with combined revenue of R120B+",
              "Drove the adoption of data analytics in audit methodology, reducing fieldwork time by 25% and improving risk detection rates by 40%",
              "Manage a portfolio of R30M in annual audit fees and mentor a team of 15 junior and senior associates",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Deloitte South Africa",
            role: "Audit Manager",
            location: "Pretoria, Gauteng",
            startDate: "02/2014",
            endDate: "06/2018",
            current: false,
            description: "",
            bullets: [
              "Managed statutory audits for government entities and SOEs, including a R15B infrastructure agency, ensuring clean audit opinions for 4 consecutive years",
              "Led IFRS 16 implementation for 3 major clients, coordinating cross-functional teams and achieving on-time delivery across all engagements",
              "Developed and delivered technical training on IFRS 9 and IFRS 15 to 100+ audit professionals across the firm",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of the Witwatersrand",
          degree: "B.Com. in Accounting (with distinction)",
          type: null,
          location: null,
          startDate: "02/2007",
          endDate: "11/2010",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "SAICA",
          degree: "Chartered Accountant CA(SA)",
          type: null,
          location: null,
          startDate: "01/2011",
          endDate: "12/2013",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Engagements", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Audit Transformation Programme",
          link: null,
          description:
            "Led the digital transformation of audit processes using data analytics and automation tools, reducing manual testing by 35% across 5 audit teams.",
          technologies: [
            "Data Analytics",
            "Audit Automation",
            "Process Reengineering",
          ],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Chartered Accountant CA(SA)",
            issuer: "SAICA",
            issueDate: "12/2013",
            credentialId: "CA-987654",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Certified Internal Auditor (CIA)",
            issuer: "IIA",
            issueDate: "06/2016",
            credentialId: "CIA-54321",
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Zulu",
          proficiency: "Native",
          order: 1,
        },
        {
          id: "dummy-lang3",
          sectionId: "dummy-languages",
          name: "Afrikaans",
          proficiency: "Conversational",
          order: 2,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Exceptional Auditing Award",
          issuer: "PwC South Africa",
          date: "12/2023",
          description: "For outstanding leadership in complex audit engagements",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "SAICA Top 50 Young CA",
          issuer: "SAICA",
          date: "06/2018",
          description: "Recognised as one of South Africa's top young Chartered Accountants",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Sipho Mngoma",
          jobTitle: "Partner, Audit",
          company: "PwC South Africa",
          email: "sipho.mngoma@pwc.com",
          phone: "+27 82 555 6666",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Refilwe Nkosi",
          jobTitle: "Chief Audit Executive",
          company: "Transnet",
          email: "refilwe.nkosi@transnet.net",
          phone: "+27 83 777 8888",
          order: 1,
        },
      ],
    }),
  ],
})

const nosiphoGqibitole: CvWithRelations = base("photo-header-float", {
  accentColor: "#b91c1c",
  fontFamily: "serif",
  showPhoto: true,
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Nosipho Gqibitole",
    jobTitle: "Senior Content Strategist",
    email: "nosipho.gqibitole@example.co.za",
    phone: "+27 73 456 7890",
    location: "Cape Town, Western Cape",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [
      { type: "linkedin", url: "linkedin.com/in/nosiphogqibitole" },
      { type: "website", url: "nosiphowrites.co.za" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Award-winning Senior Content Strategist with 8+ years of experience shaping editorial voices and digital content strategies for leading South African media and brands. Expertise in audience growth, SEO-driven content, and brand storytelling. Passionate about authentic African narratives and data-informed content decisions.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Core Competencies", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Content Strategy",
          skills: [
            "Editorial Planning",
            "SEO & Content Optimisation",
            "Audience Development",
            "Social Media Strategy",
            "Brand Storytelling",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Production",
          skills: [
            "Copywriting & Editing",
            "Content Management Systems",
            "Analytics & Reporting",
            "Podcast Production",
            "Video Scripting",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Mail & Guardian",
            role: "Senior Content Strategist",
            location: "Cape Town, Western Cape",
            startDate: "03/2020",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Led the digital content strategy that grew monthly unique readers from 800K to 2.5M within 18 months through SEO, social distribution, and audience insights",
              "Spearheaded the launch of 4 new digital verticals covering climate, tech, culture, and investigations, each exceeding traffic targets by 30%+",
              "Managed a team of 10 content producers and editors, establishing editorial workflows that improved publishing cadence by 50%",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Media24",
            role: "Content Manager",
            location: "Cape Town, Western Cape",
            startDate: "06/2016",
            endDate: "02/2020",
            current: false,
            description: "",
            bullets: [
              "Managed content operations for a portfolio of 6 lifestyle and news digital publications with combined monthly reach of 4M users",
              "Developed a branded content programme that generated R5M in annual revenue within the first year of launch",
              "Implemented a data-driven content framework that increased average engagement time by 45% and reduced bounce rate by 20%",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "Rhodes University",
          degree: "B.Jrn (Bachelor of Journalism)",
          type: null,
          location: null,
          startDate: "02/2011",
          endDate: "11/2014",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "University of Cape Town",
          degree: "PGDip in Digital Media",
          type: null,
          location: null,
          startDate: "02/2015",
          endDate: "11/2015",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Projects", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Mail & Guardian Digital Transformation",
          link: null,
          description:
            "Led the strategic overhaul of the M&G digital presence, including site redesign, CMS migration, and audience development roadmap.",
          technologies: [
            "SEO Strategy",
            "CMS Migration",
            "Audience Analytics",
          ],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Google Digital Marketing Certificate",
            issuer: "Google",
            issueDate: "06/2023",
            credentialId: "GDM-87654",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "HubSpot Content Marketing Certification",
            issuer: "HubSpot Academy",
            issueDate: "03/2022",
            credentialId: "HCM-12345",
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Xhosa",
          proficiency: "Native",
          order: 1,
        },
        {
          id: "dummy-lang3",
          sectionId: "dummy-languages",
          name: "Zulu",
          proficiency: "Conversational",
          order: 2,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Standard Bank Sikuvile Journalism Award",
          issuer: "Standard Bank",
          date: "10/2023",
          description: "For outstanding digital feature writing on South Africa's water crisis",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Vodacom Journalist of the Year – Digital",
          issuer: "Vodacom",
          date: "11/2022",
          description: "Recognised for innovative digital storytelling and audience engagement",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Vuyiswa Mokoena",
          jobTitle: "Editor-in-Chief",
          company: "Mail & Guardian",
          email: "vuyiswa@mg.co.za",
          phone: "+27 82 222 3333",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Themba Baloyi",
          jobTitle: "Head of Content",
          company: "Media24 Digital",
          email: "tbaloyi@media24.com",
          phone: "+27 83 444 5555",
          order: 1,
        },
      ],
    }),
  ],
})

const kylePetersen: CvWithRelations = base("student-sidebar", {
  accentColor: "#0f766e",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Kyle Petersen",
    jobTitle: "B.Com. Finance Graduate",
    email: "kyle.petersen@example.co.za",
    phone: "+27 72 345 6789",
    location: "Cape Town, Western Cape",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [
      { type: "linkedin", url: "linkedin.com/in/kylepetersen" },
      { type: "github", url: "github.com/kylepetersen" },
    ],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Personal Statement", 0, {
      content:
        "Motivated and detail-oriented B.Com. Finance graduate from the University of Cape Town, seeking an entry-level role in financial analysis or investment banking. Strong analytical, numerical, and communication skills developed through academic excellence, leadership roles, and internship experience at leading South African financial institutions.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Skills & Attributes", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Technical",
          skills: [
            "Financial Analysis & Modelling",
            "Microsoft Excel (Advanced)",
            "Data Visualisation (Tableau)",
            "Python (Pandas, NumPy)",
            "Accounting Fundamentals",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Professional",
          skills: [
            "Communication & Presentation",
            "Team Collaboration",
            "Problem Solving",
            "Time Management",
            "Attention to Detail",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Old Mutual",
            role: "Graduate Trainee, Finance",
            location: "Cape Town, Western Cape",
            startDate: "02/2025",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Rotating through Corporate Finance, Asset Management, and Risk divisions as part of a 12-month structured graduate programme",
              "Assisted in preparing financial models and valuation reports for a R500M infrastructure investment proposal",
              "Presented weekly market update briefings to the investment committee, analysing macroeconomic trends and sector performance",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Shoprite Group",
            role: "Finance Intern",
            location: "Cape Town, Western Cape",
            startDate: "06/2024",
            endDate: "12/2024",
            current: false,
            description: "",
            bullets: [
              "Supported the accounts payable team in processing 2,000+ supplier invoices monthly, achieving 99% accuracy rate",
              "Reconciled general ledger accounts and assisted with month-end close procedures",
              "Created Power BI dashboards tracking procurement spend that identified R2M in cost-saving opportunities",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of Cape Town",
          degree: "B.Com. in Finance & Accounting (Cum Laude)",
          type: null,
          location: null,
          startDate: "02/2021",
          endDate: "11/2024",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "UCT Investment Society",
          degree: "Certificate in Equity Research & Valuation",
          type: null,
          location: null,
          startDate: "02/2023",
          endDate: "11/2023",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Leadership & Activities", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "UCT Investment Society – Portfolio Manager",
          link: null,
          description:
            "Managed a simulated R10M equity portfolio for the society's annual investment challenge, achieving a 18% return — top 5 out of 40 teams.",
          technologies: ["Financial Modelling", "Portfolio Management", "Bloomberg"],
          order: 0,
        },
        {
          id: "dummy-prj2",
          sectionId: "dummy-projects",
          name: "Shackville Tutoring Programme",
          link: null,
          description:
            "Volunteered weekly as a maths tutor for 20 high school students from underserved communities in Cape Town.",
          technologies: ["Mentoring", "Community Outreach"],
          order: 1,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Bloomberg Market Concepts (BMC)",
            issuer: "Bloomberg LP",
            issueDate: "08/2024",
            credentialId: "BMC-54321",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "CFI Financial Modelling & Valuation Analyst (FMVA)",
            issuer: "Corporate Finance Institute",
            issueDate: "10/2024",
            credentialId: "FMVA-98765",
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Afrikaans",
          proficiency: "Native",
          order: 1,
        },
        {
          id: "dummy-lang3",
          sectionId: "dummy-languages",
          name: "Xhosa",
          proficiency: "Basic",
          order: 2,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Dean's Merit List",
          issuer: "University of Cape Town",
          date: "12/2024",
          description: "Awarded for maintaining a cumulative average above 75%",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "Golden Key International Honour Society",
          issuer: "Golden Key Society",
          date: "03/2023",
          description: "Inducted for academic excellence in the top 15% of faculty",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Prof. Jonathan Sampson",
          jobTitle: "Head of Finance Division",
          company: "University of Cape Town",
          email: "jsampson@uct.ac.za",
          phone: "+27 21 650 1234",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Lindiwe Hlope",
          jobTitle: "Graduate Programme Manager",
          company: "Old Mutual",
          email: "lhlope@oldmutual.com",
          phone: "+27 82 888 9999",
          order: 1,
        },
      ],
    }),
  ],
})

const nomvulaZulu: CvWithRelations = base("accent-band", {
  accentColor: "#b45309",
  fontFamily: "sans-serif",
  personalDetails: {
    id: "dummy-pd",
    curriculumVitaeId: "dummy",
    fullName: "Nomvula Zulu",
    jobTitle: "Regional Sales Manager",
    email: "nomvula.zulu@example.co.za",
    phone: "+27 83 567 8901",
    location: "Durban, KwaZulu-Natal",
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
    photoObjectPosition: null,
    photoCrop: null,
    nationality: null,
    updatedAt: new Date(),
    links: [{ type: "linkedin", url: "linkedin.com/in/nomvulazulu" }],
  },
  sections: [
    section("dummy-summary", "dummy", "SUMMARY", "Professional Summary", 0, {
      content:
        "Results-driven Regional Sales Manager with 13+ years of experience in FMCG sales, key account management, and route-to-market strategy across Southern Africa. Proven track record of exceeding revenue targets, building high-performing sales teams, and expanding distribution into underserved markets.",
    }),
    section("dummy-skills", "dummy", "SKILLS", "Core Competencies", 1, {
      skillGroups: [
        {
          id: "dummy-sg1",
          sectionId: "dummy-skills",
          label: "Sales",
          skills: [
            "Sales Strategy & Planning",
            "Key Account Management",
            "Trade Marketing",
            "Distribution Management",
            "Revenue Growth",
          ],
          visible: true,
          order: 0,
        },
        {
          id: "dummy-sg2",
          sectionId: "dummy-skills",
          label: "Leadership",
          skills: [
            "Team Leadership",
            "Negotiation",
            "Category Management",
            "Budgeting & Forecasting",
            "Salesforce CRM",
          ],
          visible: true,
          order: 1,
        },
      ],
    }),
    section(
      "dummy-experience",
      "dummy",
      "EXPERIENCE",
      "Professional Experience",
      2,
      {
        experienceEntries: [
          {
            id: "dummy-exp1",
            sectionId: "dummy-experience",
            company: "Unilever South Africa",
            role: "Regional Sales Manager, KZN",
            location: "Durban, KwaZulu-Natal",
            startDate: "04/2019",
            endDate: "",
            current: true,
            description: "",
            bullets: [
              "Manage a team of 12 area sales managers and 80+ merchandisers across KZN, delivering R1.2B in annual revenue against a R1.1B target (9% overachieve)",
              "Developed and executed an informal trade expansion strategy that added 5,000+ new spaza shop and street vendor accounts, growing revenue by 25%",
              "Launched 3 new product categories into the KZN market, achieving 98% distribution in modern trade within 8 weeks",
            ],
            order: 0,
          },
          {
            id: "dummy-exp2",
            sectionId: "dummy-experience",
            company: "Tiger Brands",
            role: "Key Account Manager",
            location: "Durban, KwaZulu-Natal",
            startDate: "06/2013",
            endDate: "03/2019",
            current: false,
            description: "",
            bullets: [
              "Managed the Shoprite and Checker KwaZulu-Natal accounts, growing the joint portfolio from R180M to R320M in annual sales over 3 years",
              "Negotiated annual trading terms, promotional calendars, and shelf-space allocations that improved category market share by 5 percentage points",
              "Led cross-functional ranging and delisting processes, achieving a 95% ranging success rate for new product launches",
            ],
            order: 1,
          },
        ],
      }
    ),
    section("dummy-education", "dummy", "EDUCATION", "Education", 3, {
      educationEntries: [
        {
          id: "dummy-edu1",
          sectionId: "dummy-education",
          institution: "University of KwaZulu-Natal",
          degree: "B.Com. in Marketing",
          type: null,
          location: null,
          startDate: "02/2007",
          endDate: "11/2010",
          order: 0,
        },
        {
          id: "dummy-edu2",
          sectionId: "dummy-education",
          institution: "MANCOSA",
          degree: "PGDip in Business Management",
          type: null,
          location: null,
          startDate: "02/2013",
          endDate: "11/2014",
          order: 1,
        },
      ],
    }),
    section("dummy-projects", "dummy", "PROJECTS", "Key Initiatives", 4, {
      projectEntries: [
        {
          id: "dummy-prj1",
          sectionId: "dummy-projects",
          name: "Informal Trade Expansion Programme",
          link: null,
          description:
            "Designed and implemented a township and rural distribution model that grew Unilever's KZN informal channel penetration by 40%.",
          technologies: [
            "Route-to-Market Strategy",
            "Distributor Management",
            "Field Intelligence",
          ],
          order: 0,
        },
      ],
    }),
    section(
      "dummy-certifications",
      "dummy",
      "CERTIFICATIONS",
      "Certifications",
      5,
      {
        certificationEntries: [
          {
            id: "dummy-cert1",
            sectionId: "dummy-certifications",
            name: "Unilever Sales Leadership Programme",
            issuer: "Unilever Global",
            issueDate: "06/2022",
            credentialId: "USLP-87654",
            credentialUrl: null,
            expiryDate: null,
            order: 0,
          },
          {
            id: "dummy-cert2",
            sectionId: "dummy-certifications",
            name: "Salesforce Certified Administrator",
            issuer: "Salesforce",
            issueDate: "03/2021",
            credentialId: "SF-54321",
            credentialUrl: null,
            expiryDate: null,
            order: 1,
          },
        ],
      }
    ),
    section("dummy-languages", "dummy", "LANGUAGES", "Languages", 6, {
      languageEntries: [
        {
          id: "dummy-lang1",
          sectionId: "dummy-languages",
          name: "English",
          proficiency: "Native",
          order: 0,
        },
        {
          id: "dummy-lang2",
          sectionId: "dummy-languages",
          name: "Zulu",
          proficiency: "Native",
          order: 1,
        },
        {
          id: "dummy-lang3",
          sectionId: "dummy-languages",
          name: "Afrikaans",
          proficiency: "Conversational",
          order: 2,
        },
      ],
    }),
    section("dummy-awards", "dummy", "AWARDS", "Awards", 7, {
      awardEntries: [
        {
          id: "dummy-award1",
          sectionId: "dummy-awards",
          title: "Top Regional Manager 2023",
          issuer: "Unilever South Africa",
          date: "12/2023",
          description: "For exceeding revenue targets by 9% and expanding distribution",
          order: 0,
        },
        {
          id: "dummy-award2",
          sectionId: "dummy-awards",
          title: "MD's Award for Excellence",
          issuer: "Tiger Brands",
          date: "11/2018",
          description: "Recognised for outstanding account management and portfolio growth",
          order: 1,
        },
      ],
    }),
    section("dummy-references", "dummy", "REFERENCES", "References", 8, {
      referenceEntries: [
        {
          id: "dummy-ref1",
          sectionId: "dummy-references",
          name: "Sanele Ndlovu",
          jobTitle: "Sales Director, South Africa",
          company: "Unilever",
          email: "sanele.ndlovu@unilever.com",
          phone: "+27 82 666 7777",
          order: 0,
        },
        {
          id: "dummy-ref2",
          sectionId: "dummy-references",
          name: "Nomsa Buthelezi",
          jobTitle: "Commercial Director",
          company: "Tiger Brands",
          email: "nomsa.buthelezi@tigerbrands.co.za",
          phone: "+27 83 222 3333",
          order: 1,
        },
      ],
    }),
  ],
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
  "structured-pro": thaboMokoena,
  "centred-serif": amaraOkafor,
  "accent-band": nomvulaZulu,
  "split-head": tumiMoshesh,
  "ruled-editorial": amaraOkafor,
  "bold-stamp": kwameAsante,
  "sidebar-ink": tumiMoshesh,
  "photo-header-float": nosiphoGqibitole,
  "photo-centred": drNalediKhumalo,
  "condensed-rule": siphoDlamini,
  "graduate-first": kwameAsante,
  "student-sidebar": kylePetersen,
  "clean-start": drNalediKhumalo,
}

export function createCurriculumVitae(
  templateId = "clean-line"
): CvWithRelations {
  return PROFILES[templateId] ?? thandiweMokoena
}
