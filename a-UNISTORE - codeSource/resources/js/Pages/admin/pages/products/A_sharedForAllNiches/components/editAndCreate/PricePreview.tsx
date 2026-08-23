// ─── Price Preview ────────────────────────────────────────────────────────────
export default function PricePreview({
  price,
  comparePrice,
  currentTheme,
}: {
  price: number | null;
  comparePrice: number | null;
  currentTheme: any;
}) {
  const hasPrice = (price ?? 0) > 0;
  const hasComparePrice = !!comparePrice && comparePrice > (price ?? 0);
  const discount =
    hasComparePrice && hasPrice
      ? Math.round(((comparePrice! - price!) / comparePrice!) * 100)
      : null;

  return (
    <div
      className="rounded-xl p-5 flex flex-col justify-center shadow-sm"
      style={{
        backgroundColor: currentTheme.bg,
        border: `2px dashed ${currentTheme.border}`,
        color: currentTheme.text,
      }}
    >
      <p className="text-xs uppercase tracking-wide opacity-70 mb-2">
        Price preview
      </p>

      {hasComparePrice && (
        <p className="text-sm line-through opacity-60">
          ${Number(comparePrice!).toFixed(2)}
        </p>
      )}

      <p className="text-2xl font-bold">
        {hasPrice ? `$${Number(price!).toFixed(2)}` : '--'}
      </p>

      {discount !== null && (
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full mt-2 self-start"
          style={{
            backgroundColor: currentTheme.error + '18',
            color: currentTheme.error,
          }}
        >
          -{discount}% OFF
        </span>
      )}

      {!hasPrice && (
        <p className="text-xs opacity-50 mt-1">Enter a price to preview</p>
      )}
    </div>
  );
}
