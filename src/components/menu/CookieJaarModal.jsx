import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { X, Plus, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COOKIE_JAAR_DATA } from "@/lib/cookieJaarData";
import { formatCOP } from "@/lib/constants";

const MINT = "#7ECEC4";
const CAFE = "#8B5E3C";
const CREAM = "#F0E8DF";
const BG = "#F9F5F0";
const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";
const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/676bf883d_images__4_-removebg-preview.png";

const CATS = [
  { id: "galletas", label: "Galletas", emoji: "🍪", count: 11 },
  { id: "malteadas", label: "Malteadas", emoji: "🥛", count: 2 },
  { id: "combos", label: "Combos", emoji: "🎁", count: 2 },
  { id: "supremas", label: "Supremas", emoji: "⭐", count: 4 },
];

const SECTION_LABEL_STYLE = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 10, fontWeight: 800, color: CAFE,
  textTransform: "uppercase", letterSpacing: "1.4px",
  margin: "0 0 10px", fontFamily: FONT,
};

function SectionLabel({ children }) {
  return (
    <p style={SECTION_LABEL_STYLE}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: CAFE, flexShrink: 0, display: "inline-block" }} />
      {children}
    </p>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function HeroBanner({ onClose }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden", flexShrink: 0,
      background: "linear-gradient(135deg, #7ECEC4 0%, #5BADA3 40%, #8B5E3C 100%)",
      padding: "28px 20px 24px",
    }}>
      {/* Círculos decorativos */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", top: 40, right: 60, width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

      {/* Top row: logo + close */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <img src={LOGO_URL} alt="Cookie Jaar" style={{ height: 52, objectFit: "contain" }} />
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", border: "none",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={17} color="#fff" />
        </button>
      </div>

      {/* Eyebrow */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.18)", borderRadius: 99, padding: "4px 12px", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: "#fff", fontWeight: 700, fontFamily: FONT }}>🔥 Listas para ti</span>
      </div>

      {/* Titulo + emoji flotante */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 4px", lineHeight: 1.15, fontFamily: FONT }}>
            Frescas &<br />Recién Horneadas
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: "0 0 8px", fontFamily: FONT }}>
            Ingredientes premium · Recetas únicas
          </p>
          <p style={{ fontSize: 11, fontStyle: "italic", color: "rgba(255,255,255,0.8)", margin: 0, fontFamily: FONT }}>
            "Una galleta al día aleja el mal humor 🍪"
          </p>
        </div>
        <span style={{ fontSize: 86, transform: "rotate(12deg)", lineHeight: 1, marginLeft: 8, marginTop: -8 }}>🍪</span>
      </div>
    </div>
  );
}

// ── Category Tabs ──────────────────────────────────────────────────────────────
function CategoryTabs({ active, onChange }) {
  return (
    <div style={{ background: "#fff", borderBottom: `1px solid ${CREAM}`, padding: "14px 14px 12px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontSize: 15, fontWeight: 900, color: "#1A1A1A", margin: 0, fontFamily: FONT }}>¿Qué se te antoja?</p>
        <p style={{ fontSize: 11, color: "#AAA", margin: 0, fontFamily: FONT }}>4 categorías</p>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 2 }}>
        {CATS.map(cat => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              style={{
                width: 140, height: 160, flexShrink: 0, borderRadius: 20, border: "none",
                background: "linear-gradient(145deg, #F0E8DF, #E8D8C8)",
                cursor: "pointer", padding: 0, overflow: "hidden",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                position: "relative", fontFamily: FONT,
                boxShadow: isActive ? `0 0 0 3px ${MINT}` : "none",
                transition: "box-shadow 0.2s",
              }}
            >
              <span style={{ fontSize: 72, lineHeight: 1 }}>{cat.emoji}</span>
              {/* Badge inferior */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: isActive ? "rgba(126,206,196,0.95)" : "rgba(139,94,60,0.82)",
                padding: "7px 10px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: isActive ? "#1A1A1A" : "#fff", fontFamily: FONT }}>{cat.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10, color: isActive ? "#1A1A1A" : "rgba(255,255,255,0.75)", fontFamily: FONT }}>{cat.count}</span>
                  {isActive && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "inline-block" }} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Featured (horizontal) card ─────────────────────────────────────────────────
function FeaturedCard({ product, onAdd }) {
  const [err, setErr] = useState(false);
  return (
    <button
      onClick={() => onAdd(product)}
      style={{
        width: "100%", background: "#fff", borderRadius: 20, border: "none",
        cursor: "pointer", padding: 0, overflow: "hidden",
        display: "flex", alignItems: "center", textAlign: "left", fontFamily: FONT,
        marginBottom: 10,
      }}
    >
      <div style={{ width: 130, height: 130, flexShrink: 0, background: CREAM, overflow: "hidden", position: "relative" }}>
        {product.image && !err ? (
          <img src={product.image} alt={product.name} onError={() => setErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🍪</div>
        )}
        <span style={{
          position: "absolute", top: 8, left: 8,
          background: MINT, color: "#1A1A1A",
          fontSize: 9, fontWeight: 800, borderRadius: 99, padding: "3px 8px",
        }}>Más pedido</span>
      </div>
      <div style={{ flex: 1, padding: "14px 16px" }}>
        <p style={{ fontSize: 15, fontWeight: 900, color: "#1A1A1A", margin: "0 0 4px", lineHeight: 1.2 }}>{product.name}</p>
        {product.description && <p style={{ fontSize: 11, color: "#AAA", margin: "0 0 8px", lineHeight: 1.3 }}>{product.description}</p>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#1A1A1A" }}>{formatCOP(product.price)}</span>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: MINT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={15} color="#1A1A1A" />
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Grid Card 2×2 ─────────────────────────────────────────────────────────────
function GridCard({ product, badge, onAdd }) {
  const [err, setErr] = useState(false);
  return (
    <button
      onClick={() => onAdd(product)}
      style={{
        background: "#fff", borderRadius: 18, border: "none",
        cursor: "pointer", padding: 0, overflow: "hidden",
        display: "flex", flexDirection: "column", textAlign: "left", fontFamily: FONT,
      }}
    >
      <div style={{ height: 110, width: "100%", background: CREAM, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        {product.image && !err ? (
          <img src={product.image} alt={product.name} onError={() => setErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🍪</div>
        )}
        {badge && (
          <span style={{ position: "absolute", top: 7, left: 7, background: MINT, color: "#1A1A1A", fontSize: 9, fontWeight: 800, borderRadius: 99, padding: "2px 7px" }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: "8px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: CAFE }}>{formatCOP(product.price)}</span>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: MINT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={12} color="#1A1A1A" />
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Mini Carousel ─────────────────────────────────────────────────────────────
function MiniCard({ product, onAdd }) {
  const [err, setErr] = useState(false);
  return (
    <button
      onClick={() => onAdd(product)}
      style={{
        background: "#fff", borderRadius: 14, border: "none",
        cursor: "pointer", padding: 0, overflow: "hidden",
        display: "flex", flexDirection: "column", width: "100%", fontFamily: FONT,
      }}
    >
      <div style={{ height: 80, width: "100%", background: CREAM, overflow: "hidden", flexShrink: 0 }}>
        {product.image && !err ? (
          <img src={product.image} alt={product.name} onError={() => setErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🍪</div>
        )}
      </div>
      <div style={{ padding: "6px 8px 8px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px", lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </p>
        <p style={{ fontSize: 11, fontWeight: 700, color: CAFE, margin: 0 }}>{formatCOP(product.price)}</p>
      </div>
    </button>
  );
}

function MiniCarousel({ products, onAdd }) {
  const [page, setPage] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const PER_PAGE = 3;

  const padded = useMemo(() => {
    if (!products.length) return [];
    const rem = products.length % PER_PAGE;
    if (rem === 0) return products;
    return [...products, ...products.slice(0, PER_PAGE - rem)];
  }, [products]);

  const totalPages = Math.min(3, Math.ceil(padded.length / PER_PAGE));
  const visible = padded.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const goTo = useCallback((p) => setPage((p + totalPages) % totalPages), [totalPages]);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(page + 1), 4000);
    return () => clearInterval(timerRef.current);
  }, [page, goTo]);

  if (!products.length) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(page + (diff > 0 ? 1 : -1));
            touchStartX.current = null;
          }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}
        >
          {visible.map((p, i) => <MiniCard key={`${p.id}-${page}-${i}`} product={p} onAdd={onAdd} />)}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => goTo(page - 1)}
              style={{ width: 28, height: 28, borderRadius: "50%", background: "#fff", border: `1px solid #E8D8C8`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={14} color={MINT} />
            </button>
            <button onClick={() => goTo(page + 1)}
              style={{ width: 28, height: 28, borderRadius: "50%", background: "#fff", border: `1px solid #E8D8C8`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={14} color={MINT} />
            </button>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              style={{ width: i === page ? 16 : 6, height: 6, borderRadius: 3, background: i === page ? MINT : "#D8C8B8", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Products Section ───────────────────────────────────────────────────────────
function ProductsSection({ activeTab, onAdd }) {
  const allProducts = useMemo(() => {
    if (activeTab === "supremas") {
      return (COOKIE_JAAR_DATA.galletas || []).filter(p => p.type === "suprema");
    }
    return COOKIE_JAAR_DATA[activeTab] || [];
  }, [activeTab]);

  const featured = allProducts[0];
  const gridProducts = allProducts.slice(1, 5);
  const carouselProducts = allProducts.slice(5);

  if (!allProducts.length) {
    return (
      <div style={{ textAlign: "center", paddingTop: 48, color: "#CCC" }}>
        <p style={{ fontSize: 40 }}>🍪</p>
        <p style={{ fontWeight: 600, fontFamily: FONT }}>Sin productos aún</p>
      </div>
    );
  }

  return (
    <div>
      {/* Featured */}
      {featured && (
        <div style={{ marginBottom: 20 }}>
          <SectionLabel>Más pedido</SectionLabel>
          <FeaturedCard product={featured} onAdd={onAdd} />
        </div>
      )}

      {/* Grid 2×2 */}
      {gridProducts.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionLabel>Todos los productos</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {gridProducts.map((p, i) => {
              const badge = p.type === "suprema" ? "Suprema" : i === 0 ? "Nuevo" : i === 1 ? "Especial" : null;
              return <GridCard key={p.id} product={p} badge={badge} onAdd={onAdd} />;
            })}
          </div>
        </div>
      )}

      {/* Carrusel */}
      {carouselProducts.length > 0 && (
        <div>
          <SectionLabel>También te puede gustar</SectionLabel>
          <MiniCarousel products={carouselProducts} onAdd={onAdd} />
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function CookieJaarModal({ open, onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState("galletas");

  const handleAdd = (p) => {
    onAdd({ product_id: p.id, product_name: p.name, price: p.price, quantity: 1, category: "combos" });
    setTimeout(() => onClose(), 100);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: BG, borderRadius: "28px 28px 0 0",
              width: "100%", maxWidth: 600, maxHeight: "92vh",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            <HeroBanner onClose={onClose} />
            <CategoryTabs active={activeTab} onChange={setActiveTab} />

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 40px" }}>
              <ProductsSection activeTab={activeTab} onAdd={handleAdd} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}