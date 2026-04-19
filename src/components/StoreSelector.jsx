import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function StoreSelector({ onSelect }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then(data => setStores(data))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const storeIcons = ["🏪", "🌟", "💜"];
  const storeBgs = ["#E8F4F8", "#FFF0E6", "#F0E8F8"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #FEF5F8 0%, #F5D8E8 100%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      overflow: "hidden",
      paddingBottom: 60,
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "fixed",
        top: "10%",
        left: "-8%",
        width: 280,
        height: 280,
        background: "radial-gradient(circle, rgba(200, 220, 240, 0.3) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
      }} />
      <div style={{
        position: "fixed",
        top: "40%",
        right: "-5%",
        width: 320,
        height: 320,
        background: "radial-gradient(circle, rgba(255, 200, 220, 0.25) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: "60px 32px 40px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p style={{
          fontSize: 10,
          color: "#C41E6A",
          margin: "0 0 6px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}>
          Helado Gourmet
        </p>
        <h1 style={{
          fontSize: 64,
          fontWeight: 900,
          color: "#C41E6A",
          margin: "0 0 6px",
          letterSpacing: "-1.5px",
          fontStyle: "italic",
        }}>
          Popsy
        </h1>
        <p style={{
          fontSize: 12,
          color: "#999",
          margin: 0,
          fontWeight: 500,
        }}>
          Sistema de Gestión
        </p>
      </motion.div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: "32px 24px",
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
              border: "2px solid #E8D8E8",
              borderTopColor: "#C41E6A",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }} />
            <p style={{ color: "#999" }}>Cargando tiendas...</p>
          </div>
        ) : stores.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, color: "#999" }}>Sin tiendas disponibles</p>
          </div>
        ) : (
          <div style={{ maxWidth: 680, width: "100%" }}>
            {/* Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "#fff",
                borderRadius: 28,
                border: "1px solid #F0E4EA",
                padding: "44px 36px",
                boxShadow: "0 12px 48px rgba(196, 30, 106, 0.1)",
              }}
            >
              {/* Title */}
              <div style={{ marginBottom: 36, textAlign: "center" }}>
                <h2 style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#1A0A10",
                  margin: "0 0 10px",
                }}>
                  Iniciar sesión
                </h2>
                <p style={{
                  fontSize: 13,
                  color: "#888",
                  margin: 0,
                  fontWeight: 500,
                }}>
                  Selecciona tu tienda y comienza
                </p>
              </div>

              {/* Store Options */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}>
                {stores.map((store, idx) => {
                  const colors = [
                    { bg: "#E8F4F8", accent: "#0088CC" },
                    { bg: "#FFF0E6", accent: "#FF8C00" },
                    { bg: "#F0E8F8", accent: "#9333EA" },
                  ];
                  const colorSet = colors[idx % colors.length];
                  const isFeatured = idx === 1;

                  return (
                    <motion.button
                      key={store.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -2 }}
                      onClick={() => onSelect(store)}
                      style={{
                        background: colorSet.bg,
                        border: "none",
                        borderRadius: 16,
                        padding: "18px 22px",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        position: "relative",
                        transition: "all 0.3s",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 8px 28px ${colorSet.accent}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 56,
                        height: 56,
                        background: "#fff",
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        flexShrink: 0,
                      }}>
                        {["🏪", "🌟", "💜"][idx % 3]}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1A0A10",
                          margin: "0 0 4px",
                        }}>
                          {store.name}
                        </p>
                        <p style={{
                          fontSize: 12,
                          color: "#666",
                          margin: 0,
                        }}>
                          {store.address || store.schedule || "Ubicación disponible"}
                        </p>
                      </div>

                      {/* Badge */}
                      {isFeatured && (
                        <div style={{
                          width: 28,
                          height: 28,
                          background: "#E8187A",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}>
                          ⭐
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}