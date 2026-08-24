import { ThemePalette } from "@/types/ThemeTypes";
import { Truck , RotateCcw , ShieldCheck  , MessageCircle} from "lucide-react";

const TrustBar = ({ shipping, promotions, theme }: { shipping: any; promotions: any[]; theme: ThemePalette }) => {
  const t = theme;
  const hasFreeShipping = promotions?.some((p: any) => p.type === "free_shipping");
  const items: { icon: React.ReactNode; title: string; sub: string }[] = [
    { icon: <Truck size={22} strokeWidth={1.5} />,        title: hasFreeShipping ? "Free Shipping" : (shipping?.shippingCostOverride === 0 ? "Free Shipping" : "Fast Shipping"), sub: hasFreeShipping ? "Active promotion" : "Orders over $50" },
    { icon: <RotateCcw size={22} strokeWidth={1.5} />,    title: `${shipping?.returnWindow ?? 30}-Day Returns`, sub: shipping?.returnPolicy === "free_return" ? "Free return" : "Easy return" },
    { icon: <ShieldCheck size={22} strokeWidth={1.5} />,  title: "Secure Payment", sub: "SSL encrypted" },
    { icon: <MessageCircle size={22} strokeWidth={1.5} />,title: "24/7 Support", sub: "Live chat" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ padding: "20px 16px", textAlign: "center", position: "relative" }}>
          {i > 0 && <div style={{ position: "absolute", left: 0, top: "20%", height: "60%", width: 1, background: "rgba(255,255,255,0.05)" }} />}
          <div style={{ fontSize: 22, marginBottom: 8, color: t.textMuted, display: "flex", justifyContent: "center" }}>{item.icon}</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, marginBottom: 3, color: t.text }}>{item.title}</div>
          <div style={{ fontSize: 11, color: t.textMuted }}>{item.sub}</div>
        </div>
      ))}
    </div>
  );

};

export default TrustBar ;
