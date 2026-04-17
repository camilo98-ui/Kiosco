import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { formatCOP, TAG_CONFIG } from "@/lib/constants";
import { COMBOS_DATA } from "@/lib/combosData";

function HorizontalCard({ product, onAdd, addedFlash, bg }) {
  const isFlash = addedFlash === product.id;
  const [imgError, setImgError] = React.useState(false);
  return (
    <motion.div
      animate={isFlash ? { scale: 0.98 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onAdd(product)}
      style={{
        border: "0.5px solid #FFE4F3",
        borderRadius: 16,
        background: "#fff",
        height: 72,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(233,27,139,0.06)",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div style={{ width: 72, height: 72, background: bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.image_url && !imgError ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: 72, height: 72, objectFit: "cover" }} />
        ) : (
          <img src={product.image} alt={product.title} onError={() => setImgError(true)} style={{ width: 72, height: 72, objectFit: "cover" }} />
        )}
      </div>
      <div style={{ width: 1, height: 40, background: "#F0E4EA", flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#2D1A22", lineHeight: 1.3 }}>{product.title || product.name}</p>
        <p style={{ fontSize: 9, color: "#BBA8B0" }}>Disponible</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "#C41E6A" }}>{product.displayPrice || formatCOP(product.price)}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#C41E6A",
            color: "#fff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(233,27,139,0.25)",
            cursor: "pointer",
          }}
        >
          <Plus size={11} />
        </button>
      </div>
    </motion.div>
  );
}

export default function CookieJaarLayout({ onAdd, addedFlash }) {
  const [tab, setTab] = React.useState("galletas");
  const bg = "#FFF0F5";

  const cookieJaarProducts = useMemo(() => COMBOS_DATA.filter(p => p.badge === "Cookie Jaar"), []);

  const galletas = useMemo(() => cookieJaarProducts.filter(p => p.title.toLowerCase().includes("galleta")), [cookieJaarProducts]);
  const malteadas = useMemo(() => cookieJaarProducts.filter(p => p.title.toLowerCase().includes("malteada")), [cookieJaarProducts]);
  const combos = useMemo(() => cookieJaarProducts.filter(p => !p.title.toLowerCase().includes("galleta") && !p.title.toLowerCase().includes("malteada")), [cookieJaarProducts]);

  return (
    <>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, padding: "0 14px", marginBottom: 14 }}>
        {[
          { key: "galletas", label: "Galletas 🍪", count: galletas.length },
          { key: "malteadas", label: "Malteadas 🥤", count: malteadas.length },
          { key: "combos", label: "Combos 🎁", count: combos.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              background: tab === t.key ? "#C41E6A" : "#F3E8FF",
              color: tab === t.key ? "#fff" : "#7B3EA4",
              boxShadow: tab === t.key ? "0 4px 14px rgba(196,30,106,0.3)" : "none",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Galletas */}
      {tab === "galletas" && galletas.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginBottom: 14 }}>
          {galletas.map(p => (
            <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
          ))}
        </div>
      )}

      {/* Malteadas */}
      {tab === "malteadas" && malteadas.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14, marginBottom: 14 }}>
          {malteadas.map(p => (
            <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
          ))}
        </div>
      )}

      {/* Combos */}
      {tab === "combos" && combos.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 14, paddingRight: 14 }}>
          {combos.map(p => (
            <HorizontalCard key={p.id} product={p} onAdd={onAdd} addedFlash={addedFlash} bg={bg} />
          ))}
        </div>
      )}
    </>
  );
}