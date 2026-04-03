import React from "react";
import { ChevronRight } from "lucide-react";

export default function CategoryGrid({ categories, productCounts, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "16px" }}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "125%",
            border: "none",
            borderRadius: 16,
            overflow: "hidden",
            background: "transparent",
            cursor: "pointer",
            aspectRatio: "4/5",
          }}
        >
          {/* Imagen de fondo */}
          {category.image && (
            <img
              src={category.image}
              alt={category.label}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Gradiente oscuro en parte inferior */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            }}
          />

          {/* Botón circular con flecha - esquina superior derecha */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <ChevronRight size={18} color="#fff" />
          </div>

          {/* Texto - esquina inferior izquierda */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              zIndex: 2,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "#fff",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {category.label}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.75)",
                margin: "4px 0 0",
              }}
            >
              {productCounts[category.id] || 0} opciones
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}