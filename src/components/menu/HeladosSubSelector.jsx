import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

// Tabs de subcategoría
function SubcatTabs({ active, onSelect }) {
  const tabs = [
    { id: "gourmet",   label: "Gourmet 🍦" },
    { id: "exclusivo", label: "Exclusivo ✨" },
    { id: "junior",    label: "Cono Jr 🍧" },
  ];
  return (
    <div style={{ padding: "14px 14px 12px" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 14, border: "none", cursor: "pointer",
              fontWeight: 800, fontSize: 12, fontFamily: "'Poppins', sans-serif",
              background: active === t.id ? "#C41E6A" : "#FFF0F5",
              color: active === t.id ? "#fff" : "#C41E6A",
              boxShadow: active === t.id ? "0 4px 14px rgba(196,30,106,0.3)" : "none",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Card destacada (ancha, 100%)
function FeaturedProductCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onAdd(product)}
      style={{
        width: "100%", height: 140, borderRadius: 16,
        border: "0.5px solid #FFE4F3", background: "#FFF5F9",
        overflow: "hidden", cursor: "pointer", padding: 0,
        display: "flex", alignItems: "stretch",
        boxShadow: "0 2px 8px rgba(196,30,106,0.08)",
        marginBottom: 10,
      }}
    >
      <div style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 9, fontWeight: 800, background: "#C41E6A", color: "#fff", borderRadius: 20, padding: "2px 8px" }}>
          🔥 Más pedido
        </span>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0, lineHeight: 1.3, textAlign: "left" }}>
            {product.name}
          </p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#C41E6A", margin: "4px 0 0" }}>
            {formatCOP(product.price)}
          </p>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#C41E6A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(196,30,106,0.3)" }}>
          <Plus size={16} color="#fff" />
        </div>
      </div>
      <div style={{ width: "45%", background: "#FFF0F5", overflow: "hidden", flexShrink: 0 }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>🍦</div>
        )}
      </div>
    </motion.button>
  );
}

// Card de grid 2 columnas
function GridProductCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(product)}
      style={{
        borderRadius: 16, border: "0.5px solid #FFE4F3", background: "#FFF5F9",
        overflow: "hidden", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column",
        boxShadow: "0 2px 6px rgba(196,30,106,0.07)",
      }}
    >
      <div style={{ height: 130, background: "#FFF0F5", overflow: "hidden", flexShrink: 0 }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🍦</div>
        )}
      </div>
      <div style={{ padding: "8px 10px 10px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <p style={{
          fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          textAlign: "left",
        }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#C41E6A", margin: 0 }}>
            {formatCOP(product.price)}
          </p>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#C41E6A", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(196,30,106,0.25)" }}>
            <Plus size={13} color="#fff" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function HeladosSubSelector({ products, onAdd }) {
  const [subcat, setSubcat] = useState("exclusivo");

  const available = products.filter(p => p.is_available !== false);

  const filterProducts = (sub) => {
    if (sub === "gourmet") return available.filter(p => {
      const n = p.name.toLowerCase();
      if (n.includes("exclusivo") || n.includes("junior") || n.includes("jr") || n.includes("maxi")) return false;
      return n.includes("gourmet") || (n.includes("fiore") && !n.includes("exclusivo"));
    });
    if (sub === "exclusivo") return available.filter(p => p.name.toLowerCase().includes("exclusivo"));
    if (sub === "junior") return available.filter(p => {
      const n = p.name.toLowerCase();
      return (n.includes("junior") || n.includes("jr") || n.includes("cono")) &&
        !n.includes("maxi") && !n.includes("fiore");
    });
    return available;
  };

  const filtered = filterProducts(subcat);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      <SubcatTabs active={subcat} onSelect={setSubcat} />
      <AnimatePresence mode="wait">
        <motion.div
          key={subcat}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          <div style={{ padding: "0 14px 14px" }}>
            {featured && <FeaturedProductCard product={featured} onAdd={(p) => onAdd({ ...p, _subcat: subcat })} />}
            {rest.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {rest.map(p => (
                  <GridProductCard key={p.id} product={p} onAdd={(p) => onAdd({ ...p, _subcat: subcat })} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}