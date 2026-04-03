import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { formatCOP } from "@/lib/constants";

// ── Categorías con iconos circulares ────────────────────────────────
function CategoryIcons({ activeCategory, onSelect }) {
  return (
    <div style={{ padding: "16px 16px 0" }}>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 700, color: "#1A0A10", marginBottom: 12 }}>
        Categorías
      </p>
      <div style={{ display: "flex", overflowX: "auto", gap: 16, scrollbarWidth: "none", paddingBottom: 4 }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: isActive ? "#fff0f5" : "#F5F5F5",
                border: isActive ? "2.5px solid #C2185B" : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                transition: "all 0.15s ease",
              }}>
                {cat.emoji}
              </div>
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#C2185B" : "#8A7880",
                whiteSpace: "nowrap",
              }}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Carrusel de familias ─────────────────────────────────────────────
const FAMILY_CARDS = [
  { id: "malteadas", label: "Malteadas", bg: "linear-gradient(135deg, #6D1B4E, #C2185B)" },
  { id: "helados",   label: "Helados",   bg: "linear-gradient(135deg, #7B3A00, #C97B30)" },
  { id: "combos",    label: "Cookie Jar",bg: "linear-gradient(135deg, #3A2000, #7B5A1A)" },
  { id: "especialidades", label: "Especiales", bg: "linear-gradient(135deg, #1A3A6D, #2A6DB5)" },
  { id: "cafe",      label: "Café",      bg: "linear-gradient(135deg, #1A2A1A, #2E7D32)" },
];

function FamilyCarousel({ products, activeCategory, onSelect }) {
  // Count per category
  const counts = useMemo(() => {
    const map = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [products]);

  return (
    <div style={{ padding: "16px 0 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 16, paddingRight: 16, marginBottom: 10 }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 700, color: "#1A0A10", margin: 0 }}>
          Explorar familias
        </p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, color: "#C2185B" }}>
          Ver todo
        </button>
      </div>
      <div style={{ display: "flex", overflowX: "auto", gap: 10, paddingLeft: 16, paddingRight: 16, scrollbarWidth: "none", paddingBottom: 4 }}>
        {FAMILY_CARDS.map((fam) => (
          <button
            key={fam.id}
            onClick={() => onSelect(fam.id)}
            style={{
              flexShrink: 0,
              width: 120,
              height: 80,
              borderRadius: 16,
              background: fam.bg,
              border: "none",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              padding: "0 0 10px 10px",
            }}
          >
            {/* Arrow */}
            <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={11} color="#fff" />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{fam.label}</p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                {counts[fam.id] || 0} opciones
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Item de Lo más pedido ────────────────────────────────────────────
function MostOrderedItem({ product, idx, onAdd }) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      onClick={() => onAdd(product)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#fff",
        border: "none",
        borderBottom: "1px solid #F5EAEF",
        padding: "12px 0",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div style={{
        width: 46,
        height: 46,
        borderRadius: 12,
        background: ITEM_BG[idx % ITEM_BG.length],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 22 }}>{product.emoji || "🍦"}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: "#1A0A10", margin: 0, lineHeight: 1.3 }}>
          {product.name}
        </p>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#BBA8B0", margin: 0, marginTop: 1 }}>
          {CATEGORIES.find(c => c.id === product.category)?.label || product.category} · desde {formatCOP(product.price)}
        </p>
      </div>
      <ChevronRight size={16} color="#DDD" style={{ flexShrink: 0 }} />
    </button>
  );
}

// ── Lo más pedido ────────────────────────────────────────────────────
const ITEM_BG = [
  "linear-gradient(135deg, #6D1B4E, #C2185B)",
  "linear-gradient(135deg, #7B3A00, #C97B30)",
  "linear-gradient(135deg, #1A3A6D, #2A6DB5)",
  "linear-gradient(135deg, #1A2A1A, #2E7D32)",
  "linear-gradient(135deg, #3A2000, #7B5A1A)",
];

function MostOrdered({ products, onAdd }) {
  const top = useMemo(() =>
    [...products]
      .filter(p => p.tag === "mas_vendido" && p.is_available !== false)
      .slice(0, 8),
    [products]
  );

  if (top.length === 0) return null;

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 700, color: "#1A0A10", margin: 0 }}>
          Lo más pedido
        </p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, color: "#C2185B" }}>
          Ver todo
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {top.map((product, idx) => (
          <MostOrderedItem key={product.id} product={product} idx={idx} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}

export { CategoryIcons, FamilyCarousel, MostOrdered };