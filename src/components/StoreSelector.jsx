import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronRight, IceCream } from "lucide-react";

const MAGENTA = "#C41E6A";

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
    <div style={{ minHeight: "100vh", background: "#FFFAF9", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${MAGENTA}, #FF6EB4)`, padding: "48px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🍦</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 6px", fontFamily: "'Poppins', sans-serif" }}>
          Bienvenido a Popsy
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0, fontFamily: "'Poppins', sans-serif" }}>
          Selecciona tu tienda para continuar
        </p>
      </div>

      {/* Stores */}
      <div style={{ flex: 1, padding: "24px 16px 40px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 48 }}>
            <div style={{ width: 32, height: 32, border: `3px solid #FFE4F3`, borderTopColor: MAGENTA, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : stores.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>😔</div>
            <p style={{ fontSize: 16, color: "#888" }}>No hay tiendas disponibles por ahora</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420, margin: "0 auto" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px 4px" }}>
              Tiendas disponibles
            </p>
            {stores.map((store, idx) => (
              <motion.button
                key={store.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => onSelect(store)}
                style={{
                  background: "#fff", border: "1.5px solid #FFE4F3", borderRadius: 20,
                  padding: "18px 16px", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "0 2px 12px rgba(196,30,106,0.06)",
                  fontFamily: "'Poppins', sans-serif",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: "linear-gradient(135deg, #FFF0F5, #FFD6EC)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                }}>
                  🍦
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#1A0A10", margin: "0 0 4px", lineHeight: 1.2 }}>
                    {store.name}
                  </p>
                  {store.address && (
                    <p style={{ fontSize: 12, color: "#888", margin: "0 0 3px", display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={11} style={{ flexShrink: 0 }} />
                      {store.address}
                    </p>
                  )}
                  {store.schedule && (
                    <p style={{ fontSize: 12, color: "#888", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} style={{ flexShrink: 0 }} />
                      {store.schedule}
                    </p>
                  )}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: MAGENTA, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 3px 10px rgba(196,30,106,0.3)",
                }}>
                  <ChevronRight size={18} color="#fff" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}