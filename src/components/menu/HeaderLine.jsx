import React, { useEffect, useRef, useState } from "react";

// ─── Paths orgánicos tipo "crema de helado" ──────────────────────────────────
// Sin carrito: línea fluida que termina apuntando a los productos (centro-derecha)
// Con carrito: línea que vira y termina apuntando al ícono del carrito (extremo derecho)

const PATH_EMPTY = "M 2 38 C 18 48, 35 22, 55 30 C 72 38, 82 18, 102 26 C 118 32, 125 16, 145 22 C 162 27, 168 14, 188 18 C 205 22, 210 10, 232 14 C 252 18, 258 8, 278 12 C 294 15, 298 28, 316 22 C 330 18, 336 8, 352 12";

const PATH_WITH_CART = "M 2 44 C 22 52, 42 28, 65 36 C 84 43, 98 22, 120 30 C 138 37, 148 18, 170 25 C 190 32, 196 14, 220 20 C 242 26, 250 10, 275 16 C 298 22, 308 8, 334 14 C 352 18, 362 8, 382 10 C 398 12, 412 8, 425 6";

// Tip: donde termina la flecha y qué ángulo tiene
const TIP_EMPTY     = { x: 352, y: 12, angle: -15 };
const TIP_WITH_CART = { x: 425, y: 6,  angle: -18 };

// Cuándo re-disparar la animación "draw" (en ms)
const REDRAW_INTERVAL = 9000;

export default function HeaderLine({ hasCart = false }) {
  const pathRef     = useRef(null);
  const [pathLen, setPathLen] = useState(500);
  const [drawing, setDrawing] = useState(false);
  const [fading, setFading]   = useState(false);
  const timerRef = useRef(null);

  const d   = hasCart ? PATH_WITH_CART : PATH_EMPTY;
  const tip = hasCart ? TIP_WITH_CART  : TIP_EMPTY;

  // Medir longitud del path actual
  useEffect(() => {
    if (pathRef.current) {
      setPathLen(pathRef.current.getTotalLength() || 500);
    }
  }, [d]);

  // Disparar animación draw periódicamente
  const triggerDraw = () => {
    setFading(true);
    setTimeout(() => {
      setFading(false);
      setDrawing(true);
      setTimeout(() => setDrawing(false), 2600);
    }, 400);
  };

  useEffect(() => {
    // Primer draw inmediato
    triggerDraw();
    timerRef.current = setInterval(triggerDraw, REDRAW_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, []);

  // Re-disparar cuando cambia estado del carrito
  useEffect(() => {
    clearInterval(timerRef.current);
    triggerDraw();
    timerRef.current = setInterval(triggerDraw, REDRAW_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [hasCart]);

  const lineOpacity = fading ? 0 : 1;

  return (
    <svg
      viewBox="0 0 440 56"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="20%"  stopColor="white" stopOpacity="0.10" />
          <stop offset="70%"  stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0.06" />
        </linearGradient>
        {/* Gradiente radial para brillos premium */}
        <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.10" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Blob orgánico 1: ola grande izquierda (tipo derrame de crema) ── */}
      <path
        d="M -10 56 C 20 44, 50 52, 80 42 C 108 32, 118 48, 148 40 C 175 33, 178 50, 200 56 Z"
        fill="white"
        fillOpacity="0.06"
      />

      {/* ── Blob orgánico 2: ola media derecha ── */}
      <path
        d="M 240 56 C 268 48, 295 38, 325 46 C 355 54, 370 36, 400 42 C 420 46, 435 52, 450 56 Z"
        fill="white"
        fillOpacity="0.05"
      />

      {/* ── Espiral ligera tipo soft-serve (centro-izquierda) ── */}
      <path
        d="M 60 20 C 64 14, 72 12, 76 18 C 80 24, 74 30, 68 28 C 62 26, 62 18, 68 16"
        fill="none"
        stroke="white"
        strokeOpacity="0.10"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ── Onda suave secundaria (centro) ── */}
      <path
        d="M 150 46 C 170 36, 195 50, 218 40 C 240 30, 260 46, 285 38"
        fill="none"
        stroke="white"
        strokeOpacity="0.08"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* ── Brillo premium 1: destello pequeño superior izquierdo ── */}
      <ellipse cx="92" cy="12" rx="18" ry="8" fill="url(#glowA)" />

      {/* ── Brillo premium 2: destello difuso derecha ── */}
      <ellipse cx="370" cy="22" rx="30" ry="12" fill="url(#glowB)" />

      {/* ── Punto brillo tipo reflejo helado ── */}
      <circle cx="108" cy="9" r="2.2" fill="white" fillOpacity="0.14" />
      <circle cx="110" cy="8" r="0.9" fill="white" fillOpacity="0.28" />

      {/* ── Punto brillo secundario ── */}
      <circle cx="355" cy="18" r="1.6" fill="white" fillOpacity="0.12" />


    </svg>
  );
}