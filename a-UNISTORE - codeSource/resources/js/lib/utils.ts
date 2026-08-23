import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductPlaceholder(id: string | number) {
  const colors = [
    '#f8fafc', '#f1f5f9', '#e2e8f0', '#f1f5f9', '#f8fafc'
  ];
  const color = colors[Number(id) % colors.length] || colors[0];
  return `https://placehold.co/600x800/${color.replace('#', '')}/64748b?text=Product+Image`;
}
