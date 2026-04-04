import React, { useState, useEffect } from "react";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COMBOS_DATA } from "@/lib/combosData";

const COMBOS = COMBOS_DATA;

export default function CombosAllModal({ open, onClose, onAdd }) {

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              maxWidth: 600,
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F5EAEF", flexShrink: 0 }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Todos los Combos</p>
              <button
                onClick={onClose}
                style={{ background: "#F5F5F5", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} color="#666" />
              </button>
            </div>

            {/* Grid de combos */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {COMBOS.map((combo) => (
                  <button
                    key={combo.id}
                    onClick={() => {
                      const price = combo.displayPrice?.startsWith("$") 
                        ? parseInt(combo.displayPrice.replace(/[^\d]/g, "")) 
                        : 0;
                      onAdd({ ...combo, product_name: combo.title, product_id: combo.id, price, name: combo.title });
                      setTimeout(() => onClose(), 100);
                    }}
                    style={{
                      border: "1px solid #F0E4EA",
                      borderRadius: 16,
                      background: "#fff",
                      cursor: "pointer",
                      padding: 0,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(194,24,91,0.08)",
                    }}
                  >
                    <div style={{ position: "relative", height: 120, overflow: "hidden", background: "#FFF0F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={combo.image}
                        alt={combo.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          background: "#C41E6A",
                          color: "#fff",
                          fontSize: 8,
                          fontWeight: 800,
                          borderRadius: 12,
                          padding: "2px 6px",
                        }}
                      >
                        {combo.badge}
                      </span>
                    </div>
                    <div style={{ padding: "8px 10px" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#2D1A22", margin: 0, lineHeight: 1.2 }}>
                        {combo.title}
                      </p>
                      {combo.displayPrice && (
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: combo.displayPrice.startsWith("$") ? 900 : 600,
                            color: "#C41E6A",
                            margin: "3px 0 0",
                          }}
                        >
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
  );
}