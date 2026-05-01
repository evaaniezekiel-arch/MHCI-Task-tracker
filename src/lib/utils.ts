import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'Done': return 'bg-[#C6EFCE] text-[#2D7A3A]';
    case 'In-Progress': return 'bg-[#FFEB9C] text-[#856A00]';
    case 'Pending': return 'bg-[#DDEEFF] text-[#1A4D8A]';
    case 'Undone': return 'bg-[#FFC7CE] text-[#9B2335]';
    case 'KIV': return 'bg-[#E2C4F0] text-[#6B3FA0]';
    default: return 'bg-gray-100 text-gray-800';
  }
}
