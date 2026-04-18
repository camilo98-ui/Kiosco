import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const FONT = "'Poppins', sans-serif";

// ── Sabores por categoría ──────────────────────────────────────────────────────
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

// ── Imágenes destacadas (las 2 de temporada) ──────────────────────────────────
const FEATURED_IMAGES = {
  gourmet: [
    {
      id: "fiore-gourmet",
      name: "Fiore",
      image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0e644041f_HeladoFiore14900.png",
      price: 14900,
    },
    {
      id: "gourmet-1sabor",
      name: "Gourmet",
      image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/928441d6e_GOURMET.png",
      price: 8500,
    },
  ],
  exclusivo: [
    {
      id: "fiore-exclusivo",
      name: "Fiore Exclusivo",
      image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0e644041f_HeladoFiore14900.png",
      price: 14900,
    },
    {
      id: "yogo-yogo",
      name: "Yogo Yogo",
      image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/3d40172de_EXCLUSIVO.png",
      price: 10500,
    },
  ],
  junior: [
    {
      id: "cono-jr",
      name: "Cono Jr",
      image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/4168be318_CONOJR.jpg",
      price: 7500,
    },
    {
      id: "cono-jr-mix",
      name: "Cono Jr Mix",
      image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/928441d6e_GOURMET.png",
      price: 9900,
    },
  ],
};

// ── Precios por subcategoría ───────────────────────────────────────────────────
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

function FeaturedImage({ item, onAdd }) {
  const [err, setErr] = useState(false);
  return (
    <button
      onClick={() => onAdd && onAdd(item)}
      style={{
        flex: 1, borderRadius: 18, overflow: "hidden",
        background: "#FFF0F5", height: 150,
        border: "1.5px solid #FFE4F3",
        display: "flex", flexDirection: "column",
        position: "relative", cursor: "pointer", padding: 0,
      }}
    >
      {item.image && !err ? (
        <img
          src={item.image}
          alt={item.name}
          onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🍦</div>
      )}
      {/* Overlay inferior con nombre y precio */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
        padding: "20px 10px 8px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
      }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2 }}>{item.name}</p>
        <p style={{ fontSize: 12, fontWeight: 900, color: "#FFD6EC", margin: 0 }}>{formatCOP(item.price)}</p>
      </div>
      {/* Botón + */}
      <div style={{
        position: "absolute", top: 8, right: 8,
        width: 26, height: 26, borderRadius: "50%",
        background: MAGENTA,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}>
        <span style={{ color: "#fff", fontSize: 16, lineHeight: 1, fontWeight: 900 }}>+</span>
      </div>
    </button>
  );
}

function SaborButton({ label, selected, onSelect, disabled }) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled && !selected}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: selected ? `2px solid ${MAGENTA}` : "1.5px solid #F0E4EA",
        background: selected ? "#FFF0F5" : "#fff",
        cursor: disabled && !selected ? "not-allowed" : "pointer",
        fontSize: 13,
        fontWeight: selected ? 700 : 500,
        color: selected ? MAGENTA : "#333",
        opacity: disabled && !selected ? 0.45 : 1,
        transition: "all 0.15s",
        textAlign: "center",
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span>{label}</span>
      {selected && <span style={{ fontSize: 14, color: MAGENTA }}>✓</span>}
    </button>
  );
}

export default function HeladoSubcatCustomizer({ subcat, open, onClose, onAdd, productPrice }) {
  const [numSabores, setNumSabores] = useState(null); // null = no elegido aún
  const [selected, setSelected] = useState([]);

  const saboresList = SABORES[subcat] || [];
  const featured = FEATURED_IMAGES[subcat] || [];
  const label = LABELS[subcat] || "Helado";
  const prices = BASE_PRICES[subcat] || { "1 Sabor": 8500, "2 Sabores": 10900 };

  // Precio final: usar el del producto si existe, o el del mapa
  const basePrice = productPrice || (numSabores === 2 ? prices["2 Sabores"] : prices["1 Sabor"]);

  useEffect(() => {
    if (open) {
      setNumSabores(null);
      setSelected([]);
    }
  }, [open, subcat]);

  const toggleSabor = (s) => {
    if (!numSabores) return;
    setSelected(prev => {
      if (prev.includes(s)) return prev.filter(x => x !== s);
      if (prev.length >= numSabores) return prev; // ya tiene el máximo
      return [...prev, s];
    });
  };

  const canConfirm = numSabores && selected.length === numSabores;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const notes = `Sabor: ${selected.join(", ")} | Crack: Sin Crack`;
    onAdd(
      {
        product_id: `helado-${subcat}-${Date.now()}`,
        product_name: `Helado ${label} ${numSabores === 1 ? "1 Sabor" : "2 Sabores"}`,
        name: `Helado ${label} ${numSabores === 1 ? "1 Sabor" : "2 Sabores"}`,
        price: numSabores === 2 ? prices["2 Sabores"] : prices["1 Sabor"],
        quantity: 1,
      },
      notes
    );
    toast.success("✓ Agregado al pedido", {
      duration: 1500,
      style: { background: "#C41E6A", color: "#fff", border: "none", borderRadius: 12 },
    });
    setTimeout(() => onClose(), 150);
  };

  if (!subcat) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl"
        style={{ background: "#FFFCFD", border: "none", maxHeight: "92vh", overflowY: "auto", padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #F0E4EA", position: "sticky", top: 0, background: "#FFFCFD", zIndex: 10 }}>
          <SheetTitle style={{ fontSize: 20, fontWeight: 900, color: "#1A0A10", margin: 0, fontFamily: FONT }}>
            Helado {label}
          </SheetTitle>
          <p style={{ fontSize: 13, color: MAGENTA, fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(prices["1 Sabor"])}
          </p>
        </div>

        <div style={{ padding: "16px 16px 0" }}>
          {/* Paso 1: ¿Cuántos sabores? */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A", margin: "0 0 10px", fontFamily: FONT }}>
              ¿Cuántos sabores quieres? 🍦
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[1, 2].map(n => (
                <button
                  key={n}
                  onClick={() => { setNumSabores(n); setSelected([]); }}
                  style={{
                    flex: 1,
                    padding: "14px 0",
                    borderRadius: 14,
                    border: numSabores === n ? `2.5px solid ${MAGENTA}` : "1.5px solid #F0E4EA",
                    background: numSabores === n ? "#FFF0F5" : "#fff",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: 15,
                    color: numSabores === n ? MAGENTA : "#888",
                    fontFamily: FONT,
                    transition: "all 0.15s",
                    boxShadow: numSabores === n ? `0 2px 12px rgba(196,30,106,0.18)` : "none",
                  }}
                >
                  {n} {n === 1 ? "Sabor" : "Sabores"}
                  <div style={{ fontSize: 11, fontWeight: 600, color: numSabores === n ? MAGENTA : "#BBB", marginTop: 2 }}>
                    {formatCOP(prices[n === 1 ? "1 Sabor" : "2 Sabores"])}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Imágenes destacadas — comprables directamente */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {featured.map((item, i) => (
              <FeaturedImage
                key={i}
                item={item}
                onAdd={(it) => {
                  onAdd(
                    {
                      product_id: it.id,
                      product_name: it.name,
                      name: it.name,
                      price: it.price,
                      quantity: 1,
                    },
                    `Helado ${it.name} · 1 Sabor`
                  );
                  toast.success(`✓ ${it.name} agregado`, {
                    duration: 1500,
                    style: { background: "#C41E6A", color: "#fff", border: "none", borderRadius: 12 },
                  });
                  setTimeout(() => onClose(), 150);
                }}
              />
            ))}
          </div>

          {/* Paso 2: Lista de sabores (solo si ya eligió cuántos) */}
          {numSabores ? (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", fontFamily: FONT }}>
                {numSabores === 1 ? "Elige tu sabor" : `Elige ${numSabores} sabores (${selected.length}/${numSabores})`}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {saboresList.map(s => (
                  <SaborButton
                    key={s}
                    label={s}
                    selected={selected.includes(s)}
                    onSelect={() => toggleSabor(s)}
                    disabled={selected.length >= numSabores}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0 24px", color: "#CCC" }}>
              <p style={{ fontSize: 13 }}>Primero elige cuántos sabores quieres ☝️</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!canConfirm && numSabores && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8, fontFamily: FONT }}>
              {selected.length === 0
                ? `Elige ${numSabores === 1 ? "1 sabor" : "2 sabores"} para continuar`
                : `Falta ${numSabores - selected.length} sabor${numSabores - selected.length > 1 ? "es" : ""}`}
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
            {canConfirm
              ? `Agregar al pedido · ${formatCOP(numSabores === 2 ? prices["2 Sabores"] : prices["1 Sabor"])}`
              : "Personaliza tu helado 🍦"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}