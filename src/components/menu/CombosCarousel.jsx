import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMBOS = [
  {
    id: 1,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c2b4b2bf3_SegundaMalteada16Oz-30dedescuento.png",
    alt: "Segunda Malteada 16 Oz - 30% de descuento",
  },
  {
    id: 2,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c6fd8dce_Malteada16OzCharlieBrownie37800.png",
    alt: "Malteada 16 Oz Charlie Brownie 37.800",
  },
  {
    id: 3,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d7bb62cd8_Malteada16OzBananaSplit37800.png",
    alt: "Malteada 16 Oz Banana Split 37.800",
  },
  {
    id: 4,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/717fb959c_Malteada16OzBananaSplit.png",
    alt: "Malteada 16 Oz Banana Split",
  },
  {
    id: 5,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png",
    alt: "Combo Litro de helado Brownie 8 Und",
  },
  {
    id: 6,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9ac7460da_CompraunaTarrinaoLitroyllevasotraTarrinaconel30dedescuento.png",
    alt: "Compra una Tarrina o Litro y lleva otra Tarrina con el 30% de descuento",
  },
  {
    id: 7,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e54977063_TortaTarrinaOLitro.png",
    alt: "Torta Tarrina O Litro",
  },
  {
    id: 8,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c196fbb03_Combo2TarrinasCajadeCono.png",
    alt: "Combo 2 Tarrinas Caja de Cono",
  },
  {
    id: 9,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d8375425b_2LitrosdeHeladoCajaConoBrowniex8unidades.png",
    alt: "2 Litros de Helado Caja Cono Brownie x8 unidades",
  },
  {
    id: 10,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/74c450f21_ComboLitroCajaCono2Toppings.png",
    alt: "Combo Litro Caja Cono 2 Toppings",
  },
  {
    id: 11,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/09347eafa_CompraunLitroyllevaunLitrooTarrinaconel30dto.png",
    alt: "Compra un Litro y lleva un Litro o Tarrina con el 30% dto",
  },
];

export default function CombosCarousel() {
  const [active, setActive] = useState(0);
  const startX = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % COMBOS.length);
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

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) goTo((active + 1) % COMBOS.length);
    else if (diff < -40) goTo((active - 1 + COMBOS.length) % COMBOS.length);
    startX.current = null;
  };

  const combo = COMBOS[active];

  return (
    <div style={{ background: "#fff", marginTop: 10 }}>
      <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: "0 0 12px 16px", paddingTop: 16 }}>
        Combos
      </p>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: "grab", paddingLeft: 16, paddingRight: 16 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={combo.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer" }}
          >
            <img
              src={combo.image}
              alt={combo.alt}
              className="w-full object-cover"
              style={{ display: "block", height: "auto", objectPosition: "center" }}
            />
          </motion.div>
        </AnimatePresence>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#2D1A22", marginTop: 12, marginBottom: 0, lineHeight: 1.4 }}>
          {combo.alt}
        </p>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1 mt-2 pb-4">
        {COMBOS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 4,
              width: i === active ? 14 : 4,
              borderRadius: 4,
              background: i === active ? "#C2185B" : "#EDD8E4",
              transition: "all 0.25s ease",
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