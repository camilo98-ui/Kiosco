import React, { useRef, useEffect, useState, useCallback } from "react";
import { COMBOS_DATA } from "@/lib/combosData";

const COMBOS = COMBOS_DATA;
const CARD_WIDTH = 160;
const GAP = 12;
const CARD_STEP = CARD_WIDTH + GAP;

function ComboCard({ combo, onAdd }) {
  return (
    <button
      onClick={() => onAdd && onAdd({ ...combo, name: combo.title })}
      style={{
        width: CARD_WIDTH,
        flexShrink: 0,
        borderRadius: 20,
        border: "1.5px solid #F0E4EA",
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(194,24,91,0.08)",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{
        position: "relative",
        width: CARD_WIDTH,
        height: CARD_WIDTH,
        background: "#FFF0F5",
        flexShrink: 0,
      }}>
        <img
          src={combo.image}
          alt={combo.title}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
            pointerEvents: "none",
          }}
        />
        <span style={{
          position: "absolute", top: 9, right: 9,
          background: "#C41E6A", color: "#fff",
          fontSize: 9, fontWeight: 800,
          borderRadius: 20, padding: "3px 8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}>
          {combo.badge}
        </span>
      </div>
      <div style={{ padding: "8px 10px 12px", textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
        <p style={{
          fontSize: 11, fontWeight: 800, color: "#2D1A22",
          margin: 0, lineHeight: 1.3,
        }}>
          {combo.title}
        </p>
        <p style={{ fontSize: 14, fontWeight: 900, color: "#C41E6A", margin: 0 }}>
          {combo.displayPrice}
        </p>
      </div>
    </button>
  );
}

export default function CombosCarousel({ onAdd, onOpenAll }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isHorizontalScrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const totalWidth = CARD_STEP * COMBOS.length;
  const doubled = [...COMBOS, ...COMBOS];

  const pauseFor = useCallback((ms = 1500) => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  }, []);

  const clampPos = useCallback((pos) => {
    let p = pos % totalWidth;
    if (p < 0) p += totalWidth;
    return p;
  }, [totalWidth]);

  const applyPos = useCallback((pos) => {
    posRef.current = clampPos(pos);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  }, [clampPos]);

  // Mouse handlers
  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const diff = dragStartXRef.current - e.clientX;
      applyPos(dragStartPosRef.current + diff);
    };
    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      pauseFor(1000);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [applyPos, pauseFor]);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalScrollRef.current = null;
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    dragStartPosRef.current = posRef.current;
    dragStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const dx = touchStartXRef.current - e.touches[0].clientX;
    const dy = touchStartYRef.current - e.touches[0].clientY;

    // Determinar dirección solo una vez por gesto
    if (isHorizontalScrollRef.current === null) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isHorizontalScrollRef.current = Math.abs(dx) > Math.abs(dy);
      }
    }

    if (isHorizontalScrollRef.current) {
      e.preventDefault();
      applyPos(dragStartPosRef.current + dx);
    }
  }, [applyPos]);

  const handleTouchEnd = useCallback(() => {
    isHorizontalScrollRef.current = null;
    pauseFor(1500);
  }, [pauseFor]);

  // Registrar touchmove como non-passive para poder hacer preventDefault
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, [handleTouchMove]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!pausedRef.current && trackRef.current) {
        posRef.current += 0.7;
        if (posRef.current >= totalWidth) posRef.current = 0;
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
        const idx = Math.round(posRef.current / CARD_STEP) % COMBOS.length;
        setActiveIdx(prev => prev !== idx ? idx : prev);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, [totalWidth]);

  return (
    <div style={{ background: "#fff", marginTop: 10, padding: "16px 0 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 16, paddingRight: 16, marginBottom: 14 }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: "#2D2D2D", margin: 0 }}>
          Combos que enamoran 💕
        </p>
        <button onClick={onOpenAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#C41E6A", padding: 0 }}>
          Ver todos
        </button>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => { if (!isDraggingRef.current) { pausedRef.current = true; } }}
        onMouseLeave={() => { if (!isDraggingRef.current) { pausedRef.current = false; } }}
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
          style={{
            display: "flex",
            gap: GAP,
            width: "max-content",
            willChange: "transform",
          }}
        >
          {doubled.map((combo, i) => (
            <ComboCard key={`${combo.id}-${i}`} combo={combo} onAdd={onAdd} />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 12 }}>
        {COMBOS.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: activeIdx === idx ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: activeIdx === idx ? "#C41E6A" : "#F9C6E0",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}