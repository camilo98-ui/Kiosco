import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import StoreSelectorContent from "./StoreSelectorContent";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/55f3a2eb4_Logo_poopsy-removebg-preview.png";

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
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Fondo con burbujas animadas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Burbuja 1 - superior derecha */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.02))',
            boxShadow: '0 0 60px rgba(236, 72, 153, 0.1), inset -20px -20px 40px rgba(255,255,255,0.5), inset 20px 20px 40px rgba(236, 72, 153, 0.1)'
          }}
        />
        
        {/* Burbuja 2 - inferior izquierda */}
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.12), rgba(168, 85, 247, 0.02))',
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.08), inset -25px -25px 50px rgba(255,255,255,0.4), inset 25px 25px 50px rgba(168, 85, 247, 0.08)'
          }}
        />
        
        {/* Burbuja 3 - centro superior */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.08), rgba(236, 72, 153, 0.01))',
            boxShadow: '0 0 50px rgba(236, 72, 153, 0.06), inset -15px -15px 30px rgba(255,255,255,0.3)'
          }}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen relative z-10 items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Logo flotante */}
          <div className="text-center mb-8">
            <motion.img
              src={LOGO_URL}
              alt="Popsy"
              className="h-28 xl:h-32 object-contain mx-auto drop-shadow-lg"
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
              className="text-5xl font-black text-pink-600 italic mt-4"
            >
              Popsy
            </motion.h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Selecciona tu rol y comienza</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-3xl p-8 xl:p-10 space-y-6 backdrop-blur-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              boxShadow: '0 0 0 1px rgba(251, 113, 133, 0.2), 0 20px 60px rgba(236, 72, 153, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
            
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-pink-600">Popsy</h2>
              <p className="text-sm text-slate-600 font-semibold">Selecciona tu tienda</p>
              <p className="text-xs text-slate-500">Comienza a gestionar tus pedidos</p>
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
              <StoreSelectorContent stores={stores} onSelect={onSelect} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col items-center justify-center min-h-screen px-4 py-8 relative z-10">
        <motion.img
          src={LOGO_URL}
          alt="Popsy"
          className="h-24 object-contain mx-auto mb-4"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-black text-pink-600 italic mb-2"
        >
          Popsy
        </motion.h1>
        <p className="text-slate-600 text-sm font-semibold text-center mb-8">Selecciona tu tienda</p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-3xl p-6 backdrop-blur-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 0 0 1px rgba(251, 113, 133, 0.2), 0 20px 60px rgba(236, 72, 153, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}>
          {loading ? (
            <p className="text-slate-500 text-center">Cargando...</p>
          ) : (
            <StoreSelectorContent stores={stores} onSelect={onSelect} />
          )}
        </motion.div>
      </div>
    </div>
  );
}