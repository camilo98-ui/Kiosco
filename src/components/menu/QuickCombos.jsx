import React, { useState, useEffect, useRef } from "react";
import { Zap, ShoppingCart } from "lucide-react";
import { formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_COMBOS = [
  {
    id: "c1",
    title: "Banana Split + Malteada",
    tagline: "Especialidad icónica Popsy",
    badgeText: "🍌 Icónico",
    bg: "linear-gradient(160deg, #FFE0B2 0%, #FFF3E0 100%)",
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/103909990_b92afaf3f13c522e822bec1847b69a0d.png",
    price: 37800,
    items: [
      { fallbackName: "Banana Split", category: "especialidades", price: 19900, emoji: "🍌" },
      { fallbackName: "Malteada", category: "malteadas", price: 19900, emoji: "🥤" },
    ],
  },
  {
    id: "c2",
    title: "Cookie & Malteada",
    tagline: "Galleta Cookies + Malteada Choco",
    badgeText: "💛 Favorito",
    bg: "linear-gradient(160deg, #E1BEE7 0%, #EDE7F6 100%)",
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
    bg: "linear-gradient(160deg, #C8E6C9 0%, #E8F5E9 100%)",
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
    bg: "linear-gradient(160deg, #BBDEFB 0%, #E3F2FD 100%)",
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
    bg: "linear-gradient(160deg, #FFE0B2 0%, #FFF3E0 100%)",
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
    bg: "linear-gradient(160deg, #F8BBD9 0%, #FFF0F5 100%)",
    items: [
      { fallbackName: "Sundae 2 Sabores", category: "especialidades", price: 14900, emoji: "🍨" },
      { fallbackName: "Galleta Triple Choco", category: "galletas", price: 12900, emoji: "🍪" },
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

function ComboImage({ realItems, combo }) {
  // Si el combo tiene una imagen personalizada, mostrarla primero
  if (combo.image) {
    return (
      <img src={combo.image} alt={combo.title} style={{ width: "100%", height: "auto", objectFit: "cover", mixBlendMode: "multiply", marginLeft: "-16px", marginRight: "-16px", marginTop: "-6px" }} />
    );
  }

  const imgs = realItems.map(p => p?.image_url).filter(Boolean);

  if (imgs.length === 0) {
    return (
      <div style={{ width: "100%", height: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {combo.items.map((item, i) => (
          <span key={i} style={{ fontSize: 52 }}>{item.emoji}</span>
        ))}
      </div>
    );
  }

  if (imgs.length === 1) {
    return (
      <div style={{ width: "100%", height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={imgs[0]} alt="" style={{ height: 110, width: 110, objectFit: "contain", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))" }} />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 120, position: "relative" }}>
      <img src={imgs[0]} alt="" style={{ position: "absolute", left: "10%", bottom: 0, height: 110, width: 110, objectFit: "contain", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.4))", zIndex: 2 }} />
      <img src={imgs[1]} alt="" style={{ position: "absolute", right: "4%", bottom: 10, height: 80, width: 80, objectFit: "contain", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))", zIndex: 1, opacity: 0.92 }} />
    </div>
  );
}

function ComboCard({ combo, products, onAddMultiple }) {
  const [added, setAdded] = useState(false);
  const realItems = combo.items.map(item => findProduct(products, item));
  const totalReal = combo.price || realItems.reduce((sum, p, i) => sum + (p ? p.price : combo.items[i].price), 0);

  const handleClick = () => {
    realItems.forEach(p => { if (p) onAddMultiple(p); });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      onClick={handleClick}
      style={{
        borderRadius: 24,
        background: combo.bg,
        cursor: "pointer",
        padding: "14px 16px 16px",
        textAlign: "left",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Badge */}
      <span style={{ alignSelf: "flex-start", fontSize: 9, fontWeight: 800, color: "#C2185B", background: "rgba(194,24,91,0.12)", borderRadius: 20, padding: "3px 9px", position: "relative", zIndex: 3 }}>
        {combo.badgeText}
      </span>

      <ComboImage realItems={realItems} combo={combo} />

      {/* Título y tagline */}
      <p style={{ fontSize: 15, fontWeight: 900, color: "#1A0A10", margin: 0, lineHeight: 1.25 }}>{combo.title}</p>
      <p style={{ fontSize: 11, color: "#9A7880", margin: 0, lineHeight: 1.3 }}>{combo.tagline}</p>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
        <div>
          <p style={{ fontSize: 9, color: "#BBA8B0", margin: 0 }}>total combo</p>
          <p style={{ fontSize: 20, fontWeight: 900, color: "#C2185B", margin: 0, lineHeight: 1 }}>{formatCOP(totalReal)}</p>
        </div>
        <AnimatePresence mode="wait">
          {added ? (
            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#C2185B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff" }}>
              ✓
            </motion.div>
          ) : (
            <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#C2185B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingCart size={17} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function QuickCombos({ products, onAddMultiple }) {
  const [active, setActive] = useState(0);
  const startX = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % QUICK_COMBOS.length);
    }, 3000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => { setActive(i); startTimer(); };

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) goTo((active + 1) % QUICK_COMBOS.length);
    else if (diff < -40) goTo((active - 1 + QUICK_COMBOS.length) % QUICK_COMBOS.length);
    startX.current = null;
  };

  if (!products || products.length === 0) return null;

  const combo = QUICK_COMBOS[active];

  return (
    <div style={{ background: "#fff", marginTop: 10 }}>


      <AnimatePresence mode="wait">
        <motion.div
          key={combo.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ padding: "10px 16px 0" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ComboCard combo={combo} products={products} onAddMultiple={onAddMultiple} />
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "10px 0 16px" }}>
        {QUICK_COMBOS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 4,
              width: i === active ? 14 : 4,
              borderRadius: 4,
              background: i === active ? "#C2185B" : "#EDD8E4",
              transition: "all 0.25s ease",
              border: "none",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}