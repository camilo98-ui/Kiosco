import React, { useState, useEffect, useRef } from "react";
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

const EXTRAS = [
  "Salsa Arequipe", "Salsa Caramelo", "Salsa Chocolate", "Salsa Fresa",
  "Salsa Mora", "Crema Chantilly", "Gomas Ositos", "Cerezas",
  "M&M's", "Banano", "Fresas", "Mini Masmelos",
  "Chips De Chocolate", "Brownie", "Galleta Oreo", "Nueces",
  "Barquillos", "Leche Condensada", "Sprinkles",
];

// Pasos: 1=cantidad, 2=sabor, 3=crack, 4=extras
const STEPS = ["cantidad", "sabor", "crack", "extras"];

function StepHeader({ step, label, done, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "14px 16px", background: "none", border: "none",
        borderBottom: "1px solid #F0E4EA", cursor: done || active ? "pointer" : "default",
        textAlign: "left",
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: done ? MAGENTA : active ? "#FFF0F5" : "#F5F5F5",
        border: active ? `2px solid ${MAGENTA}` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {done
          ? <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>
          : <span style={{ fontSize: 12, fontWeight: 800, color: active ? MAGENTA : "#BBB" }}>{step}</span>
        }
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: done ? "#888" : active ? "#1A1A1A" : "#CCC", fontFamily: FONT }}>
        {label}
      </span>
      {done && <span style={{ fontSize: 12, color: MAGENTA, marginLeft: "auto", fontWeight: 600 }}>✓ listo</span>}
    </button>
  );
}

export default function HeladoSubcatCustomizer({ subcat, open, onClose, onAdd }) {
  const [numSabores, setNumSabores] = useState(null);
  const [selected, setSelected] = useState([]);
  const [crack, setCrack] = useState(null);
  const [extras, setExtras] = useState([]);
  const [openStep, setOpenStep] = useState("cantidad");
  const contentRef = useRef(null);

  const saboresList = SABORES[subcat] || [];
  const label = LABELS[subcat] || "Helado";
  const prices = BASE_PRICES[subcat] || { "1 Sabor": 8500, "2 Sabores": 10900 };

  useEffect(() => {
    if (open) {
      setNumSabores(null);
      setSelected([]);
      setCrack(null);
      setExtras([]);
      setOpenStep("cantidad");
    }
  }, [open, subcat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (contentRef.current) contentRef.current.scrollTo({ top: contentRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleSelectCantidad = (n) => {
    setNumSabores(n);
    setSelected([]);
    setOpenStep("sabor");
    scrollToBottom();
  };

  const toggleSabor = (s) => {
    if (!numSabores) return;
    setSelected(prev => {
      if (prev.includes(s)) return prev.filter(x => x !== s);
      if (prev.length >= numSabores) return prev;
      const next = [...prev, s];
      if (next.length === numSabores) {
        // Auto-avanzar a crack
        setTimeout(() => { setOpenStep("crack"); scrollToBottom(); }, 200);
      }
      return next;
    });
  };

  const handleSelectCrack = (val) => {
    setCrack(val);
    setOpenStep("extras");
    scrollToBottom();
  };

  const toggleExtra = (e) => {
    setExtras(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  };

  const finalPrice = numSabores === 2 ? prices["2 Sabores"] : prices["1 Sabor"];
  const extrasTotal = extras.length * 2900;
  const total = finalPrice + extrasTotal;

  const canConfirm = numSabores && selected.length === numSabores && crack !== null;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const notesParts = [
      `Sabor: ${selected.join(", ")}`,
      `Crack: ${crack}`,
      extras.length > 0 ? `Extras: ${extras.join(", ")}` : null,
    ].filter(Boolean);
    onAdd(
      {
        product_id: `helado-${subcat}-${Date.now()}`,
        product_name: `Helado ${label} ${numSabores === 1 ? "1 Sabor" : "2 Sabores"}`,
        name: `Helado ${label} ${numSabores === 1 ? "1 Sabor" : "2 Sabores"}`,
        price: total,
        quantity: 1,
      },
      notesParts.join(" | ")
    );
    toast.success("✓ Agregado al pedido", {
      duration: 1500,
      style: { background: "#C41E6A", color: "#fff", border: "none", borderRadius: 12 },
    });
    setTimeout(() => onClose(), 150);
  };

  if (!subcat) return null;

  const doneCantidad = numSabores !== null;
  const doneSabor = selected.length === numSabores && numSabores !== null;
  const doneCrack = crack !== null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl"
        style={{ background: "#FFFCFD", border: "none", maxHeight: "92vh", padding: 0, display: "flex", flexDirection: "column" }}
      >
        {/* Header fijo */}
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #F0E4EA", flexShrink: 0 }}>
          <SheetTitle style={{ fontSize: 20, fontWeight: 900, color: "#1A0A10", margin: 0, fontFamily: FONT }}>
            Helado {label}
          </SheetTitle>
          <p style={{ fontSize: 13, color: MAGENTA, fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(prices["1 Sabor"])}
          </p>
        </div>

        {/* Scroll area */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto" }}>

          {/* ── PASO 1: Cantidad ── */}
          <StepHeader
            step={1} label="¿Cuántos sabores?" done={doneCantidad}
            active={openStep === "cantidad"}
            onClick={() => setOpenStep("cantidad")}
          />
          {openStep === "cantidad" && (
            <div style={{ padding: "16px", display: "flex", gap: 10 }}>
              {[1, 2].map(n => (
                <button
                  key={n}
                  onClick={() => handleSelectCantidad(n)}
                  style={{
                    flex: 1, padding: "14px 0", borderRadius: 14,
                    border: numSabores === n ? `2.5px solid ${MAGENTA}` : "1.5px solid #F0E4EA",
                    background: numSabores === n ? "#FFF0F5" : "#fff",
                    cursor: "pointer", fontWeight: 800, fontSize: 15,
                    color: numSabores === n ? MAGENTA : "#888",
                    fontFamily: FONT, transition: "all 0.15s",
                  }}
                >
                  {n} {n === 1 ? "Sabor" : "Sabores"}
                  <div style={{ fontSize: 11, fontWeight: 600, color: numSabores === n ? MAGENTA : "#BBB", marginTop: 2 }}>
                    {formatCOP(prices[n === 1 ? "1 Sabor" : "2 Sabores"])}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── PASO 2: Sabor ── */}
          <StepHeader
            step={2} label={numSabores === 2 ? `Elige tus sabores (${selected.length}/${numSabores})` : "Elige tu sabor"}
            done={doneSabor} active={openStep === "sabor"}
            onClick={() => doneCantidad && setOpenStep("sabor")}
          />
          {openStep === "sabor" && doneCantidad && (
            <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {saboresList.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSabor(s)}
                  disabled={selected.length >= numSabores && !selected.includes(s)}
                  style={{
                    padding: "10px 14px", borderRadius: 12,
                    border: selected.includes(s) ? `2px solid ${MAGENTA}` : "1.5px solid #F0E4EA",
                    background: selected.includes(s) ? "#FFF0F5" : "#fff",
                    cursor: selected.length >= numSabores && !selected.includes(s) ? "not-allowed" : "pointer",
                    fontSize: 13, fontWeight: selected.includes(s) ? 700 : 500,
                    color: selected.includes(s) ? MAGENTA : "#333",
                    opacity: selected.length >= numSabores && !selected.includes(s) ? 0.4 : 1,
                    transition: "all 0.15s", textAlign: "left", fontFamily: FONT,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}
                >
                  <span>{s}</span>
                  {selected.includes(s) && <span style={{ fontSize: 14, color: MAGENTA }}>✓</span>}
                </button>
              ))}
            </div>
          )}

          {/* ── PASO 3: Crack ── */}
          <StepHeader
            step={3} label="Cobertura de Chocolate Crack"
            done={doneCrack} active={openStep === "crack"}
            onClick={() => doneSabor && setOpenStep("crack")}
          />
          {openStep === "crack" && doneSabor && (
            <div style={{ padding: "16px", display: "flex", gap: 10 }}>
              {["Sin Crack", "Con Crack (+$4.000)"].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleSelectCrack(opt)}
                  style={{
                    flex: 1, padding: "14px 0", borderRadius: 14,
                    border: crack === opt ? `2.5px solid ${MAGENTA}` : "1.5px solid #F0E4EA",
                    background: crack === opt ? "#FFF0F5" : "#fff",
                    cursor: "pointer", fontWeight: 700, fontSize: 13,
                    color: crack === opt ? MAGENTA : "#888",
                    fontFamily: FONT, transition: "all 0.15s",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* ── PASO 4: Extras ── */}
          <StepHeader
            step={4} label={`Extras opcionales${extras.length > 0 ? ` (${extras.length})` : ""}`}
            done={false} active={openStep === "extras"}
            onClick={() => doneCrack && setOpenStep("extras")}
          />
          {openStep === "extras" && doneCrack && (
            <div style={{ padding: "12px 16px 16px" }}>
              <p style={{ fontSize: 11, color: "#BBA8B0", margin: "0 0 10px" }}>Cada extra +$2.900 · Opcional</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {EXTRAS.map(e => (
                  <button
                    key={e}
                    onClick={() => toggleExtra(e)}
                    style={{
                      padding: "10px 12px", borderRadius: 12,
                      border: extras.includes(e) ? `2px solid ${MAGENTA}` : "1.5px solid #F0E4EA",
                      background: extras.includes(e) ? "#FFF0F5" : "#fff",
                      cursor: "pointer", fontSize: 12,
                      fontWeight: extras.includes(e) ? 700 : 500,
                      color: extras.includes(e) ? MAGENTA : "#333",
                      transition: "all 0.15s", textAlign: "left", fontFamily: FONT,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <span>{e}</span>
                    {extras.includes(e) && <span style={{ fontSize: 13, color: MAGENTA }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ height: 100 }} />
        </div>

        {/* Footer fijo */}
        <div style={{ padding: "16px", borderTop: "1px solid #F0E4EA", background: "#FFFCFD", flexShrink: 0 }}>
          {!canConfirm && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8, fontFamily: FONT }}>
              {!numSabores ? "Elige cuántos sabores quieres" :
               selected.length < numSabores ? `Faltan ${numSabores - selected.length} sabor(es)` :
               crack === null ? "Elige si quieres Crack o no" : ""}
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