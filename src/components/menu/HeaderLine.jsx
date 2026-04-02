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
      </defs>

      {/* ── Línea orgánica principal ── */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="url(#hlineGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: lineOpacity,
          transition: "opacity 0.4s ease",
          strokeDasharray: pathLen,
          strokeDashoffset: drawing ? 0 : pathLen,
          transition: `opacity 0.4s ease, stroke-dashoffset ${drawing ? "2.4s" : "0s"} cubic-bezier(0.4,0,0.2,1)`,
        }}
      />

      {/* ── Flecha / punta orgánica ── */}
      <g
        transform={`translate(${tip.x}, ${tip.y}) rotate(${tip.angle})`}
        style={{
          opacity: (drawing && !fading) ? 1 : 0,
          transition: "opacity 0.5s ease 2s",
        }}
      >
        {/* Halo pulsante exterior */}
        <circle r="5" fill="white" fillOpacity="0" style={{ animation: "haloPulse 2.2s ease-in-out infinite" }} />
        {/* Dot central */}
        <circle r="1.8" fill="white" fillOpacity="0.22" />
        {/* Flecha sutil */}
        <path
          d="M -5 2 Q 0 -1 5 2"
          fill="none"
          stroke="white"
          strokeOpacity="0.20"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>

      <style>{`
        @keyframes haloPulse {
          0%   { r: 3;  fill-opacity: 0.12; }
          60%  { r: 7;  fill-opacity: 0.04; }
          100% { r: 3;  fill-opacity: 0.12; }
        }
      `}</style>
    </svg>
  );
}