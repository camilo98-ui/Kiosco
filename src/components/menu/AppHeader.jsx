import React, { useEffect, useState } from "react";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2b9a2f800_Logo_poopsy-removebg-preview.png";

export default function AppHeader({ storeName, onLogoClick }) {
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
        background: "linear-gradient(160deg, #FAD9E8 0%, #FDF0F6 60%, #FFFBFD 100%)",
        padding: "18px 20px 16px",
        boxShadow: scrolled
          ? "0 2px 20px rgba(181,23,90,0.10)"
          : "none",
        borderBottom: scrolled ? "none" : "1px solid rgba(220,120,160,0.12)",
        transition: "box-shadow 0.3s ease, border-bottom 0.3s ease",
      }}
    >
      {/* Logo */}
      <button
        onClick={onLogoClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <img
          src={LOGO_URL}
          alt="Popsy"
          style={{
            height: 56,
            width: "auto",
            objectFit: "contain",
            objectPosition: "left center",
            display: "block",
          }}
        />
      </button>

      {/* Store location */}
      {storeName && (
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#B5175A",
            margin: "6px 0 0",
            opacity: 0.75,
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.1px",
          }}
        >
          📍 {storeName}
        </p>
      )}
    </div>
  );
}