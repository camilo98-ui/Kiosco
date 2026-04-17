import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check } from "lucide-react";
import { formatCOP } from "@/lib/constants";

const MAGENTA = "#C41E6A";
const BROWN = "#5D3A1A";

// Sabores de helado disponibles
const SABORES = [
  "Vainilla", "Chocolate", "Fresa", "Arequipe", "Maracuyá",
  "Menta con Chocolate", "Cookies & Cream", "Mora", "Coco",
];

// Galletas Medianas - $8.900
const GALLETAS_MEDIANAS = [
  { id: "m1", name: "Galleta Mediana Chocolatísima", price: 8900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/5aec41740_GalletaMedianaChocolatsima.png" },
  { id: "m2", name: "Galleta Mediana M&M", price: 8900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/8cef119eb_GalletaMedianaMM.png" },
  { id: "m3", name: "Galleta Mediana Caramelo", price: 8900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/b712cbac2_GalletaMedianaCaramelo.png" },
  { id: "m4", name: "Galleta Mediana Macadamia", price: 8900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/806e5ba00_GalletaMedianaMacadamia.png" },
  { id: "m5", name: "Galleta Mediana Trozos de Chocolate", price: 8900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/82adf0302_GalletaMedianaTrozosdeChocolate.png" },
];

// Galletas Suprema - $12.900
const GALLETAS_SUPREMAS = [
  { id: "s1", name: "Galleta Suprema Choco Masmelo", price: 12900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7bc9ea69e_GalletaSupremaChocoMasmelo.png" },
  { id: "s2", name: "Galleta Suprema Red Velvet", price: 12900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/76aed4245_GalletaSupremaRedVelvet.jpeg" },
  { id: "s3", name: "Galleta Suprema Triple Chocolate", price: 12900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/70280fadc_GalletaSupremaTripleChocolate.png" },
  { id: "s4", name: "Galleta Suprema Cookies & Cream", price: 12900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/958ab0627_Galletasupremacookiesandcream.png" },
  { id: "s5", name: "Galleta Rellena Mantequilla de Maní", price: 12900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/be16d92e4_GalletaRellenaMantequilladeMan.png" },
];

// Otras opciones Cookie Jaar
const OTRAS = [
  { id: "o1", name: "Malteada Pistacho Cookie Jaar 12oz", price: 15900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/bb3f16e5c_MalteadaPistacho12Oz.png" },
  { id: "o2", name: "Malteada Mantequilla de Maní Cookie Jaar", price: 15900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/227a72baa_Malteadarellenamantequillademan.png" },
  { id: "o3", name: "Galleta Rellena con Helado", price: 14900, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d2812fcc6_GalletaRellenaHelado.png" },
];

const PRECIO_HELADO = 3500;

// ── Cookie Customizer Sheet ────────────────────────────────────────────────
function CookieCustomizer({ cookie, open, onClose, onAdd }) {
  const [withHelado, setWithHelado] = useState(false);
  const [sabor, setSabor] = useState(null);
  const [step, setStep] = useState("main"); // "main" | "sabores"

  if (!open || !cookie) return null;

  const total = cookie.price + (withHelado ? PRECIO_HELADO : 0);

  const handleConfirm = () => {
    if (withHelado && !sabor) {
      setStep("sabores");
      return;
    }
    const notes = withHelado && sabor ? `Con bola de helado: ${sabor}` : "";
    onAdd({
      product_id: cookie.id,
      product_name: cookie.name + (withHelado ? ` + Helado ${sabor}` : ""),
      price: total,
      quantity: 1,
      notes,
    }, notes);
    onClose();
    setWithHelado(false);
    setSabor(null);
    setStep("main");
  };

  return (
    <AnimatePresence>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: "28px 28px 0 0",
            padding: "0 0 40px",
            maxHeight: "92vh",
            overflowY: "auto",
          }}
        >
          {/* Handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#E0D0D8" }} />
          </div>

          {/* Cookie image + name */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px 12px" }}>
            <div style={{ width: 140, height: 140, borderRadius: 20, overflow: "hidden", marginBottom: 12, border: "1.5px solid #FFE4F3" }}>
              <img src={cookie.image} alt={cookie.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1A0A10", textAlign: "center", margin: "0 0 4px", lineHeight: 1.3 }}>
              {cookie.name}
            </h3>
            <p style={{ fontSize: 13, color: MAGENTA, fontWeight: 700, margin: 0 }}>{formatCOP(cookie.price)}</p>
          </div>

          {step === "main" && (
            <div style={{ padding: "0 20px" }}>
              {/* ¿Con helado? */}
              <div style={{ background: "#FFFAF9", borderRadius: 20, padding: 16, marginBottom: 20, border: "1.5px solid #FFE4F3" }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#1A0A10", margin: "0 0 12px" }}>
                  🍦 ¿La quieres con una bola de helado?
                </p>
                <p style={{ fontSize: 12, color: "#888", margin: "0 0 14px" }}>
                  Agrega una bola de helado por solo {formatCOP(PRECIO_HELADO)} más
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setWithHelado(true)}
                    style={{
                      flex: 1, padding: "12px 0", borderRadius: 14,
                      border: withHelado ? "none" : "1.5px solid #E0D0D8",
                      background: withHelado ? MAGENTA : "#fff",
                      color: withHelado ? "#fff" : "#555",
                      fontWeight: 700, fontSize: 14, cursor: "pointer",
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: withHelado ? "0 4px 14px rgba(196,30,106,0.3)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {withHelado ? "✓ Sí, con helado" : "Sí, con helado 🍦"}
                  </button>
                  <button
                    onClick={() => { setWithHelado(false); setSabor(null); }}
                    style={{
                      flex: 1, padding: "12px 0", borderRadius: 14,
                      border: !withHelado ? "none" : "1.5px solid #E0D0D8",
                      background: !withHelado ? MAGENTA : "#fff",
                      color: !withHelado ? "#fff" : "#555",
                      fontWeight: 700, fontSize: 14, cursor: "pointer",
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: !withHelado ? "0 4px 14px rgba(196,30,106,0.3)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {!withHelado ? "✓ Solo galleta" : "Solo galleta"}
                  </button>
                </div>

                {/* Sabor seleccionado */}
                {withHelado && sabor && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "#FFF0F5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1A0A10" }}>🍦 {sabor}</span>
                    <button onClick={() => setStep("sabores")} style={{ fontSize: 11, color: MAGENTA, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Cambiar</button>
                  </div>
                )}

                {withHelado && !sabor && (
                  <button
                    onClick={() => setStep("sabores")}
                    style={{
                      width: "100%", marginTop: 12, padding: "11px 0", borderRadius: 12,
                      border: "1.5px dashed #FFB0D0", background: "#FFF5F9",
                      color: MAGENTA, fontWeight: 700, fontSize: 13,
                      cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Elegir sabor →
                  </button>
                )}
              </div>

              {/* Total y confirmar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Total</p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: MAGENTA, margin: 0 }}>{formatCOP(total)}</p>
                </div>
                <button
                  onClick={handleConfirm}
                  style={{
                    height: 52, paddingLeft: 28, paddingRight: 28, borderRadius: 16,
                    background: MAGENTA, color: "#fff", fontSize: 15, fontWeight: 800,
                    border: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    boxShadow: "0 4px 16px rgba(196,30,106,0.35)",
                  }}
                >
                  Agregar al pedido
                </button>
              </div>
            </div>
          )}

          {step === "sabores" && (
            <div style={{ padding: "0 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <button onClick={() => setStep("main")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#888", padding: 0, lineHeight: 1 }}>←</button>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#1A0A10", margin: 0 }}>Elige tu sabor de helado</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SABORES.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSabor(s); setStep("main"); }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", borderRadius: 14,
                      border: sabor === s ? `1.5px solid ${MAGENTA}` : "1.5px solid #F0E6EE",
                      background: sabor === s ? "#FFF0F5" : "#fff",
                      cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1A0A10" }}>🍦 {s}</span>
                    {sabor === s && <Check size={16} color={MAGENTA} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ── Cookie Card ────────────────────────────────────────────────────────────
function CookieCard({ cookie, onSelect }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(cookie)}
      style={{
        background: "#fff",
        border: "1px solid #F0E6EE",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 10px rgba(196,30,106,0.07)",
        WebkitTapHighlightColor: "transparent",
        textAlign: "left",
      }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", background: "#FFF9F5" }}>
        <img src={cookie.image} alt={cookie.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: "#1A0A10", margin: "0 0 6px", lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {cookie.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: MAGENTA, margin: 0 }}>{formatCOP(cookie.price)}</p>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: MAGENTA,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 10px rgba(196,30,106,0.35)",
          }}>
            <Plus size={14} color="#fff" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ── Otra Card (malteadas y galleta rellena) ────────────────────────────────
function OtraCard({ item, onAdd }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onAdd({ product_id: item.id, product_name: item.name, price: item.price, quantity: 1, notes: "" }, "")}
      style={{
        background: "#fff",
        border: "1px solid #F0E6EE",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: 0,
        boxShadow: "0 2px 8px rgba(196,30,106,0.06)",
        WebkitTapHighlightColor: "transparent",
        textAlign: "left",
        height: 88,
      }}
    >
      <div style={{ width: 88, height: 88, flexShrink: 0, overflow: "hidden", background: "#FFF9F5" }}>
        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1, padding: "0 12px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#1A0A10", margin: "0 0 4px", lineHeight: 1.3 }}>{item.name}</p>
        <p style={{ fontSize: 13, fontWeight: 900, color: MAGENTA, margin: 0 }}>{formatCOP(item.price)}</p>
      </div>
      <div style={{ padding: "0 14px 0 0" }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%", background: MAGENTA,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Plus size={15} color="#fff" />
        </div>
      </div>
    </motion.button>
  );
}

// ── Main Layout ────────────────────────────────────────────────────────────
export default function CookieJaarLayout({ onAdd }) {
  const [tab, setTab] = useState("medianas");
  const [selectedCookie, setSelectedCookie] = useState(null);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const handleSelect = (cookie) => {
    setSelectedCookie(cookie);
    setCustomizerOpen(true);
  };

  const cookies = tab === "medianas" ? GALLETAS_MEDIANAS : GALLETAS_SUPREMAS;

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Header Cookie Jaar */}
      <div style={{ padding: "16px 14px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF5EC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍪</div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, color: BROWN, margin: 0, letterSpacing: "-0.3px" }}>Cookie Jaar</p>
            <p style={{ fontSize: 11, color: "#AAA", margin: 0 }}>Galletas artesanales · con o sin helado</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, padding: "0 14px", marginBottom: 16 }}>
        {[{ key: "medianas", label: "Medianas · $8.900" }, { key: "supremas", label: "Supremas · $12.900" }].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 14, border: "none", cursor: "pointer",
              fontWeight: 800, fontSize: 12, fontFamily: "'Poppins', sans-serif",
              background: tab === t.key ? BROWN : "#FFF5EC",
              color: tab === t.key ? "#fff" : BROWN,
              boxShadow: tab === t.key ? "0 4px 14px rgba(93,58,26,0.25)" : "none",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid de galletas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.18 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 14px", marginBottom: 20 }}>
            {cookies.map(c => (
              <CookieCard key={c.id} cookie={c} onSelect={handleSelect} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Otras opciones */}
      <div style={{ padding: "0 14px" }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "#BBA8B0", textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 12px" }}>
          También te puede gustar
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {OTRAS.map(item => (
            <OtraCard key={item.id} item={item} onAdd={onAdd} />
          ))}
        </div>
      </div>

      {/* Customizer */}
      <CookieCustomizer
        cookie={selectedCookie}
        open={customizerOpen}
        onClose={() => { setCustomizerOpen(false); setSelectedCookie(null); }}
        onAdd={onAdd}
      />
    </div>
  );
}