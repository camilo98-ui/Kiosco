import React, { useRef, useEffect, useState, useCallback } from "react";

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
const CARD_STEP = CARD_WIDTH + GAP;
const AUTOPLAY_INTERVAL = 3000;
const PAUSE_AFTER_DRAG = 5000;

function ComboCard({ combo, onAdd }) {
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
        border: "1.5px solid #F0E4EA",
        background: "#fff",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered ? "0 8px 24px rgba(194,24,91,0.18)" : "0 2px 8px rgba(194,24,91,0.08)",
        transform: hovered ? "translateY(-5px)" : "translateY(0px)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        userSelect: "none",
        WebkitUserSelect: "none",
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
          letterSpacing: "0.3px",
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
          <p style={{ fontSize: 14, fontWeight: 900, color: "#C41E6A", margin: "4px 0 0", lineHeight: 1 }}>
            {combo.price}
          </p>
        )}
        {isPromo && (
          <p style={{ fontSize: 10, fontWeight: 700, color: "#C41E6A", margin: "4px 0 0", lineHeight: 1.3 }}>
            {combo.price}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CombosCarousel({ onAdd }) {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Refs for drag state (no re-render needed)
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const isManualDrag = useRef(false); // true while finger/mouse is actively down

  // Autoplay timer ref
  const autoplayRef = useRef(null);
  const resumeRef = useRef(null);

  const totalCards = COMBOS.length;

  // Scroll container to a given index with smooth transition
  const scrollToIndex = useCallback((idx, transition = "0.5s ease-in-out") => {
    const container = containerRef.current;
    if (!container) return;
    // Clamp index
    const clamped = ((idx % totalCards) + totalCards) % totalCards;
    container.style.scrollBehavior = "auto";
    // Use scrollLeft to move (scroll-snap handles snapping)
    const target = clamped * CARD_STEP;
    container.style.transition = "none";
    // scrollTo with behavior smooth doesn't support custom timing, so we manually set scrollLeft
    // We'll use a CSS trick: disable scroll-snap temporarily for smooth transition
    container.scrollTo({ left: target, behavior: "smooth" });
    setActiveIdx(clamped);
  }, [totalCards]);

  // Start autoplay
  const startAutoplay = useCallback(() => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (isManualDrag.current) return; // never interrupt active drag
      setActiveIdx(prev => {
        const next = (prev + 1) % totalCards;
        const container = containerRef.current;
        if (container) {
          container.scrollTo({ left: next * CARD_STEP, behavior: "smooth" });
        }
        return next;
      });
    }, AUTOPLAY_INTERVAL);
  }, [totalCards]);

  // Pause autoplay, optionally resume after delay
  const pauseAutoplay = useCallback((resumeAfter = 0) => {
    clearInterval(autoplayRef.current);
    clearTimeout(resumeRef.current);
    if (resumeAfter > 0) {
      resumeRef.current = setTimeout(() => {
        if (!isManualDrag.current) startAutoplay();
      }, resumeAfter);
    }
  }, [startAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => {
      clearInterval(autoplayRef.current);
      clearTimeout(resumeRef.current);
    };
  }, [startAutoplay]);

  // Sync activeIdx with scroll position on scroll end
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      const idx = Math.round(container.scrollLeft / CARD_STEP);
      setActiveIdx(((idx % totalCards) + totalCards) % totalCards);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [totalCards]);

  // ── Touch events ──────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    isManualDrag.current = true;
    dragStartX.current = e.touches[0].clientX;
    pauseAutoplay(0);
  };

  const handleTouchMove = (e) => {
    dragCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    isManualDrag.current = false;
    const deltaX = dragStartX.current - dragCurrentX.current;
    const container = containerRef.current;
    if (!container) { pauseAutoplay(PAUSE_AFTER_DRAG); return; }

    if (Math.abs(deltaX) > 50) {
      const direction = deltaX > 0 ? 1 : -1;
      const next = ((activeIdx + direction) % totalCards + totalCards) % totalCards;
      container.scrollTo({ left: next * CARD_STEP, behavior: "smooth" });
      setActiveIdx(next);
    }
    pauseAutoplay(PAUSE_AFTER_DRAG);
  };

  // ── Mouse events ──────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    isManualDrag.current = true;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragCurrentX.current = e.clientX;
    pauseAutoplay(0);
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    dragCurrentX.current = e.clientX;
    // Live drag scroll
    const container = containerRef.current;
    if (container) {
      const delta = dragStartX.current - e.clientX;
      container.scrollLeft = activeIdx * CARD_STEP + delta;
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    isManualDrag.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";

    const deltaX = dragStartX.current - dragCurrentX.current;
    const container = containerRef.current;
    if (!container) { pauseAutoplay(PAUSE_AFTER_DRAG); return; }

    if (Math.abs(deltaX) > 50) {
      const direction = deltaX > 0 ? 1 : -1;
      const next = ((activeIdx + direction) % totalCards + totalCards) % totalCards;
      container.scrollTo({ left: next * CARD_STEP, behavior: "smooth" });
      setActiveIdx(next);
    } else {
      // Snap back to current
      container.scrollTo({ left: activeIdx * CARD_STEP, behavior: "smooth" });
    }
    pauseAutoplay(PAUSE_AFTER_DRAG);
  };

  // Attach mousemove/mouseup to window so drag works outside container
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeIdx]);

  return (
    <div style={{ background: "#fff", marginTop: 10, padding: "16px 0 12px" }}>
      <p style={{ fontSize: 17, fontWeight: 800, color: "#2D2D2D", margin: "0 0 14px 16px" }}>
        Combos
      </p>

      {/* Scroll container with scroll-snap */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          gap: GAP,
          paddingLeft: 16,
          paddingBottom: 4,
          paddingRight: 16,
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: "grab",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>{`
          .combos-carousel::-webkit-scrollbar { display: none; }
          .combos-carousel > div { scroll-snap-align: start; }
        `}</style>
        {COMBOS.map((combo) => (
          <div
            key={combo.id}
            style={{ scrollSnapAlign: "start", flexShrink: 0 }}
          >
            <ComboCard
              combo={combo}
              gradient={CARD_GRADIENTS[(combo.id - 1) % CARD_GRADIENTS.length]}
              onAdd={onAdd}
            />
          </div>
        ))}
        {/* Spacer so last card snaps properly */}
        <div style={{ flexShrink: 0, width: 4 }} />
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 12 }}>
        {COMBOS.map((_, idx) => (
          <div
            key={idx}
            onClick={() => {
              pauseAutoplay(PAUSE_AFTER_DRAG);
              const container = containerRef.current;
              if (container) container.scrollTo({ left: idx * CARD_STEP, behavior: "smooth" });
              setActiveIdx(idx);
            }}
            style={{
              width: activeIdx === idx ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: activeIdx === idx ? "#C41E6A" : "#F9C6E0",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}