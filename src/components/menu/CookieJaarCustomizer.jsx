import React, { useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";
import { COMBOS_DATA } from "@/lib/combosData";

function HorizontalCard({ product, onAdd, bg }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={() => onAdd(product)}
      style={{
        border: "0.5px solid #FFE4F3",
        borderRadius: 16,
        background: "#fff",
        height: 72,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(233,27,139,0.06)",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div style={{ width: 72, height: 72, background: bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: 72, height: 72, objectFit: "cover" }} />
        ) : (
          <img src={product.image} alt={product.title} onError={() => setImgError(true)} style={{ width: 72, height: 72, objectFit: "cover" }} />
        )}
      </div>
      <div style={{ width: 1, height: 40, background: "#F0E4EA", flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.title || product.name}</p>
        <p style={{ fontSize: 9, color: "#BBA8B0" }}>Disponible</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#C41E6A" }}>{product.displayPrice || formatCOP(product.price)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#C41E6A",
            color: "#fff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(233,27,139,0.25)",
            cursor: "pointer",
          }}
        >
          <Plus size={11} />
        </button>
      </div>
    </motion.div>
  );
}

export default function CookieJaarCustomizer({ open, onClose, onAdd }) {
  const [tab, setTab] = useState("galletas");
  const bg = "#FFF0F5";

  const cookieJaarProducts = useMemo(() => COMBOS_DATA.filter(p => p.badge === "Cookie Jaar"), []);

  const galletas = useMemo(() => cookieJaarProducts.filter(p => p.title.toLowerCase().includes("galleta")), [cookieJaarProducts]);
  const malteadas = useMemo(() => cookieJaarProducts.filter(p => p.title.toLowerCase().includes("malteada")), [cookieJaarProducts]);
  const combos = useMemo(() => cookieJaarProducts.filter(p => !p.title.toLowerCase().includes("galleta") && !p.title.toLowerCase().includes("malteada")), [cookieJaarProducts]);

  const handleProductAdd = (product) => {
    onAdd({
      product_id: `combo-${product.id}`,
      product_name: product.title || product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              maxWidth: 600,
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F5EAEF", flexShrink: 0 }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Cookie Jaar 🍪</p>
              <button
                onClick={onClose}
                style={{ background: "#F5F5F5", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} color="#666" />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 10, padding: "0 14px", marginTop: 12, marginBottom: 14, flexWrap: "wrap" }}>
              {[
                { key: "galletas", label: "Galletas 🍪" },
                { key: "malteadas", label: "Malteadas 🥤" },
                { key: "combos", label: "Combos 🎁" },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    flex: 1,
                    minWidth: "100px",
                    padding: "10px 0",
                    borderRadius: 14,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 13,
                    fontFamily: "'Poppins', sans-serif",
                    background: tab === t.key ? "#C41E6A" : "#FFE4F3",
                    color: tab === t.key ? "#fff" : "#C41E6A",
                    boxShadow: tab === t.key ? "0 4px 14px rgba(196,30,106,0.3)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 14 }}>
              {tab === "galletas" && galletas.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginBottom: 14 }}>
                  {galletas.map(p => (
                    <HorizontalCard key={p.id} product={p} onAdd={handleProductAdd} bg={bg} />
                  ))}
                </div>
              )}

              {tab === "malteadas" && malteadas.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginBottom: 14 }}>
                  {malteadas.map(p => (
                    <HorizontalCard key={p.id} product={p} onAdd={handleProductAdd} bg={bg} />
                  ))}
                </div>
              )}

              {tab === "combos" && combos.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
                  {combos.map(p => (
                    <HorizontalCard key={p.id} product={p} onAdd={handleProductAdd} bg={bg} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}