import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Sparkles } from "lucide-react";

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
    "linear-gradient(135deg, #1F1A2E 0%, #16213E 100%)",
    "linear-gradient(135deg, #2D1B3D 0%, #1A0F2E 100%)",
    "linear-gradient(135deg, #0D1B2A 0%, #1B2633 100%)",
  ];

  const accentColors = ["#FF006E", "#00D9FF", "#FFB703"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0E27",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background blobs */}
      <div style={{
        position: "fixed",
        top: "10%",
        left: "5%",
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(255, 0, 110, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed",
        bottom: "10%",
        right: "10%",
        width: 250,
        height: 250,
        background: "radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        animation: "float 10s ease-in-out infinite reverse",
      }} />

      {/* Simple Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: "60px 32px 40px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p style={{
          fontSize: 13,
          color: "#999",
          margin: "0 0 12px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          fontWeight: 600,
        }}>
          BIENVENIDO
        </p>
        <h1 style={{
          fontSize: 48,
          fontWeight: 900,
          color: "#fff",
          margin: "0 0 8px",
          letterSpacing: "-2px",
        }}>
          Popsy
        </h1>
        <p style={{
          fontSize: 14,
          color: "#AAA",
          margin: 0,
          fontWeight: 400,
        }}>
          Elige tu ubicación favorita
        </p>
      </motion.div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: "40px 24px 60px",
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
              border: "2px solid #333",
              borderTopColor: "#FF006E",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }} />
            <p style={{ color: "#666" }}>Cargando tiendas...</p>
          </div>
        ) : stores.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, color: "#666" }}>Sin tiendas disponibles</p>
          </div>
        ) : (
          <div style={{ maxWidth: 500, width: "100%" }}>
            {/* Full Screen Card Carousel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: bgGradients[activeIdx % bgGradients.length],
                  borderRadius: 32,
                  padding: 48,
                  position: "relative",
                  border: `1px solid ${accentColors[activeIdx % accentColors.length]}20`,
                  boxShadow: `0 20px 60px rgba(${
                    accentColors[activeIdx % accentColors.length] === "#FF006E"
                      ? "255, 0, 110"
                      : accentColors[activeIdx % accentColors.length] === "#00D9FF"
                      ? "0, 217, 255"
                      : "255, 183, 3"
                  }, 0.2)`,
                }}
              >
                {/* Corner decoration */}
                <div style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  background: `radial-gradient(circle, ${accentColors[activeIdx % accentColors.length]}30 0%, transparent 70%)`,
                  borderRadius: "50%",
                }} />

                <div style={{ position: "relative", zIndex: 2 }}>
                  {/* Store Content */}
                  <div style={{ marginBottom: 32 }}>
                    <div style={{
                      fontSize: 56,
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}>
                      🎯
                      <span style={{
                        fontSize: 24,
                        color: accentColors[activeIdx % accentColors.length],
                        display: "flex",
                        alignItems: "center",
                      }}>
                        <Sparkles size={20} />
                      </span>
                    </div>
                    <h2 style={{
                      fontSize: 32,
                      fontWeight: 900,
                      color: "#fff",
                      margin: "0 0 12px",
                      lineHeight: 1.2,
                      textTransform: "uppercase",
                      letterSpacing: "-0.5px",
                    }}>
                      {stores[activeIdx].name}
                    </h2>
                  </div>

                  {/* Details */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    marginBottom: 32,
                  }}>
                    {stores[activeIdx].address && (
                      <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}>
                        <MapPin
                          size={20}
                          color={accentColors[activeIdx % accentColors.length]}
                          strokeWidth={2}
                          style={{ marginTop: 2, flexShrink: 0 }}
                        />
                        <p style={{
                          fontSize: 15,
                          color: "#CCC",
                          margin: 0,
                          fontWeight: 500,
                          lineHeight: 1.6,
                        }}>
                          {stores[activeIdx].address}
                        </p>
                      </div>
                    )}
                    {stores[activeIdx].schedule && (
                      <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}>
                        <Clock
                          size={20}
                          color={accentColors[activeIdx % accentColors.length]}
                          strokeWidth={2}
                          style={{ marginTop: 2, flexShrink: 0 }}
                        />
                        <p style={{
                          fontSize: 15,
                          color: "#CCC",
                          margin: 0,
                          fontWeight: 500,
                          lineHeight: 1.6,
                        }}>
                          {stores[activeIdx].schedule}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(stores[activeIdx])}
                    style={{
                      width: "100%",
                      padding: "16px 32px",
                      borderRadius: 18,
                      border: "none",
                      background: `linear-gradient(135deg, ${accentColors[activeIdx % accentColors.length]}, ${accentColors[activeIdx % accentColors.length]}CC)`,
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 800,
                      cursor: "pointer",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      boxShadow: `0 8px 20px ${accentColors[activeIdx % accentColors.length]}40`,
                      transition: "all 0.3s",
                    }}
                  >
                    Continuar
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            {stores.length > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 32,
              }}>
                {stores.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      width: activeIdx === idx ? 32 : 10,
                      height: 10,
                      borderRadius: 5,
                      border: "none",
                      background: activeIdx === idx
                        ? accentColors[idx % accentColors.length]
                        : "#333",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
      `}</style>
    </div>
  );
}