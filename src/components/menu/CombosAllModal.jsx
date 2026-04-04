import React, { useState, useEffect } from "react";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COMBOS = [
  { id: 1,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c2b4b2bf3_SegundaMalteada16Oz-30dedescuento.png",          title: "Segunda Malteada 16 Oz",              price: "30% de descuento",            badge: "Oferta" },
  { id: 2,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c6fd8dce_Malteada16OzCharlieBrownie37800.png",              title: "Malteada 16 Oz Charlie Brownie",      price: "$37.800",                     badge: "Top"   },
  { id: 3,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d7bb62cd8_Malteada16OzBananaSplit37800.png",                 title: "Malteada 16 Oz Banana Split",         price: "$37.800",                     badge: "Top"   },
  { id: 4,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/717fb959c_Malteada16OzBananaSplit.png",                      title: "Malteada 16 Oz Banana Split",         price: "",                            badge: "Nuevo" },
  { id: 5,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png",                title: "Combo Litro de helado Brownie",       price: "8 unidades",                  badge: "8 uds" },
  { id: 6,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9ac7460da_CompraunaTarrinaoLitroyllevasotraTarrinaconel30dedescuento.png", title: "Compra una Tarrina o Litro", price: "30% de descuento", badge: "Oferta" },
  { id: 7,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e54977063_TortaTarrinaOLitro.png",                           title: "Torta Tarrina O Litro",               price: "",                            badge: "Nuevo" },
  { id: 8,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c196fbb03_Combo2TarrinasCajadeCono.png",                     title: "Combo 2 Tarrinas",                    price: "Caja de Cono",                badge: "Combo" },
  { id: 9,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d8375425b_2LitrosdeHeladoCajaConoBrowniex8unidades.png",     title: "2 Litros Caja Cono Brownie",          price: "x8 unidades",                 badge: "8 uds" },
  { id: 10, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/74c450f21_ComboLitroCajaCono2Toppings.png",                  title: "Combo Litro Caja Cono",               price: "2 Toppings",                  badge: "Combo" },
  { id: 11, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/09347eafa_CompraunLitroyllevaunLitrooTarrinaconel30dto.png", title: "Compra un Litro",                     price: "30% dto en otro",             badge: "Oferta" },
  { id: 12, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/46a819092_Americano9ONZGalletaRedvelvet20800.png",           title: "Americano + Galleta Red Velvet",      price: "$20.800",                     badge: "Nuevo" },
  { id: 13, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0ffc145bd_Maletada16OzAgua25800.png",                       title: "Malteada 16 Oz + Agua",               price: "$25.800",                     badge: "Top"   },
];

export default function CombosAllModal({ open, onClose, onAdd }) {
  useEffect(() => {
    const handleOpen = () => open === false && onClose === undefined ? undefined : null;
    document.addEventListener("openCombosModal", onClose ? () => onClose() : () => {});
    return () => document.removeEventListener("openCombosModal", onClose ? () => onClose() : () => {});
  }, [onClose]);

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
                      onAdd(combo);
                      onClose();
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
                    <div style={{ position: "relative", height: 120, overflow: "hidden", background: "#FFF0F5" }}>
                      <img
                        src={combo.image}
                        alt={combo.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                      {combo.price && (
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: combo.price.startsWith("$") ? 900 : 600,
                            color: "#C41E6A",
                            margin: "3px 0 0",
                          }}
                        >
                          {combo.price}
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