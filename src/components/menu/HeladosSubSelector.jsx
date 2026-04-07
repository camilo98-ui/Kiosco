import React, { useState } from "react";
import { ArrowLeft, Grid3X3, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const SUBCAT_IMAGES = {
  gourmet: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png",
  exclusivo: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png",
  junior: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png",
};

const SUBCATS = [
  { id: "gourmet",   label: "Gourmet",   subtitle: "Los clásicos de Popsy", badge: "⭐ Top",   image: SUBCAT_IMAGES.gourmet },
  { id: "exclusivo", label: "Exclusivo", subtitle: "Sabores únicos",        badge: "✨ Nuevo", image: SUBCAT_IMAGES.exclusivo },
  { id: "junior",    label: "Cono Jr",   subtitle: "Perfecto para compartir", badge: null,    image: SUBCAT_IMAGES.junior },
  { id: "todos",     label: "Ver todos", subtitle: null,                    badge: null,      image: null },
];

// Pantalla 1: Selector de subcategoría
function SubcatSelector({ onSelect }) {
  const top = SUBCATS.slice(0, 2);
  const bottom = SUBCATS.slice(2, 4);

  return (
    <div style={{ padding: "14px 14px 8px" }}>
      <p style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: "0 0 14px" }}>¿Qué helado quieres? 🍦</p>
      {/* Fila superior: Gourmet + Exclusivo */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        {top.map(s => <SubcatCard key={s.id} subcat={s} onSelect={onSelect} height={160} flex={1} />)}
      </div>
      {/* Fila inferior: Cono Jr (60%) + Ver todos (40%) */}
      <div style={{ display: "flex", gap: 10 }}>
        <SubcatCard subcat={bottom[0]} onSelect={onSelect} height={120} flex={1.5} />
        <SubcatCard subcat={bottom[1]} onSelect={onSelect} height={120} flex={1} />
      </div>
    </div>
  );
}

function SubcatCard({ subcat, onSelect, height, flex }) {
  const [imgErr, setImgErr] = useState(false);
  const isTodos = subcat.id === "todos";
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(subcat.id)}
      style={{
        position: "relative", height, flex, borderRadius: 20, overflow: "hidden",
        border: "none", cursor: "pointer", padding: 0,
        background: isTodos ? "linear-gradient(135deg, #C41E6A, #FF6EB4)" : "#FFF0F5",
        boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        minWidth: 0,
      }}
    >
      {!isTodos && subcat.image && !imgErr && (
        <img src={subcat.image} alt={subcat.label} onError={() => setImgErr(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {/* Overlay */}
      {!isTodos && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
        }} />
      )}
      {/* Badge */}
      {subcat.badge && (
        <span style={{
          position: "absolute", top: 8, left: 8, fontSize: 9, fontWeight: 800,
          background: "#C41E6A", color: "#fff", borderRadius: 20, padding: "2px 8px",
          zIndex: 2,
        }}>
          {subcat.badge}
        </span>
      )}
      {/* Texto */}
      <div style={{
        position: "absolute",
        bottom: isTodos ? undefined : 10,
        top: isTodos ? 0 : undefined,
        left: 0, right: 0,
        display: "flex", flexDirection: "column",
        alignItems: isTodos ? "center" : "flex-start",
        justifyContent: isTodos ? "center" : "flex-end",
        padding: isTodos ? 0 : "0 10px",
        zIndex: 2,
      }}>
        {isTodos && <Grid3X3 size={24} color="#fff" style={{ marginBottom: 6 }} />}
        <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>{subcat.label}</p>
        {subcat.subtitle && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", margin: "2px 0 0" }}>{subcat.subtitle}</p>}
      </div>
    </motion.button>
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
      {/* Texto izquierda */}
      <div style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          fontSize: 9, fontWeight: 800,
          background: "#C41E6A", color: "#fff",
          borderRadius: 20, padding: "2px 8px",
        }}>
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
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#C41E6A", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(196,30,106,0.3)",
        }}>
          <Plus size={16} color="#fff" />
        </div>
      </div>
      {/* Foto derecha */}
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
function GridProductCard({ product, onAdd, isLast, isOdd }) {
  const [imgErr, setImgErr] = useState(false);
  // Si es el último de una lista impar, se muestra como featured
  if (isLast && isOdd) {
    return <FeaturedProductCard product={product} onAdd={onAdd} />;
  }
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

// Pantalla 2: Lista de productos por subcategoría
function ProductList({ products, onAdd, title, onBack }) {
  const featured = products[0];
  const rest = products.slice(1);
  const isOdd = rest.length % 2 !== 0;

  // Los del grid (todos menos featured), pero si rest es impar el último va ancho
  const gridItems = isOdd ? rest.slice(0, -1) : rest;
  const lastItem = isOdd ? rest[rest.length - 1] : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 12px" }}>
          <button
            onClick={onBack}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#F3E8FF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <ArrowLeft size={18} color="#7B3EA4" />
          </button>
          <p style={{ fontSize: 17, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>{title}</p>
        </div>

        <div style={{ padding: "0 14px 14px" }}>
          {/* Card destacada */}
          {featured && <FeaturedProductCard product={featured} onAdd={onAdd} />}

          {/* Grid 2 columnas */}
          {gridItems.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: lastItem ? 10 : 0 }}>
              {gridItems.map(p => (
                <GridProductCard key={p.id} product={p} onAdd={onAdd} />
              ))}
            </div>
          )}

          {/* Último impar → card ancha */}
          {lastItem && <FeaturedProductCard product={lastItem} onAdd={onAdd} />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HeladosSubSelector({ products, onAdd, addedFlash }) {
  const [subcat, setSubcat] = useState(null);

  const available = products.filter(p => p.is_available !== false);

  const filterProducts = (sub) => {
    if (sub === "todos") return available;
    if (sub === "gourmet")   return available.filter(p =>
      p.name.toLowerCase().includes("gourmet") ||
      (!p.name.toLowerCase().includes("exclusivo") &&
       !p.name.toLowerCase().includes("junior") &&
       !p.name.toLowerCase().includes("jr") &&
       !p.name.toLowerCase().includes("maxi"))
    );
    if (sub === "exclusivo") return available.filter(p => p.name.toLowerCase().includes("exclusivo"));
    if (sub === "junior")    return available.filter(p =>
      p.name.toLowerCase().includes("junior") ||
      p.name.toLowerCase().includes("jr") ||
      p.name.toLowerCase().includes("cono")
    );
    return available;
  };

  const subLabel = {
    gourmet: "Helados Gourmet",
    exclusivo: "Helados Exclusivos",
    junior: "Cono Jr",
    todos: "Todos los Helados",
  };

  if (!subcat) {
    return <SubcatSelector onSelect={setSubcat} />;
  }

  return (
    <ProductList
      products={filterProducts(subcat)}
      onAdd={onAdd}
      title={subLabel[subcat]}
      onBack={() => setSubcat(null)}
    />
  );
}