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
        background: "linear-gradient(135deg, #FDE1E7 0%, #FFFFFF 100%)",
      }}
    >
      {/* Efecto blur suave de fondo */}
      <div className="absolute inset-0 backdrop-blur-3xl opacity-10" />

      {/* Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[380px] p-6 rounded-3xl"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/adafd980d_images2.png"
            alt="Popsy"
            className="h-24 mb-4 mx-auto"
          />
          <h1 className="text-xl font-semibold text-pink-300 mb-2">
            Iniciar sesión
          </h1>
          <p className="text-sm text-gray-500">
            Selecciona tu rol y comienza
          </p>
        </div>

        {/* Buscador de Tiendas */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Busca tu tienda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors text-sm"
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400 text-sm py-4">Cargando tiendas...</p>
          ) : filtered.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filtered.map((store) => (
                <motion.button
                  key={store.id}
                  onClick={() => setSelectedStore(store.id)}
                  whileTap={{ scale: 1.02 }}
                  className="w-full p-3 rounded-xl text-left transition-all"
                  style={{
                    background: selectedStore === store.id ? "#FCE4EC" : "#F5F5F5",
                    border: selectedStore === store.id ? "2px solid #E91E63" : "2px solid transparent",
                  }}
                >
                  <p className="font-semibold text-sm" style={{ color: selectedStore === store.id ? "#E91E63" : "#1A1A1A" }}>
                    {store.name}
                  </p>
                  {store.address && (
                    <p className="text-xs text-gray-500 mt-1">{store.address}</p>
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
          className="w-full h-12 rounded-xl font-bold text-sm transition-all mb-3"
          style={{
            background: selectedStore ? "#E91E63" : "#E8E8E8",
            color: selectedStore ? "#FFFFFF" : "#999",
            cursor: selectedStore ? "pointer" : "not-allowed",
          }}
        >
          Entrar →
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          ¿Eres administrador?
        </p>
      </motion.div>
    </div>
  );
}