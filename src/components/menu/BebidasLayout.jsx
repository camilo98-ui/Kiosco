import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";
const MAGENTA = "#E8187A";

function AvailabilityBadge({ available }) {
  return (

    <span style={{
      position: "absolute", top: 10, left: 10,
      fontSize: 9, fontWeight: 700, borderRadius: 99, padding: "3px 9px",
      background: available !== false ? "rgba(34,197,94,0.15)" : "rgba(0,0,0,0.2)",
      color: available !== false ? "#15803D" : "#fff",
    }}>
      {available !== false ? "● Disponible" : "● Agotado"}
    </span>
  );
}

function HeroCard({ product, onAdd }) {
  const [imgErr, setImgErr] = React.useState(false);
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => product.is_available !== false && onAdd(product)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 4px 20px rgba(232,24,122,0.10)", cursor: "pointer",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        width: "100%", height: 200, overflow: "hidden", borderRadius: "20px 20px 0 0",
        position: "relative", flexShrink: 0,
      }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#F9F0F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>
            {product.emoji || "💧"}
          </div>
        )}
        <AvailabilityBadge available={product.is_available} />
      </div>
      <div style={{ padding: "16px 18px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: 0, lineHeight: 1.3, fontFamily: FONT }}>{product.name}</p>
          <p style={{ fontSize: 17, fontWeight: 900, color: MAGENTA, margin: "6px 0 0", fontFamily: FONT }}>{formatCOP(product.price)}</p>
        </div>
        {product.is_available !== false && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            style={{
              width: 46, height: 46, borderRadius: "50%", background: MAGENTA,
              color: "#fff", border: "none", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", flexShrink: 0,
              boxShadow: "0 4px 14px rgba(232,24,122,0.35)",
            }}
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function SingleHero({ product, onAdd }) {
  const [imgErr, setImgErr] = React.useState(false);
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => product.is_available !== false && onAdd(product)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        boxShadow: "0 4px 24px rgba(232,24,122,0.13)", cursor: "pointer",
      }}
    >
      <div style={{
        width: "100%", height: 250, overflow: "hidden", borderRadius: "20px 20px 0 0",
        position: "relative", flexShrink: 0,
      }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#F9F0F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>
            {product.emoji || "💧"}
          </div>
        )}
        <AvailabilityBadge available={product.is_available} />
      </div>
      <div style={{ padding: "20px 20px 22px" }}>
        <p style={{ fontSize: 20, fontWeight: 900, color: "#111", margin: 0, fontFamily: FONT }}>{product.name}</p>
        <p style={{ fontSize: 18, fontWeight: 900, color: MAGENTA, margin: "8px 0 16px", fontFamily: FONT }}>{formatCOP(product.price)}</p>
        {product.is_available !== false && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            style={{
              width: "100%", height: 52, borderRadius: 16, background: MAGENTA,
              color: "#fff", border: "none", fontSize: 15, fontWeight: 800,
              cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 16px rgba(232,24,122,0.35)",
            }}
          >
            Agregar al pedido
          </button>
        )}
      </div>
    </motion.div>
  );
}

function VerticalCard({ product, onAdd }) {
  const [imgErr, setImgErr] = React.useState(false);
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => product.is_available !== false && onAdd(product)}
      style={{
        background: "#F9F0F5", borderRadius: 18, overflow: "hidden",
        boxShadow: "0 2px 12px rgba(232,24,122,0.08)", cursor: "pointer",
        display: "flex", flexDirection: "column", position: "relative",
      }}
    >
      <div style={{
        width: "100%", minHeight: 200, padding: "16px", display: "flex",
        alignItems: "center", justifyContent: "center", position: "relative",
        flexShrink: 0, background: "#F9F0F5",
      }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", objectPosition: "center" }} />
        ) : (
          <span style={{ fontSize: 80 }}>{product.emoji || "💧"}</span>
        )}
        <div style={{
          position: "absolute", top: 12, left: 12, fontSize: 10, fontWeight: 700,
          borderRadius: 6, padding: "4px 10px", background: "#FFF0F5", color: "#E91E8C",
        }}>
          Disponible
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10", margin: 0, lineHeight: 1.3, fontFamily: FONT }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#E91E8C", margin: 0, fontFamily: FONT }}>
            {formatCOP(product.price)}
          </p>
          {product.is_available !== false && (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(product); }}
              style={{
                width: 40, height: 40, borderRadius: "50%", background: "#E91E8C",
                color: "#fff", border: "none", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", flexShrink: 0,
                boxShadow: "0 4px 12px rgba(233,30,140,0.3)",
              }}
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function BebidasLayout({ products, onAdd }) {
  const available = products.filter(p => p.is_available !== false);
  const all = products; // show unavailable too

  if (all.length === 1) {
    return (
      <div style={{ padding: "8px 14px" }}>
        <SingleHero product={all[0]} onAdd={onAdd} />
      </div>
    );
  }

  if (all.length === 2) {
    return (
      <div style={{ padding: "8px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        {all.map(p => <HeroCard key={p.id} product={p} onAdd={onAdd} />)}
      </div>
    );
  }

  // 3+ productos: grid vertical
  return (
    <div style={{ padding: "8px 14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {all.map(p => <VerticalCard key={p.id} product={p} onAdd={onAdd} />)}
      </div>
    </div>
  );
}