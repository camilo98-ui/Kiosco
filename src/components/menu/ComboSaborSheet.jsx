import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";

const SABORES_GOURMET = [
  "Vainilla Gourmet", "Brownie Gourmet", "Frutos Del Bosque Gourmet",
  "Crema De Limón Gourmet", "Oreo Gourmet", "Arequipe Gourmet",
  "Fresa Gourmet", "Mocaccino Juan Valdez", "Milky Way Gourmet",
  "Vainilla Francesa Gourmet", "Chocolate Belga Gourmet", "Vainilla Fresa Gourmet",
];

const SABORES_EXCLUSIVO = [
  "Yogo Yogo Fresa", "Cherry Mania", "M&M's", "Macadamia",
  "Oreo Exclusivo", "Brownie Exclusivo", "Vainilla Chips",
  "Arroz Con Leche", "Chicle", "Snickers Almond",
];

const SALSAS_MALTEADA = [
  "Salsa Arequipe", "Salsa De Caramelo", "Salsa De Chocolate",
  "Salsa De Fresa", "Salsa De Frutas", "Salsa De Mora", "Salsa Cereza Italiana",
];

function RadioOption({ label, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "12px 16px",
        background: "none", border: "none", cursor: "pointer", textAlign: "left",
        borderBottom: "1px solid #F9F0F4",
      }}
    >
      <span style={{ fontSize: 13, color: "#1A0A10" }}>{label}</span>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        border: selected ? `6px solid ${MAGENTA}` : "2px solid #DDD",
        background: "#fff", transition: "all 0.15s",
      }} />
    </button>
  );
}

export default function ComboSaborSheet({ combo, open, onClose, onAdd }) {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("gourmet");

  if (!combo) return null;

  const isLitro = combo.saborType === "litro";
  const isMalteada = combo.saborType === "malteada";

  const opciones = isLitro
    ? (tab === "gourmet" ? SABORES_GOURMET : SABORES_EXCLUSIVO)
    : SALSAS_MALTEADA;

  const handleConfirm = () => {
    if (!selected) return;
    const notes = isLitro
      ? `Sabor: ${selected} (${tab === "gourmet" ? "Gourmet" : "Exclusivo"})`
      : `Salsa: ${selected}`;
    onAdd(
      { product_id: `combo-${combo.id}`, product_name: combo.title, price: combo.price, quantity: 1 },
      notes
    );
    setSelected(null);
    setTab("gourmet");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl"
        style={{ background: "#FFFCFD", border: "none", maxHeight: "85vh", overflowY: "auto", padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F0E4EA" }}>
          <p style={{ fontSize: 11, color: "#BBA8B0", margin: "0 0 4px", fontWeight: 600 }}>
            {isLitro ? "Elige el sabor del litro" : "Elige el sabor de la malteada"}
          </p>
          <SheetTitle style={{ fontSize: 17, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {combo.title}
          </SheetTitle>
          <p style={{ fontSize: 13, color: MAGENTA, fontWeight: 700, margin: "4px 0 0" }}>
            {combo.displayPrice}
          </p>
        </div>

        {/* Tabs para litro */}
        {isLitro && (
          <div style={{ display: "flex", gap: 10, padding: "14px 16px 0" }}>
            {[{ key: "gourmet", label: "Gourmet" }, { key: "exclusivo", label: "Exclusivo" }].map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSelected(null); }}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 12, border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 13, fontFamily: "'Poppins', sans-serif",
                  background: tab === t.key ? MAGENTA : "#F3E8FF",
                  color: tab === t.key ? "#fff" : "#7B3EA4",
                  transition: "all 0.2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Lista de sabores */}
        <div style={{ paddingTop: 8 }}>
          {opciones.map(s => (
            <RadioOption key={s} label={s} selected={selected === s} onSelect={() => setSelected(s)} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!selected && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>
              * Elige un sabor para continuar
            </p>
          )}
          <button
            onClick={handleConfirm}
            disabled={!selected}
            style={{
              width: "100%", height: 54, borderRadius: 16,
              background: selected ? MAGENTA : "#EDD8E4",
              color: selected ? "#fff" : "#BBA8B0",
              fontSize: 15, fontWeight: 900, border: "none",
              cursor: selected ? "pointer" : "not-allowed",
              boxShadow: selected ? "0 4px 16px rgba(196,30,106,0.35)" : "none",
              transition: "all 0.2s", fontFamily: "'Poppins', sans-serif",
            }}
          >
            Agregar al pedido · {formatCOP(combo.price)}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}