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
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef({ isDragging: false, startX: 0, startPos: 0 });

  const doubled = [...COMBOS, ...COMBOS];
  const cardWidth = 300;

  const handleMouseDown = (e) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startPos: posRef.current,
    };
    pausedRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const diff = dragRef.current.startX - e.clientX;
    const totalWidth = cardWidth * COMBOS.length;
    posRef.current = dragRef.current.startPos + diff;
    if (posRef.current < 0) posRef.current = totalWidth + posRef.current;
    if (posRef.current >= totalWidth) posRef.current -= totalWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    pausedRef.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = cardWidth * COMBOS.length;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += 0.5;
        if (posRef.current >= totalWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div style={{ background: "#fff", marginTop: 10, padding: "16px 0" }}>
      <p style={{ fontSize: 17, fontWeight: 700, color: "#1A0A10", margin: "0 0 12px 16px", paddingTop: 4 }}>
        Combos
      </p>

      <div
        style={{ overflow: "hidden", paddingLeft: 16, paddingRight: 16, paddingBottom: 4, cursor: "grab" }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => { pausedRef.current = true; }}
        onTouchEnd={() => { pausedRef.current = false; }}
        onMouseEnter={() => { if (!dragRef.current.isDragging) pausedRef.current = true; }}
        onMouseLeave={() => { if (!dragRef.current.isDragging) pausedRef.current = false; }}
      >
        <div ref={trackRef} style={{ display: "flex", gap: 12, width: "max-content" }}>
          {doubled.map((combo, i) => (
            <div
              key={`${combo.id}-${i}`}
              onClick={() => {
                if (onAdd) {
                  onAdd({
                    id: `combo-${combo.id}`,
                    name: combo.title,
                    price: 0,
                    category: "combos",
                    emoji: "🎁",
                  });
                }
              }}
              style={{
                width: cardWidth,
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <div style={{ borderRadius: 14, overflow: "hidden", background: "#f5f5f5", aspectRatio: "1" }}>
                <img
                  src={combo.image}
                  alt={combo.title}
                  style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: "8px" }}
                />
              </div>
              <div style={{ marginTop: 6, paddingRight: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#2D1A22", margin: 0, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {combo.title}
                </p>
                {combo.price && (
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#C2185B", margin: "2px 0 0" }}>
                    {combo.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}