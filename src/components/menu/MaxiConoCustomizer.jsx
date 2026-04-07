import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const SABORES_HELADO = [
  // Exclusivos
  "Yogo Yogo Fresa",
  "Brownie",
  "Cherry Mania",
  "Crema Limón",
  "M&M's",
  "Macadamia",
  "Milky Way",
  "Mocaccino",
  "Oreo",
  "Vainilla Chips",
  "Arroz Con Leche",
  "Yogurt De Cereza Italiana",
  "Chicle",
  "Snickers Almond",
  // Gourmet
  "Arequipe",
  "Chocolate Belga",
  "Chocolate",
  "Fresa",
  "Frutos Del Bosque",
  "Nieve Limón",
  "Mandarina",
  "Nieve Mandarina",
  "Nieve Maracuyá",
  "Ron Pasas",
  "Vainilla Francesa",
  "Vainilla",
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

const MAX_TOPPINGS = 2;
const SECTIONS = ["sabor1", "sabor2", "toppings"];

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

function CheckOption({ label, selected, onToggle, disabled }) {
  return (
    <button
      onClick={!disabled ? onToggle : undefined}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "12px 16px",
        background: "none", border: "none", cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left", borderBottom: "1px solid #F9F0F4",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <span style={{ fontSize: 13, color: "#1A0A10" }}>{label}</span>
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

export default function MaxiConoCustomizer({ product, open, onClose, onAdd }) {
  const [openSection, setOpenSection] = useState("sabor1");
  const [sabor1, setSabor1] = useState(null);
  const [sabor2, setSabor2] = useState(null);
  const [toppings, setToppings] = useState([]);

  const advanceToNext = (current) => {
    const idx = SECTIONS.indexOf(current);
    const next = SECTIONS[idx + 1];
    if (!next) {
      setTimeout(() => setOpenSection(null), 150);
    } else {
      setTimeout(() => setOpenSection(next), 200);
    }
  };

  const toggleTopping = (name) => {
    setToppings(prev => {
      if (prev.includes(name)) return prev.filter(t => t !== name);
      if (prev.length >= MAX_TOPPINGS) return prev;
      const next = [...prev, name];
      if (next.length === MAX_TOPPINGS) advanceToNext("toppings");
      return next;
    });
  };

  const total = product?.price || 0;

  const allRequired = sabor1 && sabor2 && toppings.length === MAX_TOPPINGS;

  const handleConfirm = () => {
    if (!allRequired) return;
    const notes = [
      `Sabores: ${sabor1}, ${sabor2}`,
      `Toppings incluidos: ${toppings.join(", ")}`,
    ].filter(Boolean).join(" | ");

    onAdd({ ...product, price: total }, notes);
    toast.success("✓ Agregado al pedido", { duration: 1500, style: { background: "#E91B8B", color: "#fff", border: "none", borderRadius: 12 } });
    setSabor1(null); setSabor2(null); setToppings([]);
    setOpenSection("sabor1");
    setTimeout(() => onClose(), 150);
  };

  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl"
        style={{ background: "#FFFCFD", border: "none", maxHeight: "90vh", overflowY: "auto", padding: 0 }}
      >
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F0E4EA" }}>
          <p style={{ fontSize: 11, color: "#BBA8B0", margin: "0 0 4px", fontWeight: 600 }}>Personalizando</p>
          <SheetTitle style={{ fontSize: 18, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {product?.name}
          </SheetTitle>
          <p style={{ fontSize: 13, color: "#C2185B", fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(product?.price || 0)}
          </p>
        </div>

        <AccordionSection
          title="Elige Tu Primer Sabor"
          required
          open={openSection === "sabor1"}
          onToggle={() => setOpenSection(s => s === "sabor1" ? null : "sabor1")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona 1 opción</p>
          {SABORES_HELADO.map(s => (
            <RadioOption
              key={s}
              label={s}
              selected={sabor1 === s}
              onSelect={() => { setSabor1(s); advanceToNext("sabor1"); }}
            />
          ))}
        </AccordionSection>

        <AccordionSection
          title="Elige Tu Segundo Sabor"
          required
          open={openSection === "sabor2"}
          onToggle={() => setOpenSection(s => s === "sabor2" ? null : "sabor2")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona 1 opción</p>
          {SABORES_HELADO.map(s => (
            <RadioOption
              key={s}
              label={s}
              selected={sabor2 === s}
              onSelect={() => { setSabor2(s); advanceToNext("sabor2"); }}
            />
          ))}
        </AccordionSection>

        <AccordionSection
          title="Elige 2 Toppings Incluidos"
          required
          open={openSection === "toppings"}
          onToggle={() => setOpenSection(s => s === "toppings" ? null : "toppings")}
          badge={`${toppings.length}/${MAX_TOPPINGS}`}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona {MAX_TOPPINGS} opciones · ¡van incluidas!</p>
          {EXTRAS.map(e => (
            <CheckOption
              key={e.name}
              label={e.name}
              selected={toppings.includes(e.name)}
              onToggle={() => toggleTopping(e.name)}
              disabled={!toppings.includes(e.name) && toppings.length >= MAX_TOPPINGS}
            />
          ))}
        </AccordionSection>

        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!allRequired && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>
              * Elige dos sabores y dos toppings para continuar
            </p>
          )}
          <button
            onClick={handleConfirm}
            disabled={!allRequired}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: allRequired ? "#C2185B" : "#EDD8E4",
              color: allRequired ? "#fff" : "#BBA8B0",
              fontSize: 15, fontWeight: 900, border: "none",
              cursor: allRequired ? "pointer" : "not-allowed",
              boxShadow: allRequired ? "0 4px 16px rgba(194,24,91,0.35)" : "none",
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