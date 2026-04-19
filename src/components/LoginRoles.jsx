import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useStore } from "@/lib/storeContext";

export default function LoginRoles() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { selectStore } = useStore();

  useEffect(() => {
    const savedStore = localStorage.getItem('popsy_selected_store');
    base44.entities.Store.filter({ is_active: true }).
    then((data) => {
      setStores(data);
      if (savedStore) {
        setSelectedStore(savedStore);
        setTimeout(() => navigate('/menu'), 300);
      }
    }).
    catch(() => setStores([])).
    finally(() => setLoading(false));
  }, [navigate]);

  const filtered = useMemo(() => {
    return stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address && store.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, stores]);

  const handleEnter = () => {
    if (selectedStore) {
      const store = stores.find((s) => s.id === selectedStore);
      if (store) {
        localStorage.setItem('popsy_selected_store', selectedStore);
        selectStore(store);
        navigate(`/menu`);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF0F8 0%, #FFFBFC 50%, #FFF5F8 100%)"
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
        className="absolute -top-32 -right-32 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(233, 30, 99, 0.7), rgba(233, 30, 99, 0.3), rgba(233, 30, 99, 0.1), transparent)',
          filter: 'blur(50px)',
          boxShadow: '0 0 120px rgba(233, 30, 99, 0.5)'
        }} />
      
      

      {/* Burbuja rosa suave - arriba izquierda */}
      <motion.div
        animate={{
          x: [0, -40, 40, 0],
          y: [-60, 60, -60, 0],
          scale: [1, 1.12, 0.92, 1]
        }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-0 -left-28 w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(255, 179, 210, 0.6), rgba(255, 179, 210, 0.2), transparent)',
          filter: 'blur(46px)',
          boxShadow: '0 0 105px rgba(255, 179, 210, 0.4)'
        }} />
      
      
      {/* Burbuja magenta suave - centro derecha */}
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [40, -40, 40, 0],
          scale: [1, 1.08, 0.98, 1]
        }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-1/4 right-1/4 w-[220px] h-[220px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(233, 100, 150, 0.5), rgba(233, 100, 150, 0.15), transparent)',
          filter: 'blur(42px)',
          boxShadow: '0 0 90px rgba(233, 100, 150, 0.3)'
        }} />
      
      


      {/* Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[340px] p-6 rounded-3xl mx-auto"
        style={{
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          boxShadow: "0 8px 32px rgba(232, 24, 122, 0.1)",
          minHeight: "520px"
        }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <motion.img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/bfc0077cd_images__2_-removebg-preview.png"
            alt="Popsy"
            className="h-20 mb-4 mx-auto"
            style={{ filter: 'drop-shadow(0 0 0px rgba(233, 30, 99, 0))', mixBlendMode: 'multiply' }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          
          <h2 className="text-[hsl(var(--muted-foreground))] mb-1 text-xl font-bold" style={{ color: "#888" }}>
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
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 focus:border-pink-400 focus:outline-none transition-all text-sm"
              style={{
                background: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(255, 255, 255, 0.4)",
                boxShadow: search ? "0 0 0 3px rgba(233, 30, 99, 0.15)" : "none",
                color: "#1A1A1A"
              }} />
            
          </div>

          {loading ?
          <p className="text-center text-gray-400 text-sm py-4">Cargando tiendas...</p> :
          filtered.length > 0 ?
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 mb-3">
               {filtered.map((store, idx) =>
            <motion.button
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              whileTap={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="w-full text-left transition-all"
              style={{
                background: selectedStore === store.id ? "rgba(233, 30, 99, 0.2)" : "rgba(255, 255, 255, 0.7)",
                border: selectedStore === store.id ? "1.5px solid rgba(233, 30, 99, 0.6)" : "1px solid rgba(240, 210, 225, 0.6)",
                borderRadius: "14px",
                padding: "12px 14px",
                boxShadow: selectedStore === store.id ? "inset 0 0 0 1px rgba(233, 30, 99, 0.3)" : "none"
              }}>
              
                  <p className="font-bold text-xs" style={{ color: selectedStore === store.id ? "#E91E63" : "#1A1A1A" }}>
                    {store.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{store.address || store.name}</p>
                </motion.button>
            )}
            </div> :
          search.length > 0 ?
          <p className="text-center text-gray-400 text-sm py-4">No encontramos tiendas</p> :
          null}
        </div>

        {/* Botón Entrar */}
        <motion.button
          onClick={handleEnter}
          disabled={!selectedStore}
          whileTap={selectedStore ? { scale: 0.98 } : {}}
          className="w-full h-11 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: selectedStore ? "linear-gradient(135deg, #E91E63, #F06292)" : "#E8E8E8",
            color: selectedStore ? "#FFFFFF" : "#999",
            cursor: selectedStore ? "pointer" : "not-allowed",
            boxShadow: selectedStore ? "0 6px 16px rgba(233, 30, 99, 0.3)" : "none",
            marginTop: "16px"
          }}>
          
          Ir a Popsy 🍦
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          Elige tu ubicación favorita
        </p>
      </motion.div>
    </div>);

}