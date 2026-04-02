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
          @keyframes oceanWave {
            0% { transform: translateX(0px) translateY(0px); }
            25% { transform: translateX(40px) translateY(-3px); }
            50% { transform: translateX(80px) translateY(-5px); }
            75% { transform: translateX(120px) translateY(-2px); }
            100% { transform: translateX(160px) translateY(0px); }
          }
          @keyframes oceanWave2 {
            0% { transform: translateX(-50px) translateY(0px); }
            25% { transform: translateX(0px) translateY(-4px); }
            50% { transform: translateX(50px) translateY(-6px); }
            75% { transform: translateX(100px) translateY(-3px); }
            100% { transform: translateX(150px) translateY(0px); }
          }
          @keyframes oceanWave3 {
            0% { transform: translateX(-100px) translateY(0px); }
            25% { transform: translateX(-50px) translateY(-2px); }
            50% { transform: translateX(0px) translateY(-4px); }
            75% { transform: translateX(50px) translateY(-1px); }
            100% { transform: translateX(100px) translateY(0px); }
          }
          .blob1 { animation: oceanWave 8s ease-in-out infinite; }
          .blob2 { animation: oceanWave2 9s ease-in-out infinite; }
          .blob3 { animation: oceanWave3 7s ease-in-out infinite; }
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