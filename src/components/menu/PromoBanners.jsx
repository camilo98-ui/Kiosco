import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: 1,
    bg: "#C2185B",
    dark: true,
    eyebrow: "PROMO DEL DÍA",
    title: "2x1 en Combos",
    pill: "Ver oferta →",
    emoji: "🍦",
    circleBg: "rgba(255,255,255,0.12)",
  },
  {
    id: 2,
    bg: "#FFF0F5",
    dark: false,
    border: "#F8D0DF",
    eyebrow: "DESTACADO",
    title: "Galleta Suprema HLD",
    subtitle: "Con helado premium",
    pill: "Pedir ahora →",
    emoji: "🍪",
    circleBg: "#FAC8DC",
  },
  {
    id: 3,
    bg: "#2D1A22",
    dark: true,
    eyebrow: "DESDE 1992",
    title: "Helado Gourmet",
    subtitle: "Hecho con amor",
    pill: "Descubrir →",
    emoji: "🌟",
    circleBg: "rgba(194,24,91,0.35)",
  },
  {
    id: 4,
    bg: "#FFF8FA",
    dark: false,
    border: "#F8E0EB",
    eyebrow: "NUEVA TEMPORADA",
    title: "Malteadas de temporada",
    pill: "Ver menú →",
    emoji: "🥤",
    circleBg: "#F8BBD0",
  },
];

export default function PromoBanners({ onCategorySelect }) {
  const [active, setActive] = useState(0);
  const startX = useRef(null);
  const containerRef = useRef(null);

  const next = () => setActive((a) => (a + 1) % BANNERS.length);
  const prev = () => setActive((a) => (a - 1 + BANNERS.length) % BANNERS.length);

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    startX.current = null;
  };

  const banner = BANNERS[active];

  return (
    <div className="px-5 mb-5">
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: "grab" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative overflow-hidden flex items-center justify-between"
            style={{
              background: banner.bg,
              borderRadius: 20,
              height: 108,
              padding: "0 20px",
              border: banner.border ? `1.5px solid ${banner.border}` : "none",
            }}
          >
            {/* Círculo decorativo derecha */}
            <div
              className="absolute -right-6 -top-6 w-28 h-28 rounded-full pointer-events-none"
              style={{ background: banner.circleBg }}
            />
            <div
              className="absolute -right-2 top-4 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: banner.circleBg, opacity: 0.6 }}
            />

            {/* Contenido izquierda */}
            <div className="relative z-10 flex flex-col gap-1 flex-1 min-w-0 pr-4">
              <span
                className="font-extrabold uppercase tracking-widest"
                style={{ fontSize: 9, color: banner.dark ? "rgba(255,255,255,0.7)" : "#C2185B" }}
              >
                {banner.eyebrow}
              </span>
              <p
                className="font-black leading-tight"
                style={{
                  fontSize: 17,
                  color: banner.dark ? "#FFFFFF" : "#2D1A22",
                  fontStyle: banner.id === 3 ? "italic" : "normal",
                  letterSpacing: banner.id === 3 ? "-1px" : "normal",
                }}
              >
                {banner.title}
              </p>
              {banner.subtitle && (
                <p style={{ fontSize: 10, color: banner.dark ? "rgba(255,255,255,0.55)" : "#BBA8B0" }}>
                  {banner.subtitle}
                </p>
              )}
              <button
                onClick={() => {
                  if (banner.id === 1) onCategorySelect?.("combos");
                  if (banner.id === 2) onCategorySelect?.("galletas");
                  if (banner.id === 3) onCategorySelect?.("helados");
                  if (banner.id === 4) onCategorySelect?.("malteadas");
                }}
                className="mt-1 self-start font-black flex items-center"
                style={{
                  background: banner.dark ? "#C2185B" : "#C2185B",
                  color: "#FFFFFF",
                  fontSize: 10,
                  borderRadius: 20,
                  padding: "4px 12px",
                  letterSpacing: "0.3px",
                }}
              >
                {banner.pill}
              </button>
            </div>

            {/* Emoji derecha */}
            <div className="relative z-10 text-5xl shrink-0" style={{ marginRight: 4 }}>
              {banner.emoji}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              height: 6,
              width: i === active ? 18 : 6,
              borderRadius: 6,
              background: i === active ? "#C2185B" : "#EDD8E4",
              transition: "all 0.25s ease",
              border: "none",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}