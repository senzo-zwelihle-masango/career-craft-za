import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// format date
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function formatDate(date: string, format: string = "MM/YYYY"): string {
  if (!date) return ""

  const parts = date.split("/")
  if (parts.length !== 2) return date

  const month = parseInt(parts[0], 10)
  const year = parts[1]

  if (isNaN(month)) return date

  switch (format) {
    case "YYYY":
      return year
    case "MMM YYYY":
      return `${MONTHS_SHORT[month - 1] || month} ${year}`
    case "MMMM YYYY":
      return `${MONTHS_FULL[month - 1] || month} ${year}`
    case "YYYY-MM":
      return `${year}-${String(month).padStart(2, "0")}`
    case "MM/YYYY":
    default:
      return `${String(month).padStart(2, "0")}/${year}`
  }
}