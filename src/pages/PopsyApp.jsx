import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, ChevronLeft, ChevronRight, Plus, Check, MapPin } from "lucide-react";

// ── Fonts ────────────────────────────────────────────────────────────
const SYNE = '"Syne", sans-serif';
const INTER = '"Inter", sans-serif';

// ── Theme ────────────────────────────────────────────────────────────
const BG = "#0D0D0D";
const CARD = "#1A1A1A";
const ACCENT = "#E8004D";
const BORDER = "#2A2A2A";

function formatCOP(n) {
  return "$" + n.toLocaleString("es-CO");
}

// ── Data ─────────────────────────────────────────────────────────────
export const FAMILIES = [
  {
    key: "combos",
    name: "Combos",
    emoji: "🎁",
    gradient: "linear-gradient(135deg, #0A3A1A, #2ECC71)",
    products: [
      { name: "Pareja Premium", desc: "2 conos triple + 2 malteadas XL + postre sorpresa", price: 54900, oldPrice: 68000, emoji: "💑", badge: "Más vendido" },
      { name: "Cumpleaños", desc: "Torta de helado + 4 conos dobles + decoración", price: 42900, emoji: "🎂" },
      { name: "Familiar", desc: "6 conos dobles + 2 malteadas familiares", price: 38900, oldPrice: 46000, emoji: "👨‍👩‍👧‍👦" },
      { name: "Doble o Nada", desc: "2 bolas gourmet a elegir con topping premium", price: 8400, oldPrice: 9900, emoji: "🍦", badge: "Oferta" },
    ],
  },
  {
    key: "helados",
    name: "Helados",
    emoji: "🍨",
    gradient: "linear-gradient(135deg, #1A0A10, #8B1A4A)",
    products: [
      { name: "Copa Gourmet", desc: "4 bolas premium + toppings + salsa artesanal", price: 32900, emoji: "🍨", badge: "Top" },
      { name: "Brownie", desc: "Brownie tibio + 2 bolas + salsa de chocolate", price: 21900, emoji: "🍫" },
      { name: "2 Sabores", desc: "Dos bolas del sabor que elijas en copa", price: 13900, emoji: "🍧" },
      { name: "1 Sabor", desc: "Una bola gourmet en copa individual", price: 7500, emoji: "🍦" },
    ],
  },
  {
    key: "especialidades",
    name: "Especialidades",
    emoji: "✨",
    gradient: "linear-gradient(135deg, #1A0A40, #6B3FA0)",
    products: [
      { name: "Fondue Chocolate", desc: "Chocolate belga derretido + frutas + helado", price: 38900, emoji: "🍫", badge: "Signature" },
      { name: "Sundae Deluxe", desc: "Helado, brownie, caramelo, nueces y crema", price: 27900, oldPrice: 32000, emoji: "⭐" },
      { name: "Crepes", desc: "Crepes rellenos de helado con salsas gourmet", price: 19900, emoji: "🫔" },
    ],
  },
  {
    key: "cookie",
    name: "Cookie Jar",
    emoji: "🍪",
    gradient: "linear-gradient(135deg, #5C3A1E, #C47B3E)",
    products: [
      { name: "Supremo", desc: "Cookie artesanal gigante + 3 bolas premium", price: 22900, oldPrice: 26000, emoji: "🍪", badge: "Popular" },
      { name: "Nutella", desc: "Cookie con Nutella + 2 bolas vainilla", price: 18900, emoji: "🤎" },
      { name: "Clásico", desc: "Cookie chocolate chip + 1 bola a elegir", price: 12900, emoji: "🍪" },
    ],
  },
  {
    key: "malteadas",
    name: "Malteadas",
    emoji: "🥤",
    gradient: "linear-gradient(135deg, #8B0029, #E8004D, #FF6B9D)",
    products: [
      { name: "Oreo XL", desc: "Malteada extra grande con Oreo triturado", price: 24900, oldPrice: 28000, emoji: "🥤", badge: "Favorita" },
      { name: "Tres Leches", desc: "Malteada cremosa sabor tres leches artesanal", price: 19900, emoji: "🥛" },
      { name: "Frutos Rojos", desc: "Mix de fresas, frambuesas y moras naturales", price: 17500, emoji: "🍓" },
      { name: "Chocolatísima", desc: "Doble chocolate belga con chips de cacao", price: 15900, emoji: "🍫" },
      { name: "Vainilla", desc: "Clásica malteada de vainilla francesa", price: 12900, emoji: "🍦" },
    ],
  },
  {
    key: "conos",
    name: "Conos",
    emoji: "🍦",
    gradient: "linear-gradient(135deg, #B8430A, #FF8C42)",
    products: [
      { name: "Triple Gourmet", desc: "3 bolas premium + topping + salsa artesanal", price: 18900, emoji: "🍦", badge: "Top" },
      { name: "Waffle Artesanal", desc: "Cono waffle hecho a mano + 2 bolas gourmet", price: 15500, emoji: "🧇" },
      { name: "Doble", desc: "2 bolas a elegir en cono crujiente", price: 11900, emoji: "🍦" },
      { name: "Simple", desc: "1 bola gourmet en cono artesanal", price: 7500, emoji: "🍦" },
    ],
  },
  {
    key: "cafe",
    name: "Café",
    emoji: "☕",
    gradient: "linear-gradient(135deg, #1A0F00, #7B4F1A)",
    products: [
      { name: "Frappé Caramel", desc: "Café frío, caramelo y crema batida premium", price: 17900, emoji: "☕", badge: "Nuevo" },
      { name: "Café Irlandés", desc: "Espresso, whisky irlandés y nata batida", price: 14900, emoji: "🥃" },
      { name: "Cappuccino Frío", desc: "Cappuccino helado con espuma de leche", price: 9900, emoji: "🧊" },
    ],
  },
];

const CATEGORIES = [
  { id: "malteadas", label: "Malteadas", emoji: "🥤", bg: "#2A1A2E" },
  { id: "conos",     label: "Conos",     emoji: "🍦", bg: "#2A1A0A" },
  { id: "cookie",    label: "Cookie Jar",emoji: "🍪", bg: "#2A1A0A" },
  { id: "helados",   label: "Helados",   emoji: "🍨", bg: "#1A0A1A" },
  { id: "especialidades", label: "Especiales", emoji: "✨", bg: "#120A2A" },
  { id: "cafe",      label: "Café",      emoji: "☕", bg: "#1A0F00" },
  { id: "combos",    label: "Combos",    emoji: "🎁", bg: "#0A1A0A" },
];

// ── Logo ─────────────────────────────────────────────────────────────
function PopsyLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, background: ACCENT,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <MapPin size={16} color="#fff" fill="#fff" />
      </div>
      <span style={{ fontFamily: SYNE, fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
        Pop<span style={{ color: ACCENT }}>sy</span>
      </span>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────
function AppHeader({ cartCount, onSearchClick, onCartClick }) {
  return (
    <div style={{ background: BG, padding: "14px 16px 0", position: "sticky", top: 0, zIndex: 50 }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <PopsyLogo />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onSearchClick} style={{ width: 36, height: 36, borderRadius: "50%", background: "#222", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Search size={15} color="#fff" />
          </button>
          <button onClick={onCartClick} style={{ width: 36, height: 36, borderRadius: "50%", background: "#222", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
            <ShoppingBag size={15} color="#fff" />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: ACCENT, border: "1.5px solid #0D0D0D" }} />
            )}
          </button>
        </div>
      </div>
      {/* Search bar */}
      <div style={{ background: "#1E1E1E", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Search size={13} color="#555" />
        <span style={{ fontFamily: INTER, fontSize: 13, color: "#555" }}>Busca tu helado favorito...</span>
      </div>
      {/* Delivery strip */}
      <div style={{ background: CARD, borderRadius: 12, padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: INTER, fontSize: 12, color: "#ccc", fontWeight: 500 }}>25–35 min · Bogotá</span>
        </div>
        <span style={{ fontFamily: INTER, fontSize: 11, color: "#aaa", fontWeight: 600, background: "#242424", borderRadius: 20, padding: "3px 10px" }}>🛵 Domicilio gratis</span>
      </div>
    </div>
  );
}

// ── Hero Banner ───────────────────────────────────────────────────────
function HeroBanner({ onOfferClick }) {
  return (
    <div
      onClick={onOfferClick}
      style={{
        margin: "0 16px 20px",
        borderRadius: 22,
        overflow: "hidden",
        background: "linear-gradient(135deg, #8B0029, #E8004D, #FF6B9D)",
        position: "relative",
        height: 170,
        cursor: "pointer",
      }}
    >
      {/* Overlay with ice cream image */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.35 }} />
      <div style={{ position: "relative", zIndex: 1, padding: "18px 18px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <span style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, background: ACCENT, color: "#fff", borderRadius: 20, padding: "3px 10px", alignSelf: "flex-start", letterSpacing: "0.5px" }}>⚡ OFERTA DEL DÍA</span>
        <div>
          <p style={{ fontFamily: SYNE, fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1 }}>¡Doble o Nada!</p>
          <p style={{ fontFamily: INTER, fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "4px 0 0" }}>2 bolas gourmet · Antes $9.900</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={{ background: "#fff", color: "#0D0D0D", border: "none", borderRadius: 20, padding: "8px 16px", fontFamily: INTER, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Ver oferta →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Category Chips ────────────────────────────────────────────────────
function CategoryChips({ active, onSelect }) {
  return (
    <div style={{ padding: "0 16px 20px" }}>
      <p style={{ fontFamily: SYNE, fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 12, marginTop: 0 }}>Categorías</p>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: cat.bg,
                border: isActive ? `2px solid ${ACCENT}` : `2px solid transparent`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
                transition: "all 0.15s ease",
              }}>
                {cat.emoji}
              </div>
              <span style={{ fontFamily: INTER, fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? ACCENT : "#888", whiteSpace: "nowrap" }}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Family Carousel ───────────────────────────────────────────────────
function FamilyCarousel({ onSelect }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 12 }}>
        <p style={{ fontFamily: SYNE, fontSize: 17, fontWeight: 800, color: "#fff", margin: 0 }}>Explorar familias</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: INTER, fontSize: 12, fontWeight: 600, color: ACCENT }}>Ver todo</button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none", paddingLeft: 16, paddingRight: 16, paddingBottom: 4 }}>
        {FAMILIES.map((fam) => (
          <motion.button
            key={fam.key}
            onClick={() => onSelect(fam)}
            whileTap={{ scale: 0.96 }}
            style={{
              flexShrink: 0,
              width: 150, height: 110,
              borderRadius: 18,
              background: fam.gradient,
              border: "none",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              padding: "0 0 12px 12px",
            }}
          >
            {/* Dark overlay top→bottom */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
            {/* Arrow */}
            <div style={{ position: "absolute", top: 10, right: 10, width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={13} color="#fff" />
            </div>
            <div style={{ position: "relative", zIndex: 1, textAlign: "left" }}>
              <p style={{ fontFamily: SYNE, fontSize: 13, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>{fam.name}</p>
              <p style={{ fontFamily: INTER, fontSize: 10, color: "rgba(255,255,255,0.65)", margin: 0 }}>{fam.products.length} opciones</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── Most Ordered ──────────────────────────────────────────────────────
function MostOrdered({ onFamilySelect }) {
  const topItems = FAMILIES.flatMap((fam) =>
    fam.products.slice(0, 1).map((p) => ({ ...p, family: fam }))
  ).sort((a, b) => b.price - a.price).slice(0, 6);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontFamily: SYNE, fontSize: 17, fontWeight: 800, color: "#fff", margin: 0 }}>Lo más pedido</p>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: INTER, fontSize: 12, fontWeight: 600, color: ACCENT }}>Ver todo</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {topItems.map((item, i) => (
          <motion.button
            key={i}
            onClick={() => onFamilySelect(item.family)}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 0,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
              textAlign: "left",
            }}
          >
            {/* Thumbnail */}
            <div style={{ width: 80, height: 72, flexShrink: 0, background: item.family.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
              {item.emoji}
            </div>
            {/* Info */}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: INTER, fontSize: 13, fontWeight: 700, color: "#0D0D0D", margin: 0, lineHeight: 1.3 }}>{item.name}</p>
              <p style={{ fontFamily: INTER, fontSize: 11, color: "#888", margin: "2px 0 0" }}>{item.family.name} · desde {formatCOP(item.price)}</p>
            </div>
            <ChevronRight size={16} color="#ccc" style={{ flexShrink: 0, marginRight: 12 }} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────
function HomeScreen({ onFamilySelect }) {
  const [activeCategory, setActiveCategory] = useState("malteadas");

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    const fam = FAMILIES.find((f) => f.key === id);
    if (fam) onFamilySelect(fam);
  };

  const handleOfferClick = () => {
    const combos = FAMILIES.find((f) => f.key === "combos");
    if (combos) onFamilySelect(combos);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <HeroBanner onOfferClick={handleOfferClick} />
      <CategoryChips active={activeCategory} onSelect={handleCategorySelect} />
      <FamilyCarousel onSelect={onFamilySelect} />
      <MostOrdered onFamilySelect={onFamilySelect} />
    </motion.div>
  );
}

// ── Filter Chip ───────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: "7px 16px",
        borderRadius: 20,
        border: `1px solid ${active ? "#fff" : "rgba(255,255,255,0.2)"}`,
        background: active ? "#fff" : "rgba(255,255,255,0.08)",
        color: active ? ACCENT : "#ccc",
        fontFamily: INTER,
        fontSize: 12,
        fontWeight: active ? 700 : 400,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

// ── Hero Product Card ─────────────────────────────────────────────────
function HeroProductCard({ product, family, onAdd, added }) {
  return (
    <motion.div
      style={{
        margin: "0 16px 14px",
        borderRadius: 22,
        overflow: "hidden",
        background: family.gradient,
        position: "relative",
        padding: 20,
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.65))", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {product.badge && (
          <span style={{ background: ACCENT, color: "#fff", fontFamily: INTER, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "3px 10px", display: "inline-block", marginBottom: 10 }}>{product.badge}</span>
        )}
        <p style={{ fontFamily: SYNE, fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>{product.name}</p>
        <p style={{ fontFamily: INTER, fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "6px 0 0" }}>{product.desc}</p>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <div>
          <span style={{ fontFamily: SYNE, fontSize: 20, fontWeight: 800, color: "#fff" }}>{formatCOP(product.price)}</span>
          {product.oldPrice && <span style={{ fontFamily: INTER, fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "line-through", marginLeft: 7 }}>{formatCOP(product.oldPrice)}</span>}
        </div>
        <motion.button
          onClick={() => onAdd(product)}
          whileTap={{ scale: 0.9 }}
          style={{ background: added ? "#22C55E" : ACCENT, border: "none", borderRadius: 20, padding: "9px 18px", color: "#fff", fontFamily: INTER, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "background 0.2s" }}
        >
          {added ? <Check size={15} /> : <Plus size={15} />}
          {added ? "Agregado" : "Agregar +"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Regular Product Card ──────────────────────────────────────────────
function RegularProductCard({ product, family, onAdd, added }) {
  return (
    <motion.div
      style={{ background: CARD, borderRadius: 18, display: "flex", alignItems: "center", gap: 12, overflow: "hidden", margin: "0 16px 10px" }}
    >
      <div style={{ width: 72, height: 72, flexShrink: 0, background: family.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
        {product.emoji}
      </div>
      <div style={{ flex: 1, padding: "10px 0" }}>
        {product.badge && (
          <span style={{ background: "rgba(232,0,77,0.12)", color: ACCENT, fontFamily: INTER, fontSize: 9, fontWeight: 700, borderRadius: 20, padding: "2px 8px", display: "inline-block", marginBottom: 4 }}>{product.badge}</span>
        )}
        <p style={{ fontFamily: INTER, fontSize: 13, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontFamily: INTER, fontSize: 11, color: "#666", margin: "2px 0 0", lineHeight: 1.4 }}>{product.desc}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
          <span style={{ fontFamily: SYNE, fontSize: 14, fontWeight: 800, color: "#fff" }}>{formatCOP(product.price)}</span>
          {product.oldPrice && <span style={{ fontFamily: INTER, fontSize: 11, color: "#555", textDecoration: "line-through" }}>{formatCOP(product.oldPrice)}</span>}
        </div>
      </div>
      <motion.button
        onClick={() => onAdd(product)}
        whileTap={{ scale: 0.88 }}
        style={{ width: 34, height: 34, borderRadius: "50%", background: added ? "#22C55E" : ACCENT, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginRight: 12, transition: "background 0.2s" }}
      >
        {added ? <Check size={14} color="#fff" /> : <Plus size={14} color="#fff" />}
      </motion.button>
    </motion.div>
  );
}

// ── Catalog Screen ────────────────────────────────────────────────────
const FILTERS = ["Mayor precio", "Populares", "Novedades", "Sin azúcar"];

function CatalogScreen({ family, onBack, onAdd, addedMap }) {
  const [activeFilter, setActiveFilter] = useState("Mayor precio");
  const sorted = [...family.products].sort((a, b) => b.price - a.price);
  const [hero, ...rest] = sorted;

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.22 }}>
      {/* Hero bar */}
      <div style={{ background: family.gradient, padding: "14px 16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.92 }} style={{ width: 38, height: 38, borderRadius: "50%", background: "#1E1E1E", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ChevronLeft size={18} color="#fff" />
        </motion.button>
        <div>
          <p style={{ fontFamily: SYNE, fontSize: 20, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>{family.emoji} {family.name}</p>
          <p style={{ fontFamily: INTER, fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0 }}>{family.products.length} productos disponibles</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", padding: "14px 16px" }}>
        {FILTERS.map((f) => <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />)}
      </div>

      {/* Hero product */}
      {hero && <HeroProductCard product={hero} family={family} onAdd={onAdd} added={!!addedMap[hero.name]} />}

      {/* Rest */}
      <div style={{ paddingBottom: 100 }}>
        {rest.map((p) => <RegularProductCard key={p.name} product={p} family={family} onAdd={onAdd} added={!!addedMap[p.name]} />)}
      </div>
    </motion.div>
  );
}

// ── Cart Pill ─────────────────────────────────────────────────────────
function CartPill({ count, total }) {
  if (count === 0) return null;
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 32px)", maxWidth: 388,
        background: BG, border: `1px solid ${BORDER}`, borderRadius: 50,
        padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 100, cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: INTER, color: "#fff", fontSize: 13, fontWeight: 800 }}>{count}</span>
        </div>
        <span style={{ fontFamily: INTER, color: "#fff", fontSize: 14, fontWeight: 600 }}>Ver pedido</span>
      </div>
      <span style={{ fontFamily: SYNE, color: "#fff", fontSize: 16, fontWeight: 800 }}>{formatCOP(total)}</span>
    </motion.div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function PopsyApp() {
  const [screen, setScreen] = useState("home");
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [addedMap, setAddedMap] = useState({});

  const openFamily = (family) => { setSelectedFamily(family); setScreen("catalog"); };
  const goHome = () => { setScreen("home"); setSelectedFamily(null); };

  const addToCart = (product) => {
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + product.price);
    setAddedMap((m) => ({ ...m, [product.name]: true }));
    setTimeout(() => setAddedMap((m) => ({ ...m, [product.name]: false })), 700);
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ minHeight: "100vh", background: BG }}>
        <div style={{ maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: BG, position: "relative" }}>
          <AppHeader cartCount={cartCount} />
          <div style={{ overflowY: "auto" }}>
            <AnimatePresence mode="wait">
              {screen === "home" && <HomeScreen key="home" onFamilySelect={openFamily} />}
              {screen === "catalog" && selectedFamily && (
                <CatalogScreen key="catalog" family={selectedFamily} onBack={goHome} onAdd={addToCart} addedMap={addedMap} />
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            <CartPill count={cartCount} total={cartTotal} />
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}