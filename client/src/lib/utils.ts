import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMMM d, yyyy");
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function calculateTimeSince(startDate: string): { 
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const start = new Date(startDate);
  const now = new Date();
  
  // Calculate time difference without resetting hours to make day count accurate
  const timeDifference = Math.max(0, now.getTime() - start.getTime());
  
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getCompletedBucketItemCount(bucketItems: Array<{ completed: boolean }>): number {
  return bucketItems.filter(item => item.completed).length;
}

export function getCompletionPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
