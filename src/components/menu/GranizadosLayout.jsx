import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { formatCOP } from "@/lib/constants";

const FONT = "-apple-system, 'SF Pro Display', 'Poppins', sans-serif";
const MAGENTA = "#E8187A";

function SizeBadge({ name }) {
  const is12 = name.includes("12oz");
  const is16 = name.includes("16oz");
  if (!is12 && !is16) return null;
  return (
    <span style={{
      position: "absolute", top: 10, left: 10,
      fontSize: 9, fontWeight: 700, borderRadius: 99, padding: "3px 8px",
      background: "rgba(0,0,0,0.45)", color: "#fff",
    }}>
      {is16 ? "16oz" : "12oz"}
    </span>
  );
}

function GranizadoCard({ product, onAdd }) {
  const [imgErr, setImgErr] = React.useState(false);
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => product.is_available !== false && onAdd(product)}
      style={{
        background: "#fff", borderRadius: 18, overflow: "hidden",
        boxShadow: "0 3px 14px rgba(232,24,122,0.09)", cursor: "pointer",
        display: "flex", flexDirection: "column", position: "relative",
      }}
    >
      <div style={{ height: 170, overflow: "hidden", position: "relative" }}>
        {product.image_url && !imgErr ? (
          <img src={product.image_url} alt={product.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#E0F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>🧊</div>
        )}
        <SizeBadge name={product.name} />
      </div>
      <div style={{ padding: "10px 12px 40px" }}>
        <p style={{
          fontSize: 13, fontWeight: 700, color: "#111", margin: 0, lineHeight: 1.3, fontFamily: FONT,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>
        <p style={{ fontSize: 14, fontWeight: 900, color: MAGENTA, margin: "5px 0 0", fontFamily: FONT }}>
          {formatCOP(product.price)}
        </p>
      </div>
      {product.is_available !== false && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          style={{
            position: "absolute", bottom: 10, right: 10,
            width: 32, height: 32, borderRadius: "50%", background: MAGENTA,
            color: "#fff", border: "none", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
            boxShadow: "0 3px 10px rgba(232,24,122,0.35)",
          }}
        >
          <Plus size={15} />
        </button>
      )}
    </motion.div>
  );
}

// Granizados hardcodeados con sus imágenes correctas (siempre disponibles)
const GRANIZADOS_FIJOS = [
  { id: "gran-maracuya-16", name: "Granizado Maracuyá 16oz", price: 16900, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9e4dc2ba3_GranizadoMaracuy16Onzas16900.png", is_available: true },
  { id: "gran-mandarina-16", name: "Granizado Mandarina 16oz", price: 16900, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/a6c44a954_GranizadoMandarina16Onzas16900.png", is_available: true },
  { id: "gran-limon-16", name: "Granizado Limón 16oz", price: 16900, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e5c05c503_GranizadodeLimn16Onzas16900.png", is_available: true },
  { id: "gran-mandarina-12", name: "Granizado Mandarina 12oz", price: 14900, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/f250a375a_GranizadoMandarina12Onzas14900.png", is_available: true },
  { id: "gran-maracuya-12", name: "Granizado Maracuyá 12oz", price: 14900, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6b8736279_GranizadoMaracuy12Onzas14900.png", is_available: true },
];

export default function GranizadosLayout({ products, onAdd }) {
  // Usar los productos de la BD si existen, sino los fijos
  const dbProducts = products.filter(p => p.is_available !== false && p.name.toLowerCase().includes("granizado"));
  const available = dbProducts.length > 0 ? dbProducts : GRANIZADOS_FIJOS;
  const g16 = available.filter(p => p.name.includes("16oz"));
  const g12 = available.filter(p => p.name.includes("12oz"));
  const other = available.filter(p => !p.name.includes("16oz") && !p.name.includes("12oz"));

  const renderGroup = (items, label) => {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: 20 }}>
        <p style={{
          fontSize: 9, fontWeight: 800, color: "#BBA8B0",
          textTransform: "uppercase", letterSpacing: "1.5px",
          margin: "0 0 12px", fontFamily: FONT,
        }}>
          🧊 {label}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {items.map(p => <GranizadoCard key={p.id} product={p} onAdd={onAdd} />)}
        </div>
      </div>
    );
  };

  // Si hay separación 16oz / 12oz, mostrar secciones
  if (g16.length > 0 || g12.length > 0) {
    return (
      <div style={{ padding: "8px 14px" }}>
        {renderGroup(g16, "Granizados 16oz")}
        {renderGroup(g12, "Granizados 12oz")}
        {renderGroup(other, "Otros granizados")}
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {available.map(p => <GranizadoCard key={p.id} product={p} onAdd={onAdd} />)}
      </div>
    </div>
  );
}