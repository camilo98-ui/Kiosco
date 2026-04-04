import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCOP } from "@/lib/constants";

export default function EspecialidadesCustomizer({ product, open, onClose, onAdd }) {
  const [selectedFlavors, setSelectedFlavors] = useState([]);

  const { data: heladoProducts = [] } = useQuery({
    queryKey: ["helado-flavors"],
    queryFn: () => base44.entities.Product.filter({ category: "helados" }, "-sort_order", 100),
    enabled: open,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const availableFlavors = useMemo(
    () => heladoProducts.filter(p => p.is_available !== false),
    [heladoProducts]
  );

  // Determinar número de bolas según la imagen/descripción del producto
  const numBalls = useMemo(() => {
    if (!product) return 1;
    const name = product.name.toLowerCase();
    if (name.includes("4 bola") || name.includes("4bola")) return 4;
    if (name.includes("3 bola") || name.includes("3bola")) return 3;
    if (name.includes("2 bola") || name.includes("2bola")) return 2;
    return 1;
  }, [product]);

  const handleFlavorSelect = (flavor) => {
    setSelectedFlavors(prev => {
      const isSelected = prev.find(f => f.id === flavor.id);
      if (isSelected) {
        return prev.filter(f => f.id !== flavor.id);
      } else if (prev.length < numBalls) {
        return [...prev, flavor];
      }
      return prev;
    });
  };

  const handleAdd = () => {
    if (selectedFlavors.length !== numBalls) return;
    
    const flavorNames = selectedFlavors.map(f => f.name).join(", ");
    const notes = `${numBalls} bolas: ${flavorNames}`;
    
    onAdd({ ...product, notes }, notes);
    setSelectedFlavors([]);
    onClose();
  };

  if (!open || !product) return null;

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #F5EAEF",
                flexShrink: 0,
              }}
            >
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>
                  {product.name}
                </p>
                <p style={{ fontSize: 12, color: "#C41E6A", fontWeight: 700, margin: "4px 0 0" }}>
                  Selecciona {numBalls} sabor{numBalls > 1 ? "es" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "#F5F5F5",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <X size={18} color="#666" />
              </button>
            </div>

            {/* Flavors Grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                }}
              >
                {availableFlavors.map(flavor => {
                  const isSelected = selectedFlavors.find(f => f.id === flavor.id);
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => handleFlavorSelect(flavor)}
                      style={{
                        background: isSelected ? "#C41E6A" : "#fff",
                        border: `1.5px solid ${isSelected ? "#C41E6A" : "#F0E4EA"}`,
                        borderRadius: 16,
                        padding: "12px",
                        cursor: "pointer",
                        textAlign: "left",
                        position: "relative",
                        transition: "all 0.2s ease",
                        boxShadow: isSelected ? "0 4px 12px rgba(196,30,106,0.3)" : "none",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isSelected ? "#fff" : "#1A1A1A",
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {flavor.name}
                      </p>
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 20,
                            height: 20,
                            background: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={14} color="#C41E6A" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 20px 32px", borderTop: "1px solid #F0F0F0", flexShrink: 0 }}>
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 12, color: "#999", margin: "0 0 8px" }}>
                  Seleccionados: {selectedFlavors.length}/{numBalls}
                </p>
                {selectedFlavors.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedFlavors.map(f => (
                      <span
                        key={f.id}
                        style={{
                          background: "#FFF0F5",
                          color: "#C41E6A",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 12,
                        }}
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleAdd}
                disabled={selectedFlavors.length !== numBalls}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 16,
                  background:
                    selectedFlavors.length === numBalls ? "#C41E6A" : "#F0C0DC",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 700,
                  border: "none",
                  cursor:
                    selectedFlavors.length === numBalls ? "pointer" : "not-allowed",
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow:
                    selectedFlavors.length === numBalls
                      ? "0 4px 16px rgba(196,30,106,0.35)"
                      : "none",
                }}
              >
                Agregar a carrito · {formatCOP(product.price)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}