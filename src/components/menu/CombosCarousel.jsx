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
  { id: 1,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c2b4b2bf3_SegundaMalteada16Oz-30dedescuento.png",          title: "Segunda Malteada 16 Oz",              price: "30% de descuento",            badge: "Oferta",  badgeColor: "#D85A30" },
  { id: 2,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c6fd8dce_Malteada16OzCharlieBrownie37800.png",              title: "Malteada 16 Oz Charlie Brownie",      price: "$37.800",                     badge: "Top",     badgeColor: "#EF9F27" },
  { id: 3,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d7bb62cd8_Malteada16OzBananaSplit37800.png",                 title: "Malteada 16 Oz Banana Split",         price: "$37.800",                     badge: "Top",     badgeColor: "#EF9F27" },
  { id: 4,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/717fb959c_Malteada16OzBananaSplit.png",                      title: "Malteada 16 Oz Banana Split",         price: "",                            badge: "Nuevo",   badgeColor: "#3B6D11" },
  { id: 5,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png",                title: "Combo Litro de helado Brownie",       price: "8 unidades",                  badge: "8 uds",   badgeColor: "#3B6D11" },
  { id: 6,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9ac7460da_CompraunaTarrinaoLitroyllevasotraTarrinaconel30dedescuento.png", title: "Compra una Tarrina o Litro", price: "30% de descuento",    badge: "Oferta",  badgeColor: "#D85A30" },
  { id: 7,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e54977063_TortaTarrinaOLitro.png",                           title: "Torta Tarrina O Litro",               price: "",                            badge: "Nuevo",   badgeColor: "#3B6D11" },
  { id: 8,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/c196fbb03_Combo2TarrinasCajadeCono.png",                     title: "Combo 2 Tarrinas",                    price: "Caja de Cono",                badge: "Combo",   badgeColor: "#D85A30" },
  { id: 9,  image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/d8375425b_2LitrosdeHeladoCajaConoBrowniex8unidades.png",     title: "2 Litros Caja Cono Brownie",          price: "x8 unidades",                 badge: "8 uds",   badgeColor: "#3B6D11" },
  { id: 10, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/74c450f21_ComboLitroCajaCono2Toppings.png",                  title: "Combo Litro Caja Cono",               price: "2 Toppings",                  badge: "Combo",   badgeColor: "#D85A30" },
  { id: 11, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/09347eafa_CompraunLitroyllevaunLitrooTarrinaconel30dto.png", title: "Compra un Litro",                     price: "30% dto en otro",             badge: "Oferta",  badgeColor: "#D85A30" },
  { id: 12, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/46a819092_Americano9ONZGalletaRedvelvet20800.png",           title: "Americano + Galleta Red Velvet",      price: "$20.800",                     badge: "Nuevo",   badgeColor: "#3B6D11" },
  { id: 13, image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0ffc145bd_Maletada16OzAgua25800.png",                       title: "Malteada 16 Oz + Agua",               price: "$25.800",                     badge: "Top",     badgeColor: "#EF9F27" },
];

const CARD_WIDTH = 150;
const GAP = 12;

function ComboCard({ combo, gradient, onAdd }) {
  const [hovered, setHovered] = useState(false);
  const isPrice = combo.price && combo.price.startsWith("$");
  const isPromo = combo.price && !isPrice;

  return (
    <div
      onClick={() => onAdd && onAdd({ id: `combo-${combo.id}`, name: combo.title, price: 0, category: "combos", emoji: "🎁" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: CARD_WIDTH,
        flexShrink: 0,
        borderRadius: 20,
        border: "1.5px solid #f2d6c8",
        background: "#fff",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered ? "0 8px 24px rgba(216,90,48,0.18)" : "0 2px 8px rgba(216,90,48,0.08)",
        transform: hovered ? "translateY(-5px)" : "translateY(0px)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Image zone */}
      <div style={{ position: "relative", height: 110, background: gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={combo.image}
          alt={combo.title}
          style={{ width: "90%", height: "90%", objectFit: "contain" }}
        />
        {/* Badge */}
        <span style={{
          position: "absolute", top: 8, right: 8,
          background: combo.badgeColor, color: "#fff",
          fontSize: 9, fontWeight: 800,
          borderRadius: 20, padding: "3px 8px",
          letterSpacing: "0.3px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}>
          {combo.badge}
        </span>
      </div>

      {/* Info zone */}
      <div style={{ padding: "8px 10px 12px" }}>
        <p style={{
          fontSize: 12, fontWeight: 800, color: "#3C1A0A",
          margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {combo.title}
        </p>
        {isPrice && (
          <p style={{ fontSize: 14, fontWeight: 900, color: "#D85A30", margin: "4px 0 0", lineHeight: 1 }}>
            {combo.price}
          </p>
        )}
        {isPromo && (
          <p style={{ fontSize: 10, fontWeight: 700, color: "#3B6D11", margin: "4px 0 0", lineHeight: 1.3 }}>
            {combo.price}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CombosCarousel({ onAdd }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef({ isDragging: false, startX: 0, startPos: 0 });
  const [activeIdx, setActiveIdx] = useState(0);

  const doubled = [...COMBOS, ...COMBOS];
  const totalWidth = (CARD_WIDTH + GAP) * COMBOS.length;

  const handleMouseDown = (e) => {
    dragRef.current = { isDragging: true, startX: e.clientX, startPos: posRef.current };
    pausedRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const diff = dragRef.current.startX - e.clientX;
    posRef.current = dragRef.current.startPos + diff;
    if (posRef.current < 0) posRef.current = totalWidth + posRef.current;
    if (posRef.current >= totalWidth) posRef.current -= totalWidth;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    setActiveIdx(Math.round(posRef.current / (CARD_WIDTH + GAP)) % COMBOS.length);
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

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += 1.0;
        if (posRef.current >= totalWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
        setActiveIdx(Math.round(posRef.current / (CARD_WIDTH + GAP)) % COMBOS.length);
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div style={{ background: "#fff", marginTop: 10, padding: "16px 0 12px" }}>
      <p style={{ fontSize: 17, fontWeight: 800, color: "#3C1A0A", margin: "0 0 14px 16px" }}>
        Combos
      </p>

      {/* Carousel */}
      <div
        style={{ overflow: "hidden", paddingLeft: 16, paddingBottom: 4, cursor: "grab" }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => { pausedRef.current = true; }}
        onTouchEnd={() => { pausedRef.current = false; }}
        onMouseEnter={() => { if (!dragRef.current.isDragging) pausedRef.current = true; }}
        onMouseLeave={() => { if (!dragRef.current.isDragging) pausedRef.current = false; }}
      >
        <div ref={trackRef} style={{ display: "flex", gap: GAP, width: "max-content" }}>
          {doubled.map((combo, i) => (
            <ComboCard
              key={`${combo.id}-${i}`}
              combo={combo}
              gradient={CARD_GRADIENTS[(combo.id - 1) % CARD_GRADIENTS.length]}
              onAdd={onAdd}
            />
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
              background: activeIdx === idx ? "#D85A30" : "#f2d6c8",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}