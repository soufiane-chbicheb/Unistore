import { ThemePalette } from "@/types/ThemeTypes";
import SectionHeading from "./SectionHeading";
import { Star } from "lucide-react";

interface ReviewUser {
  id: number;
  name: string;
  avatar: { id: string | number; url: string } | null;
  created_at: string;
}
interface Review {
  id: number;
  product_id: number;
  rating: number;
  text: string;
  user: ReviewUser;
  user_id: number;
}


const ReviewsBreakDown = ({ product, theme }: { product: any; theme: ThemePalette }) => {
  const t = theme;
  const reviews: Review[] = product.reviews ?? [];
  const breakdown: Record<string | number, number> = product.rating_breakdown ?? {};

  /* compute avg from reviews array if payload avg is null */
  const computedAvg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;
  const avg: number | null = product.rating_average != null
    ? Number(product.rating_average)
    : computedAvg;

  /* use reviews.length as fallback when rating_count is 0 but reviews exist */
  const count: number = (product.rating_count && product.rating_count > 0)
    ? product.rating_count
    : reviews.length;

  const gold = t.starColor ?? t.accent ?? "#d4a843";

  const Stars = ({ n, size = 14 }: { n: number; size?: number }) => (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          size={size}
          strokeWidth={1.5}
          style={{
            fill: s <= Math.round(n) ? gold : "transparent",
            color: s <= Math.round(n) ? gold : "rgba(255,255,255,0.2)",
          }}
        />
      ))}
    </span>
  );

  /* fallback initial avatar */
  const Avatar = ({ user }: { user: ReviewUser }) => {
    if (user.avatar?.url) {
      return (
        <img
          src={user.avatar.url}
          alt={user.name}
          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
      );
    }
    const initial = user.name?.[0]?.toUpperCase() ?? "?";
    return (
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg, ${t.card ?? "#1a1a1e"}, ${t.bgSecondary ?? "#121214"})`,
        border: `1px solid ${t.border ?? "rgba(255,255,255,0.08)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: t.textMuted ?? "#5a5760",
      }}>
        {initial}
      </div>
    );
  };

  /* privacy mask: "Ms. Meghan Jacobson" → "M***n" */
  const maskName = (name: string) => {
    if (!name || name.length < 2) return name ?? "User";
    return name[0] + "***" + name[name.length - 1];
  };

  return (
    <>
      <SectionHeading title="Customer Reviews" theme={t} />
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 32 }}>

        {/* ── Rating Summary ── */}
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 64, fontWeight: 800, lineHeight: 1, color: t.priceText ?? t.text }}>
            {avg != null ? Number(avg).toFixed(1) : "—"}
          </div>
          <div style={{ margin: "8px 0 4px" }}>
            {avg != null ? <Stars n={avg} size={18} /> : <Stars n={0} size={18} />}
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>{count} verified review{count !== 1 ? "s" : ""}</div>

          {/* Rating bars — keys can be number or string */}
          {[5,4,3,2,1].map(r => {
            const n: number = (breakdown[r] ?? breakdown[String(r)]) ?? 0;
            const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? (n / total) * 100 : 0;
            return (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 22, textAlign: "right", fontSize: 11, color: t.textMuted }}>{r}</span>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${gold}, ${t.accentHover ?? gold})`, borderRadius: 2 }} />
                </div>
                <span style={{ width: 24, fontSize: 11, color: t.textMuted }}>{n}</span>
              </div>
            );
          })}
        </div>

        {/* ── Review Cards ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {reviews.length === 0 && (
            <p style={{ fontSize: 13, color: t.textMuted, fontStyle: "italic" }}>No reviews yet.</p>
          )}
          {reviews.map((rv, i) => (
            <div key={rv.id} style={{ padding: "20px 0", borderTop: i > 0 ? `1px solid ${t.border ?? "rgba(255,255,255,0.04)"}` : "none" }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar user={rv.user} />
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600, color: t.text }}>
                      {maskName(rv.user.name)}
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>
                      {rv.user.created_at
                        ? new Date(rv.user.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                        : ""}
                    </div>
                  </div>
                </div>
                <Stars n={rv.rating} size={12} />
              </div>

              <p style={{ fontSize: 13, color: t.text, opacity: 0.65, lineHeight: 1.6, margin: 0 }}>
                {rv.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewsBreakDown ; 
