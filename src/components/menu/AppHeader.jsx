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
        background: "#E8187A",
        padding: "32px 20px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Large white logo centered */}
      <button
        onClick={onLogoClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <img
          src={LOGO_URL}
          alt="Popsy"
          style={{
            height: 68,
            width: "auto",
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
          }}
        />
      </button>

      {/* Store name — white, minimal */}
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
            gap: 4,
          }}
        >
          <MapPin size={10} color="#fff" strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "#fff",
              margin: 0,
              letterSpacing: "0.18em",
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