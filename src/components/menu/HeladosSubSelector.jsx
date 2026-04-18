import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Plus, Search, ArrowLeft, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#E8187A";
const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";

const SUBCATS = [
  {
    id: "gourmet",
    label: "Gourmet",
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/928441d6e_GOURMET.png",
    tags: ["Clásicos", "Más vendidos"],
  },
  {
    id: "exclusivo",
    label: "Exclusivo",
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/3d40172de_EXCLUSIVO.png",
    tags: ["Premium", "Edición especial"],
  },
  {
    id: "junior",
    label: "Cono Jr",
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/4168be318_CONOJR.jpg",
    tags: ["Para todos", "Tamaño ideal"],
  },
];

const GRID_BADGES = ["#1 semana", "Premium", "Más pedido", "Nuevo"];

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
function MiniCart({ items, onUpdateQty }) {
  if (items.length === 0) return null;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "#fff", borderTop: `2.5px solid ${MAGENTA}`,
        borderRadius: "20px 20px 0 0", padding: "16px 16px 28px",
        boxShadow: "0 -6px 30px rgba(232,24,122,0.18)",
        maxWidth: 600, margin: "0 auto", fontFamily: FONT,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", flex: 1 }}>{item.name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => onUpdateQty(i, -1)} style={{ width: 26, height: 26, borderRadius: "50%", background: "#F5F5F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Minus size={12} color="#555" />
              </button>
              <span style={{ fontSize: 14, fontWeight: 800, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => onUpdateQty(i, 1)} style={{ width: 26, height: 26, borderRadius: "50%", background: MAGENTA, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={12} color="#fff" />
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, color: MAGENTA, minWidth: 64, textAlign: "right" }}>{formatCOP(item.price * item.qty)}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #F0E0EA", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
        <span style={{ fontSize: 16, fontWeight: 900, color: MAGENTA }}>{formatCOP(subtotal)}</span>
      </div>
    </motion.div>
  );
}

// ─── Grid 2×2 card ───────────────────────────────────────────────────────────
function GridCard2x2({ product, badge, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <button
      onClick={() => onAdd(product)}
      style={{
        borderRadius: 16, border: "none", background: "#fff",
        overflow: "hidden", cursor: "pointer", padding: 0,
        display: "flex", flexDirection: "column", textAlign: "left",
        position: "relative", fontFamily: FONT,
      }}
    >
      <div style={{ height: 115, width: "100%", overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🍦</div>
        )}
      </div>
      {/* Badge absoluto */}
      {badge && (
        <span style={{
          position: "absolute", top: 8, left: 8,
          background: MAGENTA, color: "#fff",
          fontSize: 9, fontWeight: 800,
          borderRadius: 99, padding: "3px 8px",
          fontFamily: FONT,
        }}>{badge}</span>
      )}
      <div style={{ padding: "8px 10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{
          fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{product.name}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: MAGENTA }}>{formatCOP(product.price)}</span>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: MAGENTA, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={12} color="#fff" />
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Mini Carousel Card ───────────────────────────────────────────────────────
function MiniCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <button
      onClick={() => onAdd(product)}
      style={{
        borderRadius: 14, border: "none", background: "#fff",
        overflow: "hidden", cursor: "pointer", padding: 0,
        display: "flex", flexDirection: "column", textAlign: "left",
        fontFamily: FONT, flex: 1,
      }}
    >
      <div style={{ height: 72, width: "100%", overflow: "hidden", background: "#f5f5f5", flexShrink: 0 }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🍦</div>
        )}
      </div>
      <div style={{ padding: "6px 8px 8px" }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{product.name}</p>
        <p style={{ fontSize: 11, fontWeight: 900, color: MAGENTA, margin: "3px 0 0" }}>{formatCOP(product.price)}</p>
      </div>
    </button>
  );
}

// ─── Mini Carousel (3 cols × 3 páginas) ──────────────────────────────────────
function MiniCarousel({ products, onAdd }) {
  const [page, setPage] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const PER_PAGE = 3;
  const totalPages = Math.min(3, Math.ceil(products.length / PER_PAGE));
  const visible = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const goTo = useCallback((p) => {
    setPage((p + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(page + 1), 4000);
    return () => clearInterval(timerRef.current);
  }, [page, goTo]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(page + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  if (products.length === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}
        >
          {visible.map(p => <MiniCard key={p.id} product={p} onAdd={onAdd} />)}
          {/* Relleno si hay menos de 3 */}
          {visible.length < PER_PAGE && Array.from({ length: PER_PAGE - visible.length }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navegación */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => goTo(page - 1)}
            style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronLeft size={16} color={MAGENTA} />
          </button>
          <button
            onClick={() => goTo(page + 1)}
            style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ChevronRight size={16} color={MAGENTA} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: i === page ? 18 : 6, height: 6, borderRadius: 3,
                background: i === page ? MAGENTA : "#F2C4D8",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tendencia Section (grid 2×2 + carrusel miniaturas) ──────────────────────
function TendenciaSection({ products, onAdd }) {
  // Primero los mas_vendido, luego el resto — para llenar siempre el espacio
  const trending = useMemo(() => {
    const available = products.filter(p => p.is_available !== false);
    const top = available.filter(p => p.tag === "mas_vendido");
    const rest = available.filter(p => p.tag !== "mas_vendido");
    return [...top, ...rest].slice(0, 13); // máx 4 grid + 9 carrusel
  }, [products]);

  const grid4 = trending.slice(0, 4);
  const carousel = trending.slice(4);

  if (trending.length === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 12px", fontFamily: FONT }}>
        🔥 Tendencia hoy
      </p>

      {/* Grid 2×2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {grid4.map((p, i) => (
          <GridCard2x2 key={p.id} product={p} badge={GRID_BADGES[i] || null} onAdd={onAdd} />
        ))}
      </div>

      {/* Carrusel miniaturas */}
      {carousel.length > 0 && <MiniCarousel products={carousel} onAdd={onAdd} />}
    </div>
  );
}

// ─── Product List View ────────────────────────────────────────────────────────
function ProductListView({ subcat, products, onBack, onGlobalAdd }) {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const catInfo = SUBCATS.find(c => c.id === subcat);

  const filtered = useMemo(() => {
    let list = filterBySubcat(products, subcat);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [subcat, products, search]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const handleAdd = (product) => {
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
  };

  const handleUpdateQty = (idx, delta) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], qty: updated[idx].qty + delta };
      return updated.filter(i => i.qty > 0);
    });
  };

  return (
    <div style={{ background: "#F7F2F5", minHeight: "100%", fontFamily: FONT }}>
      {/* Buscador */}
      <div style={{ padding: "12px 14px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 14, padding: "10px 14px" }}>
          <Search size={14} color="#bbb" />
          <input
            type="text"
            placeholder={`Buscar en ${catInfo?.label}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#1A1A1A", background: "transparent", fontFamily: FONT }}
          />
        </div>
      </div>

      <div style={{ padding: "8px 14px", paddingBottom: cartItems.length > 0 ? 200 : 100 }}>
        {/* Featured */}
        {featured && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAdd(featured)}
            style={{
              width: "100%", borderRadius: 18, border: `2px solid ${MAGENTA}`,
              background: "#fff", overflow: "hidden", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", textAlign: "left", marginBottom: 12,
            }}
          >
            <div style={{ width: 110, height: 110, flexShrink: 0, background: "#f5f5f5", overflow: "hidden" }}>
              {featured.image_url ? (
                <img src={featured.image_url} alt={featured.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🍦</div>}
            </div>
            <div style={{ flex: 1, padding: "12px 14px" }}>
              <span style={{ fontSize: 9, fontWeight: 800, background: MAGENTA, color: "#fff", borderRadius: 99, padding: "3px 9px" }}>🔥 #1 esta semana</span>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A", margin: "6px 0 8px", lineHeight: 1.3 }}>{featured.name}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: MAGENTA }}>{formatCOP(featured.price)}</span>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: MAGENTA, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={15} color="#fff" />
                </div>
              </div>
            </div>
          </motion.button>
        )}

        {/* Grid rest */}
        {rest.length > 0 && (
          <>
            <p style={{ fontSize: 10, fontWeight: 800, color: MAGENTA, textTransform: "uppercase", letterSpacing: "1.2px", margin: "4px 0 10px" }}>
              Todos los productos
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {rest.map((p, i) => <GridCard2x2 key={p.id} product={p} badge={null} onAdd={handleAdd} />)}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#bbb" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🍦</div>
            <p style={{ fontSize: 14 }}>No se encontraron helados</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {cartItems.length > 0 && <MiniCart items={cartItems} onUpdateQty={handleUpdateQty} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Category Card (selector principal) ──────────────────────────────────────
function CategoryCard({ cat, onSelect, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.2 }}
    >
      <button
        onClick={() => onSelect(cat.id)}
        style={{
          width: "100%", borderRadius: 20, border: "none",
          background: "#fff", overflow: "hidden", cursor: "pointer", padding: 0,
          display: "flex", alignItems: "stretch",
          textAlign: "left", marginBottom: 12, fontFamily: FONT,
        }}
      >
        <div style={{ width: 120, height: 110, flexShrink: 0, overflow: "hidden" }}>
          <img src={cat.image} alt={cat.label}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        </div>
        <div style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <p style={{ fontSize: 20, fontWeight: 900, color: "#1A1A1A", margin: 0 }}>{cat.label}</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cat.tags.map(t => (
              <span key={t} style={{ fontSize: 10, fontWeight: 700, background: "#FCE4EC", color: "#C2185B", borderRadius: 99, padding: "3px 10px" }}>
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onSelect(cat.id); }}
            style={{
              alignSelf: "flex-start", background: MAGENTA, color: "#fff",
              border: "none", borderRadius: 10, padding: "7px 14px",
              fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: FONT,
            }}
          >
            Ver productos →
          </button>
        </div>
      </button>
    </motion.div>
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
    <div style={{ background: "#F7F2F5", borderRadius: 28, padding: 14, fontFamily: FONT }}>
      {/* 3 Category Cards */}
      {SUBCATS.map((cat, i) => (
        <CategoryCard key={cat.id} cat={cat} onSelect={setActiveSubcat} index={i} />
      ))}

      {/* Tendencia hoy: grid 2×2 + carrusel */}
      <TendenciaSection products={products} onAdd={onAdd} />
    </div>
  );
}