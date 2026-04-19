import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

export default function StoreSelector({ onSelect }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then(data => setStores(data))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const bgGradients = [
    "linear-gradient(135deg, #FFE5F0 0%, #FFF0F5 100%)",
    "linear-gradient(135deg, #E5F7FF 0%, #F0F5FF 100%)",
    "linear-gradient(135deg, #F5FFE5 0%, #FFFAF0 100%)",
  ];

  const accentColors = ["#E8187A", "#0088CC", "#FF9500"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FEF5F8 0%, #F5EDFA 100%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "fixed",
        top: "5%",
        left: "-5%",
        width: 250,
        height: 250,
        background: "radial-gradient(circle, rgba(173, 216, 230, 0.2) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
      }} />
      <div style={{
        position: "fixed",
        bottom: "-10%",
        right: "-5%",
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(255, 192, 203, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "48px 32px 32px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p style={{
          fontSize: 11,
          color: "#C41E6A",
          margin: "0 0 8px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}>
          Helado Gourmet
        </p>
        <h1 style={{
          fontSize: 56,
          fontWeight: 900,
          color: "#C41E6A",
          margin: "0 0 4px",
          letterSpacing: "-1px",
          fontStyle: "italic",
        }}>
          Popsy
        </h1>
        <p style={{
          fontSize: 13,
          color: "#888",
          margin: 0,
          fontWeight: 500,
        }}>
          Sistema de Gestión
        </p>
      </motion.div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: "32px 24px 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
      }}>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 50,
              height: 50,
              border: "2px solid #DDD",
              borderTopColor: "#C41E6A",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }} />
            <p style={{ color: "#888" }}>Cargando tiendas...</p>
          </div>
        ) : stores.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, color: "#999" }}>Sin tiendas disponibles</p>
          </div>
        ) : (
          <div style={{ maxWidth: 600, width: "100%" }}>
            {/* Card Container */}
            <div style={{
              background: "#fff",
              borderRadius: 24,
              border: "1px solid #F0E4EA",
              padding: "40px 32px",
              boxShadow: "0 10px 40px rgba(196, 30, 106, 0.08)",
            }}>
              {/* Title */}
              <div style={{ marginBottom: 32, textAlign: "center" }}>
                <h2 style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#1A0A10",
                  margin: "0 0 8px",
                }}>
                  Selecciona tu tienda
                </h2>
                <p style={{
                  fontSize: 13,
                  color: "#999",
                  margin: 0,
                }}>
                  Elige dónde deseas ordenar
                </p>
              </div>

              {/* Store Options */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}>
                {stores.map((store, idx) => {
                  const colors = [
                    { bg: "#E8F4F8", accent: "#0088CC", icon: "🏪" },
                    { bg: "#FFF0E6", accent: "#FF8C00", icon: "🌟" },
                    { bg: "#F0E8F8", accent: "#9333EA", icon: "💜" },
                  ];
                  const colorSet = colors[idx % colors.length];

                  return (
                    <motion.button
                      key={store.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onSelect(store)}
                      style={{
                        background: "#fff",
                        border: `2px solid ${colorSet.bg}`,
                        borderRadius: 16,
                        padding: "16px 20px",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colorSet.accent;
                        e.currentTarget.style.boxShadow = `0 8px 24px ${colorSet.accent}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = colorSet.bg;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 48,
                        height: 48,
                        background: colorSet.bg,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        flexShrink: 0,
                      }}>
                        {colorSet.icon}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1A0A10",
                          margin: "0 0 4px",
                        }}>
                          {store.name}
                        </p>
                        <p style={{
                          fontSize: 12,
                          color: "#888",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}>
                          <MapPin size={14} /> {store.address || store.schedule || "Ubicación disponible"}
                        </p>
                      </div>

                      {/* Arrow */}
                      <span style={{
                        fontSize: 18,
                        color: colorSet.accent,
                        flexShrink: 0,
                      }}>
                        →
                      </span>
                    </motion.button>
                  );
                })}
              </div>
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