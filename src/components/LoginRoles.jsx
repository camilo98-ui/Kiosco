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
        background: "linear-gradient(135deg, #FFD6E8 0%, #FFC0D9 25%, #FFE4F1 50%, #FFD6E8 75%, #FFB3D9 100%)",
        backgroundSize: "200% 200%"
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
        className="relative z-10 w-full max-w-[340px] rounded-3xl mx-auto"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.85)",
          boxShadow: "0 8px 28px rgba(232, 24, 122, 0.15), inset 0 0 1px rgba(255, 255, 255, 0.6)",
          padding: "28px"
        }}>
        
        {/* Header */}
        <div className="text-center mb-7">
          <motion.img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/bfc0077cd_images__2_-removebg-preview.png"
            alt="Popsy"
            className="h-20 mb-5 mx-auto"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(233, 30, 99, 0.08))', mixBlendMode: 'multiply' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
          
          <h2 className="text-center font-900" style={{ fontSize: "22px", color: "#1A0A10", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Bienvenido
          </h2>
          <p className="text-xs" style={{ color: "#8A7880", margin: 0, fontWeight: 500, letterSpacing: "0.3px" }}>
            ¿Dónde estás hoy?
          </p>
        </div>

        {/* Buscador de Tiendas */}
         <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#D81B60", opacity: 0.7 }} />
            <input
              type="text"
              placeholder="Busca tu tienda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border transition-all text-sm font-400"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: search ? "1.5px solid #D81B60" : "1px solid rgba(196, 30, 106, 0.15)",
                boxShadow: search ? "0 3px 8px rgba(196, 30, 106, 0.12), inset 0 1px 2px rgba(196, 30, 106, 0.06)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                color: "#1A0A10",
                fontSize: "14px"
              }} />

          </div>

          {loading ?
          <p className="text-center text-sm py-4" style={{ color: "#BBA8B0" }}>Cargando tiendas...</p> :
          filtered.length > 0 ?
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1 mb-4">
               {filtered.map((store, idx) =>
            <motion.button
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="w-full text-left transition-all duration-150"
              style={{
                background: selectedStore === store.id ? "linear-gradient(135deg, rgba(216, 27, 96, 0.08) 0%, rgba(232, 30, 99, 0.05) 100%)" : "#FFFFFF",
                border: selectedStore === store.id ? "1.2px solid #D81B60" : "1px solid rgba(196, 30, 106, 0.1)",
                borderRadius: "12px",
                padding: "13px 14px",
                boxShadow: selectedStore === store.id ? "0 2px 6px rgba(216, 27, 96, 0.08), inset 0 1px 2px rgba(216, 27, 96, 0.04)" : "0 1px 2px rgba(0, 0, 0, 0.02)"
              }}>
              <div className="flex items-start gap-2.5">
                {selectedStore === store.id && <span style={{ color: "#D81B60", marginTop: "1px", fontSize: "13px" }}>📍</span>}
                <div className="flex-1 min-w-0">
                  <p className="font-700 text-sm" style={{ color: selectedStore === store.id ? "#D81B60" : "#1A0A10", margin: 0 }}>
                    {store.name}
                  </p>
                  <p className="text-xs" style={{ color: selectedStore === store.id ? "#B8297C" : "#9A8A99", marginTop: "2px", margin: 0 }}>{store.address || store.name}</p>
                </div>
              </div>
                </motion.button>
            )}
            </div> :
          search.length > 0 ?
          <p className="text-center text-sm py-4" style={{ color: "#BBA8B0" }}>No encontramos tiendas</p> :
          null}
        </div>

        {/* Botón Entrar */}
         <motion.button
          onClick={handleEnter}
          disabled={!selectedStore}
          whileTap={selectedStore ? { scale: 0.97 } : {}}
          className="w-full h-12 rounded-xl font-800 text-sm transition-all"
          style={{
            background: selectedStore ? "linear-gradient(180deg, #E8187A 0%, #D81B60 100%)" : "#E8E8E8",
            color: selectedStore ? "#FFFFFF" : "#CCC",
            cursor: selectedStore ? "pointer" : "not-allowed",
            boxShadow: selectedStore ? "0 6px 16px rgba(216, 27, 96, 0.18), 0 0 1px rgba(216, 27, 96, 0.1)" : "none",
            marginTop: "24px",
            letterSpacing: "0.2px"
          }}>

          Entrar a Popsy
        </motion.button>

        {/* Footer */}
         <p className="text-center text-xs" style={{ color: "#C8B3BE", marginTop: "22px", fontWeight: 500, letterSpacing: "0.3px" }}>
          Tu helado te espera ✨
        </p>
      </motion.div>
    </div>);

}