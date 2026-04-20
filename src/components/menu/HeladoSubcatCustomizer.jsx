import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const FONT = "'Poppins', sans-serif";

const SABORES = {
  gourmet: [
    "Arequipe", "Chocolate Belga", "Chocolate", "Fresa", "Frutos Del Bosque",
    "Nieves Limón", "Mandarina", "Nieves Mandarina", "Nieves Maracuyá",
    "Ron Pasas", "Vainilla Francesa", "Vainilla",
  ],
  exclusivo: [
    "Yogo Yogo Fresa", "Brownie", "Cherry Mania", "Crema Limón", "MM",
    "Macadamia", "Milky Way", "Mocaccino", "Oreo", "Vainilla Chips",
    "Arroz Con Leche", "Yogurt De Cereza Italiana", "Chicle", "Snickers Almond",
  ],
  junior: [
    "Arequipe", "Chocolate", "Fresa", "Vainilla", "Mandarina",
    "Nieves Limón", "Frutos Del Bosque", "Ron Pasas",
  ],
};

const BASE_PRICES = {
  gourmet:   { "1 Sabor": 8500,  "2 Sabores": 10900 },
  exclusivo: { "1 Sabor": 10500, "2 Sabores": 13900 },
  junior:    { "1 Sabor": 7500,  "2 Sabores": 9900  },
};

const LABELS = {
  gourmet:   "Gourmet",
  exclusivo: "Exclusivo",
  junior:    "Cono Jr",
};

const CRACK_OPTIONS = [
  { label: "Sin Crack", price: 0 },
  { label: "Con Crack", price: 4000 },
];

const EXTRAS = [
  { name: "Salsa Arequipe", price: 2900 },
  { name: "Salsa De Caramelo", price: 2900 },
  { name: "Salsa De Chocolate", price: 2900 },
  { name: "Salsa De Fresa", price: 2900 },
  { name: "Salsa De Frutas", price: 2900 },
  { name: "Salsa De Mora", price: 2900 },
  { name: "Salsa Cereza Italiana", price: 2900 },
  { name: "Crema Chantilly", price: 2900 },
  { name: "Gomas Ositos", price: 2900 },
  { name: "Cerezas", price: 2900 },
  { name: "M&M's", price: 2900 },
  { name: "Banano", price: 2900 },
  { name: "Fresas", price: 2900 },
  { name: "Durazno", price: 2900 },
  { name: "Mini Masmelos", price: 2900 },
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

// ── Accordion Step ─────────────────────────────────────────────────────────────
function StepAccordion({ stepNum, title, subtitle, isOpen, isDone, onToggle, children }) {
  return (
    <div style={{ borderRadius: 16, background: "#fff", marginBottom: 10, overflow: "hidden", border: isDone ? `1.5px solid ${MAGENTA}` : "1.5px solid #F0E4EA" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            background: isDone ? MAGENTA : isOpen ? "#FFF0F5" : "#F5F5F5",
            border: isDone ? "none" : isOpen ? `2px solid ${MAGENTA}` : "2px solid #DDD",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900,
            color: isDone ? "#fff" : isOpen ? MAGENTA : "#AAA",
          }}>
            {isDone ? "✓" : stepNum}
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: isDone ? MAGENTA : "#1A1A1A", margin: 0, fontFamily: FONT }}>{title}</p>
            {isDone && subtitle && (
              <p style={{ fontSize: 11, color: "#AAA", margin: 0, fontFamily: FONT, lineHeight: 1.3 }}>{subtitle}</p>
            )}
          </div>
        </div>
        <span style={{ fontSize: 16, color: "#CCC" }}>{isOpen ? "∧" : "∨"}</span>
      </button>
      {isOpen && <div style={{ borderTop: "1px solid #F0E4EA", paddingBottom: 8 }}>{children}</div>}
    </div>
  );
}

// ── Option Rows ────────────────────────────────────────────────────────────────
function RadioRow({ label, price, selected, onSelect }) {
  return (
    <button onClick={onSelect} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", background: "none", border: "none", cursor: "pointer",
      borderBottom: "1px solid #F9F0F4",
    }}>
      <div>
        <span style={{ fontSize: 13, color: "#1A0A10", fontFamily: FONT }}>{label}</span>
        {price > 0 && <span style={{ fontSize: 11, color: MAGENTA, marginLeft: 6, fontWeight: 700 }}>+ {formatCOP(price)}</span>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        border: selected ? `6px solid ${MAGENTA}` : "2px solid #DDD",
        background: "#fff", flexShrink: 0, transition: "all 0.15s",
      }} />
    </button>
  );
}

function CheckRow({ label, price, selected, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", background: "none", border: "none", cursor: "pointer",
      borderBottom: "1px solid #F9F0F4",
    }}>
      <div>
        <span style={{ fontSize: 13, color: "#1A0A10", fontFamily: FONT }}>{label}</span>
        {price > 0 && <span style={{ fontSize: 11, color: MAGENTA, marginLeft: 6, fontWeight: 700 }}>+ {formatCOP(price)}</span>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 5,
        border: selected ? "none" : "2px solid #DDD",
        background: selected ? MAGENTA : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 0.15s",
      }}>
        {selected && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
      </div>
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function HeladoSubcatCustomizer({ subcat, open, onClose, onAdd }) {
  const [openStep, setOpenStep] = useState("cantidad");
  const [numSabores, setNumSabores] = useState(null);
  const [selected, setSelected] = useState([]);
  const [crack, setCrack] = useState(null);
  const [extras, setExtras] = useState([]);

  const saboresList = SABORES[subcat] || [];
  const label = LABELS[subcat] || "Helado";
  const prices = BASE_PRICES[subcat] || { "1 Sabor": 8500, "2 Sabores": 10900 };

  useEffect(() => {
    if (open) {
      setOpenStep("cantidad");
      setNumSabores(null);
      setSelected([]);
      setCrack(null);
      setExtras([]);
    }
  }, [open, subcat]);

  const toggleExtra = (name, price) => {
    setExtras(prev =>
      prev.find(e => e.name === name) ? prev.filter(e => e.name !== name) : [...prev, { name, price }]
    );
  };

  const handleSelectNumSabores = (n) => {
    setNumSabores(n);
    setSelected([]);
    setTimeout(() => setOpenStep("sabores"), 200);
  };

  const handleToggleSabor = (s) => {
    setSelected(prev => {
      if (prev.includes(s)) return prev.filter(x => x !== s);
      if (prev.length >= numSabores) return prev;
      const next = [...prev, s];
      if (next.length === numSabores) {
        setTimeout(() => setOpenStep("extras"), 300);
      }
      return next;
    });
  };

  const handleSelectCrack = (c) => {
    setCrack(c);
    setTimeout(() => setOpenStep(null), 200);
  };

  const crackPrice = CRACK_OPTIONS.find(c => c.label === crack)?.price || 0;
  const extrasTotal = extras.reduce((s, e) => s + e.price, 0);
  const basePrice = numSabores === 2 ? prices["2 Sabores"] : prices["1 Sabor"];
  const total = basePrice + crackPrice + extrasTotal;

  const canConfirm = numSabores && selected.length === numSabores && crack !== null;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const notes = [
      `Sabor: ${selected.join(", ")}`,
      `Crack: ${crack}`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");

    onAdd(
      {
        product_id: `helado-${subcat}-${Date.now()}`,
        product_name: `Helado ${label} ${numSabores === 1 ? "1 Sabor" : "2 Sabores"}`,
        name: `Helado ${label} ${numSabores === 1 ? "1 Sabor" : "2 Sabores"}`,
        price: total,
        quantity: 1,
      },
      notes
    );
    toast.success("✓ Agregado al pedido", {
      duration: 1500,
      style: { background: MAGENTA, color: "#fff", border: "none", borderRadius: 12 },
    });
    setTimeout(() => onClose(), 150);
  };

  if (!subcat) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl"
        style={{ background: "#F7F2F5", border: "none", maxHeight: "92vh", overflowY: "auto", padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: "20px 16px 14px", background: "#fff", borderBottom: "1px solid #F0E4EA" }}>
          <SheetTitle style={{ fontSize: 20, fontWeight: 900, color: "#1A0A10", margin: 0, fontFamily: FONT }}>
            Helado {label}
          </SheetTitle>
          <p style={{ fontSize: 13, color: MAGENTA, fontWeight: 700, margin: "4px 0 0", fontFamily: FONT }}>
            Desde {formatCOP(prices["1 Sabor"])}
          </p>
        </div>

        <div style={{ padding: "14px 14px 0" }}>

          {/* Paso 1: Cantidad */}
          <StepAccordion
            stepNum={1}
            title="¿Cuántos sabores?"
            subtitle={numSabores ? `${numSabores} ${numSabores === 1 ? "sabor" : "sabores"} · ${formatCOP(basePrice)}` : null}
            isOpen={openStep === "cantidad"}
            isDone={numSabores !== null}
            onToggle={() => setOpenStep(s => s === "cantidad" ? null : "cantidad")}
          >
            {!numSabores && (
              <p style={{ fontSize: 12, color: MAGENTA, fontWeight: 700, padding: "4px 16px 0", margin: 0, fontFamily: FONT }}>
                👇 Toca una opción para empezar
              </p>
            )}
            <div style={{ display: "flex", gap: 10, padding: "10px 16px 14px" }}>
              {[1, 2].map(n => (
                <button
                  key={n}
                  onClick={() => handleSelectNumSabores(n)}
                  style={{
                    flex: 1, padding: "16px 0", borderRadius: 14,
                    border: numSabores === n ? `2.5px solid ${MAGENTA}` : `2px solid ${MAGENTA}`,
                    background: numSabores === n ? MAGENTA : "#FFF0F5",
                    cursor: "pointer", fontWeight: 800, fontSize: 15,
                    color: numSabores === n ? "#fff" : MAGENTA,
                    fontFamily: FONT, transition: "all 0.15s",
                    boxShadow: numSabores === n ? "0 4px 14px rgba(196,30,106,0.35)" : "none",
                  }}
                >
                  {n} {n === 1 ? "Sabor" : "Sabores"}
                  <div style={{ fontSize: 11, fontWeight: 600, color: numSabores === n ? "rgba(255,255,255,0.85)" : MAGENTA, marginTop: 2 }}>
                    {formatCOP(prices[n === 1 ? "1 Sabor" : "2 Sabores"])}
                  </div>
                </button>
              ))}
            </div>
          </StepAccordion>

          {/* Paso 2: Sabores */}
          <StepAccordion
            stepNum={2}
            title={numSabores === 1 ? "Elige tu sabor" : `Elige ${numSabores || 2} sabores`}
            subtitle={selected.length > 0 ? selected.join(", ") : null}
            isOpen={openStep === "sabores"}
            isDone={selected.length > 0 && selected.length === numSabores}
            onToggle={() => setOpenStep(s => s === "sabores" ? null : "sabores")}
          >
            <p style={{ fontSize: 11, color: "#BBA8B0", padding: "8px 16px 4px", margin: 0, fontFamily: FONT }}>
              {numSabores
                ? `Selecciona ${numSabores === 1 ? "1 opción" : `${numSabores} opciones`} (${selected.length}/${numSabores})`
                : "Primero elige cuántos sabores"}
            </p>
            {saboresList.map(s => (
              <RadioRow
                key={s}
                label={s}
                price={0}
                selected={selected.includes(s)}
                onSelect={() => handleToggleSabor(s)}
              />
            ))}
          </StepAccordion>

          {/* Paso 3: Extras */}
          <StepAccordion
            stepNum={3}
            title="Extras (opcional)"
            subtitle={extras.length > 0 ? `${extras.length} extra${extras.length > 1 ? "s" : ""} · +${formatCOP(extrasTotal)}` : "Sin extras"}
            isOpen={openStep === "extras"}
            isDone={crack !== null}
            onToggle={() => setOpenStep(s => s === "extras" ? null : "extras")}
          >
            <p style={{ fontSize: 11, color: "#BBA8B0", padding: "8px 16px 4px", margin: 0, fontFamily: FONT }}>
              Opcionales · con costo adicional
            </p>
            {EXTRAS.map(e => (
              <CheckRow
                key={e.name}
                label={e.name}
                price={e.price}
                selected={!!extras.find(x => x.name === e.name)}
                onToggle={() => toggleExtra(e.name, e.price)}
              />
            ))}
            <div style={{ padding: "12px 16px 4px" }}>
              <button
                onClick={() => setOpenStep("crack")}
                style={{
                  width: "100%", padding: "13px 0", borderRadius: 14,
                  background: MAGENTA, color: "#fff", border: "none",
                  fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: FONT,
                  boxShadow: "0 4px 14px rgba(196,30,106,0.35)",
                }}
              >
                Sin extras, continuar ✓
              </button>
            </div>
          </StepAccordion>

          {/* Paso 4: Crack */}
          <StepAccordion
            stepNum={4}
            title="Cobertura Chocolate Crack"
            subtitle={crack || null}
            isOpen={openStep === "crack"}
            isDone={crack !== null}
            onToggle={() => setOpenStep(s => s === "crack" ? null : "crack")}
          >
            <p style={{ fontSize: 11, color: "#BBA8B0", padding: "8px 16px 4px", margin: 0, fontFamily: FONT }}>
              Selecciona 1 opción
            </p>
            {CRACK_OPTIONS.map(c => (
              <RadioRow
                key={c.label}
                label={c.label}
                price={c.price}
                selected={crack === c.label}
                onSelect={() => handleSelectCrack(c.label)}
              />
            ))}
          </StepAccordion>

        </div>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#F7F2F5", borderTop: "1px solid #F0E4EA" }}>
          {!canConfirm && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8, fontFamily: FONT }}>
              {!numSabores ? "Elige cuántos sabores quieres"
                : selected.length < numSabores ? `Elige ${numSabores - selected.length} sabor${numSabores - selected.length > 1 ? "es" : ""} más`
                : !crack ? "Elige cobertura de chocolate crack"
                : ""}
            </p>
          )}
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: canConfirm ? MAGENTA : "#EDD8E4",
              color: canConfirm ? "#fff" : "#BBA8B0",
              fontSize: 15, fontWeight: 900, border: "none",
              cursor: canConfirm ? "pointer" : "not-allowed",
              boxShadow: canConfirm ? "0 4px 16px rgba(196,30,106,0.35)" : "none",
              transition: "all 0.2s", fontFamily: FONT,
            }}
          >
            {canConfirm ? `Agregar al pedido · ${formatCOP(total)}` : "Personaliza tu helado 🍦"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}