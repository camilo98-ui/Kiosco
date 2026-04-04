import React, { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const EXTRAS = [
  { name: "Agua", price: 3000 },
  { name: "Gomas Ositos", price: 3100 },
  { name: "Cerezas", price: 3100 },
  { name: "M&M's", price: 3100 },
  { name: "Banano", price: 3000 },
  { name: "Fresas", price: 3100 },
  { name: "Durazno", price: 3100 },
  { name: "Mini Masmelos", price: 3100 },
  { name: "Chantilly", price: 2900 },
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
        <span style={{ fontSize: 11, color: "#C41E6A", marginLeft: 6, fontWeight: 700 }}>
          + {formatCOP(price)}
        </span>
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

export default function GenericCustomizer({ product, open, onClose, onAdd }) {
  const [extras, setExtras] = useState([]);

  const toggleExtra = (name, price) => {
    setExtras(prev =>
      prev.find(e => e.name === name)
        ? prev.filter(e => e.name !== name)
        : [...prev, { name, price }]
    );
  };

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = (product?.price || 0) + extrasTotal;

  const handleConfirm = () => {
    const notes = extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : "";
    onAdd({ ...product, price: total }, notes);
    toast.success("✓ Agregado al pedido", { duration: 1500, style: { background: "#E91B8B", color: "#fff", border: "none", borderRadius: 12 } });
    setExtras([]);
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
          <p style={{ fontSize: 11, color: "#BBA8B0", margin: "0 0 4px", fontWeight: 600 }}>Personaliza tu pedido</p>
          <SheetTitle style={{ fontSize: 18, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {product.name}
          </SheetTitle>
          <p style={{ fontSize: 13, color: "#C41E6A", fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(product.price)}
          </p>
        </div>

        <div style={{ borderBottom: "1px solid #F0E4EA" }}>
          <button
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "14px 16px",
              background: "none", border: "none", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>Elige tus extras</span>
            <span style={{ fontSize: 18, color: "#BBA8B0" }}>∧</span>
          </button>
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Opcionales · puedes elegir varios</p>
          {EXTRAS.map(e => (
            <CheckOption
              key={e.name}
              label={e.name}
              price={e.price}
              selected={!!extras.find(x => x.name === e.name)}
              onToggle={() => toggleExtra(e.name, e.price)}
            />
          ))}
        </div>

        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          <button
            onClick={handleConfirm}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: "#C41E6A",
              color: "#fff",
              fontSize: 15, fontWeight: 900, border: "none", cursor: "pointer",
              boxShadow: "0 4px 16px rgba(194,24,91,0.35)",
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