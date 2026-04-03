import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMBOS = [
  {
    id: 1,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c2b4b2bf3_SegundaMalteada16Oz-30dedescuento.png",
    title: "Segunda Malteada 16 Oz",
    price: "30% de descuento",
  },
  {
    id: 2,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c6fd8dce_Malteada16OzCharlieBrownie37800.png",
    title: "Malteada 16 Oz Charlie Brownie",
    price: "$37.800",
  },
  {
    id: 3,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d7bb62cd8_Malteada16OzBananaSplit37800.png",
    title: "Malteada 16 Oz Banana Split",
    price: "$37.800",
  },
  {
    id: 4,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/717fb959c_Malteada16OzBananaSplit.png",
    title: "Malteada 16 Oz Banana Split",
    price: "",
  },
  {
    id: 5,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png",
    title: "Combo Litro de helado Brownie",
    price: "8 unidades",
  },
  {
    id: 6,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9ac7460da_CompraunaTarrinaoLitroyllevasotraTarrinaconel30dedescuento.png",
    title: "Compra una Tarrina o Litro",
    price: "Lleva otra con 30% descuento",
  },
  {
    id: 7,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e54977063_TortaTarrinaOLitro.png",
    title: "Torta Tarrina O Litro",
    price: "",
  },
  {
    id: 8,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c196fbb03_Combo2TarrinasCajadeCono.png",
    title: "Combo 2 Tarrinas",
    price: "Caja de Cono",
  },
  {
    id: 9,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d8375425b_2LitrosdeHeladoCajaConoBrowniex8unidades.png",
    title: "2 Litros de Helado Caja Cono Brownie",
    price: "x8 unidades",
  },
  {
    id: 10,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/74c450f21_ComboLitroCajaCono2Toppings.png",
    title: "Combo Litro Caja Cono",
    price: "2 Toppings",
  },
  {
    id: 11,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/09347eafa_CompraunLitroyllevaunLitrooTarrinaconel30dto.png",
    title: "Compra un Litro",
    price: "Lleva otro con 30% dto",
  },
  {
    id: 12,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/46a819092_Americano9ONZGalletaRedvelvet20800.png",
    title: "Americano 9 ONZ + Galleta Red velvet",
    price: "$20.800",
  },
  {
    id: 13,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0ffc145bd_Maletada16OzAgua25800.png",
    title: "Malteada 16 Oz + Agua",
    price: "$25.800",
  },
];

export default function CombosCarousel({ onAdd }) {
  const [active, setActive] = useState(0);
  const startX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % COMBOS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => {
    setActive(i);
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) setActive((active + 1) % COMBOS.length);
    else if (diff < -40) setActive((active - 1 + COMBOS.length) % COMBOS.length);
    startX.current = null;
  };

  const handleComboClick = () => {
    const combo = COMBOS[active];
    if (onAdd) {
      onAdd({
        id: `combo-${combo.id}`,
        name: combo.title,
        price: 0,
        category: "combos",
        emoji: "🎁",
      });
    }
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
            onClick={handleComboClick}
            style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer", maxHeight: 200 }}
          >
            <img
              src={combo.image}
              alt={combo.title}
              className="w-full object-cover"
              style={{ display: "block", height: 200, objectPosition: "center" }}
            />
          </motion.div>
        </AnimatePresence>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#2D1A22", margin: 0, lineHeight: 1.3 }}>
            {combo.title}
          </p>
          {combo.price && (
            <p style={{ fontSize: 13, fontWeight: 700, color: "#C2185B", margin: 0 }}>
              {combo.price}
            </p>
          )}
        </div>
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