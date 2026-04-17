import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartStore";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2b9a2f800_Logo_poopsy-removebg-preview.png";
const MAGENTA = "#B5175A";

export default function AppHeader({ storeName, onCartClick, onLogoClick }) {
  const { itemCount } = useCart();
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
        height: 64,
        background: "#FDF0F5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        boxShadow: scrolled
          ? "0 2px 16px rgba(181,23,90,0.10)"
          : "0 1px 0 rgba(181,23,90,0.08)",
        transition: "box-shadow 0.3s ease",
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
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={LOGO_URL}
          alt="Popsy"
          style={{ height: 44, width: "auto", objectFit: "contain" }}
        />
      </button>

      {/* Center text */}
      <div style={{ flex: 1, textAlign: "center", padding: "0 12px" }}>
        <p style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#2D1A22",
          margin: 0,
          lineHeight: 1.3,
          fontFamily: "'Poppins', sans-serif",
        }}>
          ¿Qué se te antoja hoy? 😋
        </p>
        {storeName && (
          <p style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#B5175A",
            margin: "1px 0 0",
            lineHeight: 1.2,
            fontFamily: "'Poppins', sans-serif",
            opacity: 0.85,
          }}>
            📍 {storeName}
          </p>
        )}
      </div>

      {/* Cart icon */}
      <button
        onClick={onCartClick}
        data-cart-icon
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 4,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ShoppingCart size={24} color={MAGENTA} strokeWidth={2} />
        {itemCount > 0 && (
          <span style={{
            position: "absolute",
            top: -2,
            right: -4,
            background: MAGENTA,
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            borderRadius: "50%",
            minWidth: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "0 2px 6px rgba(181,23,90,0.35)",
          }}>
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
    </div>
  );
}