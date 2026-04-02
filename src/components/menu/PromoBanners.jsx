import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: 1,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/5006fd68f_image.png",
    alt: "Para llevar en cualquier momento",
    category: "para_llevar",
  },
  {
    id: 2,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0c2252efa_image.png",
    alt: "Domicilio Gratis por compras iguales o superiores a $40.000",
    category: "malteadas",
  },
  {
    id: 3,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/05dec2b30_image.png",
    alt: "Nuevo helado con Yogo Yoo sabor fresa",
    category: "helados",
  },
  {
    id: 4,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9502d6914_image.png",
    alt: "¡Doble o nada! 2 bolas de helado Gourmet",
    category: "helados",
  },
  {
    id: 5,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/8afa4278b_image.png",
    alt: "1 tarrina con helado + 1 Popsy Toy por $58.900",
    category: "combos",
  },
  {
    id: 6,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/df199d449_image.png",
    alt: "¡Arma el plan, nosotros ponemos el combo!",
    category: "combos",
  },
];

export default function PromoBanners({ onCategorySelect }) {
  const [active, setActive] = useState(0);
  const startX = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % BANNERS.length);
    }, 3500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    setActive(i);
    startTimer();
  };

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) goTo((active + 1) % BANNERS.length);
    else if (diff < -40) goTo((active - 1 + BANNERS.length) % BANNERS.length);
    startX.current = null;
  };

  const banner = BANNERS[active];

  return (
    <div className="px-4 mb-4">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: "grab" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => onCategorySelect?.(banner.category)}
            style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer" }}
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full object-cover"
              style={{ display: "block", height: 130, objectPosition: "center" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-2.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 5,
              width: i === active ? 16 : 5,
              borderRadius: 6,
              background: i === active ? "#C2185B" : "#EDD8E4",
              transition: "all 0.25s ease",
              border: "none",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}