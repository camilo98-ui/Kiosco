import React from "react";

export default function PopsyLogo({ onClick, size = "normal" }) {
  const sizeClass = size === "small" ? "h-10" : "h-14";
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 select-none focus:outline-none"
    >
      <div className={`${sizeClass} flex items-center`}>
        <span className={`font-nunito font-black ${size === "small" ? "text-2xl" : "text-4xl"} tracking-tight`}>
          <span className="text-primary">P</span>
          <span className="text-secondary">O</span>
          <span className="text-primary">P</span>
          <span className="text-accent">S</span>
          <span className="text-primary">Y</span>
        </span>
        <span className={`ml-1 ${size === "small" ? "text-lg" : "text-2xl"}`}>🍦</span>
      </div>
    </button>
  );
}