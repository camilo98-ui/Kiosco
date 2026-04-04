import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: 1,
    headline: "Malteadas",
    subtext: "Hazle crack a tu malteada",
    cta: "Ver malteadas",
    category: "malteadas",
    productImage: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png",
    bg: "linear-gradient(135deg, #E91B8B 0%, #FFB6D9 100%)",
  },
  {
    id: 2,
    headline: "Helados",
    subtext: "Los más cremosos del menú",
    cta: "Ver helados",
    category: "helados",
    productImage: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png",
    bg: "linear-gradient(135deg, #C2185B 0%, #FF6EB4 100%)",
  },
  {
    id: 3,
    headline: "Combos",
    subtext: "Arma el plan perfecto",
    cta: "Ver combos",
    category: "combos",
    productImage: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6dd912084_cookie-jaar-img.jpg",
    bg: "linear-gradient(135deg, #E91B8B 0%, #FFD6EC 100%)",
  },
  {
    id: 4,
    headline: "Granizados",
    subtext: "Refréscate con nuestros nieves",
    cta: "Ver granizados",
    category: "granizados",
    productImage: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/923ba973b_images2.jpg",
    bg: "linear-gradient(135deg, #AD1457 0%, #F48FB1 100%)",
  },
  {
    id: 5,
    headline: "Especiales",
    subtext: "Banana split y más delicias",
    cta: "Ver especiales",
    category: "especialidades",
    productImage: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png",
    bg: "linear-gradient(135deg, #E91B8B 0%, #FF8DC7 100%)",
  },
  {
    id: 6,
    headline: "Cookie Jar",
    subtext: "Las más cremosas del menú",
    cta: "Ver Cookie Jar",
    category: "combos",
    productImage: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/b46dcf67f_2180415.png",
    bg: "linear-gradient(135deg, #B5175A 0%, #FFB6D9 100%)",
  },
];

export default function PromoBanners({ onCategorySelect }) {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(true);
  const startX = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % BANNERS.length);
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    setEntered(false);
    setTimeout(() => {
      setActive(i);
      setEntered(true);
    }, 80);
    startTimer();
  };

  useEffect(() => {
    setEntered(false);
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, [active]);

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) goTo((active + 1) % BANNERS.length);
    else if (diff < -40) goTo((active - 1 + BANNERS.length) % BANNERS.length);
    startX.current = null;
  };

  const banner = BANNERS[active];
  const isRound = [3, 4].includes(banner.id); // Imágenes que no son PNGs transparentes

  return (
    <div
      style={{ padding: "0 12px", marginBottom: 0, paddingTop: 10 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Contenedor con overflow visible para el efecto 3D */}
      <div style={{ position: "relative", overflow: "visible" }}>

        {/* Banner base */}
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => onCategorySelect?.(banner.category)}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              cursor: "pointer",
              height: 160,
              background: banner.bg,
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Textura de puntos */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              pointerEvents: "none",
            }} />

            {/* Destellos decorativos */}
            <div style={{
              position: "absolute",
              top: -30,
              right: "35%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.10)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute",
              bottom: -20,
              left: "40%",
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              pointerEvents: "none",
            }} />

            {/* Texto lado izquierdo */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: entered ? 1 : 0, x: entered ? 0 : -10 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              style={{ paddingLeft: 20, paddingRight: 10, flex: 1, zIndex: 2, maxWidth: "55%" }}
            >
              <p style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.15,
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
                textShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}>
                {banner.headline}
              </p>
              <p style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.88)",
                margin: "5px 0 12px",
                lineHeight: 1.3,
                fontWeight: 500,
              }}>
                {banner.subtext}
              </p>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 6 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                onClick={(e) => { e.stopPropagation(); onCategorySelect?.(banner.category); }}
                style={{
                  background: "#fff",
                  color: "#E91B8B",
                  border: "none",
                  borderRadius: 20,
                  padding: "5px 14px",
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {banner.cta} →
              </motion.button>
            </motion.div>

            {/* Espacio reservado para imagen (la imagen va fuera del overflow) */}
            <div style={{ width: "45%", flexShrink: 0 }} />
          </motion.div>
        </AnimatePresence>

        {/* Imagen del producto — FUERA del overflow hidden, z-index 20 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${banner.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: entered ? 1 : 0, y: entered ? -40 : 30 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              position: "absolute",
              right: 8,
              bottom: 0,
              zIndex: 20,
              pointerEvents: "none",
              width: 170,
              height: 200,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <img
              src={banner.productImage}
              alt={banner.headline}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "bottom center",
                filter: "drop-shadow(0px 12px 20px rgba(233,27,139,0.28))",
                mixBlendMode: isRound ? "multiply" : "normal",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots de navegación */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        marginTop: 46,
      }}>
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 8,
              width: i === active ? 22 : 8,
              borderRadius: 4,
              background: i === active ? "#E91B8B" : "#F9C6E0",
              transition: "all 0.3s ease",
              border: "none",
              padding: 0,
              flexShrink: 0,
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}