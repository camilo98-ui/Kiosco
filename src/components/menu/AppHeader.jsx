import React from "react";
import { MapPin } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2b9a2f800_Logo_poopsy-removebg-preview.png";

export default function AppHeader({ storeName, onLogoClick, onStoreClick }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "#FDFBF9",
        padding: "12px 20px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Pastilla frosted-glass */}
      <button
        onClick={onLogoClick}
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(45,26,18,0.08)",
          borderRadius: 999,
          padding: "10px 36px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 16px rgba(45,26,18,0.07)",
        }}
      >
        <img
          src={LOGO_URL}
          alt="Popsy"
          style={{
            height: 52,
            width: "auto",
            objectFit: "contain",
          }}
        />
      </button>

      {/* Store name — chocolate, minimal */}
      {storeName && (
        <button
          onClick={onStoreClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <MapPin size={9} color="#C41E6A" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <p
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "#2D1A12",
              margin: 0,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "'Poppins', sans-serif",
              whiteSpace: "nowrap",
              opacity: 0.75,
            }}
          >
            {storeName}
          </p>
        </button>
      )}
    </div>
  );
}