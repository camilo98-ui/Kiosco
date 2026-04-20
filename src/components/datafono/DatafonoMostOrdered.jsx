import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, formatCOP } from "@/lib/constants";

const ITEM_BG = [
  "linear-gradient(135deg, #6D1B4E, #B5175A)",
  "linear-gradient(135deg, #7B3A00, #C97B30)",
  "linear-gradient(135deg, #1A3A6D, #2A6DB5)",
  "linear-gradient(135deg, #4A2A1A, #9A5A3A)",
  "linear-gradient(135deg, #3A2000, #7B5A1A)",
];

function MostOrderedItem({ product, idx, onSelectCategory }) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      onClick={() => onSelectCategory(product.category, product)}
      style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFF5F7", border: "none", borderBottom: "1px solid #F5EAEF", padding: "14px 16px", cursor: "pointer", textAlign: "left", width: "100%", WebkitTapHighlightColor: "transparent" }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 14, background: ITEM_BG[idx % ITEM_BG.length], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
        {product.image_url && !imgError
          ? <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 24 }}>{product.emoji || "🍦"}</span>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1A0A10", margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 11, color: "#BBA8B0", margin: "2px 0 0" }}>
          {CATEGORIES.find(c => c.id === product.category)?.label} · {formatCOP(product.price)}
        </p>
      </div>
      <ChevronRight size={16} color="#DDD" style={{ flexShrink: 0 }} />
    </button>
  );
}

export default function MostOrdered({ products, onSelectCategory }) {
  const top = useMemo(() =>
    [...products].filter(p => p.tag === "mas_vendido" && p.is_available !== false).slice(0, 8),
    [products]
  );
  if (top.length === 0) return null;
  return (
    <div style={{ background: "#FFF5F7", marginTop: 10 }}>
      <div style={{ padding: "18px 16px 4px" }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#2D1A22", margin: 0 }}>Los favoritos de todos 🔥</p>
      </div>
      {top.map((product, idx) => (
        <MostOrderedItem key={product.id} product={product} idx={idx} onSelectCategory={onSelectCategory} />
      ))}
      <div style={{ height: 8 }} />
    </div>
  );
}