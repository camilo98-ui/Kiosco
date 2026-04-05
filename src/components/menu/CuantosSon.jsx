import React, { useRef, useState } from "react";
import { formatCOP } from "@/lib/constants";

const SECTIONS = [
  {
    id: "para_ti",
    emoji: "🍦",
    label: "Para ti",
    badge: "1",
    combos: [
      { title: "Helado 1 Sabor", price: 7500, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
      { title: "Malteada 12oz", price: 15900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
      { title: "Americano + Galleta", price: 20800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e15d81047_Coffee.png" },
    ],
  },
  {
    id: "para_dos",
    emoji: "👫",
    label: "Para dos",
    badge: "2",
    combos: [
      { title: "2 Helados Gourmet", price: 17000, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
      { title: "Malteada + Agua", price: 25800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
      { title: "Galleta + HLD x2", price: 25800, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6dd912084_cookie-jaar-img.jpg" },
    ],
  },
  {
    id: "para_4",
    emoji: "👨‍👩‍👧",
    label: "Para 4",
    badge: "4",
    combos: [
      { title: "Combo Litro Brownie 8 uds", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Combo 2 Tarrinas", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Pack 4 Malteadas", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
    ],
  },
  {
    id: "para_celebrar",
    emoji: "🎉",
    label: "Para celebrar",
    badge: "🎊",
    combos: [
      { title: "Torta Tarrina o Litro", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
      { title: "Combo Litro Caja Cono", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
      { title: "Banana Split x2", price: 0, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
    ],
  },
];

function ComboCard({ combo, onAdd }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <button
      onClick={() => onAdd && onAdd({ name: combo.title, product_name: combo.title, price: combo.price, product_id: combo.title })}
      style={{
        width: 160,
        height: 200,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        border: "none",
        cursor: "pointer",
        padding: 0,
        boxShadow: "0 8px 24px rgba(180,0,80,0.12)",
      }}
    >
      {/* Fondo imagen */}
      {!imgError ? (
        <img
          src={combo.image}
          alt={combo.title}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#C41E6A,#FF6EB4)", position: "absolute", inset: 0 }} />
      )}
      {/* Overlay degradado */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
      }} />
      {/* Texto */}
      <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 2, textAlign: "left" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>{combo.title}</p>
        {combo.price > 0 && (
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", margin: "3px 0 0", fontWeight: 600 }}>
            Desde {formatCOP(combo.price)}
          </p>
        )}
      </div>
    </button>
  );
}

function SectionRow({ section, onAdd }) {
  const rowRef = useRef(null);
  const startX = useRef(null);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    startX.current = e.pageX - rowRef.current.offsetLeft;
    scrollLeft.current = rowRef.current.scrollLeft;
  };
  const handleMouseMove = (e) => {
    if (startX.current === null) return;
    const x = e.pageX - rowRef.current.offsetLeft;
    rowRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  };
  const handleMouseUp = () => { startX.current = null; };

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Header de sección */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{section.emoji}</span>
        <p style={{ fontSize: 17, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>{section.label}</p>
        <span style={{
          background: "#C41E6A", color: "#fff",
          fontSize: 11, fontWeight: 800,
          borderRadius: 20, padding: "3px 10px",
          transform: "rotate(-2deg)", display: "inline-block",
        }}>
          {section.badge} {typeof section.badge === "number" ? "pers." : ""}
        </span>
      </div>
      {/* Carrusel horizontal */}
      <div
        ref={rowRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: "flex", gap: 12,
          overflowX: "auto", padding: "4px 16px 8px",
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
          cursor: "grab",
        }}
      >
        {section.combos.map((combo, i) => (
          <ComboCard key={i} combo={combo} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}

export default function CuantosSon({ onAdd }) {
  return (
    <div style={{ background: "linear-gradient(180deg, #FFF0F7 0%, #FFFFFF 100%)", paddingTop: 20, paddingBottom: 8, marginTop: 10 }}>
      {/* Título principal */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 18 }}>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>¿Cuántos son? 🍦</p>
        <span style={{
          background: "#C41E6A", color: "#fff",
          fontSize: 11, fontWeight: 800,
          borderRadius: 20, padding: "4px 12px",
          transform: "rotate(-2deg)", display: "inline-block",
        }}>
          Arma tu plan
        </span>
      </div>
      {SECTIONS.map(section => (
        <SectionRow key={section.id} section={section} onAdd={onAdd} />
      ))}
    </div>
  );
}