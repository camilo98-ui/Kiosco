import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import StoreSelectorContent from "./StoreSelectorContent";

const LOGO_URL = "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6ea4dfa96_image.png";

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
      {/* Fondo animado con siluetas - copia del login */}
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

      {/* Vista principal */}
      <div className="min-h-screen relative z-10 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <p className="text-sm font-bold text-magenta uppercase tracking-widest mb-2">Helado Gourmet</p>
            <motion.img
              src={LOGO_URL}
              alt="Popsy"
              className="h-24 object-contain mx-auto"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* Card central - copia pixel a pixel del login */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 xl:p-10 space-y-6"
            style={{
              boxShadow: '0 0 0 1.5px rgba(251,113,133,0.25), 0 8px 40px rgba(236,72,153,0.12), 0 32px 80px rgba(168,85,247,0.10), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}>
            
            {/* Títulos */}
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-magenta">Selecciona tu sede</h2>
              <p className="text-sm text-slate-600 font-medium">¿En qué punto estás hoy?</p>
            </div>

            {/* Contenido */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-pink-500 rounded-full" />
                </div>
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
    </div>
  );
}