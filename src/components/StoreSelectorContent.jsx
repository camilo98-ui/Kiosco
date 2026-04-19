import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const STORE_ICONS = {
  0: "🏬",
  1: "🏪", 
  2: "🏢"
};

const STORE_COLORS = {
  0: { bg: "#FFF5F8", border: "#E8187A", light: "#FFB6D9" },
  1: { bg: "#FFF5F8", border: "#E8187A", light: "#FFB6D9" },
  2: { bg: "#FFF5F8", border: "#E8187A", light: "#FFB6D9" }
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
    // No navega inmediatamente, solo selecciona
  };

  const selectedStore = selected ? stores.find(s => s.id === selected) : null;

  const handleEnter = () => {
    if (selectedStore) {
      onSelect(selectedStore);
    }
  };

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar sede..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-magenta focus:outline-none transition-colors text-sm font-medium"
        />
      </div>

      {/* Cards de sede */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
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
                    background: isSelected ? colors.light : "#FFF5F8",
                    border: `2px solid ${isSelected ? colors.border : "#F0E4EA"}`,
                    borderRadius: "16px",
                    padding: "14px 16px",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Ícono */}
                    <div className="text-2xl flex-shrink-0 mt-0.5">
                      {icon}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm">
                        {store.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {store.address || store.schedule || "Información de la sede"}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        ) : search && filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <p className="text-slate-500 text-sm">No encontramos sedes con "<strong>{search}</strong>"</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Botón Entrar */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleEnter}
        disabled={!selected}
        className="w-full py-3 rounded-2xl font-bold text-white transition-all text-sm"
        style={{
          background: selected ? "#E8187A" : "#E5E7EB",
          cursor: selected ? "pointer" : "not-allowed",
          opacity: selected ? 1 : 0.6
        }}
      >
        {selectedStore ? `Entrar a ${selectedStore.name} ✨` : "Entrar →"}
      </motion.button>

      {/* Link "¿Necesitas ayuda?" */}
      <p className="text-center text-xs text-slate-500 font-medium">
        ¿Necesitas ayuda?
      </p>
    </div>
  );
}