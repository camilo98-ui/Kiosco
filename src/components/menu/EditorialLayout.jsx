import React, { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP, TAG_CONFIG, CATEGORIES } from "@/lib/constants";

const CATEGORY_BG = {
  helados: "#FFF0F5",
  malteadas: "#F3E8FF",
  especialidades: "#FFFAF0",
  cafe: "#FFF5F0",
  galletas: "#FFF9F0",
  paletas_packs: "#F0FFF4",
  popsy_toy: "#F0F5FF",
  para_llevar: "#F5FFF0",
  tortas: "#FFF0F5",
  regalos: "#FFF0FF",
  bebidas: "#F0FAFF",
  adiciones: "#FFFAF0",
};

function TagBadge({ product }) {
  const tag = TAG_CONFIG[product.tag];
  if (!tag || product.tag === "none") return null;
  return (
    <span style={{
      fontSize: 8, background: "#C2185B", color: "#fff",
      borderRadius: 20, padding: "2px 7px", fontWeight: 900,
      position: "absolute", top: 8, left: 8, zIndex: 2,
    }}>
      {tag.label}
    </span>
  );
}

function AddButton({ onAdd, product, size = 24 }) {
  if (product.is_available === false) return null;
  return (
    <button
      onClick={() => onAdd(product)}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "#C2185B", color: "#fff", border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(194,24,91,0.35)",
        cursor: "pointer", flexShrink: 0,
      }}
    >
      <Plus size={size * 0.55} />
    </button>
  );
}

function EmojiBox({ product, bg, height = 120, emojiSize = 50 }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div style={{
      background: bg, height, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      <div style={{ position: "absolute", width: emojiSize * 1.8, height: emojiSize * 1.8, borderRadius: "50%", background: "rgba(194,24,91,0.06)" }} />
      <div style={{ position: "absolute", width: emojiSize * 1.3, height: emojiSize * 1.3, borderRadius: "50%", background: "rgba(194,24,91,0.10)" }} />
      {product.image_url && !imgError ? (
        <img src={product.image_url} alt={product.name} onError={() => setImgError(true)}
          style={{ width: emojiSize * 1.2, height: emojiSize * 1.2, objectFit: "cover", borderRadius: "50%", position: "relative", zIndex: 1 }} />
      ) : (
        <span style={{ fontSize: emojiSize, lineHeight: 1, position: "relative", zIndex: 1 }}>{product.emoji || "🍦"}</span>
      )}
    </div>
  );
}

// ── LAYOUTS ESPECÍFICOS ──

// Helados & default: asimétrico
function TallCard({ product, onAdd, addedFlash, bg }) {
  const isFlash = addedFlash === product.id;
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ flex: 1.4, border: "1.5px solid #F0E4EA", borderRadius: 22, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column" }}>
      <TagBadge product={product} />
      <EmojiBox product={product} bg={bg} height={120} emojiSize={50} />
      <div style={{ padding: "10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 8, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
          <AddButton onAdd={onAdd} product={product} size={24} />
        </div>
      </div>
    </motion.div>
  );
}

function SmallCard({ product, onAdd, addedFlash, bg }) {
  const isFlash = addedFlash === product.id;
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ flex: 1, border: "1.5px solid #F0E4EA", borderRadius: 18, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column" }}>
      <TagBadge product={product} />
      <button onClick={() => onAdd(product)} style={{
        position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: "50%",
        background: "#fff", border: "1.5px solid #C2185B",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2,
      }}><Plus size={10} color="#C2185B" /></button>
      <EmojiBox product={product} bg={bg} height={58} emojiSize={28} />
      <div style={{ padding: "6px 8px 8px" }}>
        <p style={{ fontSize: 8, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 10, fontWeight: 900, color: "#C2185B", marginTop: 2 }}>{formatCOP(product.price)}</p>
      </div>
    </motion.div>
  );
}

function HorizontalCard({ product, onAdd, addedFlash, bg }) {
  const [imgError, setImgError] = useState(false);
  const isFlash = addedFlash === product.id;
  return (
    <motion.div animate={isFlash ? { scale: 0.98 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ border: "1.5px solid #F0E4EA", borderRadius: 18, background: "#fff", height: 72, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ width: 72, height: 72, background: bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgError
          ? <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: 72, height: 72, objectFit: "cover" }} />
          : <span style={{ fontSize: 30 }}>{product.emoji || "🍦"}</span>}
      </div>
      <div style={{ width: 1, height: 40, background: "#F0E4EA", flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 9, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
        <AddButton onAdd={onAdd} product={product} size={22} />
      </div>
    </motion.div>
  );
}

// Malteadas: carrusel showcase
function ShowcaseCard({ product, onAdd, addedFlash, bg }) {
  const [imgError, setImgError] = useState(false);
  const isFlash = addedFlash === product.id;
  const tag = TAG_CONFIG[product.tag];
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ width: 140, flexShrink: 0, border: "1.5px solid #F0E4EA", borderRadius: 22, overflow: "hidden", background: "#fff", position: "relative", display: "flex", flexDirection: "column" }}>
      {tag && product.tag !== "none" && (
        <span style={{ position: "absolute", top: 8, left: 8, fontSize: 8, background: "#C2185B", color: "#fff", borderRadius: 20, padding: "2px 7px", fontWeight: 900, zIndex: 2 }}>
          {tag.label}
        </span>
      )}
      <div style={{ height: 80, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgError
          ? <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: 80, objectFit: "cover" }} />
          : <span style={{ fontSize: 38 }}>{product.emoji || "🥤"}</span>}
      </div>
      <div style={{ padding: "10px 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 9, color: "#BBA8B0" }}>Disponible ahora</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
          <AddButton onAdd={onAdd} product={product} size={22} />
        </div>
      </div>
    </motion.div>
  );
}

function MalteadasLayout({ products, onAdd, addedFlash, bg, catLabel }) {
  const top = products.slice(0, 6);
  const rest = products.slice(6);
  return (
    <>
      <div style={{ overflowX: "auto", paddingLeft: 14, paddingRight: 14, scrollbarWidth: "none" }}>
        <div style={{ display: "flex", gap: 10, paddingBottom: 4 }}>
          {top.map(p => <ShowcaseCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
        </div>
      </div>
      {rest.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px" }}>
            <div style={{ flex: 1, height: 1, background: "#F0E4EA" }} />
            <p style={{ fontSize: 8, color: "#DDD", textTransform: "uppercase", letterSpacing: "1px" }}>Más {catLabel}</p>
            <div style={{ flex: 1, height: 1, background: "#F0E4EA" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
            {rest.map(p => <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
          </div>
        </>
      )}
    </>
  );
}

// Especiales: lista editorial imagen derecha
function EspecialesCard({ product, onAdd, addedFlash, bg }) {
  const [imgError, setImgError] = useState(false);
  const isFlash = addedFlash === product.id;
  const tag = TAG_CONFIG[product.tag];
  return (
    <motion.div animate={isFlash ? { scale: 0.98 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ border: "1.5px solid #F0E4EA", borderRadius: 18, background: "#fff", height: 90, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 3 }}>
        {tag && product.tag !== "none" && (
          <span style={{ fontSize: 8, background: "#FCE4EC", color: "#880E4F", borderRadius: 10, padding: "1px 6px", fontWeight: 800, alignSelf: "flex-start" }}>{tag.label}</span>
        )}
        <p style={{ fontSize: 13, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 9, color: "#BBA8B0" }}>{product.is_available !== false ? "Disponible" : "Agotado"}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#C2185B" }}>{formatCOP(product.price)}</span>
          <AddButton onAdd={onAdd} product={product} size={22} />
        </div>
      </div>
      <div style={{ width: 90, height: 90, background: bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgError
          ? <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: 90, height: 90, objectFit: "cover" }} />
          : <span style={{ fontSize: 40 }}>{product.emoji || "🌟"}</span>}
      </div>
    </motion.div>
  );
}

// Café: grid 2 columnas cuadrado
function CafeCard({ product, onAdd, addedFlash, bg }) {
  const [imgError, setImgError] = useState(false);
  const isFlash = addedFlash === product.id;
  const tag = TAG_CONFIG[product.tag];
  return (
    <motion.div animate={isFlash ? { scale: 0.97 } : { scale: 1 }} transition={{ duration: 0.15 }}
      style={{ border: "1.5px solid #F0E4EA", borderRadius: 20, background: "#fff", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
      {tag && product.tag !== "none" && (
        <span style={{ position: "absolute", top: 6, left: 6, fontSize: 7, background: "#E8F5E9", color: "#2E7D32", borderRadius: 10, padding: "1px 6px", fontWeight: 800, zIndex: 2 }}>Nuevo</span>
      )}
      <div style={{ height: 80, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgError
          ? <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: 80, objectFit: "cover" }} />
          : <span style={{ fontSize: 32 }}>{product.emoji || "☕"}</span>}
      </div>
      <div style={{ padding: "8px 10px 10px", flex: 1, position: "relative" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 11, fontWeight: 900, color: "#C2185B", marginTop: 3 }}>{formatCOP(product.price)}</p>
        <button onClick={() => onAdd(product)} style={{
          position: "absolute", bottom: 8, right: 8,
          width: 22, height: 22, borderRadius: "50%",
          background: "#C2185B", color: "#fff", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 6px rgba(194,24,91,0.3)", cursor: "pointer",
        }}><Plus size={11} /></button>
      </div>
    </motion.div>
  );
}

// Sección header reutilizable
function SectionHeader({ label, count }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 14, paddingRight: 14, marginBottom: 10 }}>
      <p style={{ fontSize: 9, fontWeight: 800, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1.5px" }}>
        {label} · {count} disponibles
      </p>
      <p style={{ fontSize: 9, color: "#C2185B", fontWeight: 700 }}>Ver todos →</p>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px" }}>
      <div style={{ flex: 1, height: 1, background: "#F0E4EA" }} />
      <p style={{ fontSize: 8, color: "#DDD", textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap" }}>Más {label}</p>
      <div style={{ flex: 1, height: 1, background: "#F0E4EA" }} />
    </div>
  );
}

// ── LAYOUT PRINCIPAL ──
export default function EditorialLayout({ products, category, onAdd, addedFlash }) {
  if (!products || products.length === 0) return null;

  const bg = CATEGORY_BG[category] || "#FFF0F5";
  const catLabel = CATEGORIES.find(c => c.id === category)?.label || category;
  const available = products.filter(p => p.is_available !== false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.2 }}
        style={{ paddingBottom: 8 }}
      >
        <SectionHeader label={catLabel} count={available.length} />

        {/* MALTEADAS */}
        {category === "malteadas" && (
          <MalteadasLayout products={available} onAdd={onAdd} addedFlash={addedFlash} bg={bg} catLabel={catLabel} />
        )}

        {/* ESPECIALES */}
        {category === "especialidades" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
            {available.map(p => <EspecialesCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
          </div>
        )}

        {/* CAFÉ */}
        {category === "cafe" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingLeft: 14, paddingRight: 14 }}>
            {available.map(p => <CafeCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
          </div>
        )}

        {/* HELADOS + RESTO: asimétrico */}
        {category !== "malteadas" && category !== "especialidades" && category !== "cafe" && (() => {
          const top = available.slice(0, 3);
          const rest = available.slice(3);
          const tall = top[0];
          const smalls = top.slice(1, 3);
          return (
            <>
              {tall && (
                <div style={{ display: "flex", gap: 8, paddingLeft: 14, paddingRight: 14, marginBottom: 10 }}>
                  <TallCard product={tall} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
                  {smalls.length > 0 && (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      {smalls.map(p => <SmallCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
                    </div>
                  )}
                </div>
              )}
              {rest.length > 0 && (
                <>
                  <Divider label={catLabel} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
                    {rest.map(p => <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />)}
                  </div>
                </>
              )}
            </>
          );
        })()}
      </motion.div>
    </AnimatePresence>
  );
}