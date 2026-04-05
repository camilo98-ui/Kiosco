import React, { useRef, useEffect, useCallback } from "react";
import { formatCOP } from "@/lib/constants";
import { motion } from "framer-motion";

const SECTIONS = [
  {
    id: "para_ti",
    emoji: "🍦",
    label: "Para ti",
    badge: "Solo",
    color: "#C41E6A",
    combos: [
      { title: "Helado 1 Sabor", price: 7500, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
      { title: "Malteada 12oz", price: 15900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
      { title: "Café + Galleta", price: 20800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e15d81047_Coffee.png" },
    ],
  },
  {
    id: "para_dos",
    emoji: "👫",
    label: "Para dos",
    badge: "x2",
    color: "#7B3EA4",
    combos: [
      { title: "2 Helados Gourmet", price: 17000, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
      { title: "Malteada + Agua", price: 25800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
      { title: "Galleta + HLD x2", price: 25800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6dd912084_cookie-jaar-img.jpg" },
    ],
  },
  {
    id: "para_4",
    emoji: "👨‍👩‍👧",
    label: "Para 4",
    badge: "x4",
    color: "#1565C0",
    combos: [
      { title: "Litro + Brownie x8", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Combo 2 Tarrinas", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Pack 4 Malteadas", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
    ],
  },
  {
    id: "para_celebrar",
    emoji: "🎉",
    label: "Para celebrar",
    badge: "🎊",
    color: "#E65100",
    combos: [
      { title: "Torta Tarrina o Litro", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
      { title: "Litro + Caja Cono", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Banana Split x2", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
    ],
  },
];

const CARD_W = 148;
const CARD_H = 190;
const GAP = 10;
const CARD_STEP = CARD_W + GAP;

function ComboCard({ combo, color, onAdd }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <button
      onClick={() => onAdd && onAdd({ name: combo.title, product_name: combo.title, price: combo.price, product_id: combo.title })}
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        border: "none",
        cursor: "pointer",
        padding: 0,
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      }}
    >
      {!imgError ? (
        <img
          src={combo.image}
          alt={combo.title}
          onError={() => setImgError(true)}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, pointerEvents: "none" }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${color}, #FF6EB4)`, position: "absolute", inset: 0 }} />
      )}
      {/* Degradado base */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "70%",
        background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)",
      }} />
      {/* Texto */}
      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, zIndex: 2, textAlign: "left" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>{combo.title}</p>
        {combo.price > 0 && (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", margin: "3px 0 0", fontWeight: 600 }}>
            Desde {formatCOP(combo.price)}
          </p>
        )}
      </div>
    </button>
  );
}

function AutoScrollRow({ section, onAdd }) {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const animRef = useRef(null);
  const pausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isHorizontalRef = useRef(null);
  const resumeRef = useRef(null);
  const containerRef = useRef(null);

  const totalWidth = CARD_STEP * section.combos.length;
  const doubled = [...section.combos, ...section.combos];

  const pauseFor = useCallback((ms = 1200) => {
    pausedRef.current = true;
    clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => { pausedRef.current = false; }, ms);
  }, []);

  const applyPos = useCallback((pos) => {
    let p = pos % totalWidth;
    if (p < 0) p += totalWidth;
    posRef.current = p;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${p}px)`;
  }, [totalWidth]);

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
    pausedRef.current = true;
    clearTimeout(resumeRef.current);
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      applyPos(dragStartPosRef.current + (dragStartXRef.current - e.clientX));
    };
    const onUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      pauseFor(1000);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [applyPos, pauseFor]);

  const handleTouchStart = useCallback((e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    dragStartPosRef.current = posRef.current;
    dragStartXRef.current = e.touches[0].clientX;
    isHorizontalRef.current = null;
    pausedRef.current = true;
    clearTimeout(resumeRef.current);
  }, []);

  const handleTouchMove = useCallback((e) => {
    const dx = touchStartXRef.current - e.touches[0].clientX;
    const dy = touchStartYRef.current - e.touches[0].clientY;
    if (isHorizontalRef.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isHorizontalRef.current = Math.abs(dx) > Math.abs(dy);
    }
    if (isHorizontalRef.current) {
      e.preventDefault();
      applyPos(dragStartPosRef.current + dx);
    }
  }, [applyPos]);

  const handleTouchEnd = useCallback(() => {
    isHorizontalRef.current = null;
    pauseFor(1200);
  }, [pauseFor]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, [handleTouchMove]);

  useEffect(() => {
    const animate = () => {
      if (!pausedRef.current && trackRef.current) {
        posRef.current += 0.45;
        if (posRef.current >= totalWidth) posRef.current = 0;
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); clearTimeout(resumeRef.current); };
  }, [totalWidth]);

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", marginBottom: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: section.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
          boxShadow: `0 4px 12px ${section.color}55`,
        }}>
          {section.emoji}
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0, lineHeight: 1.1 }}>{section.label}</p>
          <p style={{ fontSize: 11, color: "#999", margin: 0 }}>Desliza para ver más</p>
        </div>
        <span style={{
          marginLeft: "auto",
          background: section.color,
          color: "#fff",
          fontSize: 12, fontWeight: 800,
          borderRadius: 20, padding: "4px 12px",
          transform: "rotate(-2deg)", display: "inline-block",
          boxShadow: `0 2px 8px ${section.color}55`,
        }}>
          {section.badge}
        </span>
      </div>

      {/* Carrusel auto-scroll */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => { if (!isDraggingRef.current) pausedRef.current = true; }}
        onMouseLeave={() => { if (!isDraggingRef.current) pausedRef.current = false; }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          overflow: "hidden",
          paddingLeft: 16,
          paddingBottom: 4,
          cursor: "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <div
          ref={trackRef}
          style={{ display: "flex", gap: GAP, width: "max-content", willChange: "transform" }}
        >
          {doubled.map((combo, i) => (
            <ComboCard key={`${combo.title}-${i}`} combo={combo} color={section.color} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CuantosSon({ onAdd }) {
  return (
    <div style={{ background: "#FAFAFA", paddingTop: 22, paddingBottom: 8, marginTop: 10, borderTop: "1px solid #F0E4EA" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>¿Cuántos son? 🍦</p>
          <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0" }}>Elige el plan perfecto para tu grupo</p>
        </div>
      </div>
      {SECTIONS.map((section, i) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
        >
          <AutoScrollRow section={section} onAdd={onAdd} />
        </motion.div>
      ))}
    </div>
  );
}