import { convertYoutubeToEmbed } from "@/functions/product/convertYoutubeToEmbed";
import { ThemePalette } from "@/types/ThemeTypes";
import SectionHeading from "./SectionHeading";

/* ─────────────────────────────────────────
   VIDEOS SECTION
───────────────────────────────────────── */
const VideosSection = ({ videos, theme }: { videos: any[]; theme: ThemePalette }) => {
  const t = theme;
  if (!videos?.length) return null;
  return (
    <>
      <SectionHeading title="See It In Action" theme={t} />
      <div style={{ height: 520, overflowY: "scroll", scrollSnapType: "y mandatory", borderRadius: 18, scrollbarWidth: "none" as const, background: t.card }}>
        {videos.map((v: any, i: number) => (
          <div key={v.id ?? i} style={{ scrollSnapAlign: "start", height: 520, position: "relative", background: `linear-gradient(180deg, ${t.card} 0%, ${t.bg} 100%)`, borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            {v.media_type === "iframe" ? (
              <iframe src={convertYoutubeToEmbed(v.url ?? "") ?? ""} style={{ width: "100%", height: "100%", border: "none", borderRadius: 18 }} allowFullScreen />
            ) : (
              <video src={v.url ?? ""} controls style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18 }} />
            )}
            <div style={{ position: "absolute", bottom: 18, right: 20, fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", pointerEvents: "none" }}>
              {i + 1} / {videos.length}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: t.textMuted, marginTop: 12, letterSpacing: "1px", opacity: 0.6 }}>↕ scroll to see more videos</div>
    </>
  );
};


export default VideosSection ;
