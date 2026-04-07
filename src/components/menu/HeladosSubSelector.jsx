import React, { useState } from "react";
import { ArrowLeft, Grid3X3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";
import { Plus } from "lucide-react";

const SUBCAT_IMAGES = {
  gourmet: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png",
  exclusivo: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png",
  junior: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png",
};

const SUBCATS = [
  { id: "gourmet",   label: "Gourmet",   subtitle: "Los clásicos de Popsy", badge: "⭐ Top",    image: SUBCAT_IMAGES.gourmet },
  { id: "exclusivo", label: "Exclusivo", subtitle: "Sabores únicos",        badge: "✨ Nuevo",  image: SUBCAT_IMAGES.exclusivo },
  { id: "junior",    label: "Cono Jr",   subtitle: "Perfecto para compartir", badge: null,     image: SUBCAT_IMAGES.junior },
  { id: "todos",     label: "Ver todos", subtitle: null,                    badge: null,       image: null },
];

function SubcatCard({ subcat, onSelect }) {
  const [imgErr, setImgErr] = useState(false);
  const isTodos = subcat.id === "todos";
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(subcat.id)}
      style={{
        position: "relative", height: 140, borderRadius: 20, overflow: "hidden",
        border: "none", cursor: "pointer", padding: 0,
        background: isTodos ? "linear-gradient(135deg, #C41E6A, #FF6EB4)" : "#FFF0F5",
        boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
      }}
    >
      {!isTodos && subcat.image && !imgErr ? (
        <img src={subcat.image} alt={subcat.label} onError={() => setImgErr(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : null}
      {/* Overlay degradado */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
        background: isTodos ? "none" : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
      }} />
      {/* Badge */}
      {subcat.badge && (
        <span style={{
          position: "absolute", top: 8, left: 8, fontSize: 9, fontWeight: 800,
          background: "#C41E6A", color: "#fff", borderRadius: 20, padding: "2px 8px",
        }}>
          {subcat.badge}
        </span>
      )}
      {/* Contenido */}
      <div style={{
        position: "absolute", bottom: isTodos ? undefined : 10, left: 0, right: 0,
        top: isTodos ? 0 : undefined, display: "flex", flexDirection: "column",
        alignItems: isTodos ? "center" : "flex-start", justifyContent: isTodos ? "center" : "flex-end",
        padding: isTodos ? 0 : "0 10px",
        zIndex: 2,
      }}>
        {isTodos && <Grid3X3 size={28} color="#fff" style={{ marginBottom: 6 }} />}
        <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>{subcat.label}</p>
        {subcat.subtitle && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", margin: "2px 0 0" }}>{subcat.subtitle}</p>}
      </div>
    </motion.button>
  );
}

function ProductCard({ product, onAdd, bg }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(product)}
      style={{
        borderRadius: 14, border: "0.5px solid #FFE4F3", background: "#FFF5F9",
        overflow: "hidden", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column",
        boxShadow: "0 2px 6px rgba(196,30,106,0.07)",
      }}
    >
      <div style={{ height: 70, background: bg || "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 28 }}>{product.emoji || "🍦"}</span>
        )}
      </div>
      <div style={{ padding: "6px 8px 8px" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#1A1A1A", margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </p>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#C41E6A", margin: "3px 0 0" }}>
          {formatCOP(product.price)}
        </p>
      </div>
    </motion.button>
  );
}

export default function HeladosSubSelector({ products, onAdd, addedFlash }) {
  const [subcat, setSubcat] = useState(null);

  const available = products.filter(p => p.is_available !== false);

  const filterProducts = (sub) => {
    if (sub === "todos") return available;
    if (sub === "gourmet")   return available.filter(p => p.name.toLowerCase().includes("gourmet") || (!p.name.toLowerCase().includes("exclusivo") && !p.name.toLowerCase().includes("junior") && !p.name.toLowerCase().includes("jr") && !p.name.toLowerCase().includes("maxi")));
    if (sub === "exclusivo") return available.filter(p => p.name.toLowerCase().includes("exclusivo"));
    if (sub === "junior")    return available.filter(p => p.name.toLowerCase().includes("junior") || p.name.toLowerCase().includes("jr") || p.name.toLowerCase().includes("cono"));
    return available;
  };

  const subLabel = {
    gourmet: "Helados Gourmet",
    exclusivo: "Helados Exclusivos",
    junior: "Cono Jr",
    todos: "Todos los Helados",
  };

  const bg = "#FFF0F5";

  if (!subcat) {
    return (
      <div style={{ padding: "14px 14px 8px" }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: "0 0 14px" }}>¿Qué helado quieres? 🍦</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {SUBCATS.map(s => <SubcatCard key={s.id} subcat={s} onSelect={setSubcat} />)}
        </div>
      </div>
    );
  }

  const filtered = filterProducts(subcat);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={subcat}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header con back */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 10px" }}>
          <button
            onClick={() => setSubcat(null)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#F3E8FF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ArrowLeft size={18} color="#7B3EA4" />
          </button>
          <p style={{ fontSize: 17, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>{subLabel[subcat]}</p>
        </div>

        {/* Grid productos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 14px 14px" }}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} bg={bg} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}