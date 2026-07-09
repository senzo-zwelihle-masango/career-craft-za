import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://careercraftza.com"),
  title: {
    default: "Career Craft ZA",
    template: "%s - Career Craft ZA",
  },
  description:
    "Build a professional CV, cover letter, and track every job application in one place. Career Craft ZA helps South African job seekers create ATS-friendly resumes, tailor applications, and manage their job search end to end.",
  keywords: [
    "Career Craft ZA",
    "CV builder",
    "resume builder",
    "South Africa",
    "ATS friendly CV",
    "job application tracker",
    "cover letter builder",
    "job search South Africa",
    "professional resume",
    "online CV maker",
    "career tools",
    "job tracker",
    "CV templates",
    "resume templates",
  ],
  authors: [{ name: "Senzo Masango" }],
  creator: "Senzo Masango",
  publisher: "Career Craft ZA",
  applicationName: "Career Craft ZA",
  category: "Productivity",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://careercraftza.com",
    siteName: "Career Craft ZA",
    title: "Career Craft ZA | Build Your CV & Land the Job",
    description:
      "Build a professional CV, cover letter, and track every job application in one place. Career Craft ZA helps South African job seekers create ATS-friendly resumes, tailor applications, and manage their job search end to end.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Career Craft ZA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Craft ZA | Build Your CV & Land the Job",
    description:
      "Build a professional CV, cover letter, and track every job application in one place. Career Craft ZA helps South African job seekers create ATS-friendly resumes and manage their job search end to end.",
    creator: "@careercraftza",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "manifest",
        url: "/favicon/site.webmanifest",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}
