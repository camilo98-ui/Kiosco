import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, ChevronLeft, Plus, Check, MapPin } from "lucide-react";
import { FAMILIES, BG_GRADIENTS } from "@/lib/popsyCatalog";

const POPSY_RED = "#E8004D";
const POPSY_DARK = "#1A0A10";

function formatCOP(price) {
  return "$" + price.toLocaleString("es-CO");
}

// ── Header ──────────────────────────────────────────────────────────
function AppHeader({ cartCount, onCartClick, onSearchClick }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E8004D 0%, #C8003A 55%, #8B0029 100%)",
        padding: "0 16px",
        paddingTop: 16,
        paddingBottom: 14,
        position: "sticky",
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        {/* Logo */}
        <div>
          <p style={{ fontFamily: '"Playfair Display", serif', color: "#fff", fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.5px" }}>
            Popsy
          </p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: 400, letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Helado Gourmet
          </p>
        </div>
        {/* Icons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onSearchClick}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Search size={16} color="#fff" />
          </button>
          <button
            onClick={onCartClick}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}
          >
            <ShoppingBag size={16} color="#fff" />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, width: 17, height: 17, borderRadius: "50%", background: "#fff", color: POPSY_RED, fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"DM Sans", sans-serif' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Delivery bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.14)", borderRadius: 20, padding: "7px 12px" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4AE54A", boxShadow: "0 0 0 3px rgba(74,229,74,0.35)", flexShrink: 0 }} />
        <MapPin size={11} color="rgba(255,255,255,0.8)" />
        <p style={{ fontFamily: '"DM Sans", sans-serif', color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 500 }}>
          Entrega en <strong style={{ color: "#fff" }}>25–35 min</strong> · Calle 72 #10-07
        </p>
      </div>
    </div>
  );
}

// ── Family Card ──────────────────────────────────────────────────────
function FamilyCard({ family, onClick, featured }) {
  return (
    <motion.button
      onClick={() => onClick(family)}
      whileTap={{ scale: 0.97 }}
      style={{
        border: "none",
        cursor: "pointer",
        borderRadius: 22,
        background: family.gradient,
        padding: "18px 16px 14px",
        display: "flex",
        flexDirection: featured ? "row" : "column",
        alignItems: featured ? "center" : "flex-start",
        gap: featured ? 16 : 0,
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        gridColumn: featured ? "span 2" : "span 1",
        minHeight: featured ? 90 : 130,
        boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
      }}
    >
      {/* Decorative circle */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.22)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 10, right: 10, width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.15)", pointerEvents: "none" }} />

      <span style={{ fontSize: featured ? 42 : 38, lineHeight: 1, display: "block", marginBottom: featured ? 0 : 10 }}>
        {family.emoji}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: '"Playfair Display", serif', fontSize: featured ? 17 : 15, fontWeight: 700, color: POPSY_DARK, lineHeight: 1.2, marginBottom: 3 }}>
          {family.name}
        </p>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgba(26,10,16,0.6)", fontWeight: 400 }}>
          {family.products.length} productos
        </p>
      </div>

      {/* Arrow */}
      <div style={{
        position: featured ? "relative" : "absolute",
        bottom: featured ? "auto" : 12,
        right: featured ? "auto" : 12,
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: POPSY_RED,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <ChevronLeft size={14} color="#fff" style={{ transform: "rotate(180deg)" }} />
      </div>
    </motion.button>
  );
}

// ── Home Screen ──────────────────────────────────────────────────────
function HomeScreen({ onFamilySelect }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ padding: "20px 16px 120px" }}
    >
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 800, color: POPSY_DARK, lineHeight: 1.2 }}>
          ¿Qué se te antoja?
        </p>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#8A7880", marginTop: 3 }}>
          {FAMILIES.length} categorías disponibles
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {FAMILIES.map((family) => (
          <FamilyCard
            key={family.key}
            family={family}
            onClick={onFamilySelect}
            featured={!!family.featured}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Filter Chip ─────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        color: active ? "#fff" : "#8A7880",
        background: active ? POPSY_RED : "rgba(138,120,128,0.1)",
        border: "none",
        borderRadius: 20,
        padding: "7px 14px",
        cursor: "pointer",
        flexShrink: 0,
        transition: "all 0.18s ease",
      }}
    >
      {label}
    </button>
  );
}

// ── Product Card Featured ────────────────────────────────────────────
function FeaturedProductCard({ product, onAdd, added }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(140deg, #1A0A10, #3D0A20)",
        borderRadius: 24,
        padding: "20px 18px",
        position: "relative",
        overflow: "hidden",
        marginBottom: 10,
      }}
    >
      {/* Decorative red circle */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(232,0,77,0.25)" }} />
      <div style={{ position: "absolute", top: 10, right: 10, width: 80, height: 80, borderRadius: "50%", background: "rgba(232,0,77,0.12)" }} />

      {product.top && (
        <span style={{ position: "absolute", top: 14, right: 14, background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#fff", fontSize: 9, fontWeight: 900, borderRadius: 10, padding: "3px 8px", letterSpacing: "0.5px", fontFamily: '"DM Sans", sans-serif' }}>
          ⭐ TOP
        </span>
      )}

      <span style={{ fontSize: 48, lineHeight: 1, display: "block", marginBottom: 12 }}>{product.emoji}</span>

      <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 5, lineHeight: 1.3 }}>
        {product.name}
      </p>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 14, lineHeight: 1.5 }}>
        {product.desc}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
            {formatCOP(product.price)}
          </p>
          {product.oldPrice && (
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "line-through", marginTop: 2 }}>
              {formatCOP(product.oldPrice)}
            </p>
          )}
        </div>
        <motion.button
          onClick={() => onAdd(product.price)}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: added ? "#22C55E" : POPSY_RED,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s ease",
            boxShadow: "0 4px 14px rgba(232,0,77,0.4)",
          }}
        >
          {added ? <Check size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Product Card Regular ─────────────────────────────────────────────
function RegularProductCard({ product, onAdd, added }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "14px",
        display: "flex",
        gap: 13,
        alignItems: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        marginBottom: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Emoji box */}
      <div style={{
        width: 68,
        height: 68,
        borderRadius: 16,
        background: BG_GRADIENTS[product.bg] || BG_GRADIENTS.bg1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}>
        <span style={{ fontSize: 32 }}>{product.emoji}</span>
        {product.top && (
          <span style={{ position: "absolute", top: -4, right: -4, background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#fff", fontSize: 8, fontWeight: 900, borderRadius: 8, padding: "2px 5px" }}>
            TOP
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {product.badge && (
          <span style={{ display: "inline-block", background: "#FFE4EE", color: POPSY_RED, fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "2px 7px", marginBottom: 4, fontFamily: '"DM Sans", sans-serif' }}>
            {product.badge}
          </span>
        )}
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: POPSY_DARK, lineHeight: 1.3, marginBottom: 3 }}>
          {product.name}
        </p>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#8A7880", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 700, color: POPSY_DARK, lineHeight: 1 }}>
            {formatCOP(product.price)}
          </p>
          {product.oldPrice && (
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#C0A8B0", textDecoration: "line-through" }}>
              {formatCOP(product.oldPrice)}
            </p>
          )}
        </div>
      </div>

      {/* Add button */}
      <motion.button
        onClick={() => onAdd(product.price)}
        whileTap={{ scale: 0.88 }}
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: added ? "#22C55E" : POPSY_RED,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.2s ease",
          boxShadow: `0 3px 10px ${added ? "rgba(34,197,94,0.35)" : "rgba(232,0,77,0.3)"}`,
        }}
      >
        {added ? <Check size={15} color="#fff" /> : <Plus size={15} color="#fff" />}
      </motion.button>
    </motion.div>
  );
}

// ── Catalog Screen ───────────────────────────────────────────────────
const FILTERS = ["Mayor precio", "Populares", "Novedades", "Sin azúcar"];

function CatalogScreen({ family, onBack, onAdd, addedMap }) {
  const [activeFilter, setActiveFilter] = useState("Mayor precio");
  const sortedProducts = [...family.products].sort((a, b) => b.price - a.price);
  const [featured, ...rest] = sortedProducts;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ padding: "0 0 120px" }}
    >
      {/* Hero bar */}
      <div
        style={{
          background: family.gradient,
          padding: "16px 16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 13,
        }}
      >
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.92 }}
          style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1.5px solid rgba(26,10,16,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <ChevronLeft size={18} color={POPSY_DARK} />
        </motion.button>
        <div>
          <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 800, color: POPSY_DARK, lineHeight: 1.2 }}>
            {family.emoji} {family.name}
          </p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgba(26,10,16,0.55)", marginTop: 2 }}>
            {family.products.length} productos disponibles
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 16px", scrollbarWidth: "none" }}>
        {FILTERS.map((f) => (
          <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
        ))}
      </div>

      {/* Products */}
      <div style={{ padding: "0 16px" }}>
        {featured && (
          <FeaturedProductCard
            product={featured}
            onAdd={(price) => onAdd(featured.id || featured.name, price)}
            added={!!addedMap[featured.name]}
          />
        )}
        {rest.map((product) => (
          <RegularProductCard
            key={product.name}
            product={product}
            onAdd={(price) => onAdd(product.id || product.name, price)}
            added={!!addedMap[product.name]}
          />
        ))}
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
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: 388,
        background: POPSY_DARK,
        borderRadius: 50,
        padding: "12px 16px 12px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 8px 28px rgba(26,10,16,0.35)",
        zIndex: 100,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: POPSY_RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: '"DM Sans", sans-serif', color: "#fff", fontSize: 13, fontWeight: 800 }}>{count}</span>
        </div>
        <span style={{ fontFamily: '"DM Sans", sans-serif', color: "#fff", fontSize: 14, fontWeight: 600 }}>Ver pedido</span>
      </div>
      <span style={{ fontFamily: '"DM Sans", sans-serif', color: "#fff", fontSize: 15, fontWeight: 700 }}>
        {formatCOP(total)}
      </span>
    </motion.div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function PopsyApp() {
  const [screen, setScreen] = useState("home"); // "home" | "catalog"
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [addedMap, setAddedMap] = useState({});

  const openFamily = (family) => {
    setSelectedFamily(family);
    setScreen("catalog");
  };

  const goHome = () => {
    setScreen("home");
    setSelectedFamily(null);
  };

  const addToCart = (key, price) => {
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + price);
    setAddedMap((m) => ({ ...m, [key]: true }));
    setTimeout(() => {
      setAddedMap((m) => ({ ...m, [key]: false }));
    }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FBF7F8", fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ maxWidth: 420, margin: "0 auto", position: "relative", minHeight: "100vh", background: "#FBF7F8" }}>
        <AppHeader cartCount={cartCount} />

        <AnimatePresence mode="wait">
          {screen === "home" && (
            <HomeScreen key="home" onFamilySelect={openFamily} />
          )}
          {screen === "catalog" && selectedFamily && (
            <CatalogScreen
              key="catalog"
              family={selectedFamily}
              onBack={goHome}
              onAdd={addToCart}
              addedMap={addedMap}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          <CartPill count={cartCount} total={cartTotal} />
        </AnimatePresence>
      </div>
    </div>
  );
}