import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useStore } from "@/lib/storeContext";

export default function StoreSelector() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { selectStore } = useStore();

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then((data) => {
        setStores(data);
      })
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return stores.filter((store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      (store.address && store.address.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, stores]);

  const handleEnter = () => {
    if (selectedStore) {
      const store = stores.find((s) => s.id === selectedStore);
      if (store) {
        selectStore(store);
        navigate("/menu");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "#FFFFFF"
      }}>
      
      {/* Burbujas animadas de fondo - Magenta y Verde pastel */}
      {/* Burbuja grande magenta arriba derecha */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [-80, 80, -80, 0],
          scale: [1, 1.15, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-[475px] h-[475px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(249, 168, 201, 0.85), rgba(249, 168, 201, 0.5), rgba(249, 168, 201, 0.1), transparent)',
          filter: 'blur(32px)',
          boxShadow: '0 0 120px rgba(249, 168, 201, 0.85)'
        }} />
      
      {/* Burbuja grande rosa abajo izquierda */}
      <motion.div
        animate={{
          x: [0, -50, 50, 0],
          y: [80, -80, 80, 0],
          scale: [1, 0.95, 1.15, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-32 -left-32 w-[518px] h-[518px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(249, 168, 201, 0.85), rgba(249, 168, 201, 0.45), rgba(249, 168, 201, 0.05), transparent)',
          filter: 'blur(30px)',
          boxShadow: '0 0 110px rgba(249, 168, 201, 0.75)'
        }} />
      


      {/* Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[360px] rounded-3xl mx-auto overflow-visible"
        style={{
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          boxShadow: "0 8px 32px rgba(232, 24, 122, 0.1)",
          padding: "28px 24px 20px"
        }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <motion.img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/bfc0077cd_images__2_-removebg-preview.png"
            alt="Popsy"
            className="h-20 mb-4 mx-auto"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          
          <h2 className="text-xl font-bold mb-1" style={{ color: "#888" }}>
            Bienvenido
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            ¿A cuál tienda Popsy vienes hoy?
          </p>
        </div>

        {/* Buscador */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Busca tu tienda..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm focus:outline-none transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(240, 210, 225, 0.6)",
              color: "#1A1A1A",
              boxShadow: search ? "0 0 0 3px rgba(233, 30, 99, 0.15)" : "none"
            }} />
        </div>

        {/* Lista de Sedes */}
        {loading ?
          <p className="text-center text-gray-400 text-sm py-8">Cargando tiendas...</p> :
          filtered.length > 0 ?
          <div className="space-y-2 pr-2 mb-5" style={{ maxHeight: "260px", overflowY: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", paddingBottom: "16px" }}>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {filtered.map((store, idx) => (
              <motion.button
                key={store.id}
                onClick={() => setSelectedStore(store.id)}
                whileTap={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="w-full flex items-start gap-3 transition-all text-left"
                style={{
                  background: selectedStore === store.id ? "#E8187A" : "rgba(255, 255, 255, 0.45)",
                  border: selectedStore === store.id ? "1.5px solid #E8187A" : "1px solid rgba(240, 210, 225, 0.6)",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  boxShadow: selectedStore === store.id ? "0 4px 16px rgba(232, 24, 122, 0.3)" : "none"
                }}>
                <MapPin
                  size={16}
                  style={{
                    color: selectedStore === store.id ? "#fff" : "#E8187A",
                    marginTop: "2px",
                    flexShrink: 0
                  }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs leading-tight" style={{ color: selectedStore === store.id ? "#fff" : "#1A1A1A" }}>
                    {store.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: selectedStore === store.id ? "rgba(255,255,255,0.8)" : "#999" }}>
                    {store.address || store.name}
                  </p>
                </div>
              </motion.button>
            ))}
          </div> :
          search.length > 0 ?
          <p className="text-center text-gray-400 text-sm py-8">No encontramos tiendas</p> :
          null}

        {/* Botón Entrar */}
        <motion.button
          onClick={handleEnter}
          disabled={!selectedStore}
          whileTap={selectedStore ? { scale: 0.98 } : {}}
          className="w-full h-11 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: selectedStore ? "linear-gradient(135deg, #E91E63, #F06292)" : "rgba(232, 24, 122, 0.3)",
            color: "#FFFFFF",
            opacity: selectedStore ? 1 : 0.6,
            cursor: selectedStore ? "pointer" : "not-allowed",
            boxShadow: selectedStore ? "0 6px 16px rgba(233, 30, 99, 0.3)" : "none",
            marginTop: "20px"
          }}>
          {selectedStore ? `Ir a ${stores.find(s => s.id === selectedStore)?.name} 🍦` : "Ir a Popsy 🍦"}
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Elige tu ubicación favorita
        </p>
      </motion.div>
    </div>
  );
}