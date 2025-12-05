import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility to merge Tailwind class names safely
export function cn(...inputs: ClassValue[]) {
  // clsx handles conditional classes, twMerge resolves Tailwind conflicts
  return twMerge(clsx(inputs))
}
