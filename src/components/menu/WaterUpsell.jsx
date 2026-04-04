import React from "react";
import { motion } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const WATER_IMAGE = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/26de2b565_image.png";
const WATER_PRICE = 3500;

export default function WaterUpsell({ onAdd, onSkip }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          background: "#fff", borderRadius: "24px 24px 0 0",
          width: "100%", maxWidth: 480,
          padding: "28px 24px 40px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        }}
      >
        <div style={{ width: 48, height: 4, borderRadius: 2, background: "#EEE", marginBottom: 4 }} />

        <img
          src={WATER_IMAGE}
          alt="Agua Popsy"
          style={{ width: 160, height: 160, objectFit: "contain" }}
        />

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0, lineHeight: 1.3 }}>
            ¿Le agregamos agua<br />a tu pedido?
          </p>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#E91B8B", margin: "8px 0 0" }}>
            {formatCOP(WATER_PRICE)}
          </p>
        </div>

        <button
          onClick={onAdd}
          style={{
            width: "100%", height: 52, borderRadius: 16,
            background: "#E91B8B", color: "#fff",
            fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(233,27,139,0.35)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Sí, agregar 💧
        </button>

        <button
          onClick={onSkip}
          style={{
            width: "100%", height: 44, borderRadius: 16,
            background: "#F5F5F5", color: "#999",
            fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          No gracias, continuar
        </button>
      </motion.div>
    </div>
  );
}