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
        height: 120,
        background: "#C41E6A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        boxShadow: scrolled
          ? "0 4px 24px rgba(196,30,106,0.32)"
          : "0 2px 10px rgba(196,30,106,0.18)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Logo — centered, large, clickable for hidden menu */}
      <button
        onClick={onLogoClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={LOGO_URL}
          alt="Popsy"
          style={{
            height: 52,
            width: "auto",
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
          }}
        />
      </button>

      {/* Store name — fine, wide letter-spacing */}
      {storeName && (
        <button
          onClick={onStoreClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 300,
              color: "rgba(255,255,255,0.80)",
              margin: 0,
              letterSpacing: "0.22em",
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