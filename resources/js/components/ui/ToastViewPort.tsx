import { ToastInternal } from "@/contextProvoders/ToastProvider";
import { Toast } from "./Toast";


export function ToastViewport({
  toasts,
  onRemove,
}: {
  toasts: ToastInternal[];
  onRemove: (id: string) => void;
}) {
  return (
    <>
      <style>{css}</style>
      <div className="tv-viewport">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </div>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

  .tv-viewport {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
    pointer-events: none;
    width: 360px;
    max-width: calc(100vw - 40px);
  }

  .tv-toast {
    pointer-events: all;
    position: relative;
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 13px;
    padding: 16px 16px 20px 16px;
    border-radius: 16px;
    border: 1px solid var(--border);
    background: var(--bg);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 24px 48px rgba(0,0,0,0.5),
      0 4px 12px rgba(0,0,0,0.3),
      0 0 40px var(--glow);
    overflow: hidden;
    backdrop-filter: blur(20px) saturate(180%);
    cursor: default;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .tv-toast:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06) inset,
      0 32px 64px rgba(0,0,0,0.55),
      0 4px 16px rgba(0,0,0,0.3),
      0 0 60px var(--glow);
  }

  .tv-glow {
    position: absolute;
    top: -20px;
    left: -20px;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, var(--glow) 0%, transparent 70%);
    pointer-events: none;
    border-radius: 50%;
  }

  .tv-toast::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 3px;
    background: var(--accent);
    border-radius: 0 3px 3px 0;
    box-shadow: 0 0 12px var(--accent);
  }

  .tv-icon-wrap {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    margin-top: 1px;
  }

  .tv-icon { width: 16px; height: 16px; }

  .tv-content { flex: 1; min-width: 0; }

  .tv-title {
    font-family: 'Syne', system-ui, sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 3px;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .tv-desc {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    color: rgba(203, 213, 225, 0.65);
    margin: 0;
    line-height: 1.55;
  }

  .tv-action { margin-top: 10px; }

  .tv-close {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: rgba(148, 163, 184, 0.6);
    transition: all 0.15s;
    padding: 0;
    margin-top: 2px;
  }

  .tv-close:hover {
    background: rgba(255,255,255,0.1);
    color: #f1f5f9;
    transform: scale(1.1);
  }

  .tv-close svg { width: 10px; height: 10px; }

  .tv-bar-track {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: rgba(255,255,255,0.05);
  }

  .tv-bar {
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, transparent));
    transform-origin: left;
    transform: scaleX(1);
    transition-property: transform;
    transition-timing-function: linear;
    border-radius: 0 0 16px 0;
  }

  @keyframes tv-slide-in {
    0%   { opacity: 0; transform: translateX(20px) scale(0.95); filter: blur(4px); }
    60%  { opacity: 1; filter: blur(0); }
    100% { opacity: 1; transform: translateX(0) scale(1); }
  }

  @keyframes tv-slide-out {
    0%   { opacity: 1; transform: translateX(0) scale(1); max-height: 200px; margin-bottom: 0; }
    100% { opacity: 0; transform: translateX(20px) scale(0.94); max-height: 0; margin-bottom: -12px; }
  }

  .tv-enter { animation: tv-slide-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .tv-leave { animation: tv-slide-out 0.38s cubic-bezier(0.4, 0, 1, 1) forwards; }
`;

