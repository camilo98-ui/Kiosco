import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const SABORES = ["Mandarina Nieves", "Limón Nieves"];

const SALSAS = ["Leche Condensada"];

const EXTRAS = [
  { name: "Gomas Ositos", price: 2900 },
  { name: "Cerezas", price: 2900 },
  { name: "M&M's", price: 2900 },
  { name: "Banano", price: 2900 },
  { name: "Fresas", price: 2900 },
  { name: "Durazno", price: 2900 },
  { name: "Mini Masmelos", price: 2900 },
  { name: "Chantilly", price: 2900 },
  { name: "Chips De Chocolate", price: 2900 },
  { name: "Brownie", price: 2900 },
  { name: "Galleta Oreo", price: 2900 },
  { name: "Nueces", price: 2900 },
  { name: "Barquillos", price: 2900 },
  { name: "Chocolatina Milky Way", price: 2900 },
  { name: "Leche Condensada", price: 2900 },
  { name: "Macadamia", price: 2900 },
  { name: "Sprinkles", price: 2900 },
];

const SECTIONS = ["sabores", "salsa", "extras"];
const MAX_SABORES = 2;

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
          {badge && (
            <span style={{ fontSize: 10, color: "#C41E6A", fontWeight: 700 }}>{badge}</span>
          )}
        </div>
        <span style={{ fontSize: 18, color: "#BBA8B0" }}>{open ? "∧" : "∨"}</span>
      </button>
      {open && <div style={{ paddingBottom: 8 }}>{children}</div>}
    </div>
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

export default function GranizadoCustomizer({ product, open, onClose, onAdd }) {
  const [openSection, setOpenSection] = useState("sabores");
  const [sabores, setSabores] = useState([]);
  const [salsa, setSalsa] = useState(null);
  const [extras, setExtras] = useState([]);

  const is12oz = product?.name?.includes("12");
  const salsaRequired = !is12oz;

  const advanceToNext = (current) => {
    const idx = SECTIONS.indexOf(current);
    const next = SECTIONS[idx + 1];
    if (!next) {
      setTimeout(() => setOpenSection(null), 150);
    } else {
      setTimeout(() => setOpenSection(next), 200);
    }
  };

  const toggleSabor = (sabor) => {
    setSabores(prev => {
      if (prev.includes(sabor)) return prev.filter(s => s !== sabor);
      if (prev.length >= MAX_SABORES) return prev;
      const next = [...prev, sabor];
      if (next.length === MAX_SABORES) advanceToNext("sabores");
      return next;
    });
  };

  const toggleSalsa = (s) => {
    setSalsa(salsa === s ? null : s);
    if (salsa !== s) advanceToNext("salsa");
  };

  const toggleExtra = (name, price) => {
    setExtras(prev =>
      prev.find(e => e.name === name)
        ? prev.filter(e => e.name !== name)
        : [...prev, { name, price }]
    );
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const salsaPrice = salsa ? 0 : 0;
  const total = (product?.price || 0) + extrasTotal + salsaPrice;

  const allRequired = sabores.length === MAX_SABORES && (salsaRequired ? salsa : true);

  const handleConfirm = () => {
    if (!allRequired) return;

    const notes = [
      `Sabores: ${sabores.join(", ")}`,
      is12oz ? null : (salsa ? `Salsa: ${salsa}` : null),
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");

    onAdd({ ...product, price: total }, notes);
    toast.success("✓ Agregado al pedido", { duration: 1500, style: { background: "#E91B8B", color: "#fff", border: "none", borderRadius: 12 } });
    setSabores([]); setSalsa(null); setExtras([]);
    setOpenSection("sabores");
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
          <p style={{ fontSize: 13, color: "#C41E6A", fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(product?.price || 0)}
          </p>
        </div>

        <AccordionSection
          title="Elige Tus Sabores"
          required
          open={openSection === "sabores"}
          onToggle={() => setOpenSection(s => s === "sabores" ? null : "sabores")}
          badge={`${sabores.length}/${MAX_SABORES}`}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona {MAX_SABORES} opciones</p>
          {SABORES.map(s => (
            <CheckOption
              key={s}
              label={s}
              price={0}
              selected={sabores.includes(s)}
              onToggle={() => toggleSabor(s)}
              disabled={!sabores.includes(s) && sabores.length >= MAX_SABORES}
            />
          ))}
        </AccordionSection>

        {!is12oz && (
          <AccordionSection
            title="Salsa"
            required={salsaRequired}
            open={openSection === "salsa"}
            onToggle={() => setOpenSection(s => s === "salsa" ? null : "salsa")}
          >
            <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona 1 opción</p>
            {SALSAS.map(s => (
              <CheckOption
                key={s}
                label={s}
                price={0}
                selected={salsa === s}
                onToggle={() => toggleSalsa(s)}
              />
            ))}
          </AccordionSection>
        )}

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
          <button
            onClick={() => setOpenSection(null)}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "12px 16px",
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              borderTop: "1px solid #F9F0F4", fontWeight: 700, fontSize: 13, color: "#1A0A10"
            }}
          >
            No quiero extras
          </button>
        </AccordionSection>

        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!allRequired && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>
              * {is12oz ? "Elige 2 sabores para continuar" : "Elige 2 sabores y una salsa para continuar"}
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