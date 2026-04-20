import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COMBOS_DATA } from "@/lib/combosData";
import ComboCustomizer from "@/components/menu/ComboCustomizer";

const COMBOS = COMBOS_DATA;

// Combos que requieren personalización
function needsCustomizer(combo) {
  return combo.saborType === "malteada" || combo.saborType === "litro";
}

export default function CombosAllModal({ open, onClose, onAdd }) {
  const [selectedCombo, setSelectedCombo] = useState(null);

  const handleComboClick = (combo) => {
    if (needsCustomizer(combo)) {
      setSelectedCombo(combo);
    } else {
      const price = combo.displayPrice?.startsWith("$")
        ? parseInt(combo.displayPrice.replace(/[^\d]/g, ""))
        : combo.price || 0;
      onAdd({ ...combo, product_name: combo.title, product_id: `combo-${combo.id}`, price, name: combo.title });
      setTimeout(() => onClose(), 100);
    }
  };

  const handleCustomizerAdd = (item, notes) => {
    onAdd(item, notes);
    setSelectedCombo(null);
    setTimeout(() => onClose(), 150);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            onClick={onClose}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 600, maxHeight: "88vh", display: "flex", flexDirection: "column", padding: 0 }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F5EAEF", flexShrink: 0 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Todos los Combos</p>
                <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={18} color="#666" />
                </button>
              </div>

              {/* Grid */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                  {COMBOS.map((combo) => (
                    <button
                      key={combo.id}
                      onClick={() => handleComboClick(combo)}
                      style={{ border: "1px solid #F0E4EA", borderRadius: 16, background: "#fff", cursor: "pointer", padding: 0, overflow: "hidden", boxShadow: "0 2px 8px rgba(194,24,91,0.08)" }}
                    >
                      <div style={{ position: "relative", height: 120, overflow: "hidden", background: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={combo.image} alt={combo.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} loading="lazy" />
                        <span style={{ position: "absolute", top: 6, right: 6, background: "#C41E6A", color: "#fff", fontSize: 8, fontWeight: 800, borderRadius: 12, padding: "2px 6px", transform: "rotate(-2deg)" }}>
                          {combo.badge}
                        </span>
                        {needsCustomizer(combo) && (
                          <span style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 8, padding: "2px 6px" }}>
                            Personalizar ✏️
                          </span>
                        )}
                      </div>
                      <div style={{ padding: "8px 10px" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#2D1A22", margin: 0, lineHeight: 1.2 }}>{combo.title}</p>
                        {combo.displayPrice && (
                          <p style={{ fontSize: 10, fontWeight: combo.displayPrice.startsWith("$") ? 900 : 600, color: "#C41E6A", margin: "3px 0 0" }}>
                            {combo.displayPrice}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ComboCustomizer
        combo={selectedCombo}
        open={!!selectedCombo}
        onClose={() => setSelectedCombo(null)}
        onAdd={handleCustomizerAdd}
      />
    </>
  );
}