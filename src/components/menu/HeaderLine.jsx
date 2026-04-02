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
          @keyframes flowWave1 {
            0% { transform: translateX(0px); }
            100% { transform: translateX(440px); }
          }
          @keyframes flowWave2 {
            0% { transform: translateX(-220px); }
            100% { transform: translateX(220px); }
          }
          @keyframes flowWave3 {
            0% { transform: translateX(-110px); }
            100% { transform: translateX(330px); }
          }
          @keyframes vertBob1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          @keyframes vertBob2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          @keyframes vertBob3 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
          }
          .waveGroup1 { animation: flowWave1 10s linear infinite; }
          .waveGroup2 { animation: flowWave2 11s linear infinite; }
          .waveGroup3 { animation: flowWave3 9s linear infinite; }
        `}</style>
      </defs>

      {/* Grupo ola 1 - flujo continuo con duplicados */}
      <g className="waveGroup1">
        <path
          d="M -10 56 C 20 44, 50 52, 80 42 C 108 32, 118 48, 148 40 C 175 33, 178 50, 200 56 Z"
          fill="white"
          fillOpacity="0.16"
        />
        <path
          d="M 430 56 C 460 44, 490 52, 520 42 C 548 32, 558 48, 588 40 C 615 33, 618 50, 640 56 Z"
          fill="white"
          fillOpacity="0.16"
        />
      </g>

      {/* Grupo ola 2 - flujo continuo con duplicados */}
      <g className="waveGroup2">
        <path
          d="M 240 56 C 268 48, 295 38, 325 46 C 355 54, 370 36, 400 42 C 420 46, 435 52, 450 56 Z"
          fill="white"
          fillOpacity="0.14"
        />
        <path
          d="M -200 56 C -172 48, -145 38, -115 46 C -85 54, -70 36, -40 42 C -20 46, -5 52, 10 56 Z"
          fill="white"
          fillOpacity="0.14"
        />
      </g>

      {/* Grupo ola 3 - flujo continuo con duplicados */}
      <g className="waveGroup3">
        <path
          d="M 160 56 C 180 46, 205 52, 230 44 C 252 37, 262 50, 285 56 Z"
          fill="white"
          fillOpacity="0.10"
        />
        <path
          d="M 600 56 C 620 46, 645 52, 670 44 C 692 37, 702 50, 725 56 Z"
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