import React from "react";

export default function HeaderLine() {
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
        <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.20" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.14" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <style>{`
          @keyframes flow1 {
            0% { transform: translateX(-240px); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { transform: translateX(550px); opacity: 0; }
          }
          @keyframes flow2 {
            0% { transform: translateX(-240px); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { transform: translateX(550px); opacity: 0; }
          }
          @keyframes flow3 {
            0% { transform: translateX(-240px); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { transform: translateX(550px); opacity: 0; }
          }
          .wave1 { animation: flow1 20s linear infinite; }
          .wave2 { animation: flow2 22s linear infinite 3s; }
          .wave3 { animation: flow3 18s linear infinite 1.5s; }
        `}</style>
      </defs>

      {/* Ola 1 - flujo dinámico */}
      <path
        className="wave1"
        d="M -10 56 C 20 48, 50 40, 80 46 C 108 52, 118 36, 148 42 C 175 48, 178 32, 200 56 Z"
        fill="white"
        fillOpacity="0.16"
      />

      {/* Ola 2 - flujo dinámico */}
      <path
        className="wave2"
        d="M 240 56 C 268 44, 295 48, 325 40 C 355 36, 370 50, 400 46 C 420 42, 435 56, 450 56 Z"
        fill="white"
        fillOpacity="0.14"
      />

      {/* Ola 3 - flujo dinámico */}
      <path
        className="wave3"
        d="M 160 56 C 180 50, 205 38, 230 48 C 252 52, 262 36, 285 56 Z"
        fill="white"
        fillOpacity="0.10"
      />

      {/* Brillos difusos */}
      <ellipse cx="92" cy="12" rx="18" ry="8" fill="url(#glowA)" />
      <ellipse cx="370" cy="22" rx="30" ry="12" fill="url(#glowB)" />

      {/* Puntos brillo reflejo */}
      <circle cx="108" cy="9" r="2.2" fill="white" fillOpacity="0.28" />
      <circle cx="110" cy="8" r="0.9" fill="white" fillOpacity="0.45" />
      <circle cx="355" cy="18" r="1.6" fill="white" fillOpacity="0.26" />
    </svg>
  );
}