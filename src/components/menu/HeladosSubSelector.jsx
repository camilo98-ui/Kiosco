import React, { useState, useMemo } from "react";
import { Plus, Search, ArrowLeft, X, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

// ─── Constants ───────────────────────────────────────────────────────────────
const MAGENTA = "#E8187A";
const BG = "#F9F4F7";
const CARD_BORDER = "#F2E0EB";

const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";

const SUBCATS = [
  {
    id: "gourmet",
    label: "Gourmet",
    emoji: "🍦",
    tags: ["Clásicos", "Más vendidos"],
    leftBg: "#FFF0F6",
    tagBg: "#FCE4EC",
    tagColor: "#C41E6A",
    btnColor: "#E8187A",
  },
  {
    id: "exclusivo",
    label: "Exclusivo",
    emoji: "💎",
    tags: ["Premium", "Edición especial"],
    leftBg: "#F0EEFF",
    tagBg: "#EDE7F6",
    tagColor: "#5E35B1",
    btnColor: "#7C4DCC",
  },
  {
    id: "junior",
    label: "Cono Jr",
    emoji: "🧁",
    tags: ["Para todos", "Tamaño ideal"],
    leftBg: "#E8F8F2",
    tagBg: "#E8F5E9",
    tagColor: "#2E7D32",
    btnColor: "#2E7D32",
  },
];

// ─── Filter logic ─────────────────────────────────────────────────────────────
function filterBySubcat(products, sub) {
  const available = products.filter(p => p.is_available !== false);
  if (sub === "gourmet") return available.filter(p => {
    const n = p.name.toLowerCase();
    if (n.includes("exclusivo") || n.includes("junior") || n.includes("jr") || n.includes("maxi")) return false;
    return n.includes("gourmet") || (n.includes("fiore") && !n.includes("exclusivo"));
  });
  if (sub === "exclusivo") {
    const excl = available.filter(p => p.name.toLowerCase().includes("exclusivo"));
    const fiore = excl.filter(p => p.name.toLowerCase().includes("fiore"));
    const rest = excl.filter(p => !p.name.toLowerCase().includes("fiore"));
    return [...fiore, ...rest];
  }
  if (sub === "junior") return available.filter(p => {
    const n = p.name.toLowerCase();
    return (n.includes("junior") || n.includes("jr") || n.includes("cono")) && !n.includes("maxi") && !n.includes("fiore");
  });
  return available;
}

// ─── Mini Cart ────────────────────────────────────────────────────────────────
function MiniCart({ items, onUpdateQty, onConfirm }) {
  if (items.length === 0) return null;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "#fff",
        borderTop: `2.5px solid ${MAGENTA}`,
        borderRadius: "20px 20px 0 0",
        padding: "16px 16px 28px",
        boxShadow: "0 -6px 30px rgba(232,24,122,0.18)",
        maxWidth: 600, margin: "0 auto",
      }}
    >
      {/* Items */}
      <div style={{ marginBottom: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", flex: 1, fontFamily: FONT }}>{item.name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => onUpdateQty(i, -1)} style={{ width: 26, height: 26, borderRadius: "50%", background: "#F5F5F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Minus size={12} color="#555" />
              </button>
              <span style={{ fontSize: 14, fontWeight: 800, minWidth: 16, textAlign: "center", fontFamily: FONT }}>{item.qty}</span>
              <button onClick={() => onUpdateQty(i, 1)} style={{ width: 26, height: 26, borderRadius: "50%", background: MAGENTA, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={12} color="#fff" />
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, color: MAGENTA, minWidth: 64, textAlign: "right", fontFamily: FONT }}>{formatCOP(item.price * item.qty)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #F0E0EA", paddingTop: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "#999", fontFamily: FONT }}>Subtotal</span>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FONT }}>{formatCOP(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#2E7D32", fontFamily: FONT }}>🚚 Domicilio gratis</span>
          <span style={{ fontSize: 12, color: "#2E7D32", fontWeight: 700, fontFamily: FONT }}>$0</span>
        </div>
      </div>

      {/* Total + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: "#999", margin: 0, fontFamily: FONT }}>Total</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#1A1A1A", margin: 0, fontFamily: FONT }}>{formatCOP(subtotal)}</p>
        </div>
        <button
          onClick={onConfirm}
          style={{
            flex: 1, height: 50, borderRadius: 16, background: MAGENTA,
            border: "none", color: "#fff", fontSize: 15, fontWeight: 800,
            cursor: "pointer", fontFamily: FONT,
            boxShadow: "0 4px 16px rgba(232,24,122,0.35)",
          }}
        >
          Confirmar pedido →
        </button>
      </div>
    </motion.div>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: MAGENTA, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 8px", fontFamily: FONT }}>
        ⭐ Más pedido
      </p>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onAdd(product)}
        style={{
          width: "100%", borderRadius: 20, border: `2px solid ${MAGENTA}`,
          background: "#fff", overflow: "hidden", cursor: "pointer", padding: 0,
          display: "flex", alignItems: "center",
          boxShadow: "0 6px 20px rgba(232,24,122,0.15)",
          textAlign: "left",
        }}
      >
        {/* Image */}
        <div style={{ width: 110, height: 110, flexShrink: 0, background: "#FFF0F6", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {product.image_url && !imgErr ? (
            <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 44 }}>🍦</span>
          )}
        </div>
        {/* Info */}
        <div style={{ flex: 1, padding: "12px 14px" }}>
          <span style={{ fontSize: 9, fontWeight: 800, background: MAGENTA, color: "#fff", borderRadius: 99, padding: "3px 9px", fontFamily: FONT }}>🔥 #1 esta semana</span>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A", margin: "6px 0 2px", lineHeight: 1.3, fontFamily: FONT }}>{product.name}</p>
          <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 8px", fontFamily: FONT }}>Personaliza a tu gusto</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: MAGENTA, fontFamily: FONT }}>{formatCOP(product.price)}</span>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: MAGENTA, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(232,24,122,0.35)" }}>
              <Plus size={15} color="#fff" />
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
function GridCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(product)}
      style={{
        borderRadius: 16, border: `1.5px solid ${CARD_BORDER}`,
        background: "#fff", overflow: "hidden", cursor: "pointer", padding: 0,
        display: "flex", flexDirection: "column",
        boxShadow: "0 2px 8px rgba(232,24,122,0.06)",
        textAlign: "left",
      }}
    >
      <div style={{ height: 120, width: "100%", background: "#FFF0F6", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 40 }}>🍦</span>
        )}
      </div>
      <div style={{ padding: "9px 10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3, fontFamily: FONT,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: MAGENTA, fontFamily: FONT }}>{formatCOP(product.price)}</span>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: MAGENTA, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(232,24,122,0.3)" }}>
            <Plus size={12} color="#fff" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Product List View ────────────────────────────────────────────────────────
function ProductListView({ subcat, products, onBack, onGlobalAdd }) {
  const [search, setSearch] = useState("");
  const [showFavs, setShowFavs] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const catInfo = SUBCATS.find(c => c.id === subcat);

  const filtered = useMemo(() => {
    let list = filterBySubcat(products, subcat);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (showFavs) list = list.filter(p => p.tag === "mas_vendido");
    return list;
  }, [subcat, products, search, showFavs]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const handleAdd = (product) => {
    // Agregar al carrito local Y al carrito global
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
        return updated;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
    onGlobalAdd(product);

    // Toast negro
    const toast = document.createElement("div");
    toast.innerText = `✓ ${product.name} agregado`;
    Object.assign(toast.style, {
      position: "fixed", bottom: cartItems.length > 0 ? "160px" : "20px", left: "50%",
      transform: "translateX(-50%)",
      background: "#1A1A1A", color: "#fff", padding: "10px 20px",
      borderRadius: "12px", fontSize: "13px", fontWeight: "700",
      zIndex: 9999, whiteSpace: "nowrap", fontFamily: FONT,
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  };

  const handleUpdateQty = (idx, delta) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], qty: updated[idx].qty + delta };
      return updated.filter(i => i.qty > 0);
    });
  };

  return (
    <div style={{ background: BG, minHeight: "100%", fontFamily: FONT }}>
      {/* Header */}
      <div style={{ background: MAGENTA, padding: "14px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 12px", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={14} color="#fff" /> Volver
          </button>
          <span style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: FONT }}>
            {catInfo?.emoji} {catInfo?.label}
          </span>
          <div style={{ width: 70 }} />
        </div>
      </div>

      {/* Buscador + Favoritos */}
      <div style={{ padding: "12px 14px 4px", display: "flex", gap: 8 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 12, border: `1.5px solid ${CARD_BORDER}`, padding: "9px 14px" }}>
          <Search size={14} color="#bbb" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#1A1A1A", background: "transparent", fontFamily: FONT }}
          />
        </div>
        <button
          onClick={() => setShowFavs(f => !f)}
          style={{
            padding: "0 14px", borderRadius: 12, cursor: "pointer",
            background: showFavs ? "#FCE4EC" : "#fff",
            color: showFavs ? "#C41E6A" : "#999",
            border: `1.5px solid ${showFavs ? "#F48FB1" : CARD_BORDER}`,
            fontSize: 11, fontWeight: 700, fontFamily: FONT, flexShrink: 0,
          }}
        >
          ❤️ Favoritos
        </button>
      </div>

      {/* Productos */}
      <AnimatePresence mode="wait">
        <motion.div key={subcat + search + showFavs} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <div style={{ padding: "8px 14px", paddingBottom: cartItems.length > 0 ? 220 : 100 }}>
            {featured && <FeaturedCard product={featured} onAdd={handleAdd} />}
            {rest.length > 0 && (
              <>
                <p style={{ fontSize: 10, fontWeight: 800, color: MAGENTA, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 10px", fontFamily: FONT }}>
                  Todos los productos
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {rest.map(p => <GridCard key={p.id} product={p} onAdd={handleAdd} />)}
                </div>
              </>
            )}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#bbb" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🍦</div>
                <p style={{ fontSize: 14, fontFamily: FONT }}>No se encontraron helados</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mini Cart flotante */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <MiniCart items={cartItems} onUpdateQty={handleUpdateQty} onConfirm={() => {}} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SubcatCard ───────────────────────────────────────────────────────────────
function SubcatCard({ cat, onSelect }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(cat.id)}
      style={{
        width: "100%", borderRadius: 20, background: "#fff",
        border: `1.5px solid ${CARD_BORDER}`,
        boxShadow: "0 3px 12px rgba(200,16,106,0.07)",
        padding: 0, display: "flex", alignItems: "stretch",
        cursor: "pointer", textAlign: "left", marginBottom: 12,
        overflow: "hidden",
      }}
    >
      {/* Left color square */}
      <div style={{
        width: 80, background: cat.leftBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 44, flexShrink: 0,
      }}>
        {cat.emoji}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
        <p style={{ fontSize: 18, fontWeight: 900, color: "#1A1A1A", margin: 0, fontFamily: FONT }}>
          {cat.label}
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {cat.tags.map(t => (
            <span key={t} style={{ fontSize: 10, fontWeight: 700, background: cat.tagBg, color: cat.tagColor, borderRadius: 99, padding: "3px 10px", fontFamily: FONT }}>
              {t}
            </span>
          ))}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onSelect(cat.id); }}
          style={{
            alignSelf: "flex-start",
            background: cat.btnColor, color: "#fff",
            border: "none", borderRadius: 10, padding: "7px 14px",
            fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: FONT,
            boxShadow: `0 3px 10px ${cat.btnColor}44`,
          }}
        >
          Ver productos →
        </button>
      </div>
    </motion.button>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function HeladosSubSelector({ products, onAdd }) {
  const [activeSubcat, setActiveSubcat] = useState(null);

  if (activeSubcat) {
    return (
      <ProductListView
        subcat={activeSubcat}
        products={products}
        onBack={() => setActiveSubcat(null)}
        onGlobalAdd={onAdd}
      />
    );
  }

  return (
    <div style={{ background: BG, minHeight: "100%", fontFamily: FONT }}>
      {/* Header unificado */}
      <div style={{ background: MAGENTA, padding: "20px 16px 18px" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>🍦</div>
          <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.5px", fontFamily: FONT }}>
            Helados
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0, fontFamily: FONT }}>
            Elige tu categoría favorita
          </p>
        </div>
        {/* Frase en píldora */}
        <div style={{
          background: "rgba(255,255,255,0.18)", borderRadius: 99,
          padding: "8px 16px", textAlign: "center",
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.95)", margin: 0, fontStyle: "italic", fontFamily: FONT }}>
            "El placer de un helado Popsy no tiene comparación 💕"
          </p>
        </div>
      </div>

      {/* Tarjetas */}
      <div style={{ padding: "16px 14px 100px" }}>
        {SUBCATS.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.22 }}>
            <SubcatCard cat={cat} onSelect={setActiveSubcat} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}