import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const SABORES_HELADO = [
  "Cubeta Yogo Yogo Fresa",
  "Cubeta Brownie",
  "Cubeta Cherry Mania",
  "Cubeta Crema Limón",
  "Cubeta MM",
  "Cubeta Macadamia",
  "Cubeta Milky Way",
  "Cubeta Mocaccino",
  "Cubeta Oreo",
  "Cubeta Vainilla Chips",
  "Cubeta Arroz Con Leche",
  "Cubeta Yogurt De Cereza Italiana",
  "Cubeta Chicle",
  "Cubeta Snickers Almond",
];

const EXTRAS = [
  { name: "Salsa Arequipe", price: 3100 },
  { name: "Salsa De Caramelo", price: 3100 },
  { name: "Salsa De Chocolate", price: 3100 },
  { name: "Salsa De Fresa", price: 3100 },
  { name: "Salsa De Frutas", price: 3100 },
  { name: "Salsa De Mora", price: 3100 },
  { name: "Salsa Cereza Italiana", price: 3100 },
  { name: "Crema Chantilly", price: 3100 },
  { name: "Gomas Ositos", price: 3100 },
  { name: "Cerezas", price: 3100 },
  { name: "M&M's", price: 3100 },
  { name: "Banano", price: 3000 },
  { name: "Fresas", price: 3100 },
  { name: "Durazno", price: 3100 },
  { name: "Mini Masmelos", price: 3100 },
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
            <span style={{ fontSize: 10, color: "#C41E6A", background: "#FFF0F5", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
              Obligatorio
            </span>
          )}
          {badge && <span style={{ fontSize: 10, color: "#C41E6A", fontWeight: 700 }}>{badge}</span>}
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
        border: selected ? "6px solid #C41E6A" : "2px solid #DDD",
        background: "#fff", flexShrink: 0, transition: "all 0.15s",
      }} />
    </button>
  );
}

function CheckOption({ label, price, selected, onToggle, disabled }) {
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
      <div>
        <span style={{ fontSize: 13, color: "#1A0A10" }}>{label}</span>
        {price > 0 && (
          <span style={{ fontSize: 11, color: "#C41E6A", marginLeft: 6, fontWeight: 700 }}>
            + {formatCOP(price)}
          </span>
        )}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 5,
        border: selected ? "none" : "2px solid #DDD",
        background: selected ? "#C41E6A" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.15s",
      }}>
        {selected && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
      </div>
    </button>
  );
}

export default function HeladoCustomizer({ product, open, onClose, onAdd }) {
  // Detectar si el producto permite 2 sabores
  const maxSabores = product?.name?.toLowerCase().includes("2 sabor") ||
    product?.name?.toLowerCase().includes("2sabor") ? 2 : 1;

  const [openSection, setOpenSection] = useState("sabor");
  const [sabores, setSabores] = useState([]);
  const [extras, setExtras] = useState([]);

  const SECTIONS = ["sabor", "extras"];

  const advanceToNext = (current) => {
    const idx = SECTIONS.indexOf(current);
    const next = SECTIONS[idx + 1];
    if (!next) {
      setTimeout(() => setOpenSection(null), 150);
    } else {
      setTimeout(() => setOpenSection(next), 200);
    }
  };

  const toggleSabor = (s) => {
    setSabores(prev => {
      if (prev.includes(s)) return prev.filter(x => x !== s);
      if (prev.length >= maxSabores) return prev;
      const next = [...prev, s];
      if (next.length === maxSabores) advanceToNext("sabor");
      return next;
    });
  }

  const toggleExtra = (name, price) => {
    setExtras(prev => {
      const updated = prev.find(e => e.name === name)
        ? prev.filter(e => e.name !== name)
        : [...prev, { name, price }];
      if (updated.length > 0 && openSection !== "extras") {
        setOpenSection("extras");
      }
      return updated;
    });
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = (product?.price || 0) + extrasTotal;
  const allRequired = sabores.length === maxSabores;

  const handleConfirm = () => {
    if (!allRequired) return;
    const notes = [
      `Sabor: ${sabores.join(", ")}`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");

    onAdd({ ...product, price: total }, notes);
    toast.success("✓ Agregado al pedido", { duration: 1500, style: { background: "#E91B8B", color: "#fff", border: "none", borderRadius: 12 } });
    setSabores([]); setExtras([]);
    setOpenSection("sabor");
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
        {/* Header */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F0E4EA" }}>
          <p style={{ fontSize: 11, color: "#BBA8B0", margin: "0 0 4px", fontWeight: 600 }}>Personalizando</p>
          <SheetTitle style={{ fontSize: 18, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {product?.name}
          </SheetTitle>
          <p style={{ fontSize: 13, color: "#C41E6A", fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(product?.price || 0)}
          </p>
        </div>

        {/* Sabor(es) */}
        <AccordionSection
          title={maxSabores === 2 ? "Elige Los 2 Sabores De Helado" : "Elige El Sabor De Helado"}
          required
          open={openSection === "sabor"}
          onToggle={() => setOpenSection(s => s === "sabor" ? null : "sabor")}
          badge={maxSabores === 2 ? `${sabores.length}/${maxSabores}` : null}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>
            Selecciona {maxSabores === 2 ? "2 opciones" : "1 opción"}
          </p>
          {SABORES_HELADO.map(s => (
            maxSabores === 1 ? (
              <RadioOption
                key={s}
                label={s}
                selected={sabores.includes(s)}
                onSelect={() => { setSabores([s]); advanceToNext("sabor"); }}
              />
            ) : (
              <CheckOption
                key={s}
                label={s}
                price={0}
                selected={sabores.includes(s)}
                onToggle={() => toggleSabor(s)}
                disabled={!sabores.includes(s) && sabores.length >= maxSabores}
              />
            )
          ))}
        </AccordionSection>

        {/* Extras */}
        <AccordionSection
          title="Elige Tus Extras"
          required={false}
          open={openSection === "extras"}
          onToggle={() => setOpenSection(s => s === "extras" ? null : "extras")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Salsas, Chantilly y más · tienen costo adicional</p>
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
          {!allRequired && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>
              * Elige {maxSabores === 2 ? "2 sabores" : "1 sabor"} para continuar
            </p>
          )}
          <button
            onClick={handleConfirm}
            disabled={!allRequired}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: allRequired ? "#C41E6A" : "#EDD8E4",
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