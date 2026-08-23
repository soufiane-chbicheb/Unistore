export function isMeaningfulValue(v: any): boolean {
  if (v === null || v === undefined) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 3;
  if (typeof v === "number") return v > 0;
  if (typeof v === "object")
    return Object.values(v).some(isMeaningfulValue);
  return false;
}