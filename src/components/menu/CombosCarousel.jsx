import React, { useRef, useEffect, useState } from "react";
import { COMBOS_DATA } from "@/lib/combosData";

const COMBOS = COMBOS_DATA;

const CARD_WIDTH = 150;
const GAP = 12;
const CARD_STEP = CARD_WIDTH + GAP;

function ComboCard({ combo, onAdd }) {
  const isPrice = combo.displayPrice && combo.displayPrice.startsWith("$");
  const isPromo = combo.displayPrice && !isPrice;

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
      }}
    >
      <div style={{ position: "relative", height: 150, overflow: "hidden", borderRadius: "20px 20px 0 0", background: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={combo.image}
          alt={combo.title}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", pointerEvents: "none" }}
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
      <div style={{ padding: "8px 10px 12px" }}>
        <p style={{
          fontSize: 12, fontWeight: 800, color: "#2D1A22",
          margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {combo.title}
        </p>
        {isPrice && (
          <p style={{ fontSize: 14, fontWeight: 900, color: "#C41E6A", margin: "4px 0 0" }}>
            {combo.displayPrice}
          </p>
        )}
        {isPromo && (
          <p style={{ fontSize: 10, fontWeight: 700, color: "#C41E6A", margin: "4px 0 0", lineHeight: 1.3 }}>
            {combo.displayPrice}
          </p>
        )}
        </div>
        </button>
        );
        }

export default function CombosCarousel({ onAdd, onOpenAll }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef({ isDragging: false, startX: 0, startPos: 0 });
  const resumeTimerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const doubled = [...COMBOS, ...COMBOS];
  const totalWidth = CARD_STEP * COMBOS.length;

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    dragRef.current = { isDragging: true, startX: e.clientX, startPos: posRef.current };
    pausedRef.current = true;
    if (trackRef.current) trackRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const diff = dragRef.current.startX - e.clientX;
    posRef.current = dragRef.current.startPos + diff;
    if (posRef.current < 0) posRef.current = totalWidth + posRef.current;
    if (posRef.current >= totalWidth) posRef.current -= totalWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    // Resume después de 500ms de inactividad
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, 500);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Touch handlers
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
  };

  const handleTouchMove = (e) => {
    const diff = touchStartX.current - e.touches[0].clientX;
    posRef.current += diff;
    if (posRef.current < 0) posRef.current = totalWidth + posRef.current;
    if (posRef.current >= totalWidth) posRef.current -= totalWidth;
    touchStartX.current = e.touches[0].clientX;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const handleTouchEnd = () => {
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, 500);
  };

  // Continuous animation loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += 0.9;
        if (posRef.current >= totalWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
        setActiveIdx(Math.round(posRef.current / CARD_STEP) % COMBOS.length);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, []);

  return (
    <div style={{ background: "#fff", marginTop: 10, padding: "16px 0 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 16, paddingRight: 16, marginBottom: 14 }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: "#2D2D2D", margin: 0 }}>
          Combos
        </p>
        <button onClick={onOpenAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#C41E6A", padding: 0 }}>
          Ver todos →
        </button>
      </div>

      <div
        style={{ overflow: "hidden", paddingLeft: 16, paddingBottom: 4, cursor: "grab" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => { if (!dragRef.current.isDragging) pausedRef.current = true; }}
        onMouseLeave={() => { if (!dragRef.current.isDragging) pausedRef.current = false; }}
      >
        <div ref={trackRef} style={{ display: "flex", gap: GAP, width: "max-content" }}>
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