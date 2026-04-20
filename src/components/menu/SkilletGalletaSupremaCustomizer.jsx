import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const GALLETAS_SUPREMA = ["Choco Masmelo", "Cookies and Cream", "Red Velvet", "Triple Chocolate"];
const SALSAS = ["Caramelo", "Chocolate", "Mora", "Arequipe", "Fresa", "Frutas", "Cereza Italiana"];
const SABORES_HELADO = [
  "Arequipe", "Chocolate Belga", "Chocolate", "Fresa", "Frutos Del Bosque",
  "Nieves Limón", "Mandarina", "Nieves Mandarina", "Nieves Maracuyá",
  "Ron Pasas", "Vainilla Francesa", "Vainilla",
  "Yogo Yogo Fresa", "Brownie", "Cherry Mania", "Crema Limón", "MM",
  "Macadamia", "Milky Way", "Mocaccino", "Oreo", "Vainilla Chips",
  "Arroz Con Leche", "Yogurt De Cereza Italiana", "Chicle", "Snickers Almond",
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

export default function SkilletGalletaSupremaCustomizer({ product, open, onClose, onAdd }) {
  const [galleta, setGalleta] = useState(null);
  const [helado, setHelado] = useState(null);
  const [salsa, setSalsa] = useState(null);
  const [openSec, setOpenSec] = useState("galleta");

  if (!product) return null;

  const ready = galleta && helado && salsa;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `Galleta Suprema: ${galleta} | Helado: ${helado} | Salsa: ${salsa} (Gratis)`;
    onAdd({ product_id: product.id, product_name: product.name, price: product.price, quantity: 1 }, notes);
    setGalleta(null);
    setHelado(null);
    setSalsa(null);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl" style={{ background: "#FFFCFD", border: "none", maxHeight: "85vh", overflowY: "auto", padding: 0 }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F0E4EA" }}>
          <SheetTitle style={{ fontSize: 17, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {product.name}
          </SheetTitle>
        </div>

        {/* Galleta Suprema */}
        <div style={{ borderBottom: "1px solid #F0E4EA" }}>
          <button 
            onClick={() => setOpenSec(s => s === "galleta" ? null : "galleta")}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>Galleta Suprema {galleta && `✓ ${galleta}`}</span>
            <span style={{ fontSize: 18, color: "#BBA8B0" }}>{openSec === "galleta" ? "∧" : "∨"}</span>
          </button>
          {openSec === "galleta" && GALLETAS_SUPREMA.map(g => (
            <RadioOption key={g} label={g} selected={galleta === g} onSelect={() => { setGalleta(g); setOpenSec("helado"); }} />
          ))}
        </div>

        {/* Helado */}
        <div style={{ borderBottom: "1px solid #F0E4EA" }}>
          <button 
            onClick={() => setOpenSec(s => s === "helado" ? null : "helado")}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>Helado {helado && `✓ ${helado}`}</span>
            <span style={{ fontSize: 18, color: "#BBA8B0" }}>{openSec === "helado" ? "∧" : "∨"}</span>
          </button>
          {openSec === "helado" && SABORES_HELADO.map(h => (
            <RadioOption key={h} label={h} selected={helado === h} onSelect={() => { setHelado(h); setOpenSec("salsa"); }} />
          ))}
        </div>

        {/* Salsa */}
        <div style={{ borderBottom: "1px solid #F0E4EA" }}>
          <button 
            onClick={() => setOpenSec(s => s === "salsa" ? null : "salsa")}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>Salsa (Gratis) {salsa && `✓ ${salsa}`}</span>
            <span style={{ fontSize: 18, color: "#BBA8B0" }}>{openSec === "salsa" ? "∧" : "∨"}</span>
          </button>
          {openSec === "salsa" && SALSAS.map(s => <RadioOption key={s} label={s} selected={salsa === s} onSelect={() => { setSalsa(s); setOpenSec(null); }} />)}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!ready && <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>* Elige galleta, helado y salsa</p>}
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
            Agregar al pedido · {formatCOP(product.price)}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}