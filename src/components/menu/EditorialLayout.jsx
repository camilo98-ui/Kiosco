import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP, TAG_CONFIG, CATEGORIES } from "@/lib/constants";

// ─── Ordenamiento comercial dinámico ───────────────────────────────
const TAG_PRIORITY = { promo: 0, mas_vendido: 1, recomendado: 2, none: 3 };

export function sortProductsCommercially(products) {
  return [...products].sort((a, b) => {
    const pa = TAG_PRIORITY[a.tag] ?? 3;
    const pb = TAG_PRIORITY[b.tag] ?? 3;
    if (pa !== pb) return pa - pb;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });
}

// Descripciones cortas por tipo de tag
function getProductHint(product) {
  if (product.tag === "mas_vendido") return "El favorito de nuestros clientes";
  if (product.tag === "recomendado") return "Selección del chef Popsy";
  if (product.tag === "promo") return "¡Precio especial por tiempo limitado!";
  return null;
}

// Fondos por categoría
const CATEGORY_BG = {
  helados: "#FFF0F5",
  malteadas: "#F3E8FF",
  especialidades: "#FFFAF0",
  cafe: "#FFF5F0",
  galletas: "#FFF9F0",
  paletas_packs: "#F0FFF4",
  popsy_toy: "#F0F5FF",
  para_llevar: "#F5FFF0",
  tortas: "#FFF0F5",
  regalos: "#FFF0FF",
  bebidas: "#F0FAFF",
  adiciones: "#FFFAF0",
};

// ─── Componentes base ───────────────────────────────────────────────

function ProductImageBox({ product, bg, size = 120, emojiSize = 50 }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <div style={{ background: bg, height: size, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", width: emojiSize * 1.8, height: emojiSize * 1.8, borderRadius: "50%", background: "rgba(194,24,91,0.06)" }} />
      <div style={{ position: "absolute", width: emojiSize * 1.3, height: emojiSize * 1.3, borderRadius: "50%", background: "rgba(194,24,91,0.10)" }} />
      {product.image_url && !imgError ? (
        <img src={product.image_url} alt={product.name} onError={() => setImgError(true)}
          style={{ width: emojiSize * 1.2, height: emojiSize * 1.2, objectFit: "cover", borderRadius: "50%", position: "relative", zIndex: 1 }} />
      ) : (
        <span style={{ fontSize: emojiSize, lineHeight: 1, position: "relative", zIndex: 1 }}>{product.emoji || "🍦"}</span>
      )}
    </div>
  );
}

function SectionHeader({ label, count }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 14, paddingRight: 14, marginBottom: 10 }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1.5px" }}>
        {label} · {count} disponibles
      </p>
      <p style={{ fontSize: 9, color: "#C2185B", fontWeight: 700 }}>Ver todos →</p>
    </div>
  );
}

function HorizontalCard({ product, onAdd, addedFlash, bg }) {
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div
      animate={isFlash ? { scale: 0.98 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
      style={{ border: "1.5px solid #F0E4EA", borderRadius: 18, background: "#fff", height: 72, display: "flex", alignItems: "center", overflow: "hidden" }}
    >
      <div style={{ width: 72, height: 72, background: bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: 72, height: 72, objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 30 }}>{product.emoji || "🍦"}</span>
        )}
      </div>
      <div style={{ width: 1, height: 40, background: "#F0E4EA", flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        {getProductHint(product)
          ? <p style={{ fontSize: 8, color: "#C2185B", fontStyle: "italic" }}>{getProductHint(product)}</p>
          : <p style={{ fontSize: 9, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        }
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
        {product.is_available !== false && (
          <button onClick={() => onAdd(product)} style={{ width: 22, height: 22, borderRadius: "50%", background: "#C2185B", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(194,24,91,0.3)", cursor: "pointer" }}>
            <Plus size={11} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Separator({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 14, paddingRight: 14, margin: "10px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#F0E4EA" }} />
      <p style={{ fontSize: 8, color: "#DDD", textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap" }}>Más {label}</p>
      <div style={{ flex: 1, height: 1, background: "#F0E4EA" }} />
    </div>
  );
}

// ─── Layout: HELADOS (asimétrico editorial) ─────────────────────────

function TallCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ flex: 1.4, border: "1.5px solid #F0E4EA", borderRadius: 22, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column" }}>
      <ProductImageBox product={product} bg={bg} size={120} emojiSize={50} />
      {tag && product.tag !== "none" && (
        <span style={{ position: "absolute", top: 8, left: 8, fontSize: 8, background: "#C2185B", color: "#fff", borderRadius: 20, padding: "2px 7px", fontWeight: 900 }}>{tag.label}</span>
      )}
      <div style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        {getProductHint(product)
          ? <p style={{ fontSize: 8, color: "#C2185B", fontStyle: "italic" }}>{getProductHint(product)}</p>
          : <p style={{ fontSize: 8, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        }
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
          {product.is_available !== false && (
            <button onClick={() => onAdd(product)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#C2185B", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(194,24,91,0.35)", cursor: "pointer" }}>
              <Plus size={13} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SmallCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ flex: 1, border: "1.5px solid #F0E4EA", borderRadius: 18, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column" }}>
      <ProductImageBox product={product} bg={bg} size={58} emojiSize={28} />
      {tag && product.tag === "recomendado" && (
        <span style={{ position: "absolute", top: 4, left: 4, fontSize: 7, background: "#FFF9C4", color: "#7B6A00", borderRadius: 10, padding: "1px 5px", fontWeight: 800 }}>⭐ Chef</span>
      )}
      <button onClick={() => onAdd(product)} style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#fff", border: "1.5px solid #C2185B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Plus size={10} color="#C2185B" />
      </button>
      <div style={{ padding: "6px 8px 8px" }}>
        <p style={{ fontSize: 8, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 10, fontWeight: 900, color: "#C2185B", marginTop: 2 }}>{formatCOP(product.price)}</p>
      </div>
    </motion.div>
  );
}

function HeladosLayout({ products, onAdd, addedFlash, bg, catLabel }) {
  const available = products.filter(p => p.is_available !== false);
  const topProducts = available.slice(0, 3);
  const restProducts = available.slice(3);
  const tallProduct = topProducts[0];
  const smallProducts = topProducts.slice(1, 3);

  return (
    <>
      <SectionHeader label={catLabel} count={available.length} />
      {tallProduct && (
        <div style={{ display: "flex", gap: 8, paddingLeft: 14, paddingRight: 14, marginBottom: 10 }}>
          <TallCard product={tallProduct} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
          {smallProducts.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {smallProducts.map(p => <SmallCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
            </div>
          )}
        </div>
      )}
      {restProducts.length > 0 && <Separator label={catLabel} />}
      {restProducts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
          {restProducts.map(p => <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
        </div>
      )}
    </>
  );
}

// ─── Layout: MALTEADAS (carrusel horizontal showcase) ───────────────

function MalteadaCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ width: 140, flexShrink: 0, border: "1.5px solid #F0E4EA", borderRadius: 22, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ background: bg, height: 100, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 44 }}>{product.emoji || "🥤"}</span>
        )}
        {tag && product.tag !== "none" && (
          <span style={{ position: "absolute", top: 6, left: 6, fontSize: 8, background: "#C2185B", color: "#fff", borderRadius: 20, padding: "2px 7px", fontWeight: 900 }}>{tag.label}</span>
        )}
      </div>
      <div style={{ padding: "8px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 8, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
          {product.is_available !== false && (
            <button onClick={() => onAdd(product)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#C2185B", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(194,24,91,0.35)", cursor: "pointer" }}>
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AutoCarousel({ products, onAdd, addedFlash, bg }) {
  const trackRef = React.useRef(null);
  const animRef = React.useRef(null);
  const posRef = React.useRef(0);
  const pausedRef = React.useRef(false);

  // Duplicamos para loop infinito
  const doubled = [...products, ...products];

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = 150; // 140px card + 10px gap
    const totalWidth = cardWidth * products.length;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += 0.5;
        if (posRef.current >= totalWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [products.length]);

  return (
    <div
      style={{ overflow: "hidden", paddingLeft: 14, paddingBottom: 4 }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div ref={trackRef} style={{ display: "flex", gap: 10, width: "max-content" }}>
        {doubled.map((p, i) => (
          <MalteadaCard key={`${p.id}-${i}`} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
        ))}
      </div>
    </div>
  );
}

function MalteadasLayout({ products, onAdd, addedFlash, bg, catLabel }) {
  const available = products.filter(p => p.is_available !== false);
  const carouselProducts = available.slice(0, 8);
  const restProducts = available.slice(8);

  return (
    <>
      <SectionHeader label={catLabel} count={available.length} />
      <AutoCarousel products={carouselProducts} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
      {restProducts.length > 0 && <Separator label={catLabel} />}
      {restProducts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginTop: 8 }}>
          {restProducts.map(p => <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
        </div>
      )}
    </>
  );
}

// ─── Layout: ESPECIALES (lista editorial imagen derecha) ────────────

function EspecialesCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div animate={isFlash ? { scale: 0.98 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ border: "1.5px solid #F0E4EA", borderRadius: 18, background: "#fff", height: 90, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ flex: 1, padding: "0 14px", display: "flex", flexDirection: "column", gap: 3 }}>
        {tag && product.tag !== "none" && (
          <span style={{ fontSize: 8, background: "#C2185B", color: "#fff", borderRadius: 20, padding: "1px 7px", fontWeight: 900, alignSelf: "flex-start" }}>{tag.label}</span>
        )}
        <p style={{ fontSize: 13, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        {getProductHint(product)
          ? <p style={{ fontSize: 8, color: "#C2185B", fontStyle: "italic" }}>{getProductHint(product)}</p>
          : <p style={{ fontSize: 9, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        }
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
          {product.is_available !== false && (
            <button onClick={() => onAdd(product)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#C2185B", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>
      <div style={{ width: 90, height: 90, background: bg, flexShrink: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: 90, height: 90, objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 40 }}>{product.emoji || "🌟"}</span>
        )}
      </div>
    </motion.div>
  );
}

function EspecialesLayout({ products, onAdd, addedFlash, bg, catLabel }) {
  const available = products.filter(p => p.is_available !== false);
  return (
    <>
      <SectionHeader label={catLabel} count={available.length} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
        {available.map(p => <EspecialesCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
      </div>
    </>
  );
}

// ─── Layout: CAFÉ (grid 2 columnas) ─────────────────────────────────

function CafeCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ border: "1.5px solid #F0E4EA", borderRadius: 20, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ background: bg, height: 80, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 32 }}>{product.emoji || "☕"}</span>
        )}
        {tag && product.tag !== "none" && (
          <span style={{ position: "absolute", top: 5, left: 5, fontSize: 7, background: "#E8F5E9", color: "#2E7D32", borderRadius: 10, padding: "1px 6px", fontWeight: 800 }}>Nuevo</span>
        )}
      </div>
      <div style={{ padding: "8px 10px 30px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 11, fontWeight: 900, color: "#C2185B", marginTop: 3 }}>{formatCOP(product.price)}</p>
      </div>
      {product.is_available !== false && (
        <button onClick={() => onAdd(product)} style={{ position: "absolute", bottom: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "#C2185B", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Plus size={11} />
        </button>
      )}
    </motion.div>
  );
}

function CafeLayout({ products, onAdd, addedFlash, bg, catLabel }) {
  const available = products.filter(p => p.is_available !== false);
  return (
    <>
      <SectionHeader label={catLabel} count={available.length} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingLeft: 14, paddingRight: 14 }}>
        {available.map(p => <CafeCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
      </div>
    </>
  );
}

// ─── Layout: DEFAULT (helados-style) ────────────────────────────────

function DefaultLayout({ products, onAdd, addedFlash, bg, catLabel }) {
  return <HeladosLayout products={products} onAdd={onAdd} addedFlash={addedFlash} bg={bg} catLabel={catLabel} />;
}

// ─── EXPORT PRINCIPAL ───────────────────────────────────────────────

export default function EditorialLayout({ products, category, onAdd, addedFlash }) {
  if (!products || products.length === 0) return null;

  const bg = CATEGORY_BG[category] || "#FFF0F5";
  const catLabel = CATEGORIES.find(c => c.id === category)?.label || category;

  // Ordenamiento comercial dinámico aplicado antes de pasar a cada layout
  const sortedProducts = sortProductsCommercially(products);
  const layoutProps = { products: sortedProducts, onAdd, addedFlash, bg, catLabel };

  const renderLayout = () => {
    switch (category) {
      case "helados":       return <HeladosLayout {...layoutProps} />;
      case "malteadas":     return <MalteadasLayout {...layoutProps} />;
      case "especialidades": return <EspecialesLayout {...layoutProps} />;
      case "cafe":          return <CafeLayout {...layoutProps} />;
      default:              return <DefaultLayout {...layoutProps} />;
    }
  };

  return (
    <div style={{ paddingBottom: 8 }}>
      {renderLayout()}
    </div>
  );
}