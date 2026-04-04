import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP, TAG_CONFIG, CATEGORIES } from "@/lib/constants";
import MalteadaCustomizer from "@/components/menu/MalteadaCustomizer";
import MalteadaCustomizer12oz from "@/components/menu/MalteadaCustomizer12oz";
import BananaSplitCustomizer from "@/components/menu/BananaSplitCustomizer";
import HeladoCustomizer from "@/components/menu/HeladoCustomizer";
import HeladoJuniorCustomizer from "@/components/menu/HeladoJuniorCustomizer";
import MaxiConoCustomizer from "@/components/menu/MaxiConoCustomizer";
import GranizadoCustomizer from "@/components/menu/GranizadoCustomizer";
import ConeCustomizer from "@/components/menu/ConeCustomizer";
import GenericCustomizer from "@/components/menu/GenericCustomizer";
import EspecialidadesCustomizer from "@/components/menu/EspecialidadesCustomizer";

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

function SectionHeader({ label, count, onViewAll }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 14, paddingRight: 14, marginBottom: 10 }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1.5px" }}>
        {label} · {count} disponibles
      </p>
      <button onClick={onViewAll} style={{ fontSize: 9, color: "#C41E6A", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
        Ver todos →
      </button>
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
      onClick={() => product.is_available !== false && onAdd(product)}
      style={{ border: "0.5px solid #FFE4F3", borderRadius: 16, background: "#fff", height: 72, display: "flex", alignItems: "center", overflow: "hidden", boxShadow: "0 2px 8px rgba(233,27,139,0.06)", cursor: product.is_available !== false ? "pointer" : "default", WebkitTapHighlightColor: "transparent" }}
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
          ? <p style={{ fontSize: 8, color: "#C41E6A", fontStyle: "italic" }}>{getProductHint(product)}</p>
          : <p style={{ fontSize: 9, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        }
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#C41E6A" }}>{formatCOP(product.price)}</span>
        {product.is_available !== false && (
          <button onClick={() => onAdd(product)} style={{ width: 22, height: 22, borderRadius: "50%", background: "#C41E6A", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(233,27,139,0.25)", cursor: "pointer" }}>
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
      onClick={() => product.is_available !== false && onAdd(product)}
      style={{ flex: 1.4, border: "0.5px solid #FFE4F3", borderRadius: 16, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(233,27,139,0.06)", cursor: product.is_available !== false ? "pointer" : "default", WebkitTapHighlightColor: "transparent" }}>
      <ProductImageBox product={product} bg={bg} size={120} emojiSize={50} />
      {tag && product.tag !== "none" && (
        <span style={{ position: "absolute", top: 8, left: 8, fontSize: 8, background: "#C41E6A", color: "#fff", borderRadius: 20, padding: "2px 7px", fontWeight: 900 }}>{tag.label}</span>
      )}
      <div style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        {getProductHint(product)
          ? <p style={{ fontSize: 8, color: "#C41E6A", fontStyle: "italic" }}>{getProductHint(product)}</p>
          : <p style={{ fontSize: 8, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        }
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#C41E6A" }}>{formatCOP(product.price)}</span>
          {product.is_available !== false && (
            <button onClick={() => onAdd(product)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#C41E6A", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(233,27,139,0.25)", cursor: "pointer" }}>
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
      style={{ flex: 1, border: "0.5px solid #FFE4F3", borderRadius: 16, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(233,27,139,0.06)" }}>
      <ProductImageBox product={product} bg={bg} size={58} emojiSize={28} />
      {tag && product.tag === "recomendado" && (
        <span style={{ position: "absolute", top: 4, left: 4, fontSize: 7, background: "#FFF9C4", color: "#7B6A00", borderRadius: 10, padding: "1px 5px", fontWeight: 800 }}>⭐ Chef</span>
      )}
      <button onClick={() => onAdd(product)} style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%", background: "#C41E6A", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Plus size={10} color="#fff" />
      </button>
      <div style={{ padding: "6px 8px 8px" }}>
        <p style={{ fontSize: 8, fontWeight: 600, color: "#2D2D2D", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 10, fontWeight: 800, color: "#C41E6A", marginTop: 2 }}>{formatCOP(product.price)}</p>
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
      style={{ width: 140, flexShrink: 0, border: "0.5px solid #FFE4F3", borderRadius: 16, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(233,27,139,0.06)" }}>
      <div style={{ background: bg, height: 100, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 44 }}>{product.emoji || "🥤"}</span>
        )}
        {tag && product.tag !== "none" && (
          <span style={{ position: "absolute", top: 6, left: 6, fontSize: 8, background: "#C41E6A", color: "#fff", borderRadius: 20, padding: "2px 7px", fontWeight: 900 }}>{tag.label}</span>
        )}
      </div>
      <div style={{ padding: "8px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 8, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#C41E6A" }}>{formatCOP(product.price)}</span>
          {product.is_available !== false && (
            <button onClick={() => onAdd(product)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#C41E6A", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(233,27,139,0.25)", cursor: "pointer" }}>
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
  const dragRef = React.useRef({ isDragging: false, startX: 0, startPos: 0 });

  // Duplicamos para loop infinito
  const doubled = [...products, ...products];

  const handleMouseDown = (e) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startPos: posRef.current,
    };
    pausedRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const diff = dragRef.current.startX - e.clientX;
    const cardWidth = 150;
    const totalWidth = cardWidth * products.length;
    posRef.current = dragRef.current.startPos + diff;
    if (posRef.current < 0) posRef.current = totalWidth + posRef.current;
    if (posRef.current >= totalWidth) posRef.current -= totalWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    pausedRef.current = false;
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [products.length]);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = 150;
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
      style={{ overflow: "hidden", paddingLeft: 14, paddingBottom: 4, cursor: "grab" }}
      onMouseDown={handleMouseDown}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
      onMouseEnter={() => { if (!dragRef.current.isDragging) pausedRef.current = true; }}
      onMouseLeave={() => { if (!dragRef.current.isDragging) pausedRef.current = false; }}
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
  const [selectedSize, setSelectedSize] = React.useState("16oz");
  const [showAll, setShowAll] = React.useState(false);
  const available = products.filter(p => p.is_available !== false);

  const by12oz = available.filter(p => p.name.includes("12oz"));
  const by16oz = available.filter(p => p.name.includes("16oz"));

  return (
    <>
      <SectionHeader label={catLabel} count={available.length} onViewAll={() => setShowAll(!showAll)} />

      {/* Size Selector Buttons */}
      <div style={{ display: "flex", gap: 10, paddingLeft: 14, paddingRight: 14, marginBottom: 16 }}>
        <button
          onClick={() => setSelectedSize("12oz")}
          style={{
            flex: 1, height: 50, borderRadius: 16,
            background: selectedSize === "12oz" ? "#C41E6A" : "#FFF0F5",
            color: selectedSize === "12oz" ? "#fff" : "#C41E6A",
            fontSize: 14, fontWeight: 900, border: "none", cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Malteadas 12oz
        </button>
        <button
          onClick={() => setSelectedSize("16oz")}
          style={{
            flex: 1, height: 50, borderRadius: 16,
            background: selectedSize === "16oz" ? "#C41E6A" : "#FFF0F5",
            color: selectedSize === "16oz" ? "#fff" : "#C41E6A",
            fontSize: 14, fontWeight: 900, border: "none", cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Malteadas 16oz
        </button>
      </div>

      {/* Show products based on selected size */}
      {!showAll ? (
        <>
          {selectedSize === "12oz" && by12oz.length > 0 && (
            <>
              <AutoCarousel products={by12oz.slice(0, 8)} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
              {by12oz.length > 8 && <Separator label="Más 12oz" />}
              {by12oz.length > 8 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginTop: 8 }}>
                  {by12oz.slice(8).map(p => <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
                </div>
              )}
            </>
          )}
          {selectedSize === "16oz" && by16oz.length > 0 && (
            <>
              <AutoCarousel products={by16oz.slice(0, 8)} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
              {by16oz.length > 8 && <Separator label="Más 16oz" />}
              {by16oz.length > 8 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginTop: 8 }}>
                  {by16oz.slice(8).map(p => <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
          {(selectedSize === "12oz" ? by12oz : by16oz).map(p => <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
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
      style={{ border: "0.5px solid #FFE4F3", borderRadius: 16, background: "#fff", height: 90, display: "flex", alignItems: "center", overflow: "hidden", boxShadow: "0 2px 8px rgba(233,27,139,0.06)" }}>
      <div style={{ flex: 1, padding: "0 14px", display: "flex", flexDirection: "column", gap: 3 }}>
        {tag && product.tag !== "none" && (
          <span style={{ fontSize: 8, background: "#C41E6A", color: "#fff", borderRadius: 20, padding: "1px 7px", fontWeight: 900, alignSelf: "flex-start" }}>{tag.label}</span>
        )}
        <p style={{ fontSize: 13, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        {getProductHint(product)
          ? <p style={{ fontSize: 8, color: "#C41E6A", fontStyle: "italic" }}>{getProductHint(product)}</p>
          : <p style={{ fontSize: 9, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        }
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#C41E6A" }}>{formatCOP(product.price)}</span>
          {product.is_available !== false && (
            <button onClick={() => onAdd(product)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#C41E6A", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(233,27,139,0.25)" }}>
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>
      <div style={{ width: 110, height: 110, background: bg, flexShrink: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
      style={{ border: "0.5px solid #FFE4F3", borderRadius: 16, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(233,27,139,0.06)" }}>
      <div style={{ background: bg, height: 100, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 40 }}>{product.emoji || "☕"}</span>
        )}
        {tag && product.tag !== "none" && (
          <span style={{ position: "absolute", top: 5, left: 5, fontSize: 7, background: "#E8F5E9", color: "#2E7D32", borderRadius: 10, padding: "1px 6px", fontWeight: 800 }}>Nuevo</span>
        )}
      </div>
      <div style={{ padding: "8px 10px 30px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#C41E6A", marginTop: 3 }}>{formatCOP(product.price)}</p>
      </div>
      {product.is_available !== false && (
        <button onClick={() => onAdd(product)} style={{ position: "absolute", bottom: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "#C41E6A", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(233,27,139,0.25)" }}>
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
  const [customizerProduct, setCustomizerProduct] = useState(null);
  const [customizer12ozProduct, setCustomizer12ozProduct] = useState(null);
  const [bananaSplitProduct, setBananaSplitProduct] = useState(null);
  const [heladoProduct, setHeladoProduct] = useState(null);
  const [heladoJuniorProduct, setHeladoJuniorProduct] = useState(null);
  const [maxiConoProduct, setMaxiConoProduct] = useState(null);
  const [granizadoProduct, setGranizadoProduct] = useState(null);
  const [coneProduct, setConeProduct] = useState(null);
  const [genericProduct, setGenericProduct] = useState(null);
  const [especialidadesProduct, setEspecialidadesProduct] = useState(null);

  if (!products || products.length === 0) return null;

  const bg = CATEGORY_BG[category] || "#FFF0F5";
  const catLabel = CATEGORIES.find(c => c.id === category)?.label || category;

  // Interceptar onAdd según categoría/producto
  const handleAdd = (product) => {
    if (category === "malteadas") {
      if (product.name.includes("12oz")) {
        setCustomizer12ozProduct(product);
      } else {
        setCustomizerProduct(product);
      }
    } else if (category === "especialidades" && product.name.toLowerCase().includes("banana split")) {
      setBananaSplitProduct(product);
    } else if (category === "especialidades") {
      // Todos los demás productos de especialidades usan el customizer de sabores
      setEspecialidadesProduct(product);
    } else if (category === "helados" && (product.name.toLowerCase().includes("maxi cono") || product.name.toLowerCase().includes("maxicono"))) {
      setMaxiConoProduct(product);
    } else if (category === "helados" && product.name.toLowerCase().includes("exclusivo")) {
      setHeladoProduct(product);
    } else if (category === "helados" && product.name.toLowerCase().includes("gourmet")) {
      setHeladoProduct(product);
    } else if (category === "helados" && product.name.toLowerCase().includes("junior")) {
      setHeladoJuniorProduct(product);
    } else if (category === "granizados" && product.name.toLowerCase().includes("granizado")) {
      setGranizadoProduct(product);
    } else if (product.name.toLowerCase().includes("cono") && !product.name.toLowerCase().includes("maxi")) {
      setConeProduct(product);
    } else if (category === "combos") {
      setGenericProduct(product);
    } else {
      onAdd(product);
    }
  };

  const handleCustomizerAdd = (productWithPrice, notes) => {
    onAdd({ ...productWithPrice, notes });
  };

  // Ordenamiento comercial dinámico aplicado antes de pasar a cada layout
  const sortedProducts = sortProductsCommercially(products);
  const layoutProps = { products: sortedProducts, onAdd: handleAdd, addedFlash, bg, catLabel };

  const renderLayout = () => {
    switch (category) {
      case "helados":       return <HeladosLayout {...layoutProps} />;
      case "malteadas":     return <MalteadasLayout {...layoutProps} />;
      case "granizados":    return <EspecialesLayout {...layoutProps} />;
      case "especialidades": return <EspecialesLayout {...layoutProps} />;
      case "cafe":          return <CafeLayout {...layoutProps} />;
      default:              return <DefaultLayout {...layoutProps} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          style={{ paddingBottom: 8 }}
        >
          {renderLayout()}
        </motion.div>
      </AnimatePresence>
      <MalteadaCustomizer
        product={customizerProduct}
        open={!!customizerProduct}
        onClose={() => setCustomizerProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <MalteadaCustomizer12oz
        product={customizer12ozProduct}
        open={!!customizer12ozProduct}
        onClose={() => setCustomizer12ozProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <BananaSplitCustomizer
        product={bananaSplitProduct}
        open={!!bananaSplitProduct}
        onClose={() => setBananaSplitProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <HeladoCustomizer
        product={heladoProduct}
        open={!!heladoProduct}
        onClose={() => setHeladoProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <HeladoJuniorCustomizer
        product={heladoJuniorProduct}
        open={!!heladoJuniorProduct}
        onClose={() => setHeladoJuniorProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <MaxiConoCustomizer
        product={maxiConoProduct}
        open={!!maxiConoProduct}
        onClose={() => setMaxiConoProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <GranizadoCustomizer
        product={granizadoProduct}
        open={!!granizadoProduct}
        onClose={() => setGranizadoProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <ConeCustomizer
        product={coneProduct}
        open={!!coneProduct}
        onClose={() => setConeProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <GenericCustomizer
        product={genericProduct}
        open={!!genericProduct}
        onClose={() => setGenericProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <EspecialidadesCustomizer
        product={especialidadesProduct}
        open={!!especialidadesProduct}
        onClose={() => setEspecialidadesProduct(null)}
        onAdd={handleCustomizerAdd}
      />
    </>
  );
}