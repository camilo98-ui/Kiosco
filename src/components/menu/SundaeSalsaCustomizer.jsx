import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const SALSAS = ["Caramelo", "Chocolate", "Mora", "Arequipe", "Fresa", "Frutas", "Cereza Italiana"];

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

export default function SundaeSalsaCustomizer({ product, open, onClose, onAdd }) {
  const [salsa, setSalsa] = useState(null);

  if (!product) return null;

  const ready = salsa;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `Salsa: ${salsa}`;
    onAdd({ product_id: product.id, product_name: product.name, price: product.price, quantity: 1 }, notes);
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
          <p style={{ fontSize: 12, color: "#BBA8B0", margin: "6px 0 0", fontWeight: 500 }}>Elige una salsa</p>
        </div>

        {/* Salsas */}
        <div>
          {SALSAS.map(s => <RadioOption key={s} label={s} selected={salsa === s} onSelect={() => setSalsa(s)} />)}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!ready && <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>* Elige una salsa</p>}
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