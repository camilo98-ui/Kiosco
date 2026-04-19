import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

export default function StoreSelector({ onSelect }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then(data => setStores(data))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const pastelColors = [
    { bg: "#FFE5F0", accent: "#E8187A" },
    { bg: "#E5F5FF", accent: "#0099CC" },
    { bg: "#F0F5E5", accent: "#7CB342" },
    { bg: "#FFF5E5", accent: "#FF8C00" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFFBF7 0%, #F5E6F0 100%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Poppins', sans-serif",
      padding: 0,
      margin: 0,
    }}>
      {/* Minimalist Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "80px 40px 60px",
          textAlign: "center",
          background: "transparent",
        }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: 80, marginBottom: 24 }}
        >
          🍦
        </motion.div>
        <h1 style={{
          fontSize: 42,
          fontWeight: 900,
          color: "#1A0A10",
          margin: "0 0 16px",
          letterSpacing: "-1px",
        }}>
          Popsy
        </h1>
        <p style={{
          fontSize: 16,
          color: "#999",
          margin: 0,
          fontWeight: 400,
          letterSpacing: "0.5px",
        }}>
          Selecciona dónde deseas ordenar
        </p>
      </motion.div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: "0 24px 80px",
        display: "flex",
        justifyContent: "center",
      }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
            <div style={{
              width: 50,
              height: 50,
              border: "3px solid #F0E6F0",
              borderTopColor: "#E8187A",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
          </div>
        ) : stores.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 32px" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>😔</div>
            <p style={{ fontSize: 18, color: "#999" }}>Sin tiendas disponibles</p>
          </div>
        ) : (
          <div style={{ maxWidth: 520, width: "100%" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: stores.length === 1 ? "1fr" : stores.length === 2 ? "1fr" : "1fr",
              gap: 20,
              width: "100%",
            }}>
              {stores.map((store, idx) => {
                const colorPair = pastelColors[idx % pastelColors.length];
                return (
                  <motion.button
                    key={store.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.12, duration: 0.5 }}
                    whileHover={{ scale: 1.04 }}
                    onClick={() => onSelect(store)}
                    onMouseEnter={() => setHoveredId(store.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      background: "#fff",
                      border: "2px solid " + (hoveredId === store.id ? colorPair.accent : "#F0E6F0"),
                      borderRadius: 32,
                      padding: "32px 28px",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: hoveredId === store.id
                        ? `0 20px 40px ${colorPair.accent}20`
                        : "0 4px 16px rgba(0,0,0,0.05)",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {/* Decorative background */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 120,
                      height: 120,
                      background: colorPair.bg,
                      borderRadius: "50%",
                      opacity: hoveredId === store.id ? 1 : 0.4,
                      transition: "opacity 0.3s",
                      pointerEvents: "none",
                    }} />

                    <div style={{ position: "relative", zIndex: 1 }}>
                      {/* Store Name */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                      }}>
                        <div style={{
                          width: 64,
                          height: 64,
                          borderRadius: 20,
                          background: colorPair.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 32,
                        }}>
                          🍦
                        </div>
                        <h3 style={{
                          fontSize: 20,
                          fontWeight: 900,
                          color: "#1A0A10",
                          margin: 0,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          lineHeight: 1.2,
                        }}>
                          {store.name}
                        </h3>
                      </div>

                      {/* Details */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {store.address && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 14,
                            color: "#666",
                            fontWeight: 500,
                          }}>
                            <MapPin size={16} color={colorPair.accent} strokeWidth={2.5} />
                            {store.address}
                          </div>
                        )}
                        {store.schedule && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 14,
                            color: "#666",
                            fontWeight: 500,
                          }}>
                            <Clock size={16} color={colorPair.accent} strokeWidth={2.5} />
                            {store.schedule}
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <motion.div
                        animate={{ x: hoveredId === store.id ? 8 : 0 }}
                        style={{
                          marginTop: 20,
                          display: "inline-block",
                          padding: "12px 28px",
                          borderRadius: 20,
                          background: colorPair.accent,
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 800,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                        }}
                      >
                        Ingresar →
                      </motion.div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}