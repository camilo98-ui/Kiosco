import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { formatCOP, CATEGORIES } from "@/lib/constants";

function ProductRow({ product, onAdd, idx }) {
  const [imgError, setImgError] = useState(false);
  const catLabel = CATEGORIES.find(c => c.id === product.category)?.label || product.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03, duration: 0.18 }}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 16px",
        background: "#fff",
        borderBottom: "1px solid #F5EAEF",
        cursor: "pointer",
      }}
      onClick={() => onAdd(product)}
    >
      <div style={{
        width: 60, height: 60, borderRadius: 16,
        background: "#FFF0F8", flexShrink: 0,
        overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 28 }}>{product.emoji || "🍦"}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1A0A10", margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 11, color: "#BBA8B0", margin: "2px 0 0" }}>{catLabel}</p>
        <p style={{ fontSize: 14, fontWeight: 800, color: "#E91B8B", margin: "3px 0 0" }}>{formatCOP(product.price)}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onAdd(product); }}
        style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#E91B8B", color: "#fff", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 2px 8px rgba(233,27,139,0.3)",
          flexShrink: 0,
        }}
      >
        <Plus size={15} />
      </button>
    </motion.div>
  );
}

export default function MostOrderedAll({ products, onAdd, onBack }) {
  const sorted = [...products]
    .filter(p => p.tag === "mas_vendido" && p.is_available !== false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "#FFFCFD", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#fff", borderBottom: "1px solid #F0E4EA",
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF0F5", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ArrowLeft size={18} color="#E91B8B" />
        </button>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Lo más pedido</p>
        <span style={{ fontSize: 12, color: "#BBA8B0", marginLeft: "auto" }}>{sorted.length} productos</span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {sorted.map((p, i) => (
          <ProductRow key={p.id} product={p} onAdd={onAdd} idx={i} />
        ))}
        {sorted.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 80, color: "#CCCCCC" }}>
            <p style={{ fontSize: 40 }}>🍦</p>
            <p style={{ fontWeight: 600 }}>Sin productos destacados</p>
          </div>
        )}
      </div>
    </div>
  );
}