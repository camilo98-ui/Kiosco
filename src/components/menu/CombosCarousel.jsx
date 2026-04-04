import React, { useRef, useEffect, useState } from "react";

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #FFE0D0 0%, #FFB89A 100%)",
  "linear-gradient(135deg, #FFF3D6 0%, #FFD98A 100%)",
  "linear-gradient(135deg, #D6F0D6 0%, #A8D8A8 100%)",
  "linear-gradient(135deg, #FFD6E8 0%, #FFB3D1 100%)",
  "linear-gradient(135deg, #FFE0D0 0%, #FFC4A0 100%)",
  "linear-gradient(135deg, #D6E8FF 0%, #A0C4FF 100%)",
  "linear-gradient(135deg, #F0D6FF 0%, #D4A0FF 100%)",
  "linear-gradient(135deg, #FFF3D6 0%, #FFD98A 100%)",
  "linear-gradient(135deg, #D6F0D6 0%, #A8D8A8 100%)",
  "linear-gradient(135deg, #FFE0D0 0%, #FFB89A 100%)",
  "linear-gradient(135deg, #FFD6E8 0%, #FFB3D1 100%)",
  "linear-gradient(135deg, #FFF3D6 0%, #FFD98A 100%)",
  "linear-gradient(135deg, #D6E8FF 0%, #A0C4FF 100%)",
];

const COMBOS = [
  { id: 1,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c2b4b2bf3_SegundaMalteada16Oz-30dedescuento.png",          title: "Segunda Malteada 16 Oz",              price: "30% de descuento",            badge: "Oferta" },
  { id: 2,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c6fd8dce_Malteada16OzCharlieBrownie37800.png",              title: "Malteada 16 Oz Charlie Brownie",      price: "$37.800",                     badge: "Top"   },
  { id: 3,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d7bb62cd8_Malteada16OzBananaSplit37800.png",                 title: "Malteada 16 Oz Banana Split",         price: "$37.800",                     badge: "Top"   },
  { id: 4,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/717fb959c_Malteada16OzBananaSplit.png",                      title: "Malteada 16 Oz Banana Split",         price: "",                            badge: "Nuevo" },
  { id: 5,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png",                title: "Combo Litro de helado Brownie",       price: "8 unidades",                  badge: "8 uds" },
  { id: 6,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9ac7460da_CompraunaTarrinaoLitroyllevasotraTarrinaconel30dedescuento.png", title: "Compra una Tarrina o Litro", price: "30% de descuento", badge: "Oferta" },
  { id: 7,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e54977063_TortaTarrinaOLitro.png",                           title: "Torta Tarrina O Litro",               price: "",                            badge: "Nuevo" },
  { id: 8,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c196fbb03_Combo2TarrinasCajadeCono.png",                     title: "Combo 2 Tarrinas",                    price: "Caja de Cono",                badge: "Combo" },
  { id: 9,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d8375425b_2LitrosdeHeladoCajaConoBrowniex8unidades.png",     title: "2 Litros Caja Cono Brownie",          price: "x8 unidades",                 badge: "8 uds" },
  { id: 10, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/74c450f21_ComboLitroCajaCono2Toppings.png",                  title: "Combo Litro Caja Cono",               price: "2 Toppings",                  badge: "Combo" },
  { id: 11, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/09347eafa_CompraunLitroyllevaunLitrooTarrinaconel30dto.png", title: "Compra un Litro",                     price: "30% dto en otro",             badge: "Oferta" },
  { id: 12, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/46a819092_Americano9ONZGalletaRedvelvet20800.png",           title: "Americano + Galleta Red Velvet",      price: "$20.800",                     badge: "Nuevo" },
  { id: 13, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0ffc145bd_Maletada16OzAgua25800.png",                       title: "Malteada 16 Oz + Agua",               price: "$25.800",                     badge: "Top"   },
];

const CARD_WIDTH = 150;
const GAP = 12;
const CARD_STEP = CARD_WIDTH + GAP;

function ComboCard({ combo, onAdd }) {
  const isPrice = combo.price && combo.price.startsWith("$");
  const isPromo = combo.price && !isPrice;

  return (
    <button
      onClick={() => onAdd && onAdd(combo)}
      style={{
        width: CARD_WIDTH,
        flexShrink: 0,
        borderRadius: 20,
        border: "1.5px solid #F0E4EA",
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(194,24,91,0.08)",
        userSelect: "none",
        WebkitUserSelect: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <div style={{ position: "relative", height: 150, overflow: "hidden", borderRadius: "20px 20px 0 0" }}>
        <img
          src={combo.image}
          alt={combo.title}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
        <span style={{
          position: "absolute", top: 9, right: 9,
          background: "#C41E6A", color: "#fff",
          fontSize: 9, fontWeight: 800,
          borderRadius: 20, padding: "3px 8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}>
          {combo.badge}
        </span>
      </div>
      <div style={{ padding: "8px 10px 12px" }}>
        <p style={{
          fontSize: 12, fontWeight: 800, color: "#2D1A22",
          margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {combo.title}
        </p>
        {isPrice && (
          <p style={{ fontSize: 14, fontWeight: 900, color: "#C41E6A", margin: "4px 0 0" }}>
            {combo.price}
          </p>
        )}
        {isPromo && (
          <p style={{ fontSize: 10, fontWeight: 700, color: "#C41E6A", margin: "4px 0 0", lineHeight: 1.3 }}>
            {combo.price}
          </p>
        )}
        </div>
        </button>
        );
        }

export default function CombosCarousel({ onAdd }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef({ isDragging: false, startX: 0, startPos: 0 });
  const resumeTimerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const doubled = [...COMBOS, ...COMBOS];
  const totalWidth = CARD_STEP * COMBOS.length;

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    dragRef.current = { isDragging: true, startX: e.clientX, startPos: posRef.current };
    pausedRef.current = true;
    if (trackRef.current) trackRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const diff = dragRef.current.startX - e.clientX;
    posRef.current = dragRef.current.startPos + diff;
    if (posRef.current < 0) posRef.current = totalWidth + posRef.current;
    if (posRef.current >= totalWidth) posRef.current -= totalWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    // Resume después de 500ms de inactividad
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, 500);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Touch handlers
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    pausedRef.current = true;
    clearTimeout(resumeTimerRef.current);
  };

  const handleTouchMove = (e) => {
    const diff = touchStartX.current - e.touches[0].clientX;
    posRef.current += diff;
    if (posRef.current < 0) posRef.current = totalWidth + posRef.current;
    if (posRef.current >= totalWidth) posRef.current -= totalWidth;
    touchStartX.current = e.touches[0].clientX;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const handleTouchEnd = () => {
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, 500);
  };

  // Continuous animation loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += 0.9;
        if (posRef.current >= totalWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
        setActiveIdx(Math.round(posRef.current / CARD_STEP) % COMBOS.length);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, []);

  return (
    <div style={{ background: "#fff", marginTop: 10, padding: "16px 0 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 16, paddingRight: 16, marginBottom: 14 }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: "#2D2D2D", margin: 0 }}>
          Combos
        </p>
        <button onClick={() => document.dispatchEvent(new CustomEvent("openCombosModal"))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#C41E6A", padding: 0 }}>
          Ver todos →
        </button>
      </div>

      <div
        style={{ overflow: "hidden", paddingLeft: 16, paddingBottom: 4, cursor: "grab" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => { if (!dragRef.current.isDragging) pausedRef.current = true; }}
        onMouseLeave={() => { if (!dragRef.current.isDragging) pausedRef.current = false; }}
      >
        <div ref={trackRef} style={{ display: "flex", gap: GAP, width: "max-content" }}>
          {doubled.map((combo, i) => (
            <ComboCard key={`${combo.id}-${i}`} combo={combo} onAdd={onAdd} />
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 12 }}>
        {COMBOS.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: activeIdx === idx ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: activeIdx === idx ? "#C41E6A" : "#F9C6E0",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}