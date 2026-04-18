import React, { useState, useMemo } from "react";
import { Plus, Search, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

// ─── Colors ─────────────────────────────────────────────────────────────────
const ACCENT = "#E8187A";
const ACCENT_DARK = "#C8106A";
const BG = "#F8F5F7";
const CARD_BORDER = "#F0E0EA";

const SUBCATS = [
  {
    id: "gourmet",
    label: "Gourmet",
    emoji: "🍦",
    tags: ["Clásicos", "Más vendidos"],
    color: "#E8187A",
    colorLight: "#FFF0F5",
    colorPill: "#FCE4EC",
    colorText: "#C41E6A",
    cta: "Ver productos →",
  },
  {
    id: "exclusivo",
    label: "Exclusivo",
    emoji: "💎",
    tags: ["Premium", "Edición especial"],
    color: "#7E57C2",
    colorLight: "#F3EEF9",
    colorPill: "#EDE7F6",
    colorText: "#5E35B1",
    cta: "Ver productos →",
  },
  {
    id: "junior",
    label: "Cono Jr",
    emoji: "🧁",
    tags: ["Para todos", "Tamaño ideal"],
    color: "#2E7D32",
    colorLight: "#F1F8E9",
    colorPill: "#E8F5E9",
    colorText: "#2E7D32",
    cta: "Ver productos →",
  },
];

// ─── Filter logic ────────────────────────────────────────────────────────────
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

// ─── SubcatCard (pantalla de selección) ────────────────────────────────────
function SubcatCard({ cat, onSelect }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(cat.id)}
      style={{
        width: "100%", borderRadius: 20,
        background: "#fff",
        border: `1.5px solid ${CARD_BORDER}`,
        boxShadow: "0 3px 14px rgba(200,16,106,0.08)",
        padding: "18px 16px",
        display: "flex", alignItems: "center", gap: 16,
        cursor: "pointer", textAlign: "left", marginBottom: 12,
      }}
    >
      {/* Emoji grande */}
      <div style={{
        width: 60, height: 60, borderRadius: 18,
        background: cat.colorLight,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 30, flexShrink: 0,
      }}>
        {cat.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: "#1A1A1A", margin: "0 0 6px", lineHeight: 1.2 }}>
          {cat.label}
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {cat.tags.map(t => (
            <span key={t} style={{
              fontSize: 10, fontWeight: 700,
              background: cat.colorPill, color: cat.colorText,
              borderRadius: 99, padding: "3px 10px",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        flexShrink: 0,
        background: cat.color, color: "#fff",
        borderRadius: 12, padding: "8px 14px",
        fontSize: 11, fontWeight: 800,
        boxShadow: `0 4px 12px ${cat.color}55`,
        whiteSpace: "nowrap",
      }}>
        {cat.cta}
      </div>
    </motion.button>
  );
}

// ─── Featured card ───────────────────────────────────────────────────────────
function FeaturedCard({ product, accentColor, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: 14 }}
    >
      <p style={{ fontSize: 10, fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 8px" }}>
        ⭐ Más pedido
      </p>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onAdd(product)}
        style={{
          width: "100%", borderRadius: 20,
          border: `2px solid ${accentColor}`,
          background: "#fff", overflow: "hidden", cursor: "pointer", padding: 0,
          display: "flex", flexDirection: "column",
          boxShadow: `0 6px 24px ${accentColor}22`,
          textAlign: "left",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", width: "100%", height: 200, background: "#FDF0F5", overflow: "hidden" }}>
          {product.video_url ? (
            <video src={product.video_url} autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : product.image_url && !imgErr ? (
            <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>🍦</div>
          )}
          <span style={{
            position: "absolute", top: 12, left: 12,
            fontSize: 10, fontWeight: 800,
            background: accentColor, color: "#fff",
            borderRadius: 99, padding: "4px 12px",
          }}>
            🔥 #1 esta semana
          </span>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
            background: "linear-gradient(to top, rgba(0,0,0,0.18), transparent)",
          }} />
        </div>

        {/* Info */}
        <div style={{ padding: "12px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>{product.name}</p>
            <p style={{ fontSize: 11, color: "#999", margin: "3px 0 0" }}>Personaliza a tu gusto</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 900, color: accentColor }}>{formatCOP(product.price)}</span>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: accentColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 12px ${accentColor}44`, flexShrink: 0,
            }}>
              <Plus size={16} color="#fff" />
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ─── Grid card ───────────────────────────────────────────────────────────────
function GridCard({ product, accentColor, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(product)}
      style={{
        borderRadius: 18, border: `1.5px solid ${CARD_BORDER}`,
        background: "#fff", overflow: "hidden", cursor: "pointer", padding: 0,
        display: "flex", flexDirection: "column",
        boxShadow: "0 2px 10px rgba(200,16,106,0.06)",
        textAlign: "left",
      }}
    >
      <div style={{ height: 130, width: "100%", overflow: "hidden", flexShrink: 0, background: "#FDF0F5" }}>
        {product.video_url ? (
          <video src={product.video_url} autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🍦</div>
        )}
      </div>
      <div style={{ padding: "9px 10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: "#1A1A1A", margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: accentColor }}>{formatCOP(product.price)}</span>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", background: accentColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 2px 8px ${accentColor}44`,
          }}>
            <Plus size={12} color="#fff" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Product list view ───────────────────────────────────────────────────────
function ProductListView({ subcat, products, onAdd, onBack }) {
  const [search, setSearch] = useState("");
  const [showFavs, setShowFavs] = useState(false);

  const catInfo = SUBCATS.find(c => c.id === subcat);
  const accentColor = catInfo?.color || ACCENT;

  const filtered = useMemo(() => {
    let list = filterBySubcat(products, subcat);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (showFavs) list = list.filter(p => p.tag === "mas_vendido");
    return list;
  }, [subcat, products, search, showFavs]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div style={{ background: BG, minHeight: "100%" }}>
      {/* Mini header con nombre de subcat */}
      <div style={{
        background: accentColor,
        padding: "10px 14px 12px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 10, padding: "6px 10px", cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 12, fontFamily: "'Poppins', sans-serif" }}
        >
          ← Volver
        </button>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{catInfo?.emoji} {catInfo?.label}</span>
      </div>

      {/* Buscador */}
      <div style={{ padding: "12px 14px 4px", display: "flex", gap: 8 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8,
          background: "#fff", borderRadius: 12,
          border: `1.5px solid ${CARD_BORDER}`, padding: "9px 14px",
        }}>
          <Search size={14} color="#aaa" />
          <input
            type="text"
            placeholder="Buscar helado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: "none", outline: "none", fontSize: 12,
              color: "#1A1A1A", background: "transparent", fontFamily: "'Poppins', sans-serif",
            }}
          />
        </div>
        <button
          onClick={() => setShowFavs(f => !f)}
          style={{
            padding: "0 14px", borderRadius: 12, border: "none", cursor: "pointer",
            background: showFavs ? "#FCE4EC" : "#fff",
            color: showFavs ? "#C41E6A" : "#999",
            fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif",
            border: `1.5px solid ${showFavs ? "#F48FB1" : CARD_BORDER}`,
            flexShrink: 0,
          }}
        >
          ❤️ Favoritos
        </button>
      </div>

      {/* Productos */}
      <AnimatePresence mode="wait">
        <motion.div key={subcat + search + showFavs} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <div style={{ padding: "8px 14px 100px" }}>
            {featured && (
              <FeaturedCard product={featured} accentColor={accentColor} onAdd={p => onAdd({ ...p, _subcat: subcat })} />
            )}
            {rest.length > 0 && (
              <>
                <p style={{ fontSize: 10, fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 10px" }}>
                  Todos los productos
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {rest.map(p => (
                    <GridCard key={p.id} product={p} accentColor={accentColor} onAdd={p => onAdd({ ...p, _subcat: subcat })} />
                  ))}
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function HeladosSubSelector({ products, onAdd }) {
  const [activeSubcat, setActiveSubcat] = useState(null);

  if (activeSubcat) {
    return (
      <ProductListView
        subcat={activeSubcat}
        products={products}
        onAdd={onAdd}
        onBack={() => setActiveSubcat(null)}
      />
    );
  }

  return (
    <div style={{ background: BG, minHeight: "100%" }}>
      {/* Header premium */}
      <div style={{ background: ACCENT, padding: "20px 16px 0" }}>
        <p style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px", textAlign: "center", letterSpacing: "-0.5px" }}>
          🍦 Helados
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", textAlign: "center", margin: "0 0 14px" }}>
          Elige tu categoría favorita
        </p>
        {/* Franja inferior */}
        <div style={{
          background: ACCENT_DARK,
          margin: "0 -16px",
          padding: "8px 16px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", margin: 0, fontStyle: "italic" }}>
            "El placer de un helado Popsy no tiene comparación 💕"
          </p>
        </div>
      </div>

      {/* Tarjetas de subcategoría */}
      <div style={{ padding: "16px 14px 100px" }}>
        {SUBCATS.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.25 }}
          >
            <SubcatCard cat={cat} onSelect={setActiveSubcat} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}