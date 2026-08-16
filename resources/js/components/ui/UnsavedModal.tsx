import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { AlertTriangle } from "lucide-react";

export default function UnsavedModal({ bannerName, onDiscard, onKeep }: {
  bannerName: string;
  onDiscard: () => void;
  onKeep: () => void;
}) {
  const { state: { currentTheme: t } } = useStoreConfigCtx();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onKeep} />
      <div style={{
        position: 'relative', zIndex: 10, width: 380,
        borderRadius: 16, border: `1px solid ${t.border}`,
        padding: 24, boxShadow: t.shadowLg, backgroundColor: t.bgSecondary,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          <div style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: `${t.primary}20`,
          }}>
            <AlertTriangle size={16} style={{ color: t.primary }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: t.text }}>
              You have unsaved changes
            </p>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: t.textSecondary }}>
              Changes to <strong>{bannerName}</strong> will be lost if you switch without publishing first.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onKeep} style={{
            flex: 1, padding: '10px 0', fontSize: 10, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            backgroundColor: t.primary, color: t.textInverse,
          }}>Keep Editing</button>
          <button onClick={onDiscard} style={{
            flex: 1, padding: '10px 0', fontSize: 10, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            borderRadius: 10, border: `1px solid ${t.border}`,
            background: 'transparent', cursor: 'pointer', color: t.text,
          }}>Discard Changes</button>
        </div>
      </div>
    </div>
  );
}
