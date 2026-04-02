import React, { useEffect, useRef, useState } from "react";

// Estado: "idle" | "added" | "upsell"
// idle   → línea curva hacia la derecha (hacia categorías/productos)
// added  → línea apunta al botón "Ver mi pedido" (esquina inferior derecha)
// upsell → línea gira hacia la izquierda (productos complementarios)

const PATHS = {
  idle: "M -10 28 C 20 10, 60 42, 100 22 C 140 5, 175 35, 220 20 C 260 8, 290 30, 340 18 C 375 10, 400 28, 440 22",
  added: "M -10 44 C 30 55, 80 20, 130 38 C 175 52, 210 15, 260 32 C 300 45, 340 12, 390 30 C 415 40, 435 26, 440 28",
  upsell: "M -10 18 C 30 32, 70 8, 110 26 C 150 42, 180 10, 230 28 C 270 44, 310 16, 360 34 C 395 46, 425 20, 440 24",
};

// Punto final de cada path (arrowhead position)
const TIP = {
  idle:   { x: 440, y: 22, angle: -12 },
  added:  { x: 440, y: 28, angle: 6 },
  upsell: { x: 440, y: 24, angle: -8 },
};

export default function HeaderLine({ state = "idle" }) {
  const pathRef = useRef(null);
  const [length, setLength] = useState(0);
  const [prevState, setPrevState] = useState(state);
  const [visible, setVisible] = useState(true);

  // Medir longitud del path para el dasharray
  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, [state]);

  // Crossfade: cuando cambia estado, fade out → cambiar → fade in
  useEffect(() => {
    if (state !== prevState) {
      setVisible(false);
      const t = setTimeout(() => {
        setPrevState(state);
        setVisible(true);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [state, prevState]);

  const d = PATHS[prevState] || PATHS.idle;
  const tip = TIP[prevState] || TIP.idle;

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
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Gradiente a lo largo de la línea */}
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="30%" stopColor="white" stopOpacity="0.18" />
          <stop offset="85%" stopColor="white" stopOpacity="0.22" />
          <stop offset="100%" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Línea principal animada */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          // Animación de "dibujado progresivo"
          strokeDasharray: length || 600,
          strokeDashoffset: visible ? 0 : length || 600,
          animation: visible ? "drawLine 2.2s ease forwards, breathe 3.5s ease-in-out 2.4s infinite" : "none",
        }}
      />

      {/* Punta animada (arrowhead / dot) */}
      {visible && (
        <g
          transform={`translate(${tip.x}, ${tip.y}) rotate(${tip.angle})`}
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.3s ease 1.8s",
          }}
        >
          {/* Pulso exterior */}
          <circle
            cx="0"
            cy="0"
            r="4"
            fill="white"
            fillOpacity="0.08"
            style={{ animation: "pulseTip 2s ease-in-out 2.5s infinite" }}
          />
          {/* Dot central */}
          <circle
            cx="0"
            cy="0"
            r="2"
            fill="white"
            fillOpacity="0.28"
            style={{ animation: "pulseTip 2s ease-in-out 2.5s infinite alternate" }}
          />
          {/* Mini flecha */}
          <path
            d="M -4 0 L 0 -2.5 L 4 0"
            fill="none"
            stroke="white"
            strokeOpacity="0.22"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: var(--line-length, 600); }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes breathe {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes pulseTip {
          0%, 100% { transform: scale(1);   opacity: 0.28; }
          50%       { transform: scale(1.7); opacity: 0.08; }
        }
      `}</style>
    </svg>
  );
}