import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCOP } from "@/lib/constants";

const SABORES_HELADO = [
  "Yogo Yogo Fresa",
  "Arequipe Gourmet",
  "Brownie Gourmet",
  "Cherry Mania",
  "Chocolate Gourmet",
  "Chocolate Belga",
  "Crema Limón",
  "Fresa Gourmet",
  "M&M's",
  "Mandarina Gourmet",
  "Milky Way Gourmet",
  "Mocaccino Juan Valdez",
  "Oreo",
  "Ron Con Pasas Gourmet",
  "Vainilla Gourmet",
  "Vainilla Chips",
  "Vainilla Francesa Gourmet",
  "Nieve Limón",
  "Nieve Mandarina",
  "Nieve Maracuyá",
  "Yogurt De Cereza Italiana",
  "Chicle Gourmet",
  "Snickers Almond Gourmet",
];

const EXTRAS = [
  { name: "Gomas Ositos", price: 3100 },
  { name: "Cerezas", price: 3100 },
  { name: "M&M's", price: 3100 },
  { name: "Banano", price: 3000 },
  { name: "Fresas", price: 3100 },
  { name: "Durazno", price: 3100 },
  { name: "Mini Masmelos", price: 3100 },
  { name: "Chantilly", price: 3100 },
  { name: "Chips De Chocolate", price: 3100 },
  { name: "Brownie", price: 3100 },
  { name: "Galleta Oreo", price: 3100 },
  { name: "Nueces", price: 3000 },
  { name: "Barquillos", price: 3100 },
  { name: "Chocolatina Milky Way", price: 3000 },
  { name: "Leche Condensada", price: 3100 },
  { name: "Macadamia", price: 3100 },
  { name: "Sprinkles", price: 3100 },
];

const SECTIONS = ["sabor", "extras"];

function AccordionSection({ title, required, open, onToggle, children, badge }) {
  return (
    <div style={{ borderBottom: "1px solid #F0E4EA" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "14px 16px",
          background: "none", border: "none", cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>{title}</span>
          {required && (
            <span style={{ fontSize: 10, color: "#C2185B", background: "#FFF0F5", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
              Obligatorio
            </span>
          )}
          {badge && (
            <span style={{ fontSize: 10, color: "#C2185B", fontWeight: 700 }}>{badge}</span>
          )}
        </div>
        <span style={{ fontSize: 18, color: "#BBA8B0" }}>{open ? "∧" : "∨"}</span>
      </button>
      {open && <div style={{ paddingBottom: 8 }}>{children}</div>}
    </div>
  );
}

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
        width: 22, height: 22, borderRadius: "50%",
        border: selected ? "6px solid #C2185B" : "2px solid #DDD",
        background: "#fff", flexShrink: 0, transition: "all 0.15s",
      }} />
    </button>
  );
}

function CheckOption({ label, price, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "12px 16px",
        background: "none", border: "none", cursor: "pointer", textAlign: "left",
        borderBottom: "1px solid #F9F0F4",
      }}
    >
      <div>
        <span style={{ fontSize: 13, color: "#1A0A10" }}>{label}</span>
        <span style={{ fontSize: 11, color: "#C2185B", marginLeft: 6, fontWeight: 700 }}>
          + {formatCOP(price)}
        </span>
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 5,
        border: selected ? "none" : "2px solid #DDD",
        background: selected ? "#C2185B" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.15s",
      }}>
        {selected && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
      </div>
    </button>
  );
}

export default function HeladoCustomizer({ product, open, onClose, onAdd }) {
  const [openSection, setOpenSection] = useState("sabor");
  const [sabor, setSabor] = useState(null);
  const [extras, setExtras] = useState([]);

  const advanceToNext = (current) => {
    const idx = SECTIONS.indexOf(current);
    const next = SECTIONS[idx + 1];
    if (next) setTimeout(() => setOpenSection(next), 200);
  };

  const toggleExtra = (name, price) => {
    setExtras(prev =>
      prev.find(e => e.name === name)
        ? prev.filter(e => e.name !== name)
        : [...prev, { name, price }]
    );
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = (product?.price || 0) + extrasTotal;

  const handleConfirm = () => {
    if (!sabor) return;
    const notes = [
      `Sabor: ${sabor}`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");

    onAdd({ ...product, price: total }, notes);
    setSabor(null); setExtras([]);
    setOpenSection("sabor");
    onClose();
  };

  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl"
        style={{ background: "#FFFCFD", border: "none", maxHeight: "90vh", overflowY: "auto", padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F0E4EA" }}>
          <p style={{ fontSize: 11, color: "#BBA8B0", margin: "0 0 4px", fontWeight: 600 }}>Personalizando</p>
          <SheetTitle style={{ fontSize: 18, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {product?.name}
          </SheetTitle>
          <p style={{ fontSize: 13, color: "#C2185B", fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(product?.price || 0)}
          </p>
        </div>

        {/* Sabor */}
        <AccordionSection
          title="Elige El Sabor De Helado"
          required
          open={openSection === "sabor"}
          onToggle={() => setOpenSection(s => s === "sabor" ? null : "sabor")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona 1 opción</p>
          {SABORES_HELADO.map(s => (
            <RadioOption
              key={s}
              label={s}
              selected={sabor === s}
              onSelect={() => { setSabor(s); advanceToNext("sabor"); }}
            />
          ))}
        </AccordionSection>

        {/* Extras */}
        <AccordionSection
          title="Elige Tus Extras"
          required={false}
          open={openSection === "extras"}
          onToggle={() => setOpenSection(s => s === "extras" ? null : "extras")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Opcionales · puedes elegir varios</p>
          {EXTRAS.map(e => (
            <CheckOption
              key={e.name}
              label={`Adición ${e.name}`}
              price={e.price}
              selected={!!extras.find(x => x.name === e.name)}
              onToggle={() => toggleExtra(e.name, e.price)}
            />
          ))}
        </AccordionSection>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!sabor && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>
              * Elige un sabor para continuar
            </p>
          )}
          <button
            onClick={handleConfirm}
            disabled={!sabor}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: sabor ? "#C2185B" : "#EDD8E4",
              color: sabor ? "#fff" : "#BBA8B0",
              fontSize: 15, fontWeight: 900, border: "none",
              cursor: sabor ? "pointer" : "not-allowed",
              boxShadow: sabor ? "0 4px 16px rgba(194,24,91,0.35)" : "none",
              transition: "all 0.2s",
            }}
          >
            Agregar al pedido · {formatCOP(total)}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}