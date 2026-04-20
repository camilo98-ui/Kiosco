import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";

const SABORES_GOURMET = [
  "Arequipe","Chocolate Belga","Chocolate","Fresa","Frutos Del Bosque",
  "Nieves Limón","Mandarina","Nieves Mandarina","Nieves Maracuyá",
  "Ron Pasas","Vainilla Francesa","Vainilla",
];
const SABORES_EXCLUSIVO = [
  "Yogo Yogo Fresa","Brownie","Cherry Mania","Crema Limón","MM",
  "Macadamia","Milky Way","Mocaccino","Oreo","Vainilla Chips",
  "Arroz Con Leche","Yogurt De Cereza Italiana","Chicle","Snickers Almond",
];
const SABORES_ALL = [...SABORES_GOURMET, ...SABORES_EXCLUSIVO];

const SALSAS = [
  "Salsa Arequipe","Salsa De Caramelo","Salsa De Chocolate",
  "Salsa De Fresa","Salsa De Frutas","Salsa De Mora","Salsa Cereza Italiana",
];
const CHANTILLY = ["Con Crema Chantilly","Sin Crema Chantilly"];
const CRACK = [{ label: "Sin Crack", price: 0 }, { label: "Con Crack", price: 4000 }];

// Determina qué tipo de customizer mostrar según el combo
function getComboType(combo) {
  if (!combo) return null;
  const title = combo.title?.toLowerCase() || "";
  if (title.includes("banana split")) return "banana_split";
  if (title.includes("charlie brownie") || title.includes("charly")) return "malteada";
  if (title.includes("malteada") || combo.saborType === "malteada") return "malteada";
  if (combo.saborType === "litro") return "litro";
  return null;
}

// ─── UI helpers ──────────────────────────────────────────────────────────────
function Section({ title, required, open, onToggle, badge, children }) {
  return (
    <div style={{ borderBottom: "1px solid #F0E4EA" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>{title}</span>
          {required && <span style={{ fontSize: 10, color: MAGENTA, background: "#FFF0F5", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>Obligatorio</span>}
          {badge && <span style={{ fontSize: 11, color: MAGENTA, fontWeight: 700 }}>{badge}</span>}
        </div>
        <span style={{ fontSize: 18, color: "#BBA8B0" }}>{open ? "∧" : "∨"}</span>
      </button>
      {open && <div style={{ paddingBottom: 8 }}>{children}</div>}
    </div>
  );
}

function Radio({ label, price, selected, onSelect }) {
  return (
    <button onClick={onSelect} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #F9F0F4" }}>
      <div>
        <span style={{ fontSize: 13, color: "#1A0A10" }}>{label}</span>
        {price > 0 && <span style={{ fontSize: 11, color: MAGENTA, marginLeft: 6, fontWeight: 700 }}>+ {formatCOP(price)}</span>}
      </div>
      <div style={{ width: 22, height: 22, borderRadius: "50%", border: selected ? `6px solid ${MAGENTA}` : "2px solid #DDD", background: "#fff", flexShrink: 0, transition: "all 0.15s" }} />
    </button>
  );
}

function Check({ label, price, selected, onToggle }) {
  return (
    <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #F9F0F4" }}>
      <div>
        <span style={{ fontSize: 13, color: "#1A0A10" }}>{label}</span>
        {price > 0 && <span style={{ fontSize: 11, color: MAGENTA, marginLeft: 6, fontWeight: 700 }}>+ {formatCOP(price)}</span>}
      </div>
      <div style={{ width: 22, height: 22, borderRadius: 5, background: selected ? MAGENTA : "#fff", border: selected ? "none" : "2px solid #DDD", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
        {selected && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
      </div>
    </button>
  );
}

// ─── Customizer para Malteadas (y Charlie Brownie) ────────────────────────────
function MalteadaForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("salsa");
  const [salsa, setSalsa] = useState(null);
  const [chantilly, setChantilly] = useState(null);
  const [crack, setCrack] = useState(null);

  const SECS = ["salsa", "chantilly", "crack"];
  const advance = (cur) => {
    const next = SECS[SECS.indexOf(cur) + 1];
    if (next) setTimeout(() => setOpenSec(next), 200);
    else setTimeout(() => setOpenSec(null), 200);
  };

  const crackPrice = CRACK.find(c => c.label === crack)?.price || 0;
  const total = combo.price + crackPrice;
  const ready = salsa && chantilly && crack;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = [`Salsa: ${salsa}`, `Chantilly: ${chantilly}`, `Crack: ${crack}`].join(" | ");
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="Salsa" required open={openSec === "salsa"} onToggle={() => setOpenSec(s => s === "salsa" ? null : "salsa")}>
        {SALSAS.map(s => <Radio key={s} label={s} price={0} selected={salsa === s} onSelect={() => { setSalsa(s); advance("salsa"); }} />)}
      </Section>
      <Section title="¿Crema Chantilly?" required open={openSec === "chantilly"} onToggle={() => setOpenSec(s => s === "chantilly" ? null : "chantilly")}>
        {CHANTILLY.map(c => <Radio key={c} label={c} price={0} selected={chantilly === c} onSelect={() => { setChantilly(c); advance("chantilly"); }} />)}
      </Section>
      <Section title="Cobertura Chocolate Crack" required open={openSec === "crack"} onToggle={() => setOpenSec(s => s === "crack" ? null : "crack")}>
        {CRACK.map(c => <Radio key={c.label} label={c.label} price={c.price} selected={crack === c.label} onSelect={() => { setCrack(c.label); advance("crack"); }} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* Selecciona salsa, chantilly y crack" />
    </>
  );
}

// ─── Customizer para Banana Split (3 sabores + 2 salsas) ─────────────────────
function BananaSplitForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("sabores");
  const [sabores, setSabores] = useState([]);
  const [salsas, setSalsas] = useState([]);
  const [chantilly, setChantilly] = useState(null);
  const [crack, setCrack] = useState(null);
  const MAX_SABORES = 3;
  const MAX_SALSAS = 2;

  const toggleSabor = (s) => setSabores(prev => {
    if (prev.includes(s)) return prev.filter(x => x !== s);
    if (prev.length >= MAX_SABORES) return prev;
    const next = [...prev, s];
    if (next.length === MAX_SABORES) setTimeout(() => setOpenSec("salsas"), 300);
    return next;
  });

  const toggleSalsa = (s) => setSalsas(prev => {
    if (prev.includes(s)) return prev.filter(x => x !== s);
    if (prev.length >= MAX_SALSAS) return prev;
    const next = [...prev, s];
    if (next.length === MAX_SALSAS) setTimeout(() => setOpenSec("chantilly"), 300);
    return next;
  });

  const crackPrice = CRACK.find(c => c.label === crack)?.price || 0;
  const total = combo.price + crackPrice;
  const ready = sabores.length === MAX_SABORES && salsas.length >= 1 && chantilly && crack;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = [
      `Sabores: ${sabores.join(", ")}`,
      `Salsas: ${salsas.join(", ")}`,
      `Chantilly: ${chantilly}`,
      `Crack: ${crack}`,
    ].join(" | ");
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="3 Sabores De Helado" required badge={`${sabores.length}/${MAX_SABORES}`} open={openSec === "sabores"} onToggle={() => setOpenSec(s => s === "sabores" ? null : "sabores")}>
        <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Elige 3 sabores (Gourmet o Exclusivo)</p>
        {SABORES_ALL.map(s => <Check key={s} label={s} price={0} selected={sabores.includes(s)} onToggle={() => toggleSabor(s)} />)}
      </Section>
      <Section title="2 Salsas" required badge={`${salsas.length}/${MAX_SALSAS}`} open={openSec === "salsas"} onToggle={() => setOpenSec(s => s === "salsas" ? null : "salsas")}>
        <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Elige hasta 2 salsas</p>
        {SALSAS.map(s => <Check key={s} label={s} price={0} selected={salsas.includes(s)} onToggle={() => toggleSalsa(s)} />)}
      </Section>
      <Section title="¿Crema Chantilly?" required open={openSec === "chantilly"} onToggle={() => setOpenSec(s => s === "chantilly" ? null : "chantilly")}>
        {CHANTILLY.map(c => <Radio key={c} label={c} price={0} selected={chantilly === c} onSelect={() => { setChantilly(c); setTimeout(() => setOpenSec("crack"), 200); }} />)}
      </Section>
      <Section title="Cobertura Chocolate Crack" required open={openSec === "crack"} onToggle={() => setOpenSec(s => s === "crack" ? null : "crack")}>
        {CRACK.map(c => <Radio key={c.label} label={c.label} price={c.price} selected={crack === c.label} onSelect={() => { setCrack(c.label); setTimeout(() => setOpenSec(null), 200); }} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* 3 sabores, mín. 1 salsa, chantilly y crack" />
    </>
  );
}

// ─── Customizer para Litro / Tarrina ─────────────────────────────────────────
function LitroForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("sabores");
  const [tab, setTab] = useState("gourmet");
  const [sabores, setSabores] = useState([]);

  // Determinar cuántos sabores permite según el combo
  const title = combo.title?.toLowerCase() || "";
  const MAX_SABORES = title.includes("tarrina") ? 2 : title.includes("2 tarrina") ? 4 : 3;

  const saboresList = tab === "gourmet" ? SABORES_GOURMET : SABORES_EXCLUSIVO;

  const toggleSabor = (s) => setSabores(prev => {
    if (prev.includes(s)) return prev.filter(x => x !== s);
    if (prev.length >= MAX_SABORES) return prev;
    return [...prev, s];
  });

  const ready = sabores.length >= 1;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `Sabores: ${sabores.join(", ")}`;
    onConfirm(combo.price, notes);
  };

  return (
    <>
      <Section title={`Elige Tus Sabores`} required badge={`${sabores.length}/${MAX_SABORES} máx`} open={openSec === "sabores"} onToggle={() => setOpenSec(s => s === "sabores" ? null : "sabores")}>
        <div style={{ display: "flex", gap: 8, padding: "8px 16px 12px" }}>
          {[{ key: "gourmet", label: "Gourmet 🍦" }, { key: "exclusivo", label: "Exclusivo ✨" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "'Poppins', sans-serif", background: tab === t.key ? MAGENTA : "#FFF0F5", color: tab === t.key ? "#fff" : MAGENTA, transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Máximo {MAX_SABORES} sabores</p>
        {saboresList.map(s => (
          <Check key={s} label={s} price={0} selected={sabores.includes(s)} onToggle={() => toggleSabor(s)} />
        ))}
      </Section>
      <FooterBtn ready={ready} total={combo.price} onConfirm={handleConfirm} label="* Elige al menos 1 sabor" />
    </>
  );
}

function FooterBtn({ ready, total, onConfirm, label }) {
  return (
    <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
      {!ready && <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>{label}</p>}
      <button
        onClick={onConfirm}
        disabled={!ready}
        style={{
          width: "100%", height: 56, borderRadius: 18,
          background: ready ? MAGENTA : "#EDD8E4",
          color: ready ? "#fff" : "#BBA8B0",
          fontSize: 15, fontWeight: 900, border: "none",
          cursor: ready ? "pointer" : "not-allowed",
          boxShadow: ready ? "0 4px 16px rgba(194,24,91,0.35)" : "none",
          transition: "all 0.2s", fontFamily: "'Poppins', sans-serif",
        }}
      >
        Agregar al pedido · {formatCOP(total)}
      </button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ComboCustomizer({ combo, open, onClose, onAdd }) {
  const comboType = getComboType(combo);

  const handleConfirm = (finalPrice, notes) => {
    onAdd({
      product_id: `combo-${combo.id}`,
      product_name: combo.title,
      price: finalPrice,
      quantity: 1,
      category: "combos",
    }, notes);
    toast.success("✓ Combo agregado al pedido", {
      duration: 1500,
      style: { background: "#E91B8B", color: "#fff", border: "none", borderRadius: 12 },
    });
    setTimeout(() => onClose(), 150);
  };

  if (!combo || !comboType) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl"
        style={{ background: "#FFFCFD", border: "none", maxHeight: "92vh", overflowY: "auto", padding: 0 }}
      >
        {/* Header con imagen */}
        <div style={{ position: "relative" }}>
          <img src={combo.image} alt={combo.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
          <div style={{ position: "absolute", bottom: 14, left: 16 }}>
            <SheetTitle style={{ fontSize: 17, fontWeight: 900, color: "#fff", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
              {combo.title}
            </SheetTitle>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 700, margin: "3px 0 0" }}>
              {formatCOP(combo.price)}
            </p>
          </div>
        </div>

        {comboType === "malteada" && <MalteadaForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "banana_split" && <BananaSplitForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "litro" && <LitroForm combo={combo} onConfirm={handleConfirm} />}
      </SheetContent>
    </Sheet>
  );
}