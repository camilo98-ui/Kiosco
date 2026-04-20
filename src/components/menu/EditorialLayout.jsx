import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP, TAG_CONFIG, CATEGORIES } from "@/lib/constants";
import HeladosSubSelector from "@/components/menu/HeladosSubSelector";
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
import HeladoFioreCustomizer from "@/components/menu/HeladoFioreCustomizer";
import GalletaMediumHelladoCustomizer from "@/components/menu/GalletaMediumHelladoCustomizer";
import BrownieHeladoSalsaCustomizer from "@/components/menu/BrownieHeladoSalsaCustomizer";
import SundaeSalsaCustomizer from "@/components/menu/SundaeSalsaCustomizer";
import ProductDetailLine from "@/components/menu/ProductDetailLine";
import BebidasLayout from "@/components/menu/BebidasLayout";
import CafeLayoutPremium from "@/components/menu/CafeLayoutPremium";
import GranizadosLayout from "@/components/menu/GranizadosLayout";

const TAG_PRIORITY = { promo: 0, mas_vendido: 1, recomendado: 2, none: 3 };

export function sortProductsCommercially(products) {
  return [...products].sort((a, b) => {
    const pa = TAG_PRIORITY[a.tag] ?? 3;
    const pb = TAG_PRIORITY[b.tag] ?? 3;
    if (pa !== pb) return pa - pb;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });
}

function getProductHint(product) {
  if (product.tag === "mas_vendido") return "El favorito de nuestros clientes";
  if (product.tag === "recomendado") return "Selección del chef Popsy";
  if (product.tag === "promo") return "¡Precio especial por tiempo limitado!";
  return null;
}

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
      whileTap={{ scale: 0.95 }}
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

function TallCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }} whileTap={{ scale: 0.95 }}
      onClick={() => product.is_available !== false && onAdd(product)}
      style={{ flex: 1.4, border: "0.5px solid #FFE4F3", borderRadius: 16, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(196,30,106,0.06)", cursor: product.is_available !== false ? "pointer" : "default", WebkitTapHighlightColor: "transparent" }}>
      <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: bg, overflow: "hidden" }}>
        <ProductImageBox product={product} bg={bg} size={120} emojiSize={50} />
      </div>
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
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }} whileTap={{ scale: 0.95 }} onClick={() => onAdd(product)} style={{ flex: 1, border: "0.5px solid #FFE4F3", borderRadius: 16, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(233,27,139,0.06)", cursor: "pointer" }}>
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ display: "flex", gap: 8, paddingLeft: 14, paddingRight: 14, marginBottom: 10 }}>
          <TallCard product={tallProduct} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
          {smallProducts.length > 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {smallProducts.map(p => <SmallCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
            </div>
          )}
        </motion.div>
      )}
      {restProducts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
          {restProducts.map(p => <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
        </div>
      )}
    </>
  );
}

function MalteadaCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }} whileTap={{ scale: 0.95 }} onClick={() => onAdd(product)}
      style={{ width: 140, flexShrink: 0, border: "0.5px solid #FFE4F3", borderRadius: 16, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(233,27,139,0.06)", cursor: "pointer" }}>
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
  const isDraggingRef = React.useRef(false);
  const dragStartXRef = React.useRef(0);
  const dragStartPosRef = React.useRef(0);
  const touchStartXRef = React.useRef(0);
  const touchStartYRef = React.useRef(0);
  const isHorizontalRef = React.useRef(null);
  const resumeTimerRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const CARD_W = 150;
  const GAP_W = 10;
  const totalWidth = (CARD_W + GAP_W) * products.length;
  const doubled = [...products, ...products];

  const pauseFor = (ms = 1500) => {
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, ms);
  };

  const applyPos = (pos) => {
    let p = pos % totalWidth;
    if (p < 0) p += totalWidth;
    posRef.current = p;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${p}px)`;
  };

  // Mouse
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = posRef.current;
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
    e.preventDefault();
  };

  React.useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      applyPos(dragStartPosRef.current + (dragStartXRef.current - e.clientX));
    };
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      pauseFor(1000);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [totalWidth]);

  // Touch
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    dragStartPosRef.current = posRef.current;
    dragStartXRef.current = e.touches[0].clientX;
    isHorizontalRef.current = null;
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
  };

  const handleTouchMove = React.useCallback((e) => {
    const dx = touchStartXRef.current - e.touches[0].clientX;
    const dy = touchStartYRef.current - e.touches[0].clientY;
    if (isHorizontalRef.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isHorizontalRef.current = Math.abs(dx) > Math.abs(dy);
    }
    if (isHorizontalRef.current) {
      e.preventDefault();
      applyPos(dragStartPosRef.current + dx);
    }
  }, [totalWidth]);

  const handleTouchEnd = () => {
    isHorizontalRef.current = null;
    pauseFor(1500);
  };

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, [handleTouchMove]);

  // Animation loop
  React.useEffect(() => {
    const animate = () => {
      if (!pausedRef.current && trackRef.current) {
        posRef.current += 0.5;
        if (posRef.current >= totalWidth) posRef.current = 0;
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, [totalWidth]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => { if (!isDraggingRef.current) pausedRef.current = true; }}
      onMouseLeave={() => { if (!isDraggingRef.current) pausedRef.current = false; }}
      style={{ overflow: "hidden", paddingLeft: 14, paddingBottom: 4, cursor: "grab", userSelect: "none", WebkitUserSelect: "none" }}
    >
      <div ref={trackRef} style={{ display: "flex", gap: GAP_W, width: "max-content", willChange: "transform" }}>
        {doubled.map((p, i) => (
          <MalteadaCard key={`${p.id}-${i}`} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
        ))}
      </div>
    </div>
  );
}


function MalteadasLayout({ products, onAdd, addedFlash, bg, catLabel }) {
  const [tab, setTab] = React.useState("16oz");
  const available = products.filter(p => p.is_available !== false);
  const malteadas16 = available.filter(p => !p.name.includes("12oz"));
  const malteadas12 = available.filter(p => p.name.includes("12oz"));

  return (
    <>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, padding: "0 14px", marginBottom: 14 }}>
        {[{ key: "16oz", label: "Malteadas 16oz 🥤" }, { key: "12oz", label: "Malteadas 12oz 🧋" }].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 14, border: "none", cursor: "pointer",
              fontWeight: 800, fontSize: 13, fontFamily: "'Poppins', sans-serif",
              background: tab === t.key ? "#C41E6A" : "#F3E8FF",
              color: tab === t.key ? "#fff" : "#7B3EA4",
              boxShadow: tab === t.key ? "0 4px 14px rgba(196,30,106,0.3)" : "none",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido 16oz */}
      {tab === "16oz" && malteadas16.length > 0 && (
        <>
          <AutoCarousel products={malteadas16} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginTop: 14 }}>
            {malteadas16.map(p => (
              <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
            ))}
          </div>
        </>
      )}
      {/* Contenido 12oz */}
      {tab === "12oz" && malteadas12.length > 0 && (
        <>
          <AutoCarousel products={malteadas12} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginTop: 14 }}>
            {malteadas12.map(p => (
              <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function EspecialesCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div animate={isFlash ? { scale: 0.98 } : { scale: 1 }} transition={{ duration: 0.15 }} whileTap={{ scale: 0.95 }} onClick={() => onAdd(product)}
      style={{ border: "0.5px solid #FFE4F3", borderRadius: 16, background: "#fff", height: 90, display: "flex", alignItems: "center", overflow: "hidden", boxShadow: "0 2px 8px rgba(233,27,139,0.06)", cursor: "pointer" }}>
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
  const available = products.filter(p => p.is_available !== false && !p.name.toLowerCase().includes("granizado")).map(p => {
    const name = p.name.toLowerCase();
    if (name.includes("sundae 1 sabor")) {
      return { ...p, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2df60753e_Sundae1sabor10900.png" };
    } else if (name.includes("sundae 2 sabor")) {
      return { ...p, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/4ec8da0eb_Sundae2sabores14900.png" };
    }
    return p;
  });
  return (
    <>
      <SectionHeader label={catLabel} count={available.length} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
        {available.map(p => <EspecialesCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
      </div>
    </>
  );
}

function CafeCard({ product, onAdd, addedFlash, bg }) {
  const tag = TAG_CONFIG[product.tag];
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }} whileTap={{ scale: 0.95 }} onClick={() => onAdd(product)}
      style={{ border: "0.5px solid #FFE4F3", borderRadius: 16, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(233,27,139,0.06)", cursor: "pointer" }}>
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

function DefaultLayout({ products, onAdd, addedFlash, bg, catLabel }) {
  return <HeladosLayout products={products} onAdd={onAdd} addedFlash={addedFlash} bg={bg} catLabel={catLabel} />;
}

export default function EditorialLayout({ products, category, onAdd, addedFlash, autoOpenProduct, onAutoOpenDone }) {
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
  const [fioreProduct, setFioreProduct] = useState(null);
  const [galletaHelladoProduct, setGalletaHelladoProduct] = useState(null);
  const [brownieHelladoProduct, setBrownieHelladoProduct] = useState(null);
  const [sundaeProduct, setSundaeProduct] = useState(null);

  const bg = CATEGORY_BG[category] || "#FFF0F5";
  const catLabel = CATEGORIES.find(c => c.id === category)?.label || category;

  const handleAdd = useCallback((product) => {
    // Patch images for Sundaes
    let patchedProduct = product;
    const name = product.name.toLowerCase();
    if (name.includes("sundae 1 sabor")) {
      patchedProduct = { ...product, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2df60753e_Sundae1sabor10900.png" };
    } else if (name.includes("sundae 2 sabor")) {
      patchedProduct = { ...product, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/4ec8da0eb_Sundae2sabores14900.png" };
    }

    // Nuevos customizadores
    if (name.includes("helado fiore")) {
      setFioreProduct(patchedProduct);
    } else if (name.includes("galleta mediana") && name.includes("hld")) {
      setGalletaHelladoProduct(patchedProduct);
    } else if (name.includes("brownie con helado")) {
      setBrownieHelladoProduct(patchedProduct);
    } else if (name.includes("copa gelarti pops")) {
      setSundaeProduct(patchedProduct);
    } else if (name.includes("sundae 1 sabor") || name.includes("sundae 2 sabor")) {
      setSundaeProduct(patchedProduct);
    } else if (category === "malteadas") {
      if (patchedProduct.name.includes("12oz")) {
        setCustomizer12ozProduct(patchedProduct);
      } else {
        setCustomizerProduct(patchedProduct);
      }
    } else if (category === "especialidades" && patchedProduct.name.toLowerCase().includes("banana split")) {
      setBananaSplitProduct(patchedProduct);
    } else if (category === "especialidades") {
      setEspecialidadesProduct(patchedProduct);
    } else if (category === "helados" && (patchedProduct.name.toLowerCase().includes("maxi cono") || patchedProduct.name.toLowerCase().includes("maxicono"))) {
      setMaxiConoProduct(patchedProduct);
    } else if (category === "helados" && (patchedProduct.name.toLowerCase().includes("junior") || patchedProduct.name.toLowerCase().includes("jr"))) {
      setHeladoJuniorProduct(patchedProduct);
    } else if (category === "helados") {
      // Todos los helados (gourmet, exclusivo, etc.) abren el customizer
      setHeladoProduct(patchedProduct);
    } else if (category === "granizados" && patchedProduct.name.toLowerCase().includes("granizado")) {
      setGranizadoProduct(patchedProduct);
    } else if (patchedProduct.name.toLowerCase().includes("cono") && !patchedProduct.name.toLowerCase().includes("maxi")) {
      setConeProduct(patchedProduct);
    } else if (category === "combos") {
      setGenericProduct(patchedProduct);
    } else {
      onAdd(patchedProduct);
    }
  }, [category, onAdd]);

  useEffect(() => {
    if (autoOpenProduct) {
      handleAdd(autoOpenProduct);
      if (onAutoOpenDone) onAutoOpenDone();
    }
  }, [autoOpenProduct?.id]);

  if (!products || products.length === 0) return null;

  const handleCustomizerAdd = (productWithPrice, notes) => {
    onAdd(productWithPrice, notes);
  };

  const sortedProducts = sortProductsCommercially(products);
  const layoutProps = { products: sortedProducts, onAdd: handleAdd, addedFlash, bg, catLabel };

  const renderLayout = () => {
    switch (category) {
      case "helados":       return <HeladosSubSelector products={sortedProducts} onAdd={handleAdd} onDirectAdd={onAdd} addedFlash={addedFlash} />;
      case "malteadas":     return <MalteadasLayout {...layoutProps} />;
      case "granizados":    return <GranizadosLayout products={sortedProducts} onAdd={handleAdd} />;
      case "especialidades": return <EspecialesLayout {...layoutProps} />;
      case "cafe":          return <CafeLayoutPremium products={sortedProducts} onAdd={handleAdd} />;
      case "bebidas":       return <BebidasLayout products={sortedProducts} onAdd={handleAdd} />;
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
      <HeladoFioreCustomizer
        product={fioreProduct}
        open={!!fioreProduct}
        onClose={() => setFioreProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <GalletaMediumHelladoCustomizer
        product={galletaHelladoProduct}
        open={!!galletaHelladoProduct}
        onClose={() => setGalletaHelladoProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <BrownieHeladoSalsaCustomizer
        product={brownieHelladoProduct}
        open={!!brownieHelladoProduct}
        onClose={() => setBrownieHelladoProduct(null)}
        onAdd={handleCustomizerAdd}
      />
      <SundaeSalsaCustomizer
        product={sundaeProduct}
        open={!!sundaeProduct}
        onClose={() => setSundaeProduct(null)}
        onAdd={handleCustomizerAdd}
      />
    </>
  );
}