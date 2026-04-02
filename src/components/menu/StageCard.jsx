import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { formatCOP, TAG_CONFIG } from "@/lib/constants";

const PASTEL_BG = ["#FFF0F5", "#F0FFF4", "#FFFAF0", "#FFF5F0", "#F0F5FF", "#FAFFF0"];
const PASTEL_BORDER = ["#F8D0DF", "#C3E6C3", "#F0E0C0", "#F8D0C0", "#C0D0F0", "#D0F0C0"];
const RING_COLORS = ["#FAD9E8", "#F8BBD0"];

export default function StageCard({ products, onAdd, addedFlash }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const startX = React.useRef(null);

  if (!products || products.length === 0) return null;

  const product = products[activeIdx] || products[0];
  const paletteIdx = activeIdx % PASTEL_BG.length;
  const tag = TAG_CONFIG[product.tag];

  const next = () => setActiveIdx((i) => (i + 1) % products.length);
  const prev = () => setActiveIdx((i) => (i - 1 + products.length) % products.length);

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    startX.current = null;
  };

  const isFlash = addedFlash === product.id;

  return (
    <div className="px-5 mb-5">
      <motion.div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        animate={isFlash ? { scale: 0.97, opacity: 0.85 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="relative overflow-hidden"
        style={{
          background: PASTEL_BG[paletteIdx],
          border: `1.5px solid ${PASTEL_BORDER[paletteIdx]}`,
          borderRadius: 28,
          height: 190,
          padding: "0 22px",
        }}
      >
        {/* Anillos decorativos centrados */}
        <div
          className="absolute"
          style={{
            top: "50%",
            right: 22,
            transform: "translateY(-50%)",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: RING_COLORS[0],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Anillo externo con borde magenta muy transparente */}
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: "1.5px solid rgba(194,24,91,0.15)",
          }} />
          <div style={{
            position: "absolute", inset: -18, borderRadius: "50%",
            border: "1px solid rgba(194,24,91,0.08)",
          }} />
          {/* Círculo interior */}
          <div style={{
            width: 86, height: 86, borderRadius: "50%",
            background: RING_COLORS[1],
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={product.id}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ fontSize: 46, lineHeight: 1 }}
              >
                {product.emoji || "🍦"}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Contenido inferior izquierdo */}
        <div className="absolute bottom-4 left-5 right-36">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tag && product.tag !== "none" && (
                <span
                  className="inline-block font-black uppercase"
                  style={{
                    fontSize: 9,
                    background: "#C2185B",
                    color: "#fff",
                    borderRadius: 20,
                    padding: "2px 8px",
                    marginBottom: 5,
                    letterSpacing: "0.5px",
                  }}
                >
                  {tag.label}
                </span>
              )}
              <p className="font-black leading-tight" style={{ fontSize: 15, color: "#2D1A22" }}>
                {product.name}
              </p>
              <p style={{ fontSize: 9, color: "#BBA8B0", marginTop: 2 }}>
                {product.is_available !== false ? "Disponible ahora" : "Agotado"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Precio + botón inferior derecho */}
        <div className="absolute bottom-4 right-5 flex flex-col items-end gap-1.5">
          <AnimatePresence mode="wait">
            <motion.p
              key={product.id + "_price"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-black"
              style={{ fontSize: 19, color: "#C2185B" }}
            >
              {formatCOP(product.price)}
            </motion.p>
          </AnimatePresence>
          {product.is_available !== false && (
            <button
              onClick={() => onAdd(product)}
              className="flex items-center justify-center transition-transform active:scale-90 hover:scale-110"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#C2185B", color: "#fff",
                boxShadow: "0 3px 10px rgba(194,24,91,0.4)",
              }}
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Dots */}
      {products.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                height: 6,
                width: i === activeIdx ? 18 : 6,
                borderRadius: 6,
                background: i === activeIdx ? "#C2185B" : "#EDD8E4",
                transition: "all 0.25s ease",
                border: "none",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}