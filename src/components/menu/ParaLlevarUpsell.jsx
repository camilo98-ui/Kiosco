import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const LITRO_IMAGE = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/f274e95e1_Gemini_Generated_Image_nwh7ponwh7ponwh7.png";

const MAGENTA = "#C41E6A";

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
    badge: "Más popular",
    previewFlavors: "Vainilla · Brownie · Frutos del Bosque y más",
    featured: true,
  },
  {
    id: "exclusivo",
    label: "Litro Exclusivo",
    price: 46900,
    sabores: SABORES_EXCLUSIVO,
    badge: "Premium",
    previewFlavors: "Yogo Yogo · Cherry Mania · M&M's y más",
    featured: false,
  },
];

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
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 6px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#EEE" }} />
            </div>
            <div style={{ padding: "4px 20px 12px" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Elige el sabor</p>
              <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0" }}>{litro?.label} · {litro && formatCOP(litro.price)}</p>
            </div>
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

function LitroCard({ litro, onSelect }) {
  return (
    <button
      onClick={() => onSelect(litro)}
      style={{
        flex: 1,
        background: "#FFFFFF",
        border: `1.5px solid ${litro.featured ? MAGENTA : "#FFE4F3"}`,
        borderRadius: 20,
        padding: 16,
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxShadow: "0 4px 16px rgba(180,0,80,0.08)",
        minWidth: 0,
      }}
    >
      {/* Badge */}
      <span style={{
        fontSize: 10, fontWeight: 700,
        background: "#FFE4F3", color: MAGENTA,
        borderRadius: 20, padding: "3px 10px",
        alignSelf: "flex-start",
        whiteSpace: "nowrap",
      }}>
        {litro.badge}
      </span>

      {/* Nombre */}
      <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3 }}>
        {litro.label}
      </p>

      {/* Sabores preview */}
      <p style={{ fontSize: 11, color: "#999", margin: 0, lineHeight: 1.5 }}>
        {litro.previewFlavors}
      </p>

      {/* Precio */}
      <p style={{ fontSize: 22, fontWeight: 800, color: MAGENTA, margin: "4px 0 0" }}>
        {formatCOP(litro.price)}
      </p>

      {/* Botón */}
      <div style={{
        marginTop: 4, height: 44, borderRadius: 12,
        background: MAGENTA, color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700,
        boxShadow: "0 3px 10px rgba(196,30,106,0.3)",
      }}>
        Agregar
      </div>
    </button>
  );
}

export default function ParaLlevarUpsell({ open, onSkip, onAddAndPay }) {
  const [saborSheet, setSaborSheet] = useState(null);

  const handleLitroSelect = (litro) => setSaborSheet(litro);

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
              ¿Y para llevar?
            </p>
            <p style={{ fontSize: 13, color: "#999", margin: "6px 0 0" }}>
              Llévate un litro y disfrútalo cuando quieras
            </p>
          </div>

          {/* Imagen borde a borde */}
          <div style={{ position: "relative", width: "100%", height: 180, flexShrink: 0 }}>
            <img
              src={LITRO_IMAGE}
              alt="Litros Popsy"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
            {/* Overlay fade inferior */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
              background: "linear-gradient(to bottom, transparent, #FFFAF9)",
            }} />
          </div>

          {/* Cards side by side */}
          <div style={{ display: "flex", gap: 12, padding: "20px 16px 0", flexShrink: 0 }}>
            {LITROS.map(litro => (
              <LitroCard key={litro.id} litro={litro} onSelect={handleLitroSelect} />
            ))}
          </div>

          {/* Botón saltar */}
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