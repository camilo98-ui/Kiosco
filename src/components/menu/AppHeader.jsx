import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartStore";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2b9a2f800_Logo_poopsy-removebg-preview.png";
const MAGENTA = "#C41E6A";

export default function AppHeader({ storeName, onLogoClick, onCartClick }) {
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
        height: 60,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        boxShadow: scrolled
          ? "0 2px 16px rgba(0,0,0,0.10)"
          : "0 1px 0 rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Left — Logo */}
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
          style={{ height: 38, width: "auto", objectFit: "contain" }}
        />
      </button>

      {/* Center — Store location */}
      <div style={{ flex: 1, textAlign: "center", padding: "0 12px" }}>
        {storeName && (
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1A0A10",
              margin: 0,
              lineHeight: 1,
              fontFamily: "'Poppins', sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            📍 {storeName}
          </p>
        )}
      </div>

      {/* Right — Cart */}
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
          <span
            style={{
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
              boxShadow: "0 2px 6px rgba(196,30,106,0.35)",
            }}
          >
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
    </div>
  );
}