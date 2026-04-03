import React, { useState } from "react";
import { Zap, ShoppingCart, ChevronRight } from "lucide-react";
import { formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

// Combos con nombres EXACTOS del catálogo real
// Cada item tiene: productName (exacto), price, emoji
const QUICK_COMBOS = [
  {
    id: "c1",
    title: "El Clásico Refrescante",
    tagline: "Lo que todos piden 🔥",
    badgeText: "⚡ Más pedido",
    badgeColor: "#B5175A",
    bg: "linear-gradient(135deg, #6D1B4E 0%, #B5175A 100%)",
    textColor: "#fff",
    items: [
      { productName: "Malteada Fresa Gourmet", fallbackName: "Fresa Gourmet", category: "malteadas", price: 19900, emoji: "🥤" },
      { productName: "Agua Botella Pequeña", fallbackName: "Agua Botella Pequeña", category: "bebidas", price: 2500, emoji: "💧" },
    ],
    savingsText: "Combo perfecto · $22.400",
  },
  {
    id: "c2",
    title: "Cookie & Malteada",
    tagline: "Galleta + Malteada soñada 🍪",
    badgeText: "💛 Favorito",
    badgeColor: "#E65100",
    bg: "linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)",
    textColor: "#fff",
    items: [
      { productName: "Galleta Cookies and Cream", fallbackName: "Galleta Cookies and Cream", category: "galletas", price: 12900, emoji: "🍪" },
      { productName: "Malteada Chocolate Gourmet", fallbackName: "Chocolate Gourmet", category: "malteadas", price: 19900, emoji: "🥤" },
    ],
    savingsText: "Dulce total · $32.800",
  },
  {
    id: "c3",
    title: "Brownie Power",
    tagline: "Especialidad + Malteada 🌟",
    badgeText: "🌟 Top combo",
    badgeColor: "#2E7D32",
    bg: "linear-gradient(135deg, #1B5E20 0%, #388E3C 100%)",
    textColor: "#fff",
    items: [
      { productName: "Brownie con Helado", fallbackName: "Brownie con Helado", category: "especialidades", price: 14900, emoji: "🍫" },
      { productName: "Malteada Brownie", fallbackName: "Brownie", category: "malteadas", price: 19900, emoji: "🥤" },
    ],
    savingsText: "Intenso y delicioso · $34.800",
  },
  {
    id: "c4",
    title: "Maxi Cono + Refrescante",
    tagline: "El grande con bebida 🍦",
    badgeText: "✨ Recomendado",
    badgeColor: "#1565C0",
    bg: "linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)",
    textColor: "#fff",
    items: [
      { productName: "Maxi Cono", fallbackName: "Maxi Cono", category: "helados", price: 14900, emoji: "🍦" },
      { productName: "Gaseosa", fallbackName: "Gaseosa", category: "bebidas", price: 4900, emoji: "🥤" },
    ],
    savingsText: "Grande y refrescante · $19.800",
  },
  {
    id: "c5",
    title: "Banana Split + Agua",
    tagline: "Especialidad icónica 🍌",
    badgeText: "🍌 Icónico",
    badgeColor: "#F57F17",
    bg: "linear-gradient(135deg, #E65100 0%, #FF8F00 100%)",
    textColor: "#fff",
    items: [
      { productName: "Banana Split", fallbackName: "Banana Split", category: "especialidades", price: 17900, emoji: "🍌" },
      { productName: "Agua Botella Pequeña", fallbackName: "Agua Botella Pequeña", category: "bebidas", price: 2500, emoji: "💧" },
    ],
    savingsText: "Clásico gourmet · $20.400",
  },
  {
    id: "c6",
    title: "Sundae Doble + Galleta",
    tagline: "Doble felicidad 🎉",
    badgeText: "🎉 Especial",
    badgeColor: "#6A1B9A",
    bg: "linear-gradient(135deg, #880E4F 0%, #C2185B 100%)",
    textColor: "#fff",
    items: [
      { productName: "Sundae 2 Sabores", fallbackName: "Sundae 2 Sabores", category: "especialidades", price: 14900, emoji: "🍨" },
      { productName: "Galleta Triple Choco", fallbackName: "Galleta Triple Choco", category: "galletas", price: 12900, emoji: "🍪" },
    ],
    savingsText: "Para compartir · $27.800",
  },
  {
    id: "c7",
    title: "Malteada + Galletita",
    tagline: "El dúo perfecto 🍪🥤",
    badgeText: "💫 Nuevo",
    badgeColor: "#00695C",
    bg: "linear-gradient(135deg, #004D40 0%, #00897B 100%)",
    textColor: "#fff",
    items: [
      { productName: "Malteada Arequipe Gourmet", fallbackName: "Arequipe Gourmet", category: "malteadas", price: 19900, emoji: "🥤" },
      { productName: "Galleta Pistacho", fallbackName: "Galleta Pistacho", category: "galletas", price: 14900, emoji: "🍪" },
    ],
    savingsText: "Sabores únicos · $34.800",
  },
  {
    id: "c8",
    title: "Helado 2 Sabores + Agua",
    tagline: "Clásico Popsy sin falla 🍦",
    badgeText: "❤️ Básico ideal",
    badgeColor: "#C62828",
    bg: "linear-gradient(135deg, #3E2723 0%, #6D4C41 100%)",
    textColor: "#fff",
    items: [
      { productName: "Helado 2 Sabores", fallbackName: "Helado 2 Sabores", category: "helados", price: 9900, emoji: "🍦" },
      { productName: "Agua Botella Grande", fallbackName: "Agua Botella Grande", category: "bebidas", price: 5900, emoji: "💧" },
    ],
    savingsText: "Simple y rico · $15.800",
  },
];

// Busca el producto real o devuelve un producto simulado
function findProduct(products, item) {
  if (!products) return null;
  // Intenta nombre exacto primero
  let found = products.find(p =>
    p.name.toLowerCase() === item.productName.toLowerCase() && p.is_available !== false
  );
  // Si no, busca por nombre del fallback (sin "Malteada " al inicio)
  if (!found) {
    found = products.find(p =>
      p.name.toLowerCase().includes(item.fallbackName.toLowerCase()) &&
      p.category === item.category &&
      p.is_available !== false
    );
  }
  return found || null;
}

function ComboCard({ combo, products, onAddMultiple }) {
  const [added, setAdded] = useState(false);

  const realItems = combo.items.map(item => findProduct(products, item));
  const totalReal = realItems.reduce((sum, p, i) =>
    sum + (p ? p.price : combo.items[i].price), 0
  );

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
        borderRadius: 22,
        background: combo.bg,
        border: "none",
        cursor: "pointer",
        padding: "16px 14px 14px",
        textAlign: "left",
        position: "relative",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      }}
    >
      {/* Círculo decorativo de fondo */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: -30, left: -10, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

      {/* Badge */}
      <span style={{
        alignSelf: "flex-start",
        fontSize: 9, fontWeight: 800, color: "#fff",
        background: "rgba(0,0,0,0.25)",
        borderRadius: 20, padding: "3px 8px",
        backdropFilter: "blur(4px)",
      }}>
        {combo.badgeText}
      </span>

      {/* Emojis de items */}
      <div style={{ display: "flex", gap: 4, fontSize: 26, lineHeight: 1 }}>
        {combo.items.map((item, i) => (
          <span key={i}>{item.emoji}</span>
        ))}
      </div>

      {/* Título */}
      <div>
        <p style={{ fontSize: 14, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.25 }}>
          {combo.title}
        </p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", margin: "3px 0 0", lineHeight: 1.3 }}>
          {combo.tagline}
        </p>
      </div>

      {/* Items del combo */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {combo.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.6)", flexShrink: 0 }} />
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.2 }}>
              {item.fallbackName}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
        <div>
          <p style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", margin: 0 }}>total combo</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1 }}>
            {formatCOP(totalReal)}
          </p>
        </div>
        <AnimatePresence mode="wait">
          {added ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}
            >
              ✓
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid rgba(255,255,255,0.5)",
              }}
            >
              <ShoppingCart size={15} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

export default function QuickCombos({ products, onAddMultiple }) {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ background: "#fff", marginTop: 10 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #B5175A, #E91E8C)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={14} color="#fff" />
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: 0 }}>Arma tu combo</p>
        </div>
        <span style={{ fontSize: 11, color: "#BBA8B0", fontWeight: 500 }}>1 clic y listo</span>
      </div>
      <p style={{ fontSize: 12, color: "#BBA8B0", margin: "2px 16px 12px", lineHeight: 1.4 }}>
        Combos pensados para llevar más por menos 🎯
      </p>

      {/* Scroll horizontal */}
      <div style={{
        display: "flex",
        overflowX: "auto",
        gap: 12,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
        scrollbarWidth: "none",
        scrollSnapType: "x mandatory",
      }}>
        {QUICK_COMBOS.map((combo) => (
          <ComboCard
            key={combo.id}
            combo={combo}
            products={products}
            onAddMultiple={onAddMultiple}
          />
        ))}
      </div>
    </div>
  );
}