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
            0% { transform: translateX(-240px) translateY(0px); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { transform: translateX(550px) translateY(0px); opacity: 0; }
          }
          @keyframes flow2 {
            0% { transform: translateX(-240px) translateY(0px); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { transform: translateX(550px) translateY(0px); opacity: 0; }
          }
          @keyframes flow3 {
            0% { transform: translateX(-240px) translateY(0px); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { transform: translateX(550px) translateY(0px); opacity: 0; }
          }
          @keyframes waveBob1 {
            0%, 100% { transform: translateY(0px); }
            25% { transform: translateY(-4px); }
            50% { transform: translateY(-8px); }
            75% { transform: translateY(-4px); }
          }
          @keyframes waveBob2 {
            0%, 100% { transform: translateY(0px); }
            25% { transform: translateY(-5px); }
            50% { transform: translateY(-10px); }
            75% { transform: translateY(-5px); }
          }
          @keyframes waveBob3 {
            0%, 100% { transform: translateY(0px); }
            25% { transform: translateY(-3px); }
            50% { transform: translateY(-6px); }
            75% { transform: translateY(-3px); }
          }
          .wave1 { animation: flow1 20s linear infinite; }
          .wave2 { animation: flow2 22s linear infinite 3s; }
          .wave3 { animation: flow3 18s linear infinite 1.5s; }
          .waveBob1 { animation: waveBob1 2s ease-in-out infinite; }
          .waveBob2 { animation: waveBob2 2.2s ease-in-out infinite; }
          .waveBob3 { animation: waveBob3 2.1s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Ola 1 */}
      <g className="wave1">
        <path
          className="waveBob1"
          d="M -10 56 C 20 44, 50 52, 80 42 C 108 32, 118 48, 148 40 C 175 33, 178 50, 200 56 Z"
          fill="white"
          fillOpacity="0.16"
        />
      </g>

      {/* Ola 2 */}
      <g className="wave2">
        <path
          className="waveBob2"
          d="M 240 56 C 268 48, 295 38, 325 46 C 355 54, 370 36, 400 42 C 420 46, 435 52, 450 56 Z"
          fill="white"
          fillOpacity="0.14"
        />
      </g>

      {/* Ola 3 */}
      <g className="wave3">
        <path
          className="waveBob3"
          d="M 160 56 C 180 46, 205 52, 230 44 C 252 37, 262 50, 285 56 Z"
          fill="white"
          fillOpacity="0.10"
        />
      </g>

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