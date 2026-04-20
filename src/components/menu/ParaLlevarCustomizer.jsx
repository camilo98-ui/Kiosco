import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const BOLSA_SURCHARGE = 2500;

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
        {price > 0 && <span style={{ fontSize: 11, color: MAGENTA, marginLeft: 6, fontWeight: 700 }}>+ {formatCOP(price)}</span>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        border: selected ? `6px solid ${MAGENTA}` : "2px solid #DDD",
        background: "#fff", transition: "all 0.15s",
      }} />
    </button>
  );
}

export default function ParaLlevarCustomizer({ product, open, onClose, onAdd }) {
  const [llevarBolsa, setLlevarBolsa] = useState(null);
  const [openSec, setOpenSec] = useState("bolsa");

  if (!product) return null;

  const bolsaPrice = llevarBolsa === "con_bolsa" ? BOLSA_SURCHARGE : 0;
  const total = (product.price || 0) + bolsaPrice;
  const ready = llevarBolsa !== null;

  const handleConfirm = () => {
    if (!ready) return;
    const notes = `Para Llevar: ${llevarBolsa === "con_bolsa" ? "Con Bolsa Popsy (+$2.500)" : "Sin Bolsa"}`;
    onAdd({ product_id: product.id, product_name: product.name, price: total, quantity: 1 }, notes);
    setLlevarBolsa(null);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl" style={{ background: "#FFFCFD", border: "none", maxHeight: "85vh", overflowY: "auto", padding: 0 }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F0E4EA" }}>
          <SheetTitle style={{ fontSize: 17, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {product.name}
          </SheetTitle>
          <p style={{ fontSize: 12, color: "#BBA8B0", margin: "6px 0 0", fontWeight: 500 }}>¿Deseas una bolsa Popsy para llevar?</p>
        </div>

        {/* Bolsa Option */}
        <div style={{ borderBottom: "1px solid #F0E4EA" }}>
          <button 
            onClick={() => setOpenSec(s => s === "bolsa" ? null : "bolsa")}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>Bolsa Popsa {llevarBolsa && `✓`}</span>
            <span style={{ fontSize: 18, color: "#BBA8B0" }}>{openSec === "bolsa" ? "∧" : "∨"}</span>
          </button>
          {openSec === "bolsa" && (
            <>
              <RadioOption label="Con Bolsa Popsy" price={BOLSA_SURCHARGE} selected={llevarBolsa === "con_bolsa"} onSelect={() => setLlevarBolsa("con_bolsa")} />
              <RadioOption label="Sin Bolsa" price={0} selected={llevarBolsa === "sin_bolsa"} onSelect={() => setLlevarBolsa("sin_bolsa")} />
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!ready && <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>* Selecciona una opción</p>}
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