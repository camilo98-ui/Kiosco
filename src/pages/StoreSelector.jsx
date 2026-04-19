import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useStore } from "@/lib/storeContext";

export default function StoreSelector() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastStore, setLastStore] = useState(null);
  const navigate = useNavigate();
  const { selectStore } = useStore();

  useEffect(() => {
    // Cargar tiendas
    base44.entities.Store.filter({ is_active: true })
      .then((data) => {
        setStores(data);
      })
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
    
    // Cargar última tienda usada
    const saved = localStorage.getItem("popsy_last_store");
    if (saved) {
      try {
        setLastStore(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const filtered = useMemo(() => {
    return stores.filter((store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      (store.address && store.address.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, stores]);

  const handleSelectStore = (store) => {
    localStorage.setItem("popsy_last_store", JSON.stringify(store));
    selectStore(store);
    navigate("/menu");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF5F8 0%, #FFF0F5 50%, #FFE8F0 100%)"
      }}>
      
      {/* Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[360px] rounded-3xl mx-auto"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 12px 48px rgba(196, 30, 106, 0.12)",
          padding: "28px 24px"
        }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <motion.img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/bfc0077cd_images__2_-removebg-preview.png"
            alt="Popsy"
            className="h-20 mb-4 mx-auto"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          
          <h2 className="text-2xl font-bold mb-1" style={{ color: "#1A1A1A" }}>
            Bienvenido
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            ¿A cuál tienda Popsy vienes hoy?
          </p>
        </div>

        {/* Opción usar ubicación */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "14px",
            border: "1px solid #FFE4F3",
            background: "#FFF9FB",
            fontSize: "13px",
            fontWeight: 600,
            color: "#C41E6A",
            cursor: "pointer",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "all 0.2s"
          }}>
          📍 Usar mi ubicación
        </motion.button>

        {/* Última tienda usada */}
        {lastStore && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectStore(lastStore)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1.5px solid #C41E6A",
              background: "#FFF0F5",
              fontSize: "13px",
              fontWeight: 700,
              color: "#C41E6A",
              cursor: "pointer",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(196, 30, 106, 0.15)",
              transition: "all 0.2s"
            }}>
            ⭐ {lastStore.name}
          </motion.button>
        )}

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
              background: "#F9F5F7",
              border: "1px solid #FFE4F3",
              color: "#1A1A1A",
              boxShadow: search ? "0 0 0 3px rgba(233, 30, 99, 0.1)" : "none"
            }} />
        </div>

        {/* Lista de Sedes */}
        {loading ?
          <p className="text-center text-gray-400 text-sm py-8">Cargando tiendas...</p> :
          filtered.length > 0 ?
          <div className="space-y-2 pr-2" style={{ maxHeight: "260px", overflowY: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {filtered.map((store, idx) => (
              <motion.button
                key={store.id}
                onClick={() => handleSelectStore(store)}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="w-full flex items-start gap-3 transition-all text-left"
                style={{
                  background: "#FFF9FB",
                  border: "1px solid #FFE4F3",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  cursor: "pointer"
                }}>
                <MapPin
                  size={16}
                  style={{
                    color: "#C41E6A",
                    marginTop: "2px",
                    flexShrink: 0
                  }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs leading-tight" style={{ color: "#1A1A1A" }}>
                    {store.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#999" }}>
                    {store.address || store.name}
                  </p>
                </div>
              </motion.button>
            ))}
          </div> :
          search.length > 0 ?
          <p className="text-center text-gray-400 text-sm py-8">No encontramos esa tienda</p> :
          null}

      </motion.div>
    </div>
  );
}