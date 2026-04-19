import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronRight } from "lucide-react";

const MAGENTA_PRIMARY = "#E8187A";
const MAGENTA_LIGHT = "#F8D7E8";
const CREAM_BG = "#FFFCF9";

export default function StoreSelector({ onSelect }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then(data => setStores(data))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: CREAM_BG, display: "flex", flexDirection: "column" }}>
      {/* Premium Header */}
      <div style={{
        background: `linear-gradient(180deg, ${MAGENTA_PRIMARY} 0%, #E8187A 100%)`,
        padding: "64px 32px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative gradient orbs */}
        <div style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          top: -80,
          right: -60,
        }} />
        <div style={{
          position: "absolute",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          bottom: -40,
          left: -40,
        }} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: 64, marginBottom: 16, position: "relative", zIndex: 1 }}
        >
          🍦
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 12px",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          Bienvenido a Popsy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.9)",
            margin: 0,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
          }}
        >
          Selecciona tu tienda para continuar
        </motion.p>
      </div>

      {/* Stores Section */}
      <div style={{ flex: 1, padding: "40px 24px 60px", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 48 }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${MAGENTA_LIGHT}`, borderTopColor: MAGENTA_PRIMARY, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : stores.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
            <p style={{ fontSize: 16, color: "#999", fontFamily: "'Poppins', sans-serif" }}>No hay tiendas disponibles</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 480, width: "100%" }}>
            <p style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#C41E6A",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              margin: "0 0 8px",
              fontFamily: "'Poppins', sans-serif",
            }}>
              Tiendas disponibles
            </p>

            {stores.map((store, idx) => (
              <motion.button
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
                onClick={() => onSelect(store)}
                style={{
                  background: "#fff",
                  border: "1px solid #E8D8E5",
                  borderRadius: 24,
                  padding: "22px 24px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  boxShadow: "0 4px 20px rgba(196,30,106,0.08)",
                  fontFamily: "'Poppins', sans-serif",
                  WebkitTapHighlightColor: "transparent",
                  transition: "all 0.3s ease",
                }}
                onHoverStart={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(196,30,106,0.15)";
                  e.currentTarget.style.borderColor = MAGENTA_PRIMARY;
                }}
                onHoverEnd={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(196,30,106,0.08)";
                  e.currentTarget.style.borderColor = "#E8D8E5";
                }}
              >
                {/* Icon Box */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  flexShrink: 0,
                  background: `linear-gradient(135deg, ${MAGENTA_LIGHT}, #F5D0E0)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                }}>
                  🍦
                </div>

                {/* Store Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#1A0A10",
                    margin: "0 0 6px",
                    lineHeight: 1.2,
                  }}>
                    {store.name}
                  </p>
                  {store.address && (
                    <p style={{
                      fontSize: 13,
                      color: "#888",
                      margin: "0 0 4px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 500,
                    }}>
                      <MapPin size={13} style={{ flexShrink: 0, color: MAGENTA_PRIMARY }} />
                      {store.address}
                    </p>
                  )}
                  {store.schedule && (
                    <p style={{
                      fontSize: 13,
                      color: "#999",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 500,
                    }}>
                      <Clock size={13} style={{ flexShrink: 0, color: MAGENTA_PRIMARY }} />
                      {store.schedule}
                    </p>
                  )}
                </div>

                {/* Arrow Button */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: MAGENTA_PRIMARY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(196,30,106,0.35)",
                }}>
                  <ChevronRight size={20} color="#fff" strokeWidth={3} />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}