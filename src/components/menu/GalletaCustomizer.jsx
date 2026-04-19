import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const FONT = "'Poppins', sans-serif";

const SABORES_GOURMET = [
  "Arequipe", "Chocolate Belga", "Chocolate", "Fresa", "Frutos Del Bosque",
  "Nieves Limón", "Mandarina", "Nieves Mandarina", "Nieves Maracuyá",
  "Ron Pasas", "Vainilla Francesa", "Vainilla",
];

const SABORES_EXCLUSIVO = [
  "Yogo Yogo Fresa", "Brownie", "Cherry Mania", "Crema Limón", "MM",
  "Macadamia", "Milky Way", "Mocaccino", "Oreo", "Vainilla Chips",
  "Arroz Con Leche", "Yogurt De Cereza Italiana", "Chicle", "Snickers Almond",
];

const HELADO_OPTIONS = [
  { label: "Sin helado", price: 0 },
  { label: "Con helado Gourmet", price: 4900, type: "gourmet" },
  { label: "Con helado Exclusivo", price: 6900, type: "exclusivo" },
];

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

export default function GalletaCustomizer({ product, open, onClose, onAdd }) {
  const [heladoOption, setHeladoOption] = useState(null); // null | { label, price, type }
  const [sabor, setSabor] = useState(null);
  const [saboresTab, setSaboresTab] = useState("gourmet");

  useEffect(() => {
    if (open) {
      setHeladoOption(null);
      setSabor(null);
      setSaboresTab("gourmet");
    }
  }, [open, product?.id]);

  if (!product) return null;

  const needsSabor = heladoOption && heladoOption.type;
  const saboresList = (heladoOption?.type === "exclusivo") ? SABORES_EXCLUSIVO : SABORES_GOURMET;
  const canConfirm = heladoOption !== null && (!needsSabor || sabor !== null);

  const total = (product.price || 0) + (heladoOption?.price || 0);

  const handleConfirm = () => {
    if (!canConfirm) return;
    const notes = needsSabor ? `Helado: ${heladoOption.label} — Sabor: ${sabor}` : "Sin helado";
    onAdd({ ...product, price: total }, notes);
    toast.success("✓ Agregado al pedido", {
      duration: 1500,
      style: { background: MAGENTA, color: "#fff", border: "none", borderRadius: 12 },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl"
        style={{ background: "#F7F2F5", border: "none", maxHeight: "88vh", overflowY: "auto", padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: "20px 16px 14px", background: "#fff", borderBottom: "1px solid #F0E4EA" }}>
          <SheetTitle style={{ fontSize: 18, fontWeight: 900, color: "#1A0A10", margin: 0, fontFamily: FONT }}>
            {product.name}
          </SheetTitle>
          <p style={{ fontSize: 13, color: MAGENTA, fontWeight: 700, margin: "4px 0 0", fontFamily: FONT }}>
            {formatCOP(product.price)}
          </p>
        </div>

        <div style={{ padding: "14px 14px 0" }}>

          {/* Paso 1: ¿Con helado? */}
          <div style={{ borderRadius: 16, background: "#fff", marginBottom: 10, overflow: "hidden", border: "1.5px solid #F0E4EA" }}>
            <div style={{ padding: "12px 16px 4px" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1A0A10", margin: 0, fontFamily: FONT }}>
                ¿La quieres con helado? 🍦
              </p>
              <p style={{ fontSize: 11, color: "#BBA8B0", margin: "2px 0 8px", fontFamily: FONT }}>
                Selecciona 1 opción
              </p>
            </div>
            {HELADO_OPTIONS.map(opt => (
              <RadioRow
                key={opt.label}
                label={opt.label}
                price={opt.price}
                selected={heladoOption?.label === opt.label}
                onSelect={() => { setHeladoOption(opt); setSabor(null); }}
              />
            ))}
          </div>

          {/* Paso 2: Sabor (si eligió helado) */}
          {needsSabor && (
            <div style={{ borderRadius: 16, background: "#fff", marginBottom: 10, overflow: "hidden", border: `1.5px solid ${MAGENTA}` }}>
              <div style={{ padding: "12px 16px 4px" }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#1A0A10", margin: 0, fontFamily: FONT }}>
                  Elige el sabor
                </p>
                <p style={{ fontSize: 11, color: "#BBA8B0", margin: "2px 0 8px", fontFamily: FONT }}>
                  Sabores {heladoOption.type === "exclusivo" ? "Exclusivo" : "Gourmet"}
                </p>
              </div>
              {saboresList.map(s => (
                <RadioRow
                  key={s}
                  label={s}
                  price={0}
                  selected={sabor === s}
                  onSelect={() => setSabor(s)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#F7F2F5", borderTop: "1px solid #F0E4EA" }}>
          {!canConfirm && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8, fontFamily: FONT }}>
              {!heladoOption ? "Elige si la quieres con o sin helado" : "Elige el sabor de helado"}
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
            {canConfirm ? `Agregar al pedido · ${formatCOP(total)}` : "Personaliza tu galleta 🍪"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}