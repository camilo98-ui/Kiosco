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

const PRECIO_LITRO_GOURMET = 39900;
const PRECIO_LITRO_EXCLUSIVO = 46900;
const PRECIO_TARRINA_GOURMET = 39900;
const PRECIO_TARRINA_EXCLUSIVO = 46900;

// Determina qué tipo de customizer mostrar según el combo
function getComboType(combo) {
  if (!combo) return null;
  const title = combo.title?.toLowerCase() || "";
  if (title.includes("charlie brownie") || title.includes("charly brownie")) return "charlie_brownie";
  if (title.includes("banana split")) return "banana_split";
  if (title.includes("malteada 16") && !title.includes("charlie") && !title.includes("banana")) return "malteada_16";
  if (title.includes("litro de helado") && title.includes("brownie")) return "litro_brownie";
  if (title.includes("tarrina o litro")) return "tarrina_litro";
  if (title.includes("2 tarrina") && title.includes("cono")) return "dos_tarrinas";
  if (title.includes("litro") && title.includes("cono") && title.includes("topping")) return "litro_cono_toppings";
  if (title.includes("malteada") && title.includes("agua")) return "malteada_agua";
  if (title.includes("la 2da con descuento")) return "dos_malteadas";
  if (title.includes("duplica") || title.includes("segundo litro")) return "segundo_litro";
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

// ─── Customizer para Malteada 16oz (básica) ────────────────────────────────────
function Malteada16Form({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("sabor");
  const [sabor, setSabor] = useState(null);
  const [extras, setExtras] = useState([]);

  const toggleExtra = (name, price) => {
    setExtras(prev => prev.find(e => e.name === name) ? prev.filter(e => e.name !== name) : [...prev, { name, price }]);
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = combo.price + extrasTotal;
  const ready = sabor;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = [
      `Sabor: ${sabor}`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="Sabor De Helado" required badge={sabor ? "✓" : ""} open={openSec === "sabor"} onToggle={() => setOpenSec(s => s === "sabor" ? null : "sabor")}>
        {SABORES_ALL.map(s => <Radio key={s} label={s} price={0} selected={sabor === s} onSelect={() => { setSabor(s); setOpenSec("extras"); }} />)}
      </Section>
      <Section title="Extras" required={false} open={openSec === "extras"} onToggle={() => setOpenSec(s => s === "extras" ? null : "extras")}>
        {EXTRAS.map(e => <Check key={e.name} label={`${e.name}`} price={e.price} selected={!!extras.find(x => x.name === e.name)} onToggle={() => toggleExtra(e.name, e.price)} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* Elige un sabor de helado" />
    </>
  );
}

// ─── Customizer para Charlie Brownie (2 sabores, 2 salsas gratis) ─────────────────
function CharlieBrownieForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("sabores");
  const [sabores, setSabores] = useState([]);
  const [salsas, setSalsas] = useState([]);
  const [extras, setExtras] = useState([]);
  const MAX_SABORES = 2;
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
    if (next.length === MAX_SALSAS) setTimeout(() => setOpenSec("extras"), 300);
    return next;
  });

  const toggleExtra = (name, price) => {
    setExtras(prev => prev.find(e => e.name === name) ? prev.filter(e => e.name !== name) : [...prev, { name, price }]);
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = combo.price + extrasTotal;
  const ready = sabores.length === MAX_SABORES && salsas.length === MAX_SALSAS;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = [
      `Helados: ${sabores.join(", ")}`,
      `Salsas: ${salsas.join(", ")} (Gratis)`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="2 Sabores De Helado" required badge={`${sabores.length}/${MAX_SABORES}`} open={openSec === "sabores"} onToggle={() => setOpenSec(s => s === "sabores" ? null : "sabores")}>
        {SABORES_ALL.map(s => <Check key={s} label={s} price={0} selected={sabores.includes(s)} onToggle={() => toggleSabor(s)} />)}
      </Section>
      <Section title="2 Salsas (Gratis)" required badge={`${salsas.length}/${MAX_SALSAS}`} open={openSec === "salsas"} onToggle={() => setOpenSec(s => s === "salsas" ? null : "salsas")}>
        {SALSAS.map(s => <Check key={s} label={s} price={0} selected={salsas.includes(s)} onToggle={() => toggleSalsa(s)} />)}
      </Section>
      <Section title="Extras" required={false} open={openSec === "extras"} onToggle={() => setOpenSec(s => s === "extras" ? null : "extras")}>
        {EXTRAS.map(e => <Check key={e.name} label={`${e.name}`} price={e.price} selected={!!extras.find(x => x.name === e.name)} onToggle={() => toggleExtra(e.name, e.price)} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* 2 helados y 2 salsas" />
    </>
  );
}

// ─── Customizer para Banana Split (1 sabor + 1 salsa + extras) ────────────────────
function BananaSplitForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("sabor");
  const [sabor, setSabor] = useState(null);
  const [salsa, setSalsa] = useState(null);
  const [extras, setExtras] = useState([]);

  const toggleExtra = (name, price) => {
    setExtras(prev => prev.find(e => e.name === name) ? prev.filter(e => e.name !== name) : [...prev, { name, price }]);
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = combo.price + extrasTotal;
  const ready = sabor && salsa;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = [
      `Helado: ${sabor}`,
      `Salsa: ${salsa}`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="Sabor De Helado" required badge={sabor ? "✓" : ""} open={openSec === "sabor"} onToggle={() => setOpenSec(s => s === "sabor" ? null : "sabor")}>
        {SABORES_ALL.map(s => <Radio key={s} label={s} price={0} selected={sabor === s} onSelect={() => { setSabor(s); setOpenSec("salsa"); }} />)}
      </Section>
      <Section title="Salsa" required badge={salsa ? "✓" : ""} open={openSec === "salsa"} onToggle={() => setOpenSec(s => s === "salsa" ? null : "salsa")}>
        {SALSAS.map(s => <Radio key={s} label={s} price={0} selected={salsa === s} onSelect={() => { setSalsa(s); setOpenSec("extras"); }} />)}
      </Section>
      <Section title="Extras" required={false} open={openSec === "extras"} onToggle={() => setOpenSec(s => s === "extras" ? null : "extras")}>
        {EXTRAS.map(e => <Check key={e.name} label={`${e.name}`} price={e.price} selected={!!extras.find(x => x.name === e.name)} onToggle={() => toggleExtra(e.name, e.price)} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* Elige helado y salsa" />
    </>
  );
}

// ─── Customizer para Litro + Brownie (precio dinámico) ────────────────────────────
function LitroBrownieForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("tipo");
  const [tipo, setTipo] = useState(null);
  const [sabores, setSabores] = useState([]);
  const tab = tipo || "gourmet";
  const saboresList = tab === "gourmet" ? SABORES_GOURMET : SABORES_EXCLUSIVO;

  const toggleSabor = (s) => setSabores(prev => {
    if (prev.includes(s)) return prev.filter(x => x !== s);
    if (prev.length >= 1) return prev;
    const next = [...prev, s];
    if (next.length === 1) setTimeout(() => setOpenSec(null), 200);
    return next;
  });

  const litroPrice = tipo === "exclusivo" ? PRECIO_LITRO_EXCLUSIVO : PRECIO_LITRO_GOURMET;
  const total = combo.price + litroPrice;
  const ready = tipo && sabores.length === 1;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `Tipo: ${tipo === "exclusivo" ? "Exclusivo" : "Gourmet"} | Sabor: ${sabores[0]}`;
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="Tipo De Litro" required badge={tipo ? `${tipo}` : ""} open={openSec === "tipo"} onToggle={() => setOpenSec(s => s === "tipo" ? null : "tipo")}>
        <Radio label={`Gourmet ${formatCOP(PRECIO_LITRO_GOURMET)}`} price={0} selected={tipo === "gourmet"} onSelect={() => { setTipo("gourmet"); setOpenSec("sabor"); }} />
        <Radio label={`Exclusivo ${formatCOP(PRECIO_LITRO_EXCLUSIVO)}`} price={0} selected={tipo === "exclusivo"} onSelect={() => { setTipo("exclusivo"); setOpenSec("sabor"); }} />
      </Section>
      <Section title="Sabor" required badge={sabores.length ? "✓" : ""} open={openSec === "sabor"} onToggle={() => setOpenSec(s => s === "sabor" ? null : "sabor")}>
        {saboresList.map(s => <Radio key={s} label={s} price={0} selected={sabores.includes(s)} onSelect={() => toggleSabor(s)} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* Elige tipo y sabor" />
    </>
  );
}

// ─── Customizer para Tarrina o Litro ─────────────────────────────────────────────
function TarrinaLitroForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("formato");
  const [formato, setFormato] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [sabores, setSabores] = useState([]);
  const saboresList = tipo === "exclusivo" ? SABORES_EXCLUSIVO : SABORES_GOURMET;

  const toggleSabor = (s) => setSabores(prev => {
    if (prev.includes(s)) return prev.filter(x => x !== s);
    if (prev.length >= 1) return prev;
    return [...prev, s];
  });

  const basePrice = formato === "litro" 
    ? (tipo === "exclusivo" ? PRECIO_LITRO_EXCLUSIVO : PRECIO_LITRO_GOURMET)
    : (tipo === "exclusivo" ? PRECIO_TARRINA_EXCLUSIVO : PRECIO_TARRINA_GOURMET);
  const total = combo.price + basePrice;
  const ready = formato && tipo && sabores.length === 1;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `${formato === "litro" ? "Litro" : "Tarrina"} ${tipo === "exclusivo" ? "Exclusivo" : "Gourmet"} | Sabor: ${sabores[0]}`;
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="Formato" required badge={formato} open={openSec === "formato"} onToggle={() => setOpenSec(s => s === "formato" ? null : "formato")}>
        <Radio label="Tarrina" price={0} selected={formato === "tarrina"} onSelect={() => { setFormato("tarrina"); setOpenSec("tipo"); }} />
        <Radio label="Litro" price={0} selected={formato === "litro"} onSelect={() => { setFormato("litro"); setOpenSec("tipo"); }} />
      </Section>
      <Section title="Tipo" required badge={tipo} open={openSec === "tipo"} onToggle={() => setOpenSec(s => s === "tipo" ? null : "tipo")}>
        <Radio label={`Gourmet ${formatCOP(formato === "litro" ? PRECIO_LITRO_GOURMET : PRECIO_TARRINA_GOURMET)}`} price={0} selected={tipo === "gourmet"} onSelect={() => { setTipo("gourmet"); setOpenSec("sabor"); }} />
        <Radio label={`Exclusivo ${formatCOP(formato === "litro" ? PRECIO_LITRO_EXCLUSIVO : PRECIO_TARRINA_EXCLUSIVO)}`} price={0} selected={tipo === "exclusivo"} onSelect={() => { setTipo("exclusivo"); setOpenSec("sabor"); }} />
      </Section>
      <Section title="Sabor" required badge={sabores.length ? "✓" : ""} open={openSec === "sabor"} onToggle={() => setOpenSec(s => s === "sabor" ? null : "sabor")}>
        {saboresList.map(s => <Radio key={s} label={s} price={0} selected={sabores.includes(s)} onSelect={() => { toggleSabor(s); if (!sabores.includes(s)) setTimeout(() => setOpenSec(null), 200); }} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* Elige formato, tipo y sabor" />
    </>
  );
}

// ─── Customizer para 2 Tarrinas + Caja de Conos ───────────────────────────────────
function DosTarrinasForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("tipo");
  const [tipo, setTipo] = useState(null);
  const [sabores, setSabores] = useState([]);
  const MAX_SABORES = 2;
  const saboresList = tipo === "exclusivo" ? SABORES_EXCLUSIVO : SABORES_GOURMET;

  const toggleSabor = (s) => setSabores(prev => {
    if (prev.includes(s)) return prev.filter(x => x !== s);
    if (prev.length >= MAX_SABORES) return prev;
    return [...prev, s];
  });

  const tarrinaPrice = tipo === "exclusivo" ? PRECIO_TARRINA_EXCLUSIVO : PRECIO_TARRINA_GOURMET;
  const total = combo.price + (tarrinaPrice * 2);
  const ready = tipo && sabores.length === MAX_SABORES;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `${tipo === "exclusivo" ? "Exclusivo" : "Gourmet"} | Sabores: ${sabores.join(", ")}`;
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="Tipo De Tarrinas" required badge={tipo} open={openSec === "tipo"} onToggle={() => setOpenSec(s => s === "tipo" ? null : "tipo")}>
        <Radio label={`Gourmet 2x ${formatCOP(PRECIO_TARRINA_GOURMET)}`} price={0} selected={tipo === "gourmet"} onSelect={() => { setTipo("gourmet"); setOpenSec("sabores"); }} />
        <Radio label={`Exclusivo 2x ${formatCOP(PRECIO_TARRINA_EXCLUSIVO)}`} price={0} selected={tipo === "exclusivo"} onSelect={() => { setTipo("exclusivo"); setOpenSec("sabores"); }} />
      </Section>
      <Section title={`Sabores De Las Tarrinas`} required badge={`${sabores.length}/${MAX_SABORES}`} open={openSec === "sabores"} onToggle={() => setOpenSec(s => s === "sabores" ? null : "sabores")}>
        {saboresList.map(s => <Check key={s} label={s} price={0} selected={sabores.includes(s)} onToggle={() => toggleSabor(s)} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* Elige tipo y 2 sabores" />
    </>
  );
}

// ─── Customizer para Litro + Caja Cono 2 + Toppings ──────────────────────────────
function LitroConoToppingsForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("tipo");
  const [tipo, setTipo] = useState(null);
  const [sabor, setSabor] = useState(null);
  const saboresList = tipo === "exclusivo" ? SABORES_EXCLUSIVO : SABORES_GOURMET;

  const litroPrice = tipo === "exclusivo" ? PRECIO_LITRO_EXCLUSIVO : PRECIO_LITRO_GOURMET;
  const total = combo.price + litroPrice;
  const ready = tipo && sabor;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `${tipo === "exclusivo" ? "Litro Exclusivo" : "Litro Gourmet"} | Sabor: ${sabor}`;
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="Tipo De Litro" required badge={tipo} open={openSec === "tipo"} onToggle={() => setOpenSec(s => s === "tipo" ? null : "tipo")}>
        <Radio label={`Gourmet ${formatCOP(PRECIO_LITRO_GOURMET)}`} price={0} selected={tipo === "gourmet"} onSelect={() => { setTipo("gourmet"); setOpenSec("sabor"); }} />
        <Radio label={`Exclusivo ${formatCOP(PRECIO_LITRO_EXCLUSIVO)}`} price={0} selected={tipo === "exclusivo"} onSelect={() => { setTipo("exclusivo"); setOpenSec("sabor"); }} />
      </Section>
      <Section title="Sabor" required badge={sabor ? "✓" : ""} open={openSec === "sabor"} onToggle={() => setOpenSec(s => s === "sabor" ? null : "sabor")}>
        {saboresList.map(s => <Radio key={s} label={s} price={0} selected={sabor === s} onSelect={() => { setSabor(s); setOpenSec(null); }} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* Elige tipo y sabor" />
    </>
  );
}

// ─── Customizer para Malteada + Agua ──────────────────────────────────────────────
function MalteadaAguaForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("sabor");
  const [sabor, setSabor] = useState(null);

  const ready = sabor;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `Sabor: ${sabor}`;
    onConfirm(combo.price, notes);
  };

  return (
    <>
      <Section title="Sabor De Malteada" required badge={sabor ? "✓" : ""} open={openSec === "sabor"} onToggle={() => setOpenSec(s => s === "sabor" ? null : "sabor")}>
        {SABORES_ALL.map(s => <Radio key={s} label={s} price={0} selected={sabor === s} onSelect={() => { setSabor(s); setOpenSec(null); }} />)}
      </Section>
      <FooterBtn ready={ready} total={combo.price} onConfirm={handleConfirm} label="* Elige un sabor" />
    </>
  );
}

// ─── Customizer para 2 Malteadas ─────────────────────────────────────────────────
function DosMalteadasForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("sabor1");
  const [sabor1, setSabor1] = useState(null);
  const [sabor2, setSabor2] = useState(null);
  const MAX_SABORES = 2;

  const ready = sabor1 && sabor2;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `Malteadas: ${sabor1}, ${sabor2}`;
    onConfirm(combo.price, notes);
  };

  return (
    <>
      <Section title="1era Malteada" required badge={sabor1 ? "✓" : ""} open={openSec === "sabor1"} onToggle={() => setOpenSec(s => s === "sabor1" ? null : "sabor1")}>
        {SABORES_ALL.map(s => <Radio key={s} label={s} price={0} selected={sabor1 === s} onSelect={() => { setSabor1(s); setOpenSec("sabor2"); }} />)}
      </Section>
      <Section title="2da Malteada (Descuento)" required badge={sabor2 ? "✓" : ""} open={openSec === "sabor2"} onToggle={() => setOpenSec(s => s === "sabor2" ? null : "sabor2")}>
        {SABORES_ALL.map(s => <Radio key={s} label={s} price={0} selected={sabor2 === s} onSelect={() => { setSabor2(s); setOpenSec(null); }} />)}
      </Section>
      <FooterBtn ready={ready} total={combo.price} onConfirm={handleConfirm} label="* Elige 2 sabores de malteada" />
    </>
  );
}

// ─── Customizer para Segundo Litro ───────────────────────────────────────────────
function SegundoLitroForm({ combo, onConfirm }) {
  const [openSec, setOpenSec] = useState("tipo");
  const [tipo, setTipo] = useState(null);
  const [sabor, setSabor] = useState(null);
  const saboresList = tipo === "exclusivo" ? SABORES_EXCLUSIVO : SABORES_GOURMET;

  const litroPrice = tipo === "exclusivo" ? PRECIO_LITRO_EXCLUSIVO : PRECIO_LITRO_GOURMET;
  const total = combo.price + litroPrice;
  const ready = tipo && sabor;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `${tipo === "exclusivo" ? "Litro Exclusivo" : "Litro Gourmet"} | Sabor: ${sabor}`;
    onConfirm(total, notes);
  };

  return (
    <>
      <Section title="Tipo De Litro" required badge={tipo} open={openSec === "tipo"} onToggle={() => setOpenSec(s => s === "tipo" ? null : "tipo")}>
        <Radio label={`Gourmet ${formatCOP(PRECIO_LITRO_GOURMET)}`} price={0} selected={tipo === "gourmet"} onSelect={() => { setTipo("gourmet"); setOpenSec("sabor"); }} />
        <Radio label={`Exclusivo ${formatCOP(PRECIO_LITRO_EXCLUSIVO)}`} price={0} selected={tipo === "exclusivo"} onSelect={() => { setTipo("exclusivo"); setOpenSec("sabor"); }} />
      </Section>
      <Section title="Sabor" required badge={sabor ? "✓" : ""} open={openSec === "sabor"} onToggle={() => setOpenSec(s => s === "sabor" ? null : "sabor")}>
        {saboresList.map(s => <Radio key={s} label={s} price={0} selected={sabor === s} onSelect={() => { setSabor(s); setOpenSec(null); }} />)}
      </Section>
      <FooterBtn ready={ready} total={total} onConfirm={handleConfirm} label="* Elige tipo y sabor" />
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

        {comboType === "malteada_16" && <Malteada16Form combo={combo} onConfirm={handleConfirm} />}
        {comboType === "charlie_brownie" && <CharlieBrownieForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "banana_split" && <BananaSplitForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "litro_brownie" && <LitroBrownieForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "tarrina_litro" && <TarrinaLitroForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "dos_tarrinas" && <DosTarrinasForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "litro_cono_toppings" && <LitroConoToppingsForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "malteada_agua" && <MalteadaAguaForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "dos_malteadas" && <DosMalteadasForm combo={combo} onConfirm={handleConfirm} />}
        {comboType === "segundo_litro" && <SegundoLitroForm combo={combo} onConfirm={handleConfirm} />}
      </SheetContent>
    </Sheet>
  );
}