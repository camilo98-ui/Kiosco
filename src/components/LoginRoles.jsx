import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LoginRoles() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then(data => setStores(data))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return stores.filter(store =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      (store.address && store.address.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, stores]);

  const handleEnter = () => {
    if (selectedStore) {
      navigate(`/menu`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF5F7 0%, #FFFFFF 50%, #F5F0FF 100%)",
      }}
    >
      {/* Burbujas animadas de fondo */}
      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(233, 30, 99, 0.35), rgba(233, 30, 99, 0.08), transparent)',
          filter: 'blur(40px)',
          boxShadow: '0 0 80px rgba(233, 30, 99, 0.25)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.05), transparent)',
          filter: 'blur(50px)',
          boxShadow: '0 0 100px rgba(168, 85, 247, 0.2)',
        }}
      />

      {/* Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[420px] p-8 rounded-3xl"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          boxShadow: "0 0 60px rgba(244, 194, 219, 1), 0 0 100px rgba(233, 30, 99, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(50px) saturate(180%)",
          border: "2.5px solid rgba(244, 194, 219, 1)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/adafd980d_images2.png"
            alt="Popsy"
            className="h-32 mb-6 mx-auto"
            style={{ filter: 'drop-shadow(0 0 0px rgba(233, 30, 99, 0))', mixBlendMode: 'multiply' }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1A1A1A" }}>
            Bienvenido
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            ¿A cuál tienda Popsy vienes hoy?
          </p>
        </div>

        {/* Buscador de Tiendas */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="text"
              placeholder="Busca tu tienda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-400 focus:outline-none transition-all text-sm bg-gray-50 focus:bg-white"
              style={{
                boxShadow: search ? "0 0 0 3px rgba(233, 30, 99, 0.1)" : "none",
              }}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400 text-sm py-4">Cargando tiendas...</p>
          ) : filtered.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {filtered.map((store, idx) => (
                <motion.button
                  key={store.id}
                  onClick={() => setSelectedStore(store.id)}
                  whileTap={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="w-full p-3 rounded-2xl text-left transition-all"
                  style={{
                    background: selectedStore === store.id ? "rgba(233, 30, 99, 0.08)" : "#F9F9F9",
                    border: selectedStore === store.id ? "1.5px solid #E91E63" : "1.5px solid #F0F0F0",
                    boxShadow: selectedStore === store.id ? "0 0 0 3px rgba(233, 30, 99, 0.08)" : "none",
                  }}
                >
                  <p className="font-semibold text-sm" style={{ color: selectedStore === store.id ? "#E91E63" : "#1A1A1A" }}>
                    {store.name}
                  </p>
                  {store.address && (
                    <p className="text-xs text-gray-400 mt-1">{store.address}</p>
                  )}
                </motion.button>
              ))}
            </div>
          ) : search.length > 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">No encontramos tiendas</p>
          ) : null}
        </div>

        {/* Botón Entrar */}
        <motion.button
          onClick={handleEnter}
          disabled={!selectedStore}
          whileTap={selectedStore ? { scale: 0.98 } : {}}
          className="w-full h-12 rounded-2xl font-bold text-sm transition-all mb-4"
          style={{
            background: selectedStore ? "linear-gradient(135deg, #E91E63, #F06292)" : "#E8E8E8",
            color: selectedStore ? "#FFFFFF" : "#999",
            cursor: selectedStore ? "pointer" : "not-allowed",
            boxShadow: selectedStore ? "0 8px 20px rgba(233, 30, 99, 0.3)" : "none",
          }}
        >
          Ir a Popsy 🍦
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          Elige tu ubicación favorita
        </p>
      </motion.div>
    </div>
  );
}