import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LoginRoles() {
  const [search, setSearch] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then(data => setStores(data))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = stores.filter(store =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectStore = (store) => {
    // Guardar la tienda seleccionada en contexto o sessionStorage
    sessionStorage.setItem("selectedStore", JSON.stringify(store));
    navigate("/menu");
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
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/ac52e6a2e_LOGO_POPSY_2-removebg-preview.png"
            alt="Popsy Logo"
            className="h-20 object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-semibold text-gray-700 mb-2">
            Selecciona tu tienda
          </h1>
          <p className="text-sm text-gray-500">
            Comienza a gestionar tus pedidos
          </p>
        </div>

        {/* Buscador de Tiendas */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Busca tu tienda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {/* Lista de Tiendas */}
        <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-4">Cargando tiendas...</p>
          ) : filtered.length > 0 ? (
            filtered.map((store) => (
              <motion.button
                key={store.id}
                onClick={() => handleSelectStore(store)}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 rounded-xl text-left transition-all"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E0E0E0",
                }}
              >
                <p className="font-semibold text-sm text-gray-800">
                  {store.name}
                </p>
                {store.address && (
                  <p className="text-xs text-gray-500 mt-1">
                    {store.address}
                  </p>
                )}
              </motion.button>
            ))
          ) : search.length > 0 ? (
            <p className="text-center text-gray-500 py-4">
              No encontramos tiendas
            </p>
          ) : (
            <p className="text-center text-gray-400 py-4 text-sm">
              Escribe el nombre de tu tienda
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}