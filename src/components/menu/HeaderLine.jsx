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
            25% { transform: translateX(85px) translateY(-6px); }
            50% { transform: translateX(215px) translateY(-10px); }
            75% { transform: translateX(345px) translateY(-6px); }
            95% { opacity: 1; }
            100% { transform: translateX(550px) translateY(0px); opacity: 0; }
          }
          @keyframes flow2 {
            0% { transform: translateX(-240px) translateY(0px); opacity: 0; }
            5% { opacity: 1; }
            25% { transform: translateX(85px) translateY(-7px); }
            50% { transform: translateX(215px) translateY(-12px); }
            75% { transform: translateX(345px) translateY(-7px); }
            95% { opacity: 1; }
            100% { transform: translateX(550px) translateY(0px); opacity: 0; }
          }
          @keyframes flow3 {
            0% { transform: translateX(-240px) translateY(0px); opacity: 0; }
            5% { opacity: 1; }
            25% { transform: translateX(85px) translateY(-5px); }
            50% { transform: translateX(215px) translateY(-9px); }
            75% { transform: translateX(345px) translateY(-5px); }
            95% { opacity: 1; }
            100% { transform: translateX(550px) translateY(0px); opacity: 0; }
          }
          .wave1 { animation: flow1 20s ease-in-out infinite; }
          .wave2 { animation: flow2 22s ease-in-out infinite 3s; }
          .wave3 { animation: flow3 18s ease-in-out infinite 1.5s; }
        `}</style>
      </defs>

      {/* Ola 1 */}
      <path
        className="wave1"
        d="M -10 56 C 10 48, 30 52, 50 56 C 70 50, 90 52, 110 56 C 130 48, 150 52, 170 56 C 190 50, 210 52, 230 56 Z"
        fill="white"
        fillOpacity="0.16"
      />

      {/* Ola 2 */}
      <path
        className="wave2"
        d="M 240 56 C 260 48, 280 52, 300 56 C 320 50, 340 52, 360 56 C 380 48, 400 52, 420 56 C 440 50, 460 52, 480 56 Z"
        fill="white"
        fillOpacity="0.14"
      />

      {/* Ola 3 */}
      <path
        className="wave3"
        d="M 160 56 C 180 48, 200 52, 220 56 C 240 50, 260 52, 280 56 C 300 48, 320 52, 340 56 Z"
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