import React from "react";
import { Search, ShoppingBag } from "lucide-react";

export default function PopsyHeader({ cartCount }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
      {/* Main header */}
      <div
        style={{
          background: "linear-gradient(135deg, #E8004D, #C8003A, #8B0029)",
          padding: "14px 18px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div>
          <div
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-0.5px",
            }}
          >
            Popsy
          </div>
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 10,
              color: "rgba(255,255,255,0.75)",
              fontWeight: 400,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginTop: 1,
            }}
          >
            Helado Gourmet
          </div>
        </div>

        {/* Icons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Search size={15} color="#fff" />
          </button>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <ShoppingBag size={15} color="#fff" />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#fff",
                  color: "#E8004D",
                  fontSize: 9,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Delivery bar */}
      <div
        style={{
          background: "linear-gradient(135deg, #8B0029, #6B0020)",
          padding: "7px 18px",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#4ADE80",
            display: "inline-block",
            boxShadow: "0 0 0 3px rgba(74,222,128,0.3)",
            animation: "pulse 2s infinite",
            flexShrink: 0,
          }}
        />
        <style>{`
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.3); }
            50% { box-shadow: 0 0 0 6px rgba(74,222,128,0.1); }
          }
        `}</style>
        <span
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            color: "rgba(255,255,255,0.9)",
            fontWeight: 400,
          }}
        >
          Entrega en{" "}
          <strong style={{ color: "#fff", fontWeight: 600 }}>25–35 min</strong>
        </span>
      </div>
    </div>
  );
}