import React from "react";

// Logo real de Popsy usando la imagen oficial del sistema
export default function PopsyLogo({ onClick, size = "normal", floating = false }) {
  const imgSize = size === "small" ? "h-9" : "h-14";

  if (floating) {
    return (
      <button
        onClick={onClick}
        className="select-none focus:outline-none"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Popsy_logo.svg/1200px-Popsy_logo.svg.png"
          alt="Popsy"
          className="h-10 w-auto object-contain drop-shadow-lg"
          onError={(e) => {
            // fallback text logo
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <span
          className="hidden items-center gap-1 font-nunito font-black text-2xl tracking-tight"
          style={{ display: "none" }}
        >
          <span style={{ color: "#F5A623" }}>P</span>
          <span style={{ color: "#E91E8C" }}>O</span>
          <span style={{ color: "#F5A623" }}>P</span>
          <span style={{ color: "#26C485" }}>S</span>
          <span style={{ color: "#F5A623" }}>Y</span>
          <span className="ml-1">🍦</span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 select-none focus:outline-none"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Popsy_logo.svg/1200px-Popsy_logo.svg.png"
        alt="Popsy"
        className={`${imgSize} w-auto object-contain drop-shadow-lg`}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <span
        className="hidden items-center gap-0.5 font-nunito font-black tracking-tight"
        style={{ display: "none", fontSize: size === "small" ? "1.4rem" : "2rem" }}
      >
        <span style={{ color: "#F5A623" }}>P</span>
        <span style={{ color: "#E91E8C" }}>O</span>
        <span style={{ color: "#F5A623" }}>P</span>
        <span style={{ color: "#26C485" }}>S</span>
        <span style={{ color: "#F5A623" }}>Y</span>
        <span className="ml-1 text-xl">🍦</span>
      </span>
    </button>
  );
}