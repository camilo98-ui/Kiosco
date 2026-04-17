import React, { useEffect, useState } from "react";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2b9a2f800_Logo_poopsy-removebg-preview.png";

export default function AppHeader({ storeName, onLogoClick, onCartClick, onStoreClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "#C41E6A",
      }}
    >
      {/* Pink bar — logo only */}
      <div
        style={{
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onLogoClick}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <img
            src={LOGO_URL}
            alt="Popsy"
            style={{
              height: 58,
              width: "auto",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
            }}
          />
        </button>
      </div>

      {/* Thin store name bar */}
      {storeName && (
        <button
          onClick={onStoreClick}
          style={{
            width: "100%",
            background: "rgba(0,0,0,0.10)",
            border: "none",
            cursor: "pointer",
            padding: "5px 0 6px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 300,
              color: "rgba(255,255,255,0.75)",
              margin: 0,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily: "'Poppins', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {storeName}
          </p>
        </button>
      )}
    </div>
  );
}