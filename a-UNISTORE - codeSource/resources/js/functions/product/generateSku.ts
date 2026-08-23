export function generateSKU(productName: string, brand: string, releaseDate?: string): string {
  if (!productName && !brand) {
    return '';
  }
  // Normalize helpers
  const normalize = (str: string) =>
    str
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, ""); // remove spaces + special chars

  const pn = normalize(productName).slice(0, 6); // first 6 letters of product name
  const br = normalize(brand).slice(0, 4);       // first 4 letters of brand

  let dateOrRandom: string;

  if (releaseDate) {
    // expected format YYYY-MM-DD or similar
    const d = new Date(releaseDate);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear().toString().slice(2);  // YY
      const month = String(d.getMonth() + 1).padStart(2, "0"); // MM
      const day = String(d.getDate()).padStart(2, "0");        // DD
      dateOrRandom = `${year}${month}${day}`; // YYMMDD
    } else {
      // invalid date → fallback
      dateOrRandom = Math.floor(1000 + Math.random() * 9000).toString();
    }
  } else {
    // no date → random 4-digit number
    dateOrRandom = Math.floor(1000 + Math.random() * 9000).toString();
  }

  return `${br}-${pn}-${dateOrRandom}`;
}
