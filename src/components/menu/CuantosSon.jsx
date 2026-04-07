import React, { useRef, useEffect, useState, useCallback } from "react";
import { formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const SECTIONS = [
  {
    id: "para_ti",
    emoji: "🍦",
    label: "Para ti",
    subtitle: "5 opciones · Desde $7.500",
    badge: "Solo",
    color: "#C41E6A",
    combos: [
      { title: "Helado 1 Sabor", price: 7500, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
      { title: "Malteada 12oz", price: 15900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
      { title: "Americano + Galleta", price: 20800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e15d81047_Coffee.png" },
      { title: "Helado Gourmet 1 Sabor", price: 9500, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
      { title: "Granizado 12oz", price: 15900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/923ba973b_images2.jpg" },
    ],
  },
  {
    id: "para_dos",
    emoji: "👫",
    label: "Para dos",
    subtitle: "5 opciones · Desde $17.000",
    badge: "x2",
    color: "#7B3EA4",
    combos: [
      { title: "2 Helados Gourmet", price: 17000, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
      { title: "Malteada + Agua", price: 25800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
      { title: "Galleta + HLD x2", price: 25800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6dd912084_cookie-jaar-img.jpg" },
      { title: "Combo 2 Tarrinas", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Banana Split x2", price: 35800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
    ],
  },
  {
    id: "para_4",
    emoji: "👨‍👩‍👧",
    label: "Para 4",
    subtitle: "5 opciones · Consulta precios",
    badge: "x4",
    color: "#1565C0",
    combos: [
      { title: "Litro + Brownie x8", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Combo 2 Tarrinas", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Pack 4 Malteadas", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
      { title: "Combo Litro Caja Cono", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "4 Helados Exclusivos", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
    ],
  },
  {
    id: "para_celebrar",
    emoji: "🎉",
    label: "Para celebrar",
    subtitle: "5 opciones · Especial",
    badge: "🎊",
    color: "#E65100",
    combos: [
      { title: "Torta Tarrina o Litro", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
      { title: "Combo Litro Caja Cono", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Banana Split x2", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
      { title: "Copa Gelarti Pops", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
      { title: "Skillet Galleta Mediana", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6dd912084_cookie-jaar-img.jpg" },
    ],
  },
];

// Grid rotante de 3 columnas — cada columna rota de forma independiente
function RotatingGrid({ combos, color, onAdd }) {
  // 3 columnas, cada una muestra un producto diferente
  const [indices, setIndices] = useState([0, 1, 2]);
  const [fading, setFading] = useState([false, false, false]);
  const activeIdx = Math.floor(indices[0] / combos.length) % combos.length;

  useEffect(() => {
    if (combos.length <= 3) return;
    const interval = setInterval(() => {
      // Rotar columna 0 → 1 → 2 con delay escalonado
      [0, 1, 2].forEach((col, i) => {
        setTimeout(() => {
          setFading(prev => { const n = [...prev]; n[col] = true; return n; });
          setTimeout(() => {
            setIndices(prev => {
              const n = [...prev];
              n[col] = (n[col] + 1) % combos.length;
              return n;
            });
            setFading(prev => { const n = [...prev]; n[col] = false; return n; });
          }, 200);
        }, i * 300);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [combos.length]);

  const dotIdx = indices[0] % combos.length;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 14px" }}>
        {[0, 1, 2].map(col => {
          const combo = combos[indices[col] % combos.length];
          const [imgErr, setImgErr] = useState(false);
          return (
            <motion.button
              key={col}
              whileTap={{ scale: 0.96 }}
              onClick={() => onAdd && onAdd({ name: combo.title, product_name: combo.title, price: combo.price, product_id: combo.title })}
              style={{
                borderRadius: 14, border: "0.5px solid #FFE4F3", background: "#FFF5F9",
                overflow: "hidden", cursor: "pointer", padding: 0,
                opacity: fading[col] ? 0 : 1,
                transition: "opacity 0.2s ease",
                display: "flex", flexDirection: "column",
                boxShadow: "0 2px 6px rgba(196,30,106,0.07)",
              }}
            >
              <div style={{ height: 70, background: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {combo.image && !imgErr ? (
                  <img src={combo.image} alt={combo.title} onError={() => setImgErr(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 24 }}>🍦</span>
                )}
              </div>
              <div style={{ padding: "5px 6px 7px" }}>
                <p style={{
                  fontSize: 10, fontWeight: 600, color: "#1A1A1A", margin: 0, lineHeight: 1.3,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {combo.title}
                </p>
                {combo.price > 0 && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#C41E6A", margin: "2px 0 0" }}>
                    {formatCOP(combo.price)}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 10 }}>
        {combos.map((_, i) => (
          <div key={i} style={{
            width: dotIdx === i ? 16 : 6, height: 6,
            borderRadius: 3,
            background: dotIdx === i ? color : "#F9C6E0",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

function SectionCard({ section, isOpen, onToggle, onAdd, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      style={{
        background: "#fff", borderRadius: 18,
        border: "0.5px solid #FFE4F3",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(196,30,106,0.06)",
        marginBottom: 10,
      }}
    >
      {/* Header tappable */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 12, background: "#FFF0F5",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>
          {section.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>{section.label}</p>
          <p style={{ fontSize: 11, color: "#999", margin: "1px 0 0" }}>{section.subtitle}</p>
        </div>
        <span style={{
          background: section.color, color: "#fff",
          fontSize: 11, fontWeight: 800,
          borderRadius: 20, padding: "4px 10px",
          flexShrink: 0,
        }}>
          {section.badge}
        </span>
        <ChevronDown
          size={18} color="#BBA8B0"
          style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
        />
      </button>

      {/* Contenido expandible */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: 14 }}>
              <RotatingGrid combos={section.combos} color={section.color} onAdd={onAdd} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CuantosSon({ onAdd }) {
  const [openId, setOpenId] = useState("para_ti"); // Primera abierta por defecto

  const toggle = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <div style={{ background: "#FAFAFA", paddingTop: 22, paddingBottom: 8, marginTop: 10, borderTop: "1px solid #F0E4EA" }}>
      <div style={{ padding: "0 16px", marginBottom: 16 }}>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>¿Cuántos son? 🍦</p>
        <p style={{ fontSize: 12, color: "#999", margin: "2px 0 0" }}>Toca para ver las mejores opciones</p>
      </div>
      <div style={{ padding: "0 12px" }}>
        {SECTIONS.map((section, i) => (
          <SectionCard
            key={section.id}
            section={section}
            isOpen={openId === section.id}
            onToggle={() => toggle(section.id)}
            onAdd={onAdd}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}