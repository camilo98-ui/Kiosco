import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import StoreSelectorContent from "./StoreSelectorContent";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/21f23c7d3_image.png";

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
      {/* Fondo con burbujas animadas - Magenta y Verde pastel pequeñas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [-50, 50, -50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(233, 30, 99, 0.5), rgba(233, 30, 99, 0.15), transparent)',
            filter: 'blur(40px)',
            boxShadow: '0 0 80px rgba(233, 30, 99, 0.3)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -35, 35, 0],
            y: [50, -50, 50, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute -bottom-16 -left-16 w-[180px] h-[180px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(144, 238, 144, 0.45), rgba(144, 238, 144, 0.1), transparent)',
            filter: 'blur(38px)',
            boxShadow: '0 0 75px rgba(144, 238, 144, 0.25)',
          }}
        />
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute top-1/2 right-1/3 w-[160px] h-[160px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(233, 100, 150, 0.4), rgba(233, 100, 150, 0.08), transparent)',
            filter: 'blur(35px)',
            boxShadow: '0 0 70px rgba(233, 100, 150, 0.2)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [30, -30, 30, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
          className="absolute bottom-1/3 left-1/4 w-[150px] h-[150px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(152, 251, 152, 0.4), rgba(152, 251, 152, 0.08), transparent)',
            filter: 'blur(36px)',
            boxShadow: '0 0 65px rgba(152, 251, 152, 0.2)',
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
          className="h-24 object-contain mx-auto mb-8"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
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