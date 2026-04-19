import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { formatCOP, TAG_CONFIG } from "@/lib/constants";

const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";
const MAGENTA = "#E8187A";

function FeaturedHorizontalCard({ product, onAdd }) {
  const [imgErr, setImgErr] = React.useState(false);
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onAdd(product)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 4px 18px rgba(232,24,122,0.12)", cursor: "pointer",
        display: "flex", alignItems: "center", marginBottom: 14,
      }}
    >
      <div style={{ width: 130, height: 130, flexShrink: 0, overflow: "hidden", background: "#FFF5F0" }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>☕</div>
        )}
      </div>
      <div style={{ flex: 1, padding: "14px 16px" }}>
        <span style={{
          display: "inline-block", fontSize: 9, fontWeight: 800,
          background: MAGENTA, color: "#fff", borderRadius: 99, padding: "3px 9px", marginBottom: 6,
        }}>
          ☕ Más pedido
        </span>
        <p style={{ fontSize: 16, fontWeight: 800, color: "#111", margin: "0 0 4px", lineHeight: 1.3, fontFamily: FONT }}>{product.name}</p>
        <p style={{ fontSize: 15, fontWeight: 900, color: MAGENTA, margin: "0 0 12px", fontFamily: FONT }}>{formatCOP(product.price)}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: MAGENTA, color: "#fff", border: "none", borderRadius: 12,
            padding: "8px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: FONT,
            boxShadow: "0 3px 12px rgba(232,24,122,0.3)",
          }}
        >
          <Plus size={13} /> Agregar
        </button>
      </div>
    </motion.div>
  );
}

function CafeGridCard({ product, onAdd }) {
  const [imgErr, setImgErr] = React.useState(false);
  const isNew = product.tag && product.tag !== "none";
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => onAdd(product)}
      style={{
        background: "#fff", borderRadius: 18, overflow: "hidden",
        boxShadow: "0 2px 12px rgba(232,24,122,0.08)", cursor: "pointer",
        display: "flex", flexDirection: "column", position: "relative",
      }}
    >
      <div style={{ height: 140, overflow: "hidden", position: "relative" }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#FFF5F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>☕</div>
        )}
        {isNew && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            fontSize: 9, fontWeight: 800, background: MAGENTA, color: "#fff",
            borderRadius: 99, padding: "3px 9px",
          }}>Nuevo</span>
        )}
      </div>
      <div style={{ padding: "10px 12px 36px", flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0, lineHeight: 1.3, fontFamily: FONT,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </p>
        <p style={{ fontSize: 14, fontWeight: 800, color: MAGENTA, margin: "5px 0 0", fontFamily: FONT }}>{formatCOP(product.price)}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onAdd(product); }}
        style={{
          position: "absolute", bottom: 10, right: 10,
          width: 28, height: 28, borderRadius: "50%", background: MAGENTA,
          color: "#fff", border: "none", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer",
          boxShadow: "0 2px 8px rgba(232,24,122,0.3)",
        }}
      >
        <Plus size={13} />
      </button>
    </motion.div>
  );
}

export default function CafeLayoutPremium({ products, onAdd }) {
  const available = products.filter(p => p.is_available !== false);
  // Featured: primero por tag priority, else el primero disponible
  const featured = available.find(p => p.tag === "mas_vendido" || p.tag === "recomendado") || available[0];
  const rest = available.filter(p => p.id !== featured?.id);

  if (!featured) return null;

  return (
    <div style={{ padding: "8px 14px" }}>
      {/* Card destacada horizontal */}
      <FeaturedHorizontalCard product={featured} onAdd={onAdd} />

      {/* Separador label */}
      {rest.length > 0 && (
        <p style={{
          fontSize: 9, fontWeight: 800, color: "#BBA8B0",
          textTransform: "uppercase", letterSpacing: "1.5px",
          margin: "0 0 12px", fontFamily: FONT,
        }}>
          ☕ Todos los cafés
        </p>
      )}

      {/* Grid 2 columnas */}
      {rest.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {rest.map(p => <CafeGridCard key={p.id} product={p} onAdd={onAdd} />)}
        </div>
      )}
    </div>
  );
}