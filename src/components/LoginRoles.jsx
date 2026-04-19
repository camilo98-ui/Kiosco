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
        background: "linear-gradient(135deg, #FFF0F8 0%, #FFFBFC 50%, #FFF5F8 100%)",
      }}
    >
      {/* Burbujas animadas de fondo - Verde pastel */}
      <motion.div
        animate={{
          x: [0, 80, -80, 0],
          y: [-100, 100, -100, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(144, 238, 144, 0.6), rgba(144, 238, 144, 0.2), rgba(144, 238, 144, 0.05), transparent)',
          filter: 'blur(60px)',
          boxShadow: '0 0 200px rgba(144, 238, 144, 0.4)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -80, 80, 0],
          y: [100, -100, 100, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(152, 251, 152, 0.5), rgba(152, 251, 152, 0.15), rgba(152, 251, 152, 0.03), transparent)',
          filter: 'blur(65px)',
          boxShadow: '0 0 210px rgba(152, 251, 152, 0.35)',
        }}
      />
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -80, 80, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-1/4 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(173, 255, 47, 0.4), rgba(173, 255, 47, 0.1), rgba(173, 255, 47, 0.02), transparent)',
          filter: 'blur(55px)',
          boxShadow: '0 0 180px rgba(173, 255, 47, 0.3)',
        }}
      />

      {/* Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[340px] p-6 rounded-3xl mx-auto"
        style={{
          background: "rgba(255, 245, 250, 0.8)",
          boxShadow: "0 8px 32px rgba(233, 30, 99, 0.08)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid rgba(200, 240, 200, 0.3)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/bfc0077cd_images__2_-removebg-preview.png"
            alt="Popsy"
            className="h-20 mb-4 mx-auto"
            style={{ filter: 'drop-shadow(0 0 0px rgba(233, 30, 99, 0))', mixBlendMode: 'multiply' }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <h2 className="text-xl font-bold mb-1" style={{ color: "#1A1A1A" }}>
            Bienvenido
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            ¿A cuál tienda Popsy vienes hoy?
          </p>
        </div>

        {/* Buscador de Tiendas */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="text"
              placeholder="Busca tu tienda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 border-gray-100 focus:border-pink-400 focus:outline-none transition-all text-sm bg-gray-50 focus:bg-white"
              style={{
                boxShadow: search ? "0 0 0 3px rgba(233, 30, 99, 0.1)" : "none",
              }}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400 text-sm py-4">Cargando tiendas...</p>
          ) : filtered.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
               {filtered.map((store, idx) => (
                 <motion.button
                   key={store.id}
                   onClick={() => setSelectedStore(store.id)}
                   whileTap={{ scale: 1.02 }}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="w-full p-2.5 rounded-2xl text-left transition-all"
                  style={{
                    background: selectedStore === store.id ? "rgba(233, 30, 99, 0.08)" : "#F9F9F9",
                    border: selectedStore === store.id ? "1.5px solid #E91E63" : "1.5px solid #F0F0F0",
                    boxShadow: selectedStore === store.id ? "0 0 0 3px rgba(233, 30, 99, 0.08)" : "none",
                  }}
                >
                  <p className="font-semibold text-xs" style={{ color: selectedStore === store.id ? "#E91E63" : "#1A1A1A" }}>
                    {store.name}
                  </p>
                  {store.address && (
                    <p className="text-xs text-gray-400 mt-0.5">{store.address}</p>
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
          className="w-full h-11 rounded-2xl font-bold text-sm transition-all mb-3"
          style={{
            background: selectedStore ? "linear-gradient(135deg, #E91E63, #F06292)" : "#E8E8E8",
            color: selectedStore ? "#FFFFFF" : "#999",
            cursor: selectedStore ? "pointer" : "not-allowed",
            boxShadow: selectedStore ? "0 6px 16px rgba(233, 30, 99, 0.3)" : "none",
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