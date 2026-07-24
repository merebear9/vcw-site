import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMMM d, yyyy");
}

export function isSvgPath(src: string | null | undefined) {
  return !!src && src.toLowerCase().endsWith(".svg");
}

export function categorySlug(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function siteUrl(path = "") {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}

export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  FOIA_RESPONSE: "FOIA Response",
  MEETING_MINUTES: "Meeting Minutes",
  COURT_FILING: "Court Filing",
  BUDGET_FINANCE: "Budget/Finance",
  CONTRACTS: "Contracts",
  PERSONNEL: "Personnel",
  OTHER: "Other",
};
