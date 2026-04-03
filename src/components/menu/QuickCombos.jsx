import React, { useState, useEffect, useRef } from "react";
import { Zap, ShoppingCart } from "lucide-react";
import { formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_COMBOS = [
  {
    id: "c1",
    title: "El Clásico Refrescante",
    tagline: "Malteada + Agua",
    badgeText: "⚡ Más pedido",
    bg: "linear-gradient(160deg, #7B1340 0%, #C2185B 100%)",
    items: [
      { fallbackName: "Fresa Gourmet", category: "malteadas", price: 19900, emoji: "🥤" },
      { fallbackName: "Agua Botella Pequeña", category: "bebidas", price: 2500, emoji: "💧" },
    ],
  },
  {
    id: "c2",
    title: "Cookie & Malteada",
    tagline: "Galleta Cookies + Malteada Choco",
    badgeText: "💛 Favorito",
    bg: "linear-gradient(160deg, #4A148C 0%, #7B1FA2 100%)",
    items: [
      { fallbackName: "Galleta Cookies and Cream", category: "galletas", price: 12900, emoji: "🍪" },
      { fallbackName: "Chocolate Gourmet", category: "malteadas", price: 19900, emoji: "🥤" },
    ],
  },
  {
    id: "c3",
    title: "Brownie Power",
    tagline: "Brownie c/Helado + Malteada",
    badgeText: "🌟 Top combo",
    bg: "linear-gradient(160deg, #1B5E20 0%, #388E3C 100%)",
    items: [
      { fallbackName: "Brownie con Helado", category: "especialidades", price: 14900, emoji: "🍫" },
      { fallbackName: "Brownie", category: "malteadas", price: 19900, emoji: "🥤" },
    ],
  },
  {
    id: "c4",
    title: "Maxi Cono + Gaseosa",
    tagline: "Grande + Bebida refrescante",
    badgeText: "✨ Recomendado",
    bg: "linear-gradient(160deg, #0D47A1 0%, #1976D2 100%)",
    items: [
      { fallbackName: "Maxi Cono", category: "helados", price: 14900, emoji: "🍦" },
      { fallbackName: "Gaseosa", category: "bebidas", price: 4900, emoji: "🥤" },
    ],
  },
  {
    id: "c5",
    title: "Banana Split + Agua",
    tagline: "Especialidad icónica Popsy",
    badgeText: "🍌 Icónico",
    bg: "linear-gradient(160deg, #E65100 0%, #FF8F00 100%)",
    items: [
      { fallbackName: "Banana Split", category: "especialidades", price: 17900, emoji: "🍌" },
      { fallbackName: "Agua Botella Pequeña", category: "bebidas", price: 2500, emoji: "💧" },
    ],
  },
  {
    id: "c6",
    title: "Sundae + Galleta Choco",
    tagline: "Doble sabor, doble felicidad",
    badgeText: "🎉 Especial",
    bg: "linear-gradient(160deg, #880E4F 0%, #C2185B 100%)",
    items: [
      { fallbackName: "Sundae 2 Sabores", category: "especialidades", price: 14900, emoji: "🍨" },
      { fallbackName: "Galleta Triple Choco", category: "galletas", price: 12900, emoji: "🍪" },
    ],
  },
  {
    id: "c7",
    title: "Arequipe + Pistacho",
    tagline: "Malteada Arequipe + Galleta",
    badgeText: "💫 Premium",
    bg: "linear-gradient(160deg, #004D40 0%, #00897B 100%)",
    items: [
      { fallbackName: "Arequipe Gourmet", category: "malteadas", price: 19900, emoji: "🥤" },
      { fallbackName: "Galleta Pistacho", category: "galletas", price: 14900, emoji: "🍪" },
    ],
  },
  {
    id: "c8",
    title: "Helado Clásico + Agua",
    tagline: "2 sabores + Botella grande",
    badgeText: "❤️ Básico ideal",
    bg: "linear-gradient(160deg, #3E2723 0%, #6D4C41 100%)",
    items: [
      { fallbackName: "Helado 2 Sabores", category: "helados", price: 9900, emoji: "🍦" },
      { fallbackName: "Agua Botella Grande", category: "bebidas", price: 5900, emoji: "💧" },
    ],
  },
];

function findProduct(products, item) {
  if (!products) return null;
  return products.find(
    p => p.name.toLowerCase().includes(item.fallbackName.toLowerCase()) &&
      p.category === item.category &&
      p.is_available !== false
  ) || null;
}

// Imagen compuesta: muestra las 2 fotos de los productos superpuestas
function ComboImage({ realItems, combo }) {
  const imgs = realItems.map(p => p?.image_url).filter(Boolean);

  if (imgs.length === 0) {
    // Solo emojis si no hay fotos
    return (
      <div style={{ width: "100%", height: 110, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {combo.items.map((item, i) => (
          <span key={i} style={{ fontSize: 44 }}>{item.emoji}</span>
        ))}
      </div>
    );
  }

  if (imgs.length === 1) {
    return (
      <div style={{ width: "100%", height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={imgs[0]} alt="" style={{ height: 100, width: 100, objectFit: "contain", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))" }} />
      </div>
    );
  }

  // 2 imágenes: la segunda más pequeña y desplazada
  return (
    <div style={{ width: "100%", height: 110, position: "relative" }}>
      {/* Imagen 1 — izquierda/centro */}
      <img
        src={imgs[0]}
        alt=""
        style={{
          position: "absolute",
          left: "10%",
          bottom: 0,
          height: 100,
          width: 100,
          objectFit: "contain",
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.4))",
          zIndex: 2,
        }}
      />
      {/* Imagen 2 — derecha, algo más pequeña y elevada */}
      <img
        src={imgs[1]}
        alt=""
        style={{
          position: "absolute",
          right: "4%",
          bottom: 8,
          height: 75,
          width: 75,
          objectFit: "contain",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
          zIndex: 1,
          opacity: 0.92,
        }}
      />
    </div>
  );
}

function ComboCard({ combo, products, onAddMultiple }) {
  const [added, setAdded] = useState(false);
  const realItems = combo.items.map(item => findProduct(products, item));
  const totalReal = realItems.reduce((sum, p, i) => sum + (p ? p.price : combo.items[i].price), 0);

  const handleClick = () => {
    realItems.forEach(p => { if (p) onAddMultiple(p); });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      style={{
        flexShrink: 0,
        width: 200,
        borderRadius: 24,
        background: combo.bg,
        border: "none",
        cursor: "pointer",
        padding: "12px 14px 14px",
        textAlign: "left",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
      }}
    >
      {/* Círculos decorativos */}
      <div style={{ position: "absolute", top: -25, right: -25, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -30, left: -15, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

      {/* Badge */}
      <span style={{
        alignSelf: "flex-start", fontSize: 9, fontWeight: 800, color: "#fff",
        background: "rgba(0,0,0,0.28)", borderRadius: 20, padding: "3px 9px",
        backdropFilter: "blur(4px)", position: "relative", zIndex: 3,
      }}>
        {combo.badgeText}
      </span>

      {/* Imagen compuesta de los productos reales */}
      <ComboImage realItems={realItems} combo={combo} />

      {/* Título y tagline */}
      <p style={{ fontSize: 13, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.25 }}>
        {combo.title}
      </p>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.72)", margin: 0, lineHeight: 1.3 }}>
        {combo.tagline}
      </p>

      {/* Footer precio + botón */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
        <div>
          <p style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", margin: 0 }}>total combo</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1 }}>
            {formatCOP(totalReal)}
          </p>
        </div>
        <AnimatePresence mode="wait">
          {added ? (
            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#333" }}>
              ✓
            </motion.div>
          ) : (
            <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.45)" }}>
              <ShoppingCart size={15} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

// Carrusel automático lento
export default function QuickCombos({ products, onAddMultiple }) {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const animRef = useRef(null);
  const pausedRef = useRef(false);
  const dragRef = useRef({ isDragging: false, startX: 0, startPos: 0 });

  const CARD_WIDTH = 212; // 200px card + 12px gap
  const total = QUICK_COMBOS.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!pausedRef.current && !dragRef.current.isDragging) {
        posRef.current += 0.4; // velocidad lenta tipo carrusel
        if (posRef.current >= CARD_WIDTH * total) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [total]);

  // Drag / touch
  const onMouseDown = (e) => {
    dragRef.current = { isDragging: true, startX: e.clientX, startPos: posRef.current };
    pausedRef.current = true;
  };
  const onMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const diff = dragRef.current.startX - e.clientX;
    posRef.current = Math.max(0, dragRef.current.startPos + diff);
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
  };
  const onMouseUp = () => { dragRef.current.isDragging = false; pausedRef.current = false; };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => { document.removeEventListener("mousemove", onMouseMove); document.removeEventListener("mouseup", onMouseUp); };
  }, []);

  if (!products || products.length === 0) return null;

  // Duplicamos los combos para loop infinito
  const doubled = [...QUICK_COMBOS, ...QUICK_COMBOS];

  return (
    <div style={{ background: "#fff", marginTop: 10 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #B5175A, #E91E8C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={14} color="#fff" />
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: 0 }}>Arma tu combo</p>
        </div>
        <span style={{ fontSize: 11, color: "#BBA8B0", fontWeight: 500 }}>1 clic y listo</span>
      </div>
      <p style={{ fontSize: 12, color: "#BBA8B0", margin: "2px 16px 12px", lineHeight: 1.4 }}>
        Combos pensados para llevar más 🎯
      </p>

      {/* Carrusel automático */}
      <div
        style={{ overflow: "hidden", paddingBottom: 16, cursor: "grab" }}
        onMouseDown={onMouseDown}
        onTouchStart={(e) => { pausedRef.current = true; dragRef.current = { isDragging: true, startX: e.touches[0].clientX, startPos: posRef.current }; }}
        onTouchMove={(e) => { const diff = dragRef.current.startX - e.touches[0].clientX; posRef.current = Math.max(0, dragRef.current.startPos + diff); if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`; }}
        onTouchEnd={() => { dragRef.current.isDragging = false; pausedRef.current = false; }}
      >
        <div
          ref={trackRef}
          style={{ display: "flex", gap: 12, paddingLeft: 16, paddingRight: 16, width: "max-content" }}
        >
          {doubled.map((combo, i) => (
            <ComboCard
              key={`${combo.id}-${i}`}
              combo={combo}
              products={products}
              onAddMultiple={onAddMultiple}
            />
          ))}
        </div>
      </div>
    </div>
  );
}