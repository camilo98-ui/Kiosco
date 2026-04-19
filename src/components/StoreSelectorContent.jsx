import React, { useState } from "react";
import { motion } from "framer-motion";

const STORE_ICONS = {
  0: "🏪",
  1: "🌟", 
  2: "💜"
};

const STORE_COLORS = {
  0: { bg: "#F0F4FF", border: "#C7D2FE", icon: "#4F46E5" },
  1: { bg: "#FFF7ED", border: "#FDBA74", icon: "#EA580C" },
  2: { bg: "#FCE7F3", border: "#F472B6", icon: "#EC4899" }
};

export default function StoreSelectorContent({ stores, onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (store) => {
    setSelected(store.id);
    setTimeout(() => onSelect(store), 300);
  };

  return (
    <div className="space-y-6">
      {/* Store Cards */}
      <div className="space-y-3">
        {stores.map((store, idx) => {
          const colors = STORE_COLORS[idx % 3];
          const icon = STORE_ICONS[idx % 3];
          const isSelected = selected === store.id;

          return (
            <motion.button
              key={store.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(store)}
              className="w-full text-left transition-all"
              style={{
                background: colors.bg,
                border: `2px solid ${isSelected ? colors.icon : colors.border}`,
                borderRadius: "16px",
                padding: "16px 18px",
                boxShadow: isSelected ? `0 0 0 3px ${colors.icon}20` : "none"
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ background: colors.icon + "15" }}
                >
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm leading-tight">
                    {store.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {store.address || store.schedule || "Selecciona para continuar"}
                  </p>
                </div>

                {/* Checkbox */}
                <div className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5"
                  style={{
                    borderColor: isSelected ? colors.icon : colors.border,
                    background: isSelected ? colors.icon : "white"
                  }}>
                  {isSelected && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Enter Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => selected && handleSelect(stores.find(s => s.id === selected))}
        disabled={!selected}
        className="w-full py-3 rounded-full font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: selected ? "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)" : "#E5E7EB"
        }}
      >
        Entrar →
      </motion.button>

      {/* Admin Link */}
      <p className="text-center text-xs text-slate-500">
        Acceso administrativo
      </p>
    </div>
  );
}