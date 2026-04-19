import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

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
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return stores.filter(store =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      (store.address && store.address.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, stores]);

  const handleSelect = (store) => {
    setSelected(store.id);
    setTimeout(() => onSelect(store), 300);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Busca tu tienda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-pink-500 focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Store Results - Solo muestra si hay búsqueda */}
      <AnimatePresence mode="wait">
        {search.length > 0 ? (
          filtered.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filtered.map((store, idx) => {
                const storeIdx = stores.indexOf(store);
                const colors = STORE_COLORS[storeIdx % 3];
                const icon = STORE_ICONS[storeIdx % 3];
                const isSelected = selected === store.id;

                return (
                  <motion.button
                    key={store.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
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
                      <div
                        className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
                        style={{ background: colors.icon + "15" }}
                      >
                        {icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm leading-tight">
                          {store.name}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {store.address || store.schedule || "Selecciona para continuar"}
                        </p>
                      </div>

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
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-slate-500 text-sm">No encontramos tiendas con "<strong>{search}</strong>"</p>
            </motion.div>
          )
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-slate-400 text-sm">Escribe el nombre de tu tienda para buscar...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enter Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
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