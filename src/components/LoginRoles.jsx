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
        background: `
          linear-gradient(135deg, 
            #f5f5f5 0%,
            #e8e8e8 25%,
            #f0f0f0 50%,
            #e8e8e8 75%,
            #f5f5f5 100%
          ),
          radial-gradient(circle at 20% 30%, rgba(233, 30, 99, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(184, 134, 111, 0.06) 0%, transparent 40%)
        `,
        backgroundSize: "200% 200%, 100% 100%, 100% 100%",
        backgroundAttachment: "fixed"
      }}>
      
      {/* Destellos elegantes del mármol - Cobre y Magenta */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-1/4 w-2 h-2 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(184, 134, 111, 0.8), transparent)',
          boxShadow: '0 0 20px rgba(184, 134, 111, 0.6)'
        }} />
      
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(233, 30, 99, 0.6), transparent)',
          boxShadow: '0 0 16px rgba(233, 30, 99, 0.4)'
        }} />
      
      <motion.div
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 left-1/3 w-1 h-1 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(184, 134, 111, 0.7), transparent)',
          boxShadow: '0 0 12px rgba(184, 134, 111, 0.5)'
        }} />
      


      {/* Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[360px] mx-auto rounded-[28px]"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 40px rgba(233, 30, 99, 0.05)",
          padding: "40px 32px",
          minHeight: "620px"
        }}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/bfc0077cd_images__2_-removebg-preview.png"
            alt="Popsy"
            className="h-24 mb-6 mx-auto"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(233, 30, 99, 0.08))', mixBlendMode: 'multiply' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          
          <h2 className="mb-2 text-2xl font-light tracking-tight" style={{ color: "#1A1A1A", letterSpacing: "0.5px" }}>
            Bienvenido
          </h2>
          <p className="text-sm font-light" style={{ color: "#888", letterSpacing: "0.3px" }}>
            ¿Dónde estás hoy?
          </p>
        </div>

        {/* Buscador de Tiendas */}
         <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#C0C0C0" }} />
            <input
              type="text"
              placeholder="Busca tu tienda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border font-light tracking-wide focus:outline-none transition-all text-sm"
              style={{
                background: "#FFFFFF",
                border: search ? "1.5px solid #E91E63" : "1px solid #E8E8E8",
                color: "#1A1A1A",
                boxShadow: search ? "0 6px 20px rgba(233, 30, 99, 0.12)" : "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            />

          </div>

          {loading ?
          <p className="text-center text-gray-300 text-sm py-4 font-light">Cargando tiendas...</p> :
          filtered.length > 0 ?
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 mb-2">
               {filtered.map((store, idx) =>
            <motion.button
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              whileTap={{ scale: 1.01 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="w-full text-left transition-all"
              style={{
                background: selectedStore === store.id ? "#FFFFFF" : "#FAFAFA",
                border: selectedStore === store.id ? "1.5px solid #E91E63" : "1px solid #E8E8E8",
                borderRadius: "12px",
                padding: "14px 16px",
                boxShadow: selectedStore === store.id ? "0 12px 32px rgba(233, 30, 99, 0.15), inset 0 1px 3px rgba(233, 30, 99, 0.08)" : "0 2px 6px rgba(0, 0, 0, 0.03)"
              }}>
              <div className="flex items-start gap-3">
                {selectedStore === store.id && <span style={{ color: "#E91E63", marginTop: "1px", fontSize: "16px" }}>📍</span>}
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: selectedStore === store.id ? "#E91E63" : "#1A1A1A" }}>
                    {store.name}
                  </p>
                  <p className="text-xs font-light" style={{ color: selectedStore === store.id ? "#D32E7A" : "#AAA", marginTop: "3px" }}>{store.address || store.name}</p>
                </div>
              </div>
                </motion.button>
            )}
            </div> :
          search.length > 0 ?
          <p className="text-center text-gray-300 text-sm py-4 font-light">No encontramos tiendas</p> :
          null}
        </div>

        {/* Botón Entrar */}
         <motion.button
          onClick={handleEnter}
          disabled={!selectedStore}
          whileTap={selectedStore ? { scale: 0.97 } : {}}
          className="w-full font-light tracking-wide transition-all text-sm"
          style={{
            background: selectedStore ? "linear-gradient(135deg, #E91E63 0%, #D6245E 50%, #B8865F 100%)" : "#E8E8E8",
            color: selectedStore ? "#FFFFFF" : "#CCC",
            cursor: selectedStore ? "pointer" : "not-allowed",
            padding: "16px 0",
            borderRadius: "14px",
            border: selectedStore ? "1px solid rgba(255, 255, 255, 0.4)" : "none",
            boxShadow: selectedStore ? "0 12px 32px rgba(233, 30, 99, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.05)",
            marginTop: "28px"
          }}>

          Entrar a Popsy
        </motion.button>

        {/* Footer */}
         <p className="text-center text-xs font-light tracking-wide" style={{ color: "#C0C0C0", marginTop: "32px" }}>
          Tu helado te espera ✨
        </p>
      </motion.div>
    </div>);

}