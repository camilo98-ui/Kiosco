import React from "react";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/af2c73dd3_popsy-b-01__4_-removebg-preview1.png";

export default function PopsyLogo({ onClick, size = "normal", dark = false }) {
  const imgSize = size === "small" ? "h-10" : size === "large" ? "h-28" : "h-14";

  return (
    <button
      onClick={onClick}
      className="flex items-center select-none focus:outline-none"
    >
      <img
        src={LOGO_URL}
        alt="Popsy"
        className={`${imgSize} w-auto object-contain ${dark ? "brightness-0 invert" : ""}`}
      />
    </button>
  );
}