import React from "react";
import { ChevronRight } from "lucide-react";

const FAMILY_GRADIENTS = [
  "linear-gradient(135deg, #FFD6E7, #FFB3CC)",
  "linear-gradient(135deg, #FFE4C4, #FFCC99)",
  "linear-gradient(135deg, #C8F0FF, #90D8F8)",
  "linear-gradient(135deg, #C8F0E0, #90DFB8)",
  "linear-gradient(135deg, #E8D5F5, #D0A8F0)",
  "linear-gradient(135deg, #FFF3C4, #FFE070)",
  "linear-gradient(135deg, #D0E8FF, #A0C8FF)",
];

function FamilyCard({ family, gradient, onSelect, fullWidth }) {
  return (
    <div
      onClick={() => onSelect(family.key)}
      style={{
        background: gradient,
        borderRadius: 22,
        padding: fullWidth ? "18px 22px" : "18px 16px 16px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        gridColumn: fullWidth ? "span 2" : undefined,
        display: fullWidth ? "flex" : "flex",
        flexDirection: fullWidth ? "row" : "column",
        alignItems: fullWidth ? "center" : "flex-start",
        gap: fullWidth ? 16 : 0,
        minHeight: fullWidth ? 90 : 130,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        userSelect: "none",
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
      onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {/* Decorative circle */}
      <div
        style={{
          position: fullWidth ? "relative" : "absolute",
          top: fullWidth ? undefined : -16,
          right: fullWidth ? undefined : -16,
          width: fullWidth ? 70 : 90,
          height: fullWidth ? 70 : 90,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: fullWidth ? 32 : 36 }}>{family.emoji}</span>
      </div>

      {/* Text content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: fullWidth ? 18 : 15,
            fontWeight: 700,
            color: "#1A0A10",
            lineHeight: 1.2,
            marginTop: fullWidth ? 0 : 44,
            marginBottom: 3,
          }}
        >
          {family.name}
        </div>
        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 11,
            color: "#8A7880",
            fontWeight: 400,
          }}
        >
          {family.products.length} productos
        </div>
      </div>

      {/* Arrow button */}
      <div
        style={{
          position: fullWidth ? "relative" : "absolute",
          bottom: fullWidth ? undefined : 12,
          right: fullWidth ? undefined : 12,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#E8004D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ChevronRight size={14} color="#fff" />
      </div>
    </div>
  );
}

export default function FamilyGrid({ families, onSelect }) {
  const regularFamilies = families.filter((f) => !f.featured);
  const featuredFamily = families.find((f) => f.featured);

  return (
    <div style={{ padding: "20px 16px 120px" }}>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 26,
            fontWeight: 700,
            color: "#1A0A10",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: 4,
          }}
        >
          ¿Qué se te antoja?
        </h1>
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            color: "#8A7880",
            margin: 0,
          }}
        >
          {families.length} categorías disponibles
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {regularFamilies.map((family, idx) => (
          <FamilyCard
            key={family.key}
            family={family}
            gradient={FAMILY_GRADIENTS[idx % FAMILY_GRADIENTS.length]}
            onSelect={onSelect}
            fullWidth={false}
          />
        ))}
        {featuredFamily && (
          <FamilyCard
            key={featuredFamily.key}
            family={featuredFamily}
            gradient={FAMILY_GRADIENTS[6]}
            onSelect={onSelect}
            fullWidth={true}
          />
        )}
      </div>
    </div>
  );
}