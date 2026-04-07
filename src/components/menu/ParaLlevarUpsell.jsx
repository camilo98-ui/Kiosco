import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const LITRO_IMAGE = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/f274e95e1_Gemini_Generated_Image_nwh7ponwh7ponwh7.png";

const SABORES_GOURMET = [
  "Vainilla Gourmet",
  "Brownie Gourmet",
  "Frutos Del Bosque Gourmet",
  "Crema De Limón Gourmet",
  "Oreo Gourmet",
  "Arequipe Gourmet",
  "Fresa Gourmet",
  "Mocaccino Juan Valdez",
  "Milky Way Gourmet",
  "Vainilla Francesa Gourmet",
];

const SABORES_EXCLUSIVO = [
  "Yogo Yogo Fresa",
  "Cherry Mania",
  "M&M's",
  "Macadamia",
  "Oreo Exclusivo",
  "Brownie Exclusivo",
  "Vainilla Chips",
  "Arroz Con Leche",
  "Chicle",
  "Snickers Almond",
];

const LITROS = [
  {
    id: "gourmet",
    label: "Litro Gourmet",
    price: 39900,
    sabores: SABORES_GOURMET,
    badge: null,
    flavorsLabel: "Vainilla · Brownie · Frutos del Bosque · Crema de Limón · Oreo y más",
  },
  {
    id: "exclusivo",
    label: "Litro Exclusivo",
    price: 46900,
    sabores: SABORES_EXCLUSIVO,
    badge: "Premium",
    flavorsLabel: "Yogo Yogo · Cherry Mania · M&M's · Macadamia · Oreo y más",
  },
];

const MAGENTA = "#C41E6A";

// Confetti decorativo
function Confetti() {
  const dots = [
    { top: "8%", left: "6%", size: 8, color: "#C41E6A", opacity: 0.15 },
    { top: "4%", left: "20%", size: 5, color: "#FF6EB4", opacity: 0.12 },
    { top: "12%", right: "8%", size: 7, color: "#C41E6A", opacity: 0.13 },
    { top: "6%", right: "22%", size: 4, color: "#FF6EB4", opacity: 0.1 },
    { bottom: "18%", left: "4%", size: 6, color: "#C41E6A", opacity: 0.12 },
    { bottom: "22%", left: "18%", size: 4, color: "#FF6EB4", opacity: 0.1 },
    { bottom: "16%", right: "6%", size: 8, color: "#C41E6A", opacity: 0.13 },
    { bottom: "20%", right: "20%", size: 5, color: "#FF6EB4", opacity: 0.12 },
  ];
  const stars = [
    { top: "10%", left: "12%", opacity: 0.13 },
    { top: "7%", right: "14%", opacity: 0.11 },
    { bottom: "24%", left: "10%", opacity: 0.12 },
    { bottom: "19%", right: "12%", opacity: 0.10 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: "absolute", width: d.size, height: d.size,
          borderRadius: "50%", background: d.color, opacity: d.opacity,
          top: d.top, left: d.left, right: d.right, bottom: d.bottom,
        }} />
      ))}
      {stars.map((s, i) => (
        <div key={`star-${i}`} style={{
          position: "absolute", fontSize: 14, opacity: s.opacity,
          top: s.top, left: s.left, right: s.right, bottom: s.bottom,
          color: MAGENTA,
        }}>✦</div>
      ))}
    </div>
  );
}

// Bottom sheet selector de sabor
function SaborSheet({ litro, open, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(litro, selected);
    setSelected(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 110,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: "24px 24px 0 0",
              width: "100%", maxHeight: "70vh",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 6px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#EEE" }} />
            </div>
            <div style={{ padding: "4px 20px 12px" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Elige el sabor</p>
              <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0" }}>{litro?.label} · {litro && formatCOP(litro.price)}</p>
            </div>
            {/* Lista sabores */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
              {litro?.sabores.map(sabor => (
                <button
                  key={sabor}
                  onClick={() => setSelected(sabor)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "12px 0",
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: "1px solid #F9F0F4", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#1A1A1A" }}>{sabor}</span>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    border: selected === sabor ? `6px solid ${MAGENTA}` : "2px solid #DDD",
                    background: "#fff", transition: "all 0.15s",
                  }} />
                </button>
              ))}
            </div>
            {/* Botón confirmar */}
            <div style={{ padding: "14px 20px 32px", borderTop: "1px solid #F0F0F0" }}>
              <button
                onClick={handleConfirm}
                disabled={!selected}
                style={{
                  width: "100%", height: 52, borderRadius: 14,
                  background: selected ? MAGENTA : "#F0C0DC",
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  border: "none", cursor: selected ? "pointer" : "not-allowed",
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: selected ? "0 4px 14px rgba(196,30,106,0.35)" : "none",
                  transition: "all 0.2s",
                }}
              >
                Confirmar y pagar →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Tarjeta de litro
function LitroCard({ litro, onSelect }) {
  return (
    <button
      onClick={() => onSelect(litro)}
      style={{
        flex: 1, background: "#FFF5F9", border: "1px solid #FFE4F3",
        borderRadius: 16, padding: "14px 12px",
        cursor: "pointer", textAlign: "left",
        display: "flex", flexDirection: "column", gap: 6,
      }}
    >
      {litro.badge && (
        <span style={{
          fontSize: 10, fontWeight: 800, background: MAGENTA, color: "#fff",
          borderRadius: 20, padding: "2px 8px", alignSelf: "flex-start",
        }}>
          {litro.badge}
        </span>
      )}
      <p style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>{litro.label}</p>
      <p style={{ fontSize: 11, color: "#999", margin: 0, lineHeight: 1.4 }}>{litro.flavorsLabel}</p>
      <p style={{ fontSize: 18, fontWeight: 800, color: MAGENTA, margin: "4px 0 0" }}>
        {formatCOP(litro.price)}
      </p>
      <div style={{
        marginTop: 6, height: 40, borderRadius: 12,
        background: MAGENTA, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700,
        boxShadow: "0 3px 10px rgba(196,30,106,0.3)",
      }}>
        Agregar
      </div>
    </button>
  );
}

export default function ParaLlevarUpsell({ open, onSkip, onAddAndPay }) {
  const [saborSheet, setSaborSheet] = useState(null); // litro seleccionado

  const handleLitroSelect = (litro) => {
    setSaborSheet(litro);
  };

  const handleSaborConfirm = (litro, sabor) => {
    setSaborSheet(null);
    onAddAndPay({
      product_id: `litro-${litro.id}`,
      product_name: `${litro.label} · ${sabor}`,
      price: litro.price,
      quantity: 1,
      notes: `Sabor: ${sabor}`,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#FFFFFF",
            display: "flex", flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <Confetti />

          {/* Contenido */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 20px 0", position: "relative", zIndex: 1 }}>

            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <span style={{
                background: "#FFE4F3", color: MAGENTA,
                fontSize: 13, fontWeight: 700,
                borderRadius: 20, padding: "6px 16px",
                border: `1px solid #F9C6E0`,
              }}>
                🍦 Antes de irte...
              </span>
            </div>

            {/* Título */}
            <p style={{ fontSize: 26, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 6px", fontFamily: "'Poppins', sans-serif" }}>
              ¿Y para llevar?
            </p>
            <p style={{ fontSize: 14, color: "#666", textAlign: "center", margin: "0 0 20px", lineHeight: 1.5 }}>
              Llévate un litro Popsy y disfrútalo cuando quieras
            </p>

            {/* Imagen principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              style={{ width: "100%", marginBottom: 6 }}
            >
              <img
                src={LITRO_IMAGE}
                alt="Litros Popsy"
                style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block" }}
              />
            </motion.div>

            {/* Línea de puntos decorativa */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 5, marginBottom: 22,
            }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: MAGENTA, opacity: 0.2 + (i % 3) * 0.1 }} />
              ))}
            </div>

            {/* Cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              {LITROS.map(litro => (
                <LitroCard key={litro.id} litro={litro} onSelect={handleLitroSelect} />
              ))}
            </div>
          </div>

          {/* Botón saltar */}
          <div style={{ padding: "12px 20px 36px", textAlign: "center", position: "relative", zIndex: 1 }}>
            <button
              onClick={onSkip}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "#AAAAAA",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              No gracias, continuar al pago →
            </button>
          </div>

          {/* Selector de sabor */}
          <SaborSheet
            litro={saborSheet}
            open={!!saborSheet}
            onClose={() => setSaborSheet(null)}
            onConfirm={handleSaborConfirm}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}