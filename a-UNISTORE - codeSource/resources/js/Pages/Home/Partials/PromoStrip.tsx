
export type Promotion = {
  id: number
  name: string
  type: "percentage" | "fixed" | "free_shipping"
  value: number
  minimum_order_amount: number | null
  valid_until: string | null
}


// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDiscount(p: Promotion, currency: string): string {
  if (p.type === "free_shipping") return "LIVRAISON\nGRATUITE"
  if (p.type === "percentage") return `-${p.value}%`
  return `-${p.value} ${currency}`
}

function formatThreshold(p: Promotion, currency: string): string | null {
  if (!p.minimum_order_amount) return null
  return `DÈS ${p.minimum_order_amount.toLocaleString("fr-MA")} ${currency}`
}

function formatValidity(dateStr: string | null): string | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return `Valable jusqu'au ${d.getDate()} ${d.toLocaleString("fr-FR", { month: "long" })}`
}

function getTitle(p: Promotion): string {
  if (p.type === "free_shipping") return "LIVRAISON OFFERTE"
  if (p.type === "fixed") return "REMISE EXCLUSIVE"
  return p.name?.toUpperCase() || "OFFRE SPÉCIALE"
}


// ─── background shapes config ─────────────────────────────────────────────────

const SHAPES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: (i * 41 + 7) % 100,
  y: (i * 67 + 13) % 100,
  size: 10 + (i % 5) * 9,
  duration: 3.5 + (i % 6) * 1.1,
  delay: (i * 0.45) % 5,
  opacity: 0.05 + (i % 5) * 0.035,
  rotation: (i * 23) % 360,
  char: ["◆", "%", "◆", "●", "%"][i % 5],
}))


import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx"
import { usePage } from "@inertiajs/react"
// ─── PromoStrip component ─────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from "react"

interface PromoStripProps {
  promotions?: Promotion[]
  intervalMs?: number
}

const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    name: "Offres Spéciales",
    type: "percentage",
    value: 10,
    minimum_order_amount: 1500,
    valid_until: "2026-03-30",
  },
  {
    id: 2,
    name: "Méga Remise",
    type: "percentage",
    value: 25,
    minimum_order_amount: 2000,
    valid_until: "2026-04-15",
  },
  {
    id: 3,
    name: "Remise Exclusive",
    type: "fixed",
    value: 50,
    minimum_order_amount: 300,
    valid_until: "2026-04-01",
  },
  {
    id: 4,
    name: "Livraison Offerte",
    type: "free_shipping",
    value: 0,
    minimum_order_amount: 500,
    valid_until: "2026-05-01",
  },
]
export const PromoStrip: React.FC<PromoStripProps> = ({
  promotions = MOCK_PROMOTIONS,
  intervalMs = 3000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [current, setCurrent] = useState(0)
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = promotions.length
  const {state : {currentTheme : theme}} = useStoreConfigCtx()
  const goTo = useCallback((next: number) => {
    setPhase("exit")
    setTimeout(() => {
      setCurrent(next)
      setPhase("enter")
      setTimeout(() => setPhase("idle"), 350)
    }, 280)
  }, [])

  const advance = useCallback((dir: 1 | -1 = 1) => {
    setCurrent((c) => {
      const next = (c + dir + total) % total
      goTo(next)
      return c // keep current until goTo fires
    })
  }, [goTo, total])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (total > 1) timerRef.current = setInterval(() => advance(1), intervalMs)
  }, [advance, intervalMs, total])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  // Floating particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let raf: number
    const pts: { x:number;y:number;vx:number;vy:number;r:number;a:number;life:number;max:number }[] = []
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener("resize", resize)
    let frame = 0
    const tick = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (frame % 5 === 0) pts.push({
        x: Math.random() * canvas.width, y: canvas.height + 6,
        vx: (Math.random() - 0.5) * 0.5, vy: -(0.3 + Math.random() * 0.8),
        r: 1 + Math.random() * 2, a: 0.5 + Math.random() * 0.4,
        life: 0, max: 90 + Math.random() * 80,
      })
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i]
        p.x += p.vx; p.y += p.vy; p.life++
        if (p.life > p.max) { pts.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,220,100,${p.a * (1 - p.life / p.max)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [])

  if (!total) return null

  const { storeCurrency } = usePage().props as any
  const promo = promotions[current]
  const bgColor = theme.promotionBg[promo.type]
  const discount = formatDiscount(promo, storeCurrency)
  const threshold = formatThreshold(promo, storeCurrency)
  const validity = formatValidity(promo.valid_until)
  const title = getTitle(promo)
  const multiline = discount.includes("\n")

  const contentStyle: React.CSSProperties = {
    opacity: phase === "exit" ? 0 : 1,
    transform: phase === "exit" ? "translateY(-10px)" : phase === "enter" ? "translateY(10px)" : "translateY(0)",
    transition: "opacity 0.28s ease, transform 0.28s ease",
  }

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{ background: bgColor, minHeight: 90, fontFamily: "'Anton','Impact','Arial Black',sans-serif" }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

      {/* Floating shapes */}
      {SHAPES.map(s => (
        <div key={s.id} className="absolute pointer-events-none" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          opacity: s.opacity, color: "#fff", fontSize: s.size,
          animation: `shapeFloat ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
          zIndex: 0, transform: `rotate(${s.rotation}deg)`,
        }}>{s.char}</div>
      ))}

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 120% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)",
        zIndex: 0,
      }} />

      {/* Slide content */}
      <div style={{ position: "relative", zIndex: 1, ...contentStyle }}>
        <div className="flex items-center justify-center flex-wrap gap-0 px-10 py-3">

          {/* Title block */}
          <div className="flex flex-col items-start justify-center px-6 py-1 min-w-[150px]">
            <div style={{
              fontSize: "clamp(16px, 3vw, 28px)", fontWeight: 900,
              color: theme.promotionBg.text, lineHeight: 1.05,
              letterSpacing: "0.05em", textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}>
              {title}
            </div>
            {validity && (
              <div style={{
                fontSize: "clamp(9px, 1.2vw, 11px)", color: "rgba(255,255,255,0.72)",
                marginTop: 5, fontFamily: "sans-serif", fontWeight: 400, letterSpacing: "0.06em",
              }}>
                {validity}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.2)", margin: "0 8px" }} />

          {/* Big discount */}
          <div className="flex items-center justify-center px-8 py-1">
            <div style={{
              fontSize: multiline ? "clamp(18px, 3.5vw, 32px)" : "clamp(36px, 7.5vw, 68px)",
              fontWeight: 900, color: theme.promotionBg.text,
              lineHeight: 1, letterSpacing: "-0.02em",
              textShadow: "0 3px 18px rgba(0,0,0,0.2)",
              whiteSpace: "pre-line", textAlign: "center",
              animation: "pulseBig 2.5s ease-in-out infinite alternate",
            }}>
              {discount}
            </div>
          </div>

          {/* Threshold badge */}
          {threshold && (
            <>
              <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.2)", margin: "0 8px" }} />
              <div className="flex flex-col items-center justify-center px-6 py-1 gap-2">
                <div style={{
                  background: theme.promotionBg.badge,
                  color: theme.promotionBg.badgeText,
                  fontWeight: 900, fontSize: "clamp(11px, 1.8vw, 15px)",
                  padding: "4px 14px", borderRadius: 4,
                  letterSpacing: "0.05em", boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}>
                  {threshold}
                </div>
                <div style={{
                  fontSize: "clamp(9px, 1.2vw, 11px)", color: "rgba(255,255,255,0.82)",
                  letterSpacing: "0.12em", fontFamily: "sans-serif", fontWeight: 600,
                }}>
                  D'ACHATS
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="flex justify-center gap-1.5 pb-2">
            {promotions.map((_, i) => (
              <button key={i} onClick={() => { goTo(i); resetTimer() }} style={{
                width: i === current ? 18 : 6, height: 6, borderRadius: 99,
                background: i === current ? "#fff" : "rgba(255,255,255,0.3)",
                border: "none", padding: 0, cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Arrows */}
      {total > 1 && (
        <>
          {[{ side: "left", dir: -1 as const, char: "‹" }, { side: "right", dir: 1 as const, char: "›" }].map(a => (
            <button key={a.side} onClick={() => { advance(a.dir); resetTimer() }} style={{
              position: "absolute", [a.side]: 10, top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
              borderRadius: "50%", width: 28, height: 28, fontSize: 16,
              cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{a.char}</button>
          ))}
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        @keyframes shapeFloat {
          from { transform: translateY(0) rotate(0deg) scale(1); }
          to   { transform: translateY(-14px) rotate(25deg) scale(1.1); }
        }
        @keyframes pulseBig {
          from { transform: scale(1); }
          to   { transform: scale(1.04); }
        }
      `}</style>
    </div>
  )
}

export default PromoStrip
