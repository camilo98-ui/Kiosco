import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Search, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useStore } from "@/lib/storeContext";

// Burbujas flotantes con parallax
function FloatingBubbles() {
  const bubbles = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    size: Math.random() * 200 + 80,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 8 + 12,
    color: ["rgba(200, 100, 200, 0.1)", "rgba(150, 200, 255, 0.08)", "rgba(255, 180, 200, 0.09)", "rgba(200, 180, 255, 0.07)"][i % 4]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: "-100px",
            background: `radial-gradient(circle at 30% 30%, ${bubble.color}, transparent)`,
            filter: "blur(40px)",
            backdropFilter: "blur(20px)"
          }}
          animate={{
            y: [-100, -window.innerHeight - 200],
            x: [0, Math.sin(bubble.delay) * 100]
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "linear",
            delay: bubble.delay
          }}
        />
      ))}
    </div>
  );
}

// Hero Element - Helado animado
function IceCreamHero() {
  return (
    <motion.div
      className="flex items-center justify-center mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative w-32 h-40">
        {/* Brillo de fondo */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(196,30,106,0.15), transparent)",
            filter: "blur(30px)"
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Helado - Ilustración simplificada */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Cono */}
          <div className="w-16 h-20 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-b-3xl shadow-lg relative">
            {/* Textura del cono */}
            <div className="absolute inset-0 opacity-30">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="absolute w-full h-0.5 bg-yellow-600" style={{ top: `${i * 12.5}%` }} />
              ))}
            </div>
          </div>

          {/* Helado - Bola */}
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 via-rose-300 to-pink-400 shadow-2xl -mt-8 relative"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              boxShadow: "0 12px 32px rgba(196, 30, 106, 0.3), inset -5px -5px 15px rgba(0,0,0,0.1), inset 5px 5px 15px rgba(255,255,255,0.3)"
            }}
          >
            {/* Brillo helado */}
            <motion.div
              className="absolute top-2 left-4 w-8 h-8 bg-white rounded-full opacity-40"
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Tarjeta Quick Pick
function QuickPickCard({ icon, title, subtitle, onClick, isLoading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="w-full group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative rounded-2xl p-4 overflow-hidden backdrop-blur-md"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          border: "1.5px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 8px 32px rgba(196, 30, 106, 0.1), inset 0 0 20px rgba(255,255,255,0.5)",
        }}
      >
        {/* Brillo animado */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
            pointerEvents: "none"
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: "#1A1A1A" }}>
              {title}
            </p>
            <p className="text-xs" style={{ color: "#999" }}>
              {subtitle}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

// Tarjeta Tienda en lista de búsqueda
function StoreCard({ store, onClick, isLoading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div
        className="rounded-xl p-3 backdrop-blur-md border transition-all"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 4px 16px rgba(196, 30, 106, 0.08)"
        }}
      >
        <div className="flex items-center gap-2">
          <MapPin size={14} style={{ color: "#C41E6A", flexShrink: 0 }} />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs leading-tight" style={{ color: "#1A1A1A" }}>
              {store.name}
            </p>
            {store.address && (
              <p className="text-xs" style={{ color: "#AAA" }}>
                {store.address}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function StoreSelector() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastStore, setLastStore] = useState(null);
  const [selecting, setSelecting] = useState(false);
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

  const handleSelectStore = async (store) => {
    setSelecting(true);
    localStorage.setItem("popsy_last_store", JSON.stringify(store));
    selectStore(store);
    
    // Animación de transición
    setTimeout(() => {
      navigate("/menu");
    }, 300);
  };

  const filtered = useMemo(() => {
    if (!search) return [];
    return stores.filter((store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      (store.address && store.address.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, stores]);

  const quickPickOptions = [
    lastStore && { icon: "⭐", title: "Tu favorita", subtitle: lastStore.name, store: lastStore },
    stores[0] && { icon: "📍", title: "La más cercana", subtitle: stores[0].name || "Nueva tienda", store: stores[0] },
    stores[1] && { icon: "🔥", title: "La más rápida", subtitle: stores[1].name || "Nueva tienda", store: stores[1] }
  ].filter(Boolean);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F5E6FF 0%, #E6F3FF 25%, #FFE6F0 50%, #F5E6FF 75%, #E6F3FF 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite"
      }}
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Burbujas flotantes */}
      <FloatingBubbles />

      {/* Contenido */}
      <motion.div
        className="relative z-10 w-full max-w-sm flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.img
            src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/bfc0077cd_images__2_-removebg-preview.png"
            alt="Popsy"
            className="h-16 mx-auto mb-4"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1A1A1A" }}>
            ¿Listo para tu momento Popsy?
          </h1>
          <p className="text-xs" style={{ color: "#888" }}>
            Tu antojo empieza aquí
          </p>
        </div>

        {/* Hero Element */}
        <IceCreamHero />

        {/* Quick Pick Cards */}
        {!searchOpen && (
          <motion.div
            className="space-y-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {quickPickOptions.map((option, idx) => (
              <QuickPickCard
                key={idx}
                icon={option.icon}
                title={option.title}
                subtitle={option.subtitle}
                onClick={() => handleSelectStore(option.store)}
                isLoading={selecting}
              />
            ))}

            {/* Expandir búsqueda */}
            <motion.button
              onClick={() => setSearchOpen(true)}
              whileTap={{ scale: 0.96 }}
              className="w-full"
            >
              <div
                className="rounded-2xl p-3 backdrop-blur-md border transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.5)"
                }}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Search size={14} style={{ color: "#C41E6A" }} />
                  <span className="text-xs font-medium" style={{ color: "#888" }}>
                    O busca otra tienda…
                  </span>
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Search Expanded */}
        {searchOpen && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Busca tu tienda…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm focus:outline-none transition-all backdrop-blur-md"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: search ? "0 0 0 3px rgba(196, 30, 106, 0.1)" : "none"
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X size={16} style={{ color: "#999" }} />
                </button>
              )}
            </div>

            {/* Lista de resultados */}
            {filtered.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filtered.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onClick={() => handleSelectStore(store)}
                    isLoading={selecting}
                  />
                ))}
              </div>
            ) : search ? (
              <p className="text-center text-xs" style={{ color: "#999" }}>
                No encontramos esa tienda
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {stores.slice(0, 8).map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onClick={() => handleSelectStore(store)}
                    isLoading={selecting}
                  />
                ))}
              </div>
            )}

            {/* Cerrar búsqueda */}
            <motion.button
              onClick={() => setSearchOpen(false)}
              whileTap={{ scale: 0.96 }}
              className="w-full"
            >
              <div
                className="rounded-xl py-2 text-xs font-medium"
                style={{
                  color: "#C41E6A",
                  background: "rgba(196, 30, 106, 0.05)",
                  border: "1px solid rgba(196, 30, 106, 0.2)"
                }}
              >
                Cerrar búsqueda
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && !searchOpen && (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-rose-400 rounded-full animate-spin" />
            <p className="text-xs mt-2" style={{ color: "#999" }}>
              Listo en segundos…
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}