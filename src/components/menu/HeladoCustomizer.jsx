import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatCOP } from "@/lib/constants";

const SABORES_GOURMET = [
  "Arequipe",
  "Chocolate Belga",
  "Chocolate",
  "Fresa",
  "Frutos Del Bosque",
  "Nieves Limón",
  "Mandarina",
  "Nieves Mandarina",
  "Nieves Maracuyá",
  "Ron Pasas",
  "Vainilla Francesa",
  "Vainilla",
];

const SABORES_EXCLUSIVO = [
  "Yogo Yogo Fresa",
  "Brownie",
  "Cherry Mania",
  "Crema Limón",
  "MM",
  "Macadamia",
  "Milky Way",
  "Mocaccino",
  "Oreo",
  "Vainilla Chips",
  "Arroz Con Leche",
  "Yogurt De Cereza Italiana",
  "Chicle",
  "Snickers Almond",
];

const CHOCOLATE_CRACK = [
  { label: "Sin Crack", price: 0 },
  { label: "Con Crack", price: 4000 },
];

const EXTRAS = [
  { name: "Salsa Arequipe", price: 2900 },
  { name: "Salsa De Caramelo", price: 2900 },
  { name: "Salsa De Chocolate", price: 2900 },
  { name: "Salsa De Fresa", price: 2900 },
  { name: "Salsa De Frutas", price: 2900 },
  { name: "Salsa De Mora", price: 2900 },
  { name: "Salsa Cereza Italiana", price: 2900 },
  { name: "Crema Chantilly", price: 2900 },
  { name: "Gomas Ositos", price: 2900 },
  { name: "Cerezas", price: 2900 },
  { name: "M&M's", price: 2900 },
  { name: "Banano", price: 2900 },
  { name: "Fresas", price: 2900 },
  { name: "Durazno", price: 2900 },
  { name: "Mini Masmelos", price: 2900 },
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

function AccordionSection({ title, required, open, onToggle, children, badge }) {
  return (
    <div style={{ borderBottom: "1px solid #F0E4EA" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "14px 16px",
          background: "none", border: "none", cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1A0A10" }}>{title}</span>
          {required && (
            <span style={{ fontSize: 10, color: "#C41E6A", background: "#FFF0F5", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
              Obligatorio
            </span>
          )}
          {badge && <span style={{ fontSize: 10, color: "#C41E6A", fontWeight: 700 }}>{badge}</span>}
        </div>
        <span style={{ fontSize: 18, color: "#BBA8B0" }}>{open ? "∧" : "∨"}</span>
      </button>
      {open && <div style={{ paddingBottom: 8 }}>{children}</div>}
    </div>
  );
}

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
        {price > 0 && (
          <span style={{ fontSize: 11, color: "#C41E6A", marginLeft: 6, fontWeight: 700 }}>
            + {formatCOP(price)}
          </span>
        )}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        border: selected ? "6px solid #C41E6A" : "2px solid #DDD",
        background: "#fff", flexShrink: 0, transition: "all 0.15s",
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
        background: "none", border: "none", cursor: "pointer",
        textAlign: "left", borderBottom: "1px solid #F9F0F4",
      }}
    >
      <div>
        <span style={{ fontSize: 13, color: "#1A0A10" }}>{label}</span>
        {price > 0 && (
          <span style={{ fontSize: 11, color: "#C41E6A", marginLeft: 6, fontWeight: 700 }}>
            + {formatCOP(price)}
          </span>
        )}
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

function detectSabores(product) {
  if (!product) return null;
  const name = product.name.toLowerCase();
  if (name.includes("2 sabor") || name.includes("2sabor")) return 2;
  if (name.includes("1 sabor") || name.includes("1sabor")) return 1;
  return null;
}

export default function HeladoCustomizer({ product, open, onClose, onAdd }) {
  const [openSection, setOpenSection] = useState("cantidad");
  const [maxSabores, setMaxSabores] = useState(null);
  const [tab, setTab] = useState("gourmet");
  const [sabores, setSabores] = useState([]);
  const [crack, setCrack] = useState(null);
  const [extras, setExtras] = useState([]);

  const fixedTab = product?._subcat === "gourmet" ? "gourmet" : product?._subcat === "exclusivo" ? "exclusivo" : null;
  const effectiveTab = fixedTab || tab;
  const saboresList = effectiveTab === "gourmet" ? SABORES_GOURMET : SABORES_EXCLUSIVO;
  const SECTIONS = ["sabor", "crack", "extras"];

  const advanceToNext = (current) => {
    const idx = SECTIONS.indexOf(current);
    const next = SECTIONS[idx + 1];
    if (next) setTimeout(() => setOpenSection(next), 200);
  };

  const toggleSabor = (s) => {
    setSabores(prev => {
      if (prev.includes(s)) return prev.filter(x => x !== s);
      if (prev.length >= maxSabores) return prev;
      const next = [...prev, s];
      if (next.length === maxSabores) advanceToNext("sabor");
      return next;
    });
  };

  const toggleExtra = (name, price) => {
    setExtras(prev =>
      prev.find(e => e.name === name)
        ? prev.filter(e => e.name !== name)
        : [...prev, { name, price }]
    );
  };

  const crackPrice = CHOCOLATE_CRACK.find(c => c.label === crack)?.price || 0;
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const total = (product?.price || 0) + crackPrice + extrasTotal;
  const allRequired = maxSabores && sabores.length >= maxSabores && crack !== null;

  useEffect(() => {
    if (open) {
      const d = detectSabores(product);
      setMaxSabores(d || 1);
      setOpenSection("sabor");
      setSabores([]); setCrack(null); setExtras([]);
      if (!fixedTab) setTab("gourmet");
    }
  }, [open, product?.id]);

  const handleConfirm = () => {
    if (!allRequired) return;
    const notes = [
      `Sabor: ${sabores.join(", ")}`,
      `Crack: ${crack}`,
      extras.length > 0 ? `Extras: ${extras.map(e => e.name).join(", ")}` : null,
    ].filter(Boolean).join(" | ");

    onAdd({ ...product, price: total }, notes);
    toast.success("✓ Agregado al pedido", { duration: 1500, style: { background: "#E91B8B", color: "#fff", border: "none", borderRadius: 12 } });
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
        {/* Header */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #F0E4EA" }}>
          <p style={{ fontSize: 11, color: "#BBA8B0", margin: "0 0 4px", fontWeight: 600 }}>Personalizando</p>
          <SheetTitle style={{ fontSize: 18, fontWeight: 900, color: "#1A0A10", margin: 0 }}>
            {product?.name}
          </SheetTitle>
          <p style={{ fontSize: 13, color: "#C41E6A", fontWeight: 700, margin: "4px 0 0" }}>
            Desde {formatCOP(product?.price || 0)}
          </p>
        </div>

        {/* Sabor */}
        <AccordionSection
          title={maxSabores === 2 ? "Elige Los 2 Sabores" : "Elige El Sabor"}
          required
          open={openSection === "sabor"}
          onToggle={() => setOpenSection(s => s === "sabor" ? null : "sabor")}
          badge={maxSabores === 2 ? `${sabores.length}/${maxSabores}` : null}
        >
          {!fixedTab && (
            <div style={{ display: "flex", gap: 8, padding: "8px 16px 12px" }}>
              {[{ key: "gourmet", label: "Gourmet 🍦" }, { key: "exclusivo", label: "Exclusivo ✨" }].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
                    fontWeight: 700, fontSize: 12, fontFamily: "'Poppins', sans-serif",
                    background: effectiveTab === t.key ? "#C41E6A" : "#FFF0F5",
                    color: effectiveTab === t.key ? "#fff" : "#C41E6A",
                    transition: "all 0.2s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>
            Selecciona {maxSabores === 1 ? "1 opción" : `${maxSabores} opciones`}
          </p>
          {saboresList.map(s => (
            maxSabores === 1 ? (
              <RadioOption
                key={s} label={s} price={0}
                selected={sabores.includes(s)}
                onSelect={() => { setSabores([s]); advanceToNext("sabor"); }}
              />
            ) : (
              <CheckOption
                key={s} label={s} price={0}
                selected={sabores.includes(s)}
                onToggle={() => toggleSabor(s)}
              />
            )
          ))}
        </AccordionSection>

        {/* Crack */}
        <AccordionSection
          title="Cobertura De Chocolate Crack"
          required
          open={openSection === "crack"}
          onToggle={() => setOpenSection(s => s === "crack" ? null : "crack")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Selecciona 1 opción</p>
          {CHOCOLATE_CRACK.map(c => (
            <RadioOption
              key={c.label} label={c.label} price={c.price}
              selected={crack === c.label}
              onSelect={() => { setCrack(c.label); advanceToNext("crack"); }}
            />
          ))}
        </AccordionSection>

        {/* Extras */}
        <AccordionSection
          title="Elige Tus Extras"
          required={false}
          open={openSection === "extras"}
          onToggle={() => setOpenSection(s => s === "extras" ? null : "extras")}
        >
          <p style={{ fontSize: 11, color: "#BBA8B0", padding: "0 16px 6px" }}>Opcionales · con costo adicional</p>
          {EXTRAS.map(e => (
            <CheckOption
              key={e.name} label={`Adición ${e.name}`} price={e.price}
              selected={!!extras.find(x => x.name === e.name)}
              onToggle={() => toggleExtra(e.name, e.price)}
            />
          ))}
          <div style={{ padding: "12px 16px 4px" }}>
            <button
              onClick={() => setOpenSection(null)}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 14,
                background: "#C41E6A", color: "#fff", border: "none",
                fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                boxShadow: "0 4px 14px rgba(196,30,106,0.35)",
              }}
            >
              Sin extras, continuar ✓
            </button>
          </div>
        </AccordionSection>

        {/* Footer */}
        <div style={{ padding: "16px", position: "sticky", bottom: 0, background: "#FFFCFD", borderTop: "1px solid #F0E4EA" }}>
          {!allRequired && (
            <p style={{ fontSize: 11, color: "#BBA8B0", textAlign: "center", marginBottom: 8 }}>
              * Elige sabores y opción de crack para continuar
            </p>
          )}
          <button
            onClick={handleConfirm}
            disabled={!allRequired}
            style={{
              width: "100%", height: 56, borderRadius: 18,
              background: allRequired ? "#C41E6A" : "#EDD8E4",
              color: allRequired ? "#fff" : "#BBA8B0",
              fontSize: 15, fontWeight: 900, border: "none",
              cursor: allRequired ? "pointer" : "not-allowed",
              boxShadow: allRequired ? "0 4px 16px rgba(194,24,91,0.35)" : "none",
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