import { ThemePalette } from "@/types/ThemeTypes";

const SectionHeading = ({ title, theme }: { title: string; theme: ThemePalette }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
    <h2 style={{
      fontSize: 19, fontWeight: 700, color: theme.text,
      whiteSpace: "nowrap", fontFamily: "'Syne', sans-serif",
    }}>
      {title}
    </h2>
    <div style={{
      flex: 1, height: 1,
      background: `linear-gradient(90deg, ${theme.border ?? "rgba(255,255,255,0.07)"} 0%, transparent 100%)`,
    }} />
  </div>
);

export default SectionHeading ; 
