import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP, TAG_CONFIG, CATEGORIES } from "@/lib/constants";

const CATEGORY_BG = {
  helados: "#FFF0F5",
  malteadas: "#F3E8FF",
  especialidades: "#FFFAF0",
  cafe: "#FFF5F0",
  galletas: "#FFF9F0",
  paletas_packs: "#F0FFF4",
  popsy_toy: "#F0F5FF",
  para_llevar: "#F5FFF0",
  tortas: "#FFF0F5",
  regalos: "#FFF0FF",
  bebidas: "#F0FAFF",
  adiciones: "#FFFAF0",
};

function ProductImageBox({ product, bg, size = 120, emojiSize = 50 }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <div
      style={{
        background: bg,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Círculos concéntricos decorativos */}
      <div style={{
        position: "absolute",
        width: emojiSize * 1.8, height: emojiSize * 1.8,
        borderRadius: "50%",
        background: "rgba(194,24,91,0.06)",
      }} />
      <div style={{
        position: "absolute",
        width: emojiSize * 1.3, height: emojiSize * 1.3,
        borderRadius: "50%",
        background: "rgba(194,24,91,0.10)",
      }} />
      {product.image_url && !imgError ? (
        <img
          src={product.image_url}
          alt={product.name}
          onError={() => setImgError(true)}
          style={{ width: emojiSize * 1.2, height: emojiSize * 1.2, objectFit: "cover", borderRadius: "50%", position: "relative", zIndex: 1 }}
        />
      ) : (
        <span style={{ fontSize: emojiSize, lineHeight: 1, position: "relative", zIndex: 1 }}>
          {product.emoji || "🍦"}
        </span>
      )}
    </div>
  );
}

function TallCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  return (
    <motion.div
      animate={isFlash ? { scale: 0.97 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
      style={{
        flex: 1.4,
        border: "1.5px solid #F0E4EA",
        borderRadius: 22,
        overflow: "hidden",
        background: "#fff",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ProductImageBox product={product} bg={bg} size={120} emojiSize={50} />
      {tag && product.tag !== "none" && (
        <span style={{
          position: "absolute", top: 8, left: 8,
          fontSize: 8, background: "#C2185B", color: "#fff",
          borderRadius: 20, padding: "2px 7px", fontWeight: 900,
        }}>
          {tag.label}
        </span>
      )}
      <div style={{ padding: "10px 10px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 8, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
          {product.is_available !== false && (
            <button
              onClick={() => onAdd(product)}
              style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "#C2185B", color: "#fff", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(194,24,91,0.35)",
                cursor: "pointer",
              }}
            >
              <Plus size={13} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SmallCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  return (
    <motion.div
      animate={isFlash ? { scale: 0.97 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
      style={{
        flex: 1,
        border: "1.5px solid #F0E4EA",
        borderRadius: 18,
        overflow: "hidden",
        background: "#fff",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ProductImageBox product={product} bg={bg} size={58} emojiSize={28} />
      {tag && product.tag === "recomendado" && (
        <span style={{
          position: "absolute", top: 4, left: 4,
          fontSize: 7, background: "#FFF9C4", color: "#7B6A00",
          borderRadius: 10, padding: "1px 5px", fontWeight: 800,
        }}>
          ⭐ Chef
        </span>
      )}
      <button
        onClick={() => onAdd(product)}
        style={{
          position: "absolute", top: 4, right: 4,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", border: "1.5px solid #C2185B",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Plus size={10} color="#C2185B" />
      </button>
      <div style={{ padding: "6px 8px 8px" }}>
        <p style={{ fontSize: 8, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 10, fontWeight: 900, color: "#C2185B", marginTop: 2 }}>{formatCOP(product.price)}</p>
      </div>
    </motion.div>
  );
}

function HorizontalCard({ product, onAdd, addedFlash, bg }) {
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div
      animate={isFlash ? { scale: 0.98 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
      style={{
        border: "1.5px solid #F0E4EA",
        borderRadius: 18,
        background: "#fff",
        height: 72,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        gap: 0,
      }}
    >
      {/* Imagen cuadrada */}
      <div style={{
        width: 72, height: 72, background: bg, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{ width: 72, height: 72, objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 30 }}>{product.emoji || "🍦"}</span>
        )}
      </div>
      {/* Divider */}
      <div style={{ width: 1, height: 40, background: "#F0E4EA", flexShrink: 0 }} />
      {/* Info */}
      <div style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 9, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
      </div>
      {/* Precio + botón */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
        {product.is_available !== false && (
          <button
            onClick={() => onAdd(product)}
            style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "#C2185B", color: "#fff", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(194,24,91,0.3)",
              cursor: "pointer",
            }}
          >
            <Plus size={11} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function EditorialLayout({ products, category, onAdd, addedFlash }) {
  if (!products || products.length === 0) return null;

  const bg = CATEGORY_BG[category] || "#FFF0F5";
  const catLabel = CATEGORIES.find(c => c.id === category)?.label || category;
  const available = products.filter(p => p.is_available !== false);

  // Top 3 para la zona asimétrica, resto en filas
  const topProducts = available.slice(0, 3);
  const restProducts = available.slice(3);

  const tallProduct = topProducts[0];
  const smallProducts = topProducts.slice(1, 3);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.2 }}
        style={{ paddingBottom: 8 }}
      >
        {/* Header de sección */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 14, paddingRight: 14, marginBottom: 10 }}>
          <p style={{ fontSize: 9, fontWeight: 800, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            {catLabel} · {available.length} disponibles
          </p>
          <p style={{ fontSize: 9, color: "#C2185B", fontWeight: 700 }}>Ver todos →</p>
        </div>

        {/* Zona asimétrica */}
        {tallProduct && (
          <div style={{ display: "flex", gap: 8, paddingLeft: 14, paddingRight: 14, marginBottom: 10 }}>
            <TallCard product={tallProduct} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
            {smallProducts.length > 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {smallProducts.map(p => (
                  <SmallCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Separador */}
        {restProducts.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 14, paddingRight: 14, margin: "10px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#F0E4EA" }} />
            <p style={{ fontSize: 8, color: "#DDD", textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap" }}>
              Más {catLabel}
            </p>
            <div style={{ flex: 1, height: 1, background: "#F0E4EA" }} />
          </div>
        )}

        {/* Filas anchas */}
        {restProducts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
            {restProducts.map(p => (
              <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}