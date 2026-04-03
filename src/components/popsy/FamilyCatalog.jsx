import React, { useState } from "react";
import { ChevronLeft, Plus, Check } from "lucide-react";
import { BG_GRADIENTS } from "@/lib/popsyCatalog";
import { formatCOP } from "@/lib/constants";

const FILTERS = ["Mayor precio", "Populares", "Novedades", "Sin azúcar"];

function FeaturedCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (added) return;
    onAdd(product.price);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  };

  return (
    <div
      style={{
        background: "linear-gradient(140deg, #1A0A10, #3D0A20)",
        borderRadius: 22,
        padding: "20px",
        marginBottom: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circle */}
      <div
        style={{
          position: "absolute",
          right: -30,
          top: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(232,0,77,0.25)",
        }}
      />

      {/* TOP badge */}
      {product.top && (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#5C3D00",
            fontSize: 9,
            fontWeight: 800,
            padding: "3px 9px",
            borderRadius: 20,
            fontFamily: '"DM Sans", sans-serif',
            letterSpacing: "0.5px",
          }}
        >
          TOP ⭐
        </span>
      )}

      {/* Emoji */}
      <div style={{ fontSize: 52, marginBottom: 12, position: "relative", zIndex: 1 }}>
        {product.emoji}
      </div>

      {/* Text */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            marginBottom: 6,
            lineHeight: 1.25,
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            color: "rgba(255,200,200,0.8)",
            margin: 0,
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          {product.desc}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            {product.oldPrice && (
              <p
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 11,
                  color: "rgba(255,200,200,0.5)",
                  textDecoration: "line-through",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {formatCOP(product.oldPrice)}
              </p>
            )}
            <p
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              {formatCOP(product.price)}
            </p>
          </div>
          <button
            onClick={handleAdd}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: added ? "#22C55E" : "#E8004D",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s ease",
              boxShadow: "0 4px 14px rgba(232,0,77,0.4)",
              flexShrink: 0,
            }}
          >
            {added ? <Check size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (added) return;
    onAdd(product.price);
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  };

  const bg = BG_GRADIENTS[product.bg] || BG_GRADIENTS.bg1;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: "14px",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 2px 12px rgba(26,10,16,0.07)",
        position: "relative",
      }}
    >
      {/* TOP badge */}
      {product.top && (
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#5C3D00",
            fontSize: 8,
            fontWeight: 800,
            padding: "2px 7px",
            borderRadius: 20,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          TOP ⭐
        </span>
      )}

      {/* Emoji box */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 30,
        }}
      >
        {product.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {product.badge && (
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 9,
              fontWeight: 600,
              background: "#FFD6E7",
              color: "#C0004D",
              padding: "2px 8px",
              borderRadius: 20,
              display: "inline-block",
              marginBottom: 4,
            }}
          >
            {product.badge}
          </span>
        )}
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: "#1A0A10",
            margin: 0,
            marginBottom: 2,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 11,
            color: "#8A7880",
            margin: 0,
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          {product.oldPrice && (
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 11,
                color: "#C0B0B6",
                textDecoration: "line-through",
              }}
            >
              {formatCOP(product.oldPrice)}
            </span>
          )}
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 15,
              fontWeight: 700,
              color: "#E8004D",
            }}
          >
            {formatCOP(product.price)}
          </span>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: added ? "#22C55E" : "#E8004D",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.2s ease",
          boxShadow: "0 3px 10px rgba(232,0,77,0.3)",
        }}
      >
        {added ? <Check size={14} color="#fff" /> : <Plus size={14} color="#fff" />}
      </button>
    </div>
  );
}

export default function FamilyCatalog({ family, onBack, onAddToCart }) {
  const [activeFilter, setActiveFilter] = useState("Mayor precio");

  const [featured, ...rest] = family.products;

  return (
    <div style={{ padding: "0 0 140px" }}>
      {/* Family header */}
      <div style={{ padding: "16px 16px 0" }}>
        {/* Back button + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button
            onClick={onBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#fff",
              border: "1.5px solid #F0E4EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <ChevronLeft size={18} color="#1A0A10" />
          </button>
          <div>
            <h2
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 22,
                fontWeight: 700,
                color: "#1A0A10",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {family.name}
            </h2>
            <p
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12,
                color: "#8A7880",
                margin: 0,
              }}
            >
              {family.products.length} productos disponibles
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            scrollbarWidth: "none",
            paddingBottom: 14,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                flexShrink: 0,
                padding: "7px 14px",
                borderRadius: 30,
                border: activeFilter === f ? "none" : "1.5px solid #E8D8DF",
                background: activeFilter === f ? "#E8004D" : "#fff",
                color: activeFilter === f ? "#fff" : "#8A7880",
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12,
                fontWeight: activeFilter === f ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: "0 16px" }}>
        {featured && (
          <FeaturedCard product={featured} onAdd={onAddToCart} />
        )}
        {rest.map((product) => (
          <ProductCard key={product.name} product={product} onAdd={onAddToCart} />
        ))}
      </div>
    </div>
  );
}