import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#e8559a";
const BG = "#f9f4f7";
const BORDER = "#f3e0ea";
const TEXT = "#2a2a2a";
const SUBTEXT = "#888888";

function SubcatTabs({ active, onSelect }) {
  const tabs = [
    { id: "gourmet", label: "Gourmet 🍦" },
    { id: "exclusivo", label: "Exclusivo ✨" },
    { id: "junior", label: "Cono Jr 🍧" },
  ];
  return (
    <div style={{ padding: "14px 14px 12px", background: BG }}>
      <div style={{ display: "flex", gap: 8 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 99,
              border: active === t.id ? "none" : "1.5px solid #e5d6df",
              cursor: "pointer", fontWeight: 700, fontSize: 11,
              fontFamily: "'Poppins', sans-serif",
              background: active === t.id ? MAGENTA : "#fff",
              color: active === t.id ? "#fff" : SUBTEXT,
              boxShadow: active === t.id ? "0 4px 14px rgba(232,85,154,0.3)" : "none",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturedProductCard({ product, onAdd, isFirst }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {isFirst && (
        <p style={{ fontSize: 10, fontWeight: 800, color: MAGENTA, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>
          ⭐ Más pedido
        </p>
      )}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onAdd(product)}
        style={{
          width: "100%", borderRadius: 18, border: `2px solid ${MAGENTA}`,
          background: "#fff", overflow: "hidden", cursor: "pointer", padding: 0,
          display: "flex", flexDirection: "column",
          boxShadow: "0 4px 20px rgba(232,85,154,0.18)",
          marginBottom: 10, textAlign: "left",
        }}
      >
        {/* Imagen superior */}
        <div style={{ position: "relative", height: 160, width: "100%", overflow: "hidden", flexShrink: 0 }}>
          {product.image_url && !imgErr ? (
            <img
              src={product.image_url}
              alt={product.name}
              onError={() => setImgErr(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#fff0f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🍦</div>
          )}
          {/* Badge sobre la imagen */}
          <span style={{
            position: "absolute", top: 10, left: 10,
            fontSize: 10, fontWeight: 800, background: MAGENTA, color: "#fff",
            borderRadius: 99, padding: "4px 10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            🔥 #1 esta semana
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: "12px 14px 14px" }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.3 }}>
            {product.name}
          </p>
          <p style={{ fontSize: 11, color: SUBTEXT, margin: "3px 0 0" }}>Personaliza a tu gusto</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <p style={{ fontSize: 17, fontWeight: 900, color: MAGENTA, margin: 0 }}>
              {formatCOP(product.price)}
            </p>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: MAGENTA,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 10px rgba(232,85,154,0.35)",
            }}>
              <Plus size={16} color="#fff" />
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

function GridProductCard({ product, onAdd }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(product)}
      style={{
        borderRadius: 14, border: `1.5px solid ${BORDER}`, background: "#fff",
        overflow: "hidden", cursor: "pointer", padding: 0,
        display: "flex", flexDirection: "column",
        boxShadow: "0 2px 8px rgba(232,85,154,0.06)",
        textAlign: "left",
      }}
    >
      {/* Imagen superior — toca bordes laterales y superior */}
      <div style={{ height: 140, width: "100%", overflow: "hidden", flexShrink: 0 }}>
        {product.image_url && !imgErr ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#fff0f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🍦</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "9px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{
          fontSize: 12, fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>
        <p style={{ fontSize: 10, color: SUBTEXT, margin: "2px 0 0" }}>Varios sabores</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: MAGENTA, margin: 0 }}>
            {formatCOP(product.price)}
          </p>
          <div style={{
            width: 26, height: 26, borderRadius: "50%", background: MAGENTA,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(232,85,154,0.3)",
          }}>
            <Plus size={13} color="#fff" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function HeladosSubSelector({ products, onAdd }) {
  const [subcat, setSubcat] = useState("exclusivo");
  const [search, setSearch] = useState("");

  const available = products.filter(p => p.is_available !== false);

  const filterProducts = (sub) => {
    if (sub === "gourmet") return available.filter(p => {
      const n = p.name.toLowerCase();
      if (n.includes("exclusivo") || n.includes("junior") || n.includes("jr") || n.includes("maxi")) return false;
      return n.includes("gourmet") || (n.includes("fiore") && !n.includes("exclusivo"));
    });
    if (sub === "exclusivo") return available.filter(p => p.name.toLowerCase().includes("exclusivo"));
    if (sub === "junior") return available.filter(p => {
      const n = p.name.toLowerCase();
      return (n.includes("junior") || n.includes("jr") || n.includes("cono")) &&
        !n.includes("maxi") && !n.includes("fiore");
    });
    return available;
  };

  const filtered = filterProducts(subcat).filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div style={{ background: BG, minHeight: "100%" }}>
      {/* Search bar */}
      <div style={{ padding: "10px 14px 2px", background: BG }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", borderRadius: 99,
          border: `1.5px solid ${BORDER}`, padding: "9px 14px",
        }}>
          <Search size={15} color={SUBTEXT} />
          <input
            type="text"
            placeholder="Buscar helado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, border: "none", outline: "none", fontSize: 13,
              color: TEXT, background: "transparent", fontFamily: "'Poppins', sans-serif",
            }}
          />
        </div>
      </div>

      <SubcatTabs active={subcat} onSelect={(s) => { setSubcat(s); setSearch(""); }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={subcat}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          <div style={{ padding: "4px 14px 14px" }}>
            {featured && (
              <FeaturedProductCard
                product={featured}
                isFirst={!search}
                onAdd={(p) => onAdd({ ...p, _subcat: subcat })}
              />
            )}

            {rest.length > 0 && (
              <>
                <p style={{
                  fontSize: 10, fontWeight: 800, color: MAGENTA,
                  textTransform: "uppercase", letterSpacing: "1.2px",
                  margin: "4px 0 10px",
                }}>
                  Todos los productos
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {rest.map(p => (
                    <GridProductCard key={p.id} product={p} onAdd={(p) => onAdd({ ...p, _subcat: subcat })} />
                  ))}
                </div>
              </>
            )}

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: SUBTEXT }}>
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