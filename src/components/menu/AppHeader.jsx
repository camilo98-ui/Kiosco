import React, { useEffect, useState } from "react";
import { ShoppingCart, MapPin } from "lucide-react";
import { useCart } from "@/lib/cartStore";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2b9a2f800_Logo_poopsy-removebg-preview.png";

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
        height: 88,
        background: "#C41E6A",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        boxShadow: scrolled
          ? "0 4px 20px rgba(196,30,106,0.35)"
          : "0 2px 8px rgba(196,30,106,0.20)",
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
          style={{
            height: "calc(88px * 0.45)",
            width: "auto",
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
          }}
        />
      </button>

      {/* Center — Store location */}
      <div style={{ flex: 1, textAlign: "center", padding: "0 10px" }}>
        {storeName && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <MapPin size={12} color="rgba(248,249,250,0.85)" strokeWidth={2.5} />
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
                margin: 0,
                lineHeight: 1,
                fontFamily: "'Poppins', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {storeName}
            </p>
          </div>
        )}
      </div>

      {/* Right — Cart */}
      <button
        onClick={onCartClick}
        data-cart-icon
        style={{
          background: "rgba(255,255,255,0.18)",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ShoppingCart size={22} color="#F8F9FA" strokeWidth={2} />
        {itemCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              background: "#fff",
              color: "#C41E6A",
              fontSize: 10,
              fontWeight: 900,
              borderRadius: "50%",
              minWidth: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              fontFamily: "'Poppins', sans-serif",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
    </div>
  );
}