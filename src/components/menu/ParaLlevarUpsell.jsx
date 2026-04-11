import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const LITRO_IMAGE = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/f274e95e1_Gemini_Generated_Image_nwh7ponwh7ponwh7.png";
const MAGENTA = "#C41E6A";
const LITRO_PRICE = 46900;

const SABORES_LITRO = [
  "Oreo",
  "Crema Limón",
  "M&M's",
  "Macadamia",
  "Milky Way",
];

function SaborSheet({ open, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
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
              width: "100%", maxHeight: "60vh",
              display: "flex", flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 6px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#EEE" }} />
            </div>
            <div style={{ padding: "4px 20px 12px" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Elige el sabor</p>
              <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0" }}>Litro · {formatCOP(LITRO_PRICE)}</p>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
              {SABORES_LITRO.map(sabor => (
                <button
                  key={sabor}
                  onClick={() => setSelected(sabor)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "14px 0",
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: "1px solid #F9F0F4", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#1A1A1A", fontWeight: selected === sabor ? 700 : 400 }}>{sabor}</span>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    border: selected === sabor ? `6px solid ${MAGENTA}` : "2px solid #DDD",
                    background: "#fff", transition: "all 0.15s",
                  }} />
                </button>
              ))}
            </div>
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

export default function ParaLlevarUpsell({ open, onSkip, onAddAndPay }) {
  const [showSaborSheet, setShowSaborSheet] = useState(false);

  const handleSaborConfirm = (sabor) => {
    setShowSaborSheet(false);
    onAddAndPay({
      product_id: "litro-exclusivo",
      product_name: `Litro · ${sabor}`,
      price: LITRO_PRICE,
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
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#FFFAF9",
            display: "flex", flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 14, paddingBottom: 6, flexShrink: 0 }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#DDD" }} />
          </div>

          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8, marginBottom: 16, flexShrink: 0 }}>
            <span style={{
              background: "#FFE4F3", color: MAGENTA,
              fontSize: 13, fontWeight: 600,
              borderRadius: 20, padding: "6px 16px",
            }}>
              Antes de irte...
            </span>
          </div>

          {/* Título */}
          <div style={{ textAlign: "center", padding: "0 20px", marginBottom: 18, flexShrink: 0 }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", margin: 0, fontFamily: "'Poppins', sans-serif" }}>
              El verdadero final feliz 🍦
            </p>
            <p style={{ fontSize: 14, color: "#999", margin: "8px 0 0" }}>
              Un litro en la mano y felicidad garantizada
            </p>
          </div>

          {/* Imagen */}
          <div style={{ position: "relative", width: "100%", height: 200, flexShrink: 0 }}>
            <img
              src={LITRO_IMAGE}
              alt="Litro Popsy"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
              background: "linear-gradient(to bottom, transparent, #FFFAF9)",
            }} />
          </div>

          {/* Card litro */}
          <div style={{ padding: "20px 16px 0", flexShrink: 0 }}>
            <button
              onClick={() => setShowSaborSheet(true)}
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: `1.5px solid ${MAGENTA}`,
                borderRadius: 20,
                padding: "20px 20px",
                cursor: "pointer",
                textAlign: "left",
                boxShadow: "0 4px 16px rgba(180,0,80,0.12)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: "#FFE4F3", color: MAGENTA,
                    borderRadius: 20, padding: "3px 10px",
                    display: "inline-block", marginBottom: 8,
                  }}>
                    🍦 Para llevar
                  </span>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px" }}>
                    Litro de helado
                  </p>
                  <p style={{ fontSize: 12, color: "#999", margin: "0 0 12px" }}>
                    Oreo · Crema Limón · M&M's · Macadamia · Milky Way
                  </p>
                  <p style={{ fontSize: 26, fontWeight: 900, color: MAGENTA, margin: 0 }}>
                    {formatCOP(LITRO_PRICE)}
                  </p>
                </div>
              </div>
              <div style={{
                marginTop: 16, height: 48, borderRadius: 12,
                background: MAGENTA, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700,
                boxShadow: "0 3px 10px rgba(196,30,106,0.3)",
              }}>
                Elegir sabor y agregar →
              </div>
            </button>
          </div>

          {/* Skip */}
          <div style={{ textAlign: "center", padding: "20px 20px 36px", flexShrink: 0 }}>
            <button
              onClick={onSkip}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "#BBBBBB",
                fontFamily: "'Poppins', sans-serif",
                textDecoration: "underline",
                padding: "10px 0",
              }}
            >
              No gracias, ya tengo todo
            </button>
          </div>

          {/* Selector de sabor */}
          <SaborSheet
            open={showSaborSheet}
            onClose={() => setShowSaborSheet(false)}
            onConfirm={handleSaborConfirm}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}