import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COOKIE_JAAR_DATA } from "@/lib/cookieJaarData";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const FONT = "'Poppins', sans-serif";

const TABS = [
  { id: "galletas", label: "Galletas", emoji: "🍪" },
  { id: "malteadas", label: "Malteadas", emoji: "🥤" },
  { id: "combos", label: "Combos", emoji: "🎉" },
];

const TAB_SUBTITLES = {
  galletas: "Medianas & Supremas",
  malteadas: "Rellenas & especiales",
  combos: "Lo mejor junto",
};

const TAB_HERO = {
  galletas: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/162924610_image.png",
  malteadas: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/162924610_image.png",
  combos: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/162924610_image.png",
};

function TypeBadge({ type }) {
  if (!type) return null;
  const isSuprema = type === "suprema";
  return (
    <span style={{
      display: "inline-block", fontSize: 9, fontWeight: 800,
      background: isSuprema ? "#FFF0F5" : "#F5F5F5",
      color: isSuprema ? MAGENTA : "#999",
      borderRadius: 99, padding: "3px 8px", fontFamily: FONT,
    }}>
      {isSuprema ? "⭐ Suprema" : "Mediana"}
    </span>
  );
}

function ProductCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onAdd(product)}
      style={{
        border: "none", borderRadius: 20, background: "#fff",
        cursor: "pointer", padding: 0, overflow: "hidden",
        display: "flex", flexDirection: "column", textAlign: "left",
        boxShadow: "0 2px 12px rgba(196,30,106,0.08)",
        fontFamily: FONT,
      }}
    >
      {/* Image */}
      <div style={{ height: 160, width: "100%", background: "#FFF0F5", overflow: "hidden", position: "relative", flexShrink: 0 }}>
        {product.image && !imgErr ? (
          <img
            src={product.image} alt={product.name}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>
            🍪
          </div>
        )}
        {product.type === "suprema" && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            background: MAGENTA, color: "#fff",
            fontSize: 9, fontWeight: 800, borderRadius: 99, padding: "3px 8px",
          }}>⭐ Suprema</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#111", margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </p>
        {product.description && (
          <p style={{ fontSize: 10, color: "#AAA", margin: 0, lineHeight: 1.3,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: MAGENTA }}>{formatCOP(product.price)}</span>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: MAGENTA, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Plus size={13} color="#fff" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function FeaturedCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onAdd(product)}
      style={{
        width: "100%", border: "none", borderRadius: 20, background: "#fff",
        cursor: "pointer", padding: 0, overflow: "hidden",
        display: "flex", alignItems: "center", textAlign: "left",
        boxShadow: "0 2px 12px rgba(196,30,106,0.1)",
        fontFamily: FONT, marginBottom: 10,
      }}
    >
      <div style={{ width: 110, height: 110, flexShrink: 0, background: "#FFF0F5", overflow: "hidden" }}>
        {product.image && !imgErr ? (
          <img src={product.image} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🍪</div>
        )}
      </div>
      <div style={{ flex: 1, padding: "14px 16px" }}>
        {product.type && <TypeBadge type={product.type} />}
        <p style={{ fontSize: 14, fontWeight: 800, color: "#111", margin: "6px 0 4px", lineHeight: 1.3 }}>{product.name}</p>
        {product.description && (
          <p style={{ fontSize: 11, color: "#AAA", margin: "0 0 6px", lineHeight: 1.3 }}>{product.description}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: MAGENTA }}>{formatCOP(product.price)}</span>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: MAGENTA, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={15} color="#fff" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function CookieJaarModal({ open, onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState("galletas");

  const allProducts = COOKIE_JAAR_DATA[activeTab] || [];

  // Para galletas: separar medianas y supremas
  const medianas = allProducts.filter(p => p.type === "mediana");
  const supremas = allProducts.filter(p => p.type === "suprema");
  const noType = allProducts.filter(p => !p.type);

  const handleAdd = (p) => {
    onAdd({ product_id: p.id, product_name: p.name, price: p.price, quantity: 1, category: "combos" });
    setTimeout(() => onClose(), 100);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#F7F2F5", borderRadius: "28px 28px 0 0",
              width: "100%", maxWidth: 600, maxHeight: "92vh",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Header con hero */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ height: 190, overflow: "hidden" }}>
                <img
                  src={TAB_HERO[activeTab]} alt="Cookie Jaar"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />
              </div>

              {/* Título sobre hero */}
              <div style={{ position: "absolute", bottom: 14, left: 20 }}>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0, fontFamily: FONT, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                  Cookie Jaar 🍪
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", margin: 0, fontFamily: FONT }}>
                  {TAB_SUBTITLES[activeTab]}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute", top: 14, right: 16,
                  background: "rgba(255,255,255,0.9)", border: "none",
                  borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <X size={18} color="#333" />
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: "flex", gap: 8, padding: "12px 16px",
              background: "#fff", borderBottom: "1px solid #F0E4EA",
              overflowX: "auto", flexShrink: 0, scrollbarWidth: "none",
            }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: activeTab === tab.id ? MAGENTA : "#F9F0F4",
                    color: activeTab === tab.id ? "#fff" : "#888",
                    border: "none", borderRadius: 12, padding: "8px 16px",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                    whiteSpace: "nowrap", transition: "all 0.2s", fontFamily: FONT,
                  }}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Products */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 32px" }}>

              {/* Galletas: sección Supremas destacadas + grid medianas */}
              {activeTab === "galletas" && (
                <>
                  {supremas.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: MAGENTA, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 10px", fontFamily: FONT }}>
                        ⭐ Supremas
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {supremas.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)}
                      </div>
                    </div>
                  )}
                  {medianas.length > 0 && (
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 10px", fontFamily: FONT }}>
                        Medianas
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {medianas.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Malteadas: featured cards horizontales */}
              {activeTab === "malteadas" && (
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, color: MAGENTA, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 10px", fontFamily: FONT }}>
                    Malteadas especiales
                  </p>
                  {allProducts.map(p => <FeaturedCard key={p.id} product={p} onAdd={handleAdd} />)}
                </div>
              )}

              {/* Combos: featured cards */}
              {activeTab === "combos" && (
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, color: MAGENTA, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 10px", fontFamily: FONT }}>
                    Combos disponibles
                  </p>
                  {allProducts.map(p => <FeaturedCard key={p.id} product={p} onAdd={handleAdd} />)}
                </div>
              )}

              {allProducts.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: 48, color: "#CCC" }}>
                  <p style={{ fontSize: 40 }}>🍪</p>
                  <p style={{ fontWeight: 600, fontFamily: FONT }}>Sin productos en esta sección</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}