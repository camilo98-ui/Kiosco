import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/popsy_logo.png";

export default function StoreSelector({ onSelect }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Store.filter({ is_active: true })
      .then(data => setStores(data))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white">
      {/* Fondo animado con siluetas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-white" />
        
        {/* Silueta principal superior derecha */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -25, 0],
            rotateZ: [0, 8, 0]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-48 -right-48 w-[480px] h-[480px]"
          style={{
            background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.12), rgba(244, 114, 182, 0.07), rgba(251, 207, 232, 0.02))',
            borderRadius: '42% 58% 45% 55% / 48% 62% 38% 52%',
            boxShadow: `inset -22px -22px 55px rgba(255, 255, 255, 0.8), inset 22px 22px 55px rgba(236, 72, 153, 0.13), 0 35px 100px rgba(236, 72, 153, 0.18), 0 15px 40px rgba(236, 72, 153, 0.08)`,
            filter: 'blur(1px)'
          }} />
        
        {/* Silueta inferior izquierda */}
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            rotateZ: [0, -10, 0]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-60 -left-60 w-[600px] h-[600px]"
          style={{
            background: 'linear-gradient(120deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.05), rgba(251, 207, 232, 0.03))',
            borderRadius: '38% 62% 52% 48% / 58% 42% 58% 42%',
            boxShadow: `inset -25px -25px 60px rgba(255, 255, 255, 0.75), inset 25px 25px 60px rgba(168, 85, 247, 0.1), 0 40px 120px rgba(236, 72, 153, 0.12)`,
            filter: 'blur(1px)'
          }} />
        
        {/* Silueta central rotante */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotateZ: [0, 180, 360]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px]"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.06), rgba(244, 114, 182, 0.04), rgba(236, 72, 153, 0.02))',
            borderRadius: '45% 55% 48% 52% / 52% 45% 55% 48%',
            boxShadow: `inset -20px -20px 50px rgba(255, 255, 255, 0.7), inset 20px 20px 50px rgba(168, 85, 247, 0.08)`,
            filter: 'blur(1px)'
          }} />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen relative z-10 items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Logo flotante desktop */}
          <div className="text-center mb-8">
            <motion.img
              src={LOGO_URL}
              alt="Popsy"
              className="h-28 xl:h-32 object-contain mx-auto drop-shadow-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black text-slate-400 italic mt-4"
            >
              Popsy
            </motion.h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Sistema de Gestión</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 xl:p-10 space-y-6"
            style={{
              boxShadow: '0 0 0 1.5px rgba(251,113,133,0.25), 0 8px 40px rgba(236,72,153,0.12), 0 32px 80px rgba(168,85,247,0.10), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}>
            
            {/* Header */}
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-bold text-slate-700">Selecciona tu tienda</h2>
              <p className="text-sm text-slate-600 font-medium">Comienza a gestionar tus pedidos</p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-pink-500 rounded-full" />
                </div>
                <p className="text-slate-500 mt-4 text-sm">Cargando tiendas...</p>
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">Sin tiendas disponibles</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stores.map((store, idx) => (
                  <motion.button
                    key={store.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -2 }}
                    onClick={() => onSelect(store)}
                    className="w-full text-left rounded-2xl p-4 flex items-center gap-4 group transition-all"
                    style={{
                      background: ["#E8F4F8", "#FFF0E6", "#F0E8F8"][idx % 3],
                      border: "1px solid rgba(236, 72, 153, 0.1)"
                    }}
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 bg-white/80 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {["🏪", "🌟", "💜"][idx % 3]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm">
                        {store.name}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {store.address || store.schedule || "Ubicación disponible"}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="text-slate-400 group-hover:text-pink-500 transition-colors flex-shrink-0">
                      →
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile View - fallback simple */}
      <div className="lg:hidden flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <h1 className="text-4xl font-black text-pink-600 italic mb-8">Popsy</h1>
        <div className="w-full space-y-3">
          {loading ? (
            <p className="text-slate-500 text-center">Cargando...</p>
          ) : (
            stores.map((store, idx) => (
              <motion.button
                key={store.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelect(store)}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 text-left"
              >
                <p className="font-bold text-slate-800">{store.name}</p>
                <p className="text-xs text-slate-600 mt-1">
                  {store.address || "Seleccionar"}
                </p>
              </motion.button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}