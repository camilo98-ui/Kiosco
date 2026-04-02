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
          @keyframes wave1 {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-4px); }
          }
          @keyframes wave2 {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-6px); }
          }
          @keyframes wave3 {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-3px); }
          }
          .blob1 { animation: wave1 5s ease-in-out infinite; transform-origin: 100px 50px; }
          .blob2 { animation: wave2 6.5s ease-in-out infinite; transform-origin: 340px 50px; }
          .blob3 { animation: wave3 4.5s ease-in-out infinite 1s; transform-origin: 220px 50px; }
        `}</style>
      </defs>

      {/* Blob ola grande izquierda */}
      <path
        className="blob1"
        d="M -10 56 C 20 44, 50 52, 80 42 C 108 32, 118 48, 148 40 C 175 33, 178 50, 200 56 Z"
        fill="white"
        fillOpacity="0.16"
      />

      {/* Blob ola media derecha */}
      <path
        className="blob2"
        d="M 240 56 C 268 48, 295 38, 325 46 C 355 54, 370 36, 400 42 C 420 46, 435 52, 450 56 Z"
        fill="white"
        fillOpacity="0.14"
      />

      {/* Blob ola central pequeña */}
      <path
        className="blob3"
        d="M 160 56 C 180 46, 205 52, 230 44 C 252 37, 262 50, 285 56 Z"
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