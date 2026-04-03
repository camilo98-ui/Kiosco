import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronDown, ChevronUp, Plus, Check } from "lucide-react";
import { formatCOP } from "@/lib/constants";

// ── Datos fijos de personalización ─────────────────────────────────

const SALSAS = [
  "Salsa Arequipe",
  "Salsa De Caramelo",
  "Salsa De Chocolate",
  "Salsa De Fresa",
  "Salsa De Frutas",
  "Salsa De Mora",
  "Salsa Cereza Italiana",
];

const CHANTILLY = ["Crema Chantilly", "Sin Crema Chantilly"];

const CHOCOLATE_CRACK = [
  { label: "Sin Crack", price: 0 },
  { label: "Con Crack", price: 4000 },
];

// Extras basados en la entidad adiciones (lista fija)
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

// ── Sub-componentes ─────────────────────────────────────────────────

function AccordionSection({ title, required, open, onToggle, children }) {
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
        </div>
        {open ? <ChevronUp size={18} color="#BBA8B0" /> : <ChevronDown size={18} color="#BBA8B0" />}
      </button>
      {open && <div style={{ paddingBottom: 8 }}>{children}</div>}
    </div>
  );
}

function RadioOption({ label, price, selected, onSelect }) {
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
      <div>
        <span style={{ fontSize: 13, color: "#1A0A10" }}>{label}</span>
        {price > 0 && (
          <span style={{ fontSize: 11, color: "#C2185B", marginLeft: 6, fontWeight: 700 }}>
            + {formatCOP(price)}
          </span>
        )}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        border: selected ? "6px solid #C2185B" : "2px solid #DDD",
        background: "#fff", flexShrink: 0, transition: "all 0.15s",
      }} />
    </button>
  );
}

function CheckOption({ name, price, selected, onToggle }) {
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
        <span style={{ fontSize: 13, color: "#1A0A10" }}>{name}</span>
        <span style={{ fontSize: 11, color: "#C2185B", marginLeft: 6, fontWeight: 700 }}>
          + {formatCOP(price)}
        </span>
      </div>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: selected ? "#C2185B" : "#fff",
        border: selected ? "none" : "1.5px solid #DDD",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.15s",
      }}>
        {selected ? <Plus size={14} color="#fff" /> : <Plus size={14} color="#CCC" />}
      </div>
    </button>
  );
}

// ── Componente principal ────────────────────────────────────────────

export default function MalteadaCustomizer({ product, open, onClose, onAdd }) {
  const [openSection, setOpenSection] = useState("salsa");
  const [salsa, setSalsa] = useState(null);
  const [chantilly, setChantilly] = useState(null);
  const [crack, setCrack] = useState(null);
  const [extras, setExtras] = useState([]);

  const SECTIONS = ["salsa", "chantilly", "crack", "extras"];

  const toggleExtra = (name, price) => {
    setExtras(prev =>
      prev.find(e => e.name === name)
        ? prev.filter(e => e.name !== name)
        : [...prev, { name, price }]
    );
  };

  const toggle = (section) => setOpenSection(s => s === section ? null : section);

  const advanceToNext = (currentSection) => {
    const idx = SECTIONS.indexOf(currentSection);
    const next = SECTIONS[idx + 1];
    if (next) setTimeout(() => setOpenSection(next), 200);
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const crackPrice = CHOCOLATE_CRACK.find(c => c.label === crack)?.price || 0;
  const total = (product?.price || 0) + extrasTotal + crackPrice;

  const allRequired = salsa && chantilly && crack;

  const handleConfirm = () => {
    if (!allRequired) return;

    const notes = [
      `Salsa: ${salsa}`,
      `Chantilly: ${chantilly}`,
      `Crack: ${crack}`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");

    // Agregar el producto base con precio total (base + crack + extras)
    onAdd({ ...product, price: total }, notes);
    // Reset
    setSalsa(null); setChantilly(null); setCrack(null); setExtras([]);
    setOpenSection("salsa");
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
            {product.name}
          </SheetTitle>
          <p style={{ fontSize: 13, color: "#C2185B", fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(product.price)}
          </p>
        </div>

        {/* Secciones */}
        <AccordionSection
          title="Elige Sabor De Tu Salsa"
          required
          open={openSection === "salsa"}
          onToggle={() => toggle("salsa")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona 1 opción</p>
          {SALSAS.map(s => (
            <RadioOption key={s} label={s} price={0} selected={salsa === s} onSelect={() => { setSalsa(s); advanceToNext("salsa"); }} />
          ))}
        </AccordionSection>

        <AccordionSection
          title="¿Deseas Crema Chantilly?"
          required
          open={openSection === "chantilly"}
          onToggle={() => toggle("chantilly")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona 1 opción</p>
          {CHANTILLY.map(c => (
            <RadioOption key={c} label={c} price={0} selected={chantilly === c} onSelect={() => { setChantilly(c); advanceToNext("chantilly"); }} />
          ))}
        </AccordionSection>

        <AccordionSection
          title="Deseas Cobertura De Chocolate Crack"
          required
          open={openSection === "crack"}
          onToggle={() => toggle("crack")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona 1 opción</p>
          {CHOCOLATE_CRACK.map(c => (
            <RadioOption key={c.label} label={c.label} price={c.price} selected={crack === c.label} onSelect={() => { setCrack(c.label); advanceToNext("crack"); }} />
          ))}
        </AccordionSection>

        <AccordionSection
          title="Elige Tus Extras"
          required={false}
          open={openSection === "extras"}
          onToggle={() => toggle("extras")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Puedes elegir hasta {EXTRAS.length} opciones</p>
          {EXTRAS.map(e => (
            <CheckOption
              key={e.name}
              name={`Adición ${e.name}`}
              price={e.price}
              selected={!!extras.find(x => x.name === e.name)}
              onToggle={() => toggleExtra(e.name, e.price)}
            />
          ))}
        </AccordionSection>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!allRequired && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>
              * Completa las opciones obligatorias para continuar
            </p>
          )}
          <button
            onClick={handleConfirm}
            disabled={!allRequired}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: allRequired ? "#C2185B" : "#EDD8E4",
              color: allRequired ? "#fff" : "#BBA8B0",
              fontSize: 15, fontWeight: 900, border: "none", cursor: allRequired ? "pointer" : "not-allowed",
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