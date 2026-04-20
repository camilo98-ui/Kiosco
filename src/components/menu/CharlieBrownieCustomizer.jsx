import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const SALSAS = ["Caramelo", "Chocolate", "Mora", "Arequipe", "Fresa", "Frutas", "Cereza Italiana"];
const SABORES_HELADO = [
  "Arequipe", "Chocolate Belga", "Chocolate", "Fresa", "Frutos Del Bosque",
  "Nieves Limón", "Mandarina", "Nieves Mandarina", "Nieves Maracuyá",
  "Ron Pasas", "Vainilla Francesa", "Vainilla",
  "Yogo Yogo Fresa", "Brownie", "Cherry Mania", "Crema Limón", "MM",
  "Macadamia", "Milky Way", "Mocaccino", "Oreo", "Vainilla Chips",
  "Arroz Con Leche", "Yogurt De Cereza Italiana", "Chicle", "Snickers Almond",
];
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
  { name: "Sprinkles", price: 2900 },
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
        {price > 0 && <span style={{ fontSize: 11, color: MAGENTA, marginLeft: 6, fontWeight: 700 }}>+ {formatCOP(price)}</span>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 5, flexShrink: 0,
        border: selected ? "none" : "2px solid #DDD",
        background: selected ? MAGENTA : "#fff", transition: "all 0.15s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
      </div>
    </button>
  );
}

export default function CharlieBrownieCustomizer({ product, open, onClose, onAdd }) {
  const [helados, setHelados] = useState([]);
  const [salsas, setSalsas] = useState([]);
  const [extras, setExtras] = useState([]);
  const [openSec, setOpenSec] = useState("helado");

  if (!product) return null;

  const maxHelados = 2;
  const maxSalsas = 2;
  const ready = helados.length === maxHelados && salsas.length === maxSalsas;

  const toggleHelado = (h) => {
    setHelados(prev => {
      if (prev.includes(h)) return prev.filter(x => x !== h);
      if (prev.length >= maxHelados) return prev;
      return [...prev, h];
    });
  };

  const toggleSalsa = (s) => {
    setSalsas(prev => {
      if (prev.includes(s)) return prev.filter(x => x !== s);
      if (prev.length >= maxSalsas) return prev;
      return [...prev, s];
    });
  };

  const toggleExtra = (name, price) => {
    setExtras(prev =>
      prev.find(e => e.name === name)
        ? prev.filter(e => e.name !== name)
        : [...prev, { name, price }]
    );
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = (product.price || 0) + extrasTotal;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = [
      `Helados: ${helados.join(", ")}`,
      `Salsas: ${salsas.join(", ")} (Gratis)`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");
    onAdd({ product_id: product.id, product_name: product.name, price: total, quantity: 1 }, notes);
    setHelados([]);
    setSalsas([]);
    setExtras([]);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl" style={{ background: "#FFFCFD", border: "none", maxHeight: "85vh", overflowY: "auto", padding: 0 }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F0E4EA" }}>
          <SheetTitle style={{ fontSize: 17, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {product.name}
          </SheetTitle>
          <p style={{ fontSize: 12, color: "#BBA8B0", margin: "6px 0 0", fontWeight: 500 }}>Elige 2 sabores de helado y 2 salsas (sin costo extra)</p>
        </div>

        {/* Helados */}
        <div style={{ borderBottom: "1px solid #F0E4EA" }}>
          <button 
            onClick={() => setOpenSec(s => s === "helado" ? null : "helado")}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>2 Sabores de Helado {helados.length}/{maxHelados}</span>
            <span style={{ fontSize: 18, color: "#BBA8B0" }}>{openSec === "helado" ? "∧" : "∨"}</span>
          </button>
          {openSec === "helado" && SABORES_HELADO.map(h => (
            <CheckOption key={h} label={h} price={0} selected={helados.includes(h)} onToggle={() => toggleHelado(h)} />
          ))}
        </div>

        {/* Salsas */}
        <div style={{ borderBottom: "1px solid #F0E4EA" }}>
          <button 
            onClick={() => setOpenSec(s => s === "salsa" ? null : "salsa")}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>2 Salsas (Gratis) {salsas.length}/{maxSalsas}</span>
            <span style={{ fontSize: 18, color: "#BBA8B0" }}>{openSec === "salsa" ? "∧" : "∨"}</span>
          </button>
          {openSec === "salsa" && SALSAS.map(s => (
            <CheckOption key={s} label={s} price={0} selected={salsas.includes(s)} onToggle={() => toggleSalsa(s)} />
          ))}
        </div>

        {/* Extras */}
        {openSec === "extras" && (
          <div style={{ borderBottom: "1px solid #F0E4EA" }}>
            <button onClick={() => setOpenSec(null)} style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>Extras</span>
              <span style={{ fontSize: 18, color: "#BBA8B0" }}>∧</span>
            </button>
            <div>
              {EXTRAS.map(e => (
                <CheckOption key={e.name} label={`Adición ${e.name}`} price={e.price} selected={!!extras.find(x => x.name === e.name)} onToggle={() => toggleExtra(e.name, e.price)} />
              ))}
              <div style={{ padding: "12px 16px 4px" }}>
                <button onClick={() => setOpenSec(null)} style={{ width: "100%", padding: "13px 0", borderRadius: 14, background: "#C41E6A", color: "#fff", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Poppins', sans-serif", boxShadow: "0 4px 14px rgba(196,30,106,0.35)" }}>
                  Sin extras, continuar ✓
                </button>
              </div>
            </div>
          </div>
        )}
        {openSec !== "extras" && (
          <div style={{ borderBottom: "1px solid #F0E4EA" }}>
            <button onClick={() => setOpenSec("extras")} style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>Extras</span>
              <span style={{ fontSize: 18, color: "#BBA8B0" }}>∨</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!ready && <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>* Elige 2 helados y 2 salsas</p>}
          <button
            onClick={handleConfirm}
            disabled={!ready}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: ready ? MAGENTA : "#EDD8E4",
              color: ready ? "#fff" : "#BBA8B0",
              fontSize: 15, fontWeight: 900, border: "none",
              cursor: ready ? "pointer" : "not-allowed",
              boxShadow: ready ? "0 4px 16px rgba(196,30,106,0.35)" : "none",
              transition: "all 0.2s", fontFamily: "'Poppins', sans-serif",
            }}
          >
            Agregar al pedido · {formatCOP(total)}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}