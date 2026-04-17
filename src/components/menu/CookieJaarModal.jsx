import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COOKIE_JAAR_DATA } from "@/lib/cookieJaarData";
import { formatCOP } from "@/lib/constants";

const TABS = [
  { id: "galletas", label: "🍪 Galletas" },
  { id: "malteadas", label: "🥤 Malteadas" },
  { id: "combos", label: "🎉 Combos" }
];

function ProductCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onAdd(product)}
      style={{
        border: "1px solid #FFE4F3",
        borderRadius: 16,
        background: "#fff",
        cursor: "pointer",
        padding: 0,
        overflow: "hidden",
        flexDirection: "column",
        display: "flex",
        boxShadow: "0 2px 8px rgba(196,30,106,0.08)",
      }}
    >
      <div style={{ height: 140, background: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.image && !imgErr ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 40 }}>🍪</span>
        )}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.2 }}>
          {product.name}
        </p>
        {product.type && (
          <span style={{
            display: "inline-block",
            fontSize: 9,
            fontWeight: 600,
            background: product.type === "suprema" ? "#FFE4F3" : "#F0F0F0",
            color: product.type === "suprema" ? "#C41E6A" : "#888",
            borderRadius: 12,
            padding: "2px 6px",
            marginTop: 3
          }}>
            {product.type === "suprema" ? "⭐ Suprema" : "Mediana"}
          </span>
        )}
        <p style={{ fontSize: 13, fontWeight: 800, color: "#C41E6A", margin: "4px 0 0" }}>
          {formatCOP(product.price)}
        </p>
      </div>
    </motion.button>
  );
}

export default function CookieJaarModal({ open, onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState("galletas");

  const currentProducts = COOKIE_JAAR_DATA[activeTab] || [];

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
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid #F5EAEF",
              flexShrink: 0
            }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>
                  Cookie Jaar 🍪
                </p>
                <p style={{ fontSize: 12, color: "#BBA8B0", margin: "2px 0 0" }}>
                  Galletas · Malteadas · Combos
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "#F5F5F5",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} color="#666" />
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: "flex",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid #F0E4EA",
              overflowX: "auto",
              flexShrink: 0,
              scrollbarWidth: "none"
            }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? "#C41E6A" : "#F9F0F4",
                    color: activeTab === tab.id ? "#fff" : "#888",
                    border: "none",
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 12
              }}>
                {currentProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={(p) => {
                      onAdd({
                        product_id: p.id,
                        product_name: p.name,
                        price: p.price,
                        quantity: 1,
                        category: "combos"
                      });
                      setTimeout(() => onClose(), 100);
                    }}
                  />
                ))}
              </div>
              {currentProducts.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: 40, color: "#CCC" }}>
                  <p style={{ fontSize: 40 }}>🍪</p>
                  <p style={{ fontWeight: 600 }}>Sin productos en esta sección</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}