import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";

const MAGENTA = "#C41E6A";
const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/af2c73dd3_popsy-b-01__4_-removebg-preview1.png";

function getInitial(name) {
  return name.replace(/^CC\s+/i, "").charAt(0).toUpperCase();
}

const ACCENT_COLORS = [
  "#C41E6A", "#9C27B0", "#1565C0", "#00897B",
  "#E65100", "#6D4C41", "#283593", "#558B2F",
  "#AD1457", "#4527A0", "#00695C", "#BF360C",
];

function StoreCard({ store, index, onSelect }) {
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const initial = getInitial(store.name);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(store)}
      style={{
        width: "100%",
        background: "#fff",
        border: "1px solid #F0E6EE",
        borderRadius: 20,
        padding: "14px 16px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 2px 10px rgba(196,30,106,0.06)",
        fontFamily: "-apple-system, 'SF Pro Display', 'Poppins', sans-serif",
        WebkitTapHighlightColor: "transparent",
        marginBottom: 10,
      }}
    >
      {/* Initial circle */}
      <div style={{
        width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
        background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 4px 12px ${color}40`,
      }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
          {initial}
        </span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14, fontWeight: 800, color: "#1A0A10",
          margin: "0 0 3px", lineHeight: 1.2,
          fontFamily: "-apple-system, 'SF Pro Display', 'Poppins', sans-serif",
          letterSpacing: "-0.2px",
        }}>
          {store.name}
        </p>
        {store.address && (
          <p style={{
            fontSize: 12, color: "#AAA", margin: "0 0 2px",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            <MapPin size={10} style={{ flexShrink: 0 }} />
            {store.address}
          </p>
        )}
        {store.schedule && (
          <p style={{ fontSize: 12, color: "#888", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CAF50", display: "inline-block", flexShrink: 0 }} />
            {store.schedule}
          </p>
        )}
      </div>

      {/* Chevron */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: "#FFF0F5",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ChevronRight size={16} color={MAGENTA} />
      </div>
    </motion.button>
  );
}

function SkeletonCard({ index }) {
  return (
    <div style={{
      width: "100%", background: "#fff", border: "1px solid #F0E6EE",
      borderRadius: 20, padding: "14px 16px", marginBottom: 10,
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F5ECF2", flexShrink: 0 }}
        className="animate-pulse" />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, background: "#F5ECF2", borderRadius: 8, marginBottom: 8, width: "60%" }}
          className="animate-pulse" />
        <div style={{ height: 11, background: "#F5ECF2", borderRadius: 8, width: "40%" }}
          className="animate-pulse" />
      </div>
    </div>
  );
}

export default function StoreSelector({ onSelect }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then(data => setStores(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F5F7", display: "flex", flexDirection: "column", fontFamily: "-apple-system, 'SF Pro Display', 'Poppins', sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{
        background: `linear-gradient(160deg, #C41E6A 0%, #E8187A 60%, #FF6EB4 100%)`,
        padding: "56px 28px 72px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", top: 20, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -20, right: 30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: 10, left: 20, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <img
            src={LOGO_URL}
            alt="Popsy"
            style={{ height: 64, objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: 4 }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: 15, color: "rgba(255,255,255,0.75)", margin: "0 0 24px",
            fontWeight: 400, letterSpacing: "0.2px", position: "relative", zIndex: 1,
          }}
        >
          La heladería que te enamora
        </motion.p>

        {/* Hero emoji */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
          style={{
            fontSize: 80,
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))",
            lineHeight: 1,
            position: "relative", zIndex: 1,
          }}
        >
          🍦
        </motion.div>
      </div>

      {/* ── White card that overlaps the hero ── */}
      <div style={{
        flex: 1,
        background: "#F8F5F7",
        borderRadius: "28px 28px 0 0",
        marginTop: -28,
        position: "relative",
        zIndex: 2,
        padding: "28px 16px 48px",
      }}>
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingLeft: 4 }}>
          <MapPin size={14} color={MAGENTA} />
          <p style={{
            fontSize: 12, fontWeight: 700, color: "#BBA8B0",
            textTransform: "uppercase", letterSpacing: "1.2px", margin: 0,
          }}>
            Selecciona tu tienda
          </p>
        </div>

        {/* Store list */}
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          {loading ? (
            [0,1,2,3,4].map(i => <SkeletonCard key={i} index={i} />)
          ) : (
            stores.map((store, idx) => (
              <StoreCard key={store.id} store={store} index={idx} onSelect={onSelect} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}