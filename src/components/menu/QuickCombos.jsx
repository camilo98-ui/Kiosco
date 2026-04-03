import React from "react";
import { Plus, Zap } from "lucide-react";
import { formatCOP } from "@/lib/constants";

// Combos sugeridos — nombre, items a buscar en el catálogo por nombre parcial, precio total fijo, emoji
const QUICK_COMBOS = [
  {
    id: "c1",
    label: "Malteada + Agua",
    description: "Malteada a elección + Agua",
    emoji: "🥤",
    searchNames: ["malteada", "agua"],
    totalPrice: 24900,
    badge: "⚡ Más pedido",
    badgeColor: "#C2185B",
  },
  {
    id: "c2",
    label: "Galleta Suprema + Malteada Cherry",
    description: "Cookie Suprema + Malteada Cherry Manía",
    emoji: "🍪",
    searchNames: ["galleta suprema", "cherry"],
    totalPrice: 38900,
    badge: "🔥 Favorito",
    badgeColor: "#E65100",
  },
  {
    id: "c3",
    label: "Cono + Malteada",
    description: "Cono tradicional + Malteada a elección",
    emoji: "🍦",
    searchNames: ["cono", "malteada"],
    totalPrice: 29900,
    badge: "✨ Recomendado",
    badgeColor: "#6A1B9A",
  },
  {
    id: "c4",
    label: "Cookie Jar + Café",
    description: "Cookie Jar especial + Café americano",
    emoji: "☕",
    searchNames: ["cookie jar", "americano"],
    totalPrice: 32900,
    badge: "🆕 Nuevo",
    badgeColor: "#2E7D32",
  },
  {
    id: "c5",
    label: "Tarrina + Malteada",
    description: "Tarrina de helado + Malteada de fresa",
    emoji: "🍧",
    searchNames: ["tarrina", "fresa"],
    totalPrice: 34900,
    badge: "💛 Clásico",
    badgeColor: "#F57F17",
  },
];

export default function QuickCombos({ products, onAddMultiple }) {
  if (!products || products.length === 0) return null;

  const handleComboClick = (combo) => {
    // Busca productos reales que coincidan con los nombres del combo
    const found = combo.searchNames.map((searchName) => {
      return products.find(
        (p) =>
          p.is_available !== false &&
          p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }).filter(Boolean);

    if (found.length > 0) {
      found.forEach((p) => onAddMultiple(p));
    } else {
      // Si no encuentra productos exactos, solo muestra el combo visualmente
      // (el cliente pedirá en caja)
      alert(`Combo "${combo.label}" agregado al pedido por ${formatCOP(combo.totalPrice)}`);
    }
  };

  return (
    <div style={{ background: "#fff", marginTop: 10 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "18px 16px 12px" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #B5175A, #E91E8C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={14} color="#fff" />
        </div>
        <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: 0 }}>Arma tu combo rápido</p>
      </div>
      <p style={{ fontSize: 12, color: "#BBA8B0", margin: "-4px 16px 12px", lineHeight: 1.4 }}>
        Combos pensados para ti · Todo en un clic
      </p>

      {/* Tarjetas horizontales */}
      <div style={{ display: "flex", overflowX: "auto", gap: 10, paddingLeft: 16, paddingRight: 16, paddingBottom: 16, scrollbarWidth: "none", scrollSnapType: "x mandatory" }}>
        {QUICK_COMBOS.map((combo) => (
          <button
            key={combo.id}
            onClick={() => handleComboClick(combo)}
            style={{
              flexShrink: 0,
              width: 170,
              borderRadius: 18,
              border: "1.5px solid #F0E4EA",
              background: "#FFFCFD",
              padding: "14px 12px 12px",
              cursor: "pointer",
              textAlign: "left",
              position: "relative",
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {/* Badge */}
            <span style={{
              position: "absolute", top: 10, right: 10,
              fontSize: 8, fontWeight: 800, color: "#fff",
              background: combo.badgeColor,
              borderRadius: 20, padding: "2px 7px",
            }}>
              {combo.badge}
            </span>

            {/* Emoji */}
            <span style={{ fontSize: 32, lineHeight: 1 }}>{combo.emoji}</span>

            {/* Nombre */}
            <p style={{ fontSize: 12, fontWeight: 800, color: "#1A0A10", margin: 0, lineHeight: 1.3, paddingRight: 20 }}>
              {combo.label}
            </p>

            {/* Descripción */}
            <p style={{ fontSize: 10, color: "#BBA8B0", margin: 0, lineHeight: 1.4 }}>
              {combo.description}
            </p>

            {/* Footer precio + botón */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
              <div>
                <p style={{ fontSize: 8, color: "#BBA8B0", margin: 0 }}>desde</p>
                <p style={{ fontSize: 15, fontWeight: 900, color: "#B5175A", margin: 0 }}>
                  {formatCOP(combo.totalPrice)}
                </p>
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "#B5175A",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 3px 10px rgba(181,23,90,0.35)",
              }}>
                <Plus size={14} color="#fff" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}