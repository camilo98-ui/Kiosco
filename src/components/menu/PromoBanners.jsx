import React, { useState, useEffect, useRef } from "react";
// framer-motion no needed

const BANNERS = [
  {
    id: 1,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/5006fd68f_image.png",
    alt: "Para llevar siempre",
    category: "para_llevar",
    bannerText: "Para llevar",
  },
  {
    id: 2,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0c2252efa_image.png",
    alt: "Domicilio Gratis",
    category: "malteadas",
    bannerText: "Domicilio Gratis",
  },
  {
    id: 3,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/05dec2b30_image.png",
    alt: "Nuevo Yogo Yoo",
    category: "helados",
    bannerText: "Nuevo sabor",
  },
  {
    id: 4,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/9502d6914_image.png",
    alt: "Doble o Nada",
    category: "helados",
    bannerText: "Doble o Nada",
  },
  {
    id: 5,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/8afa4278b_image.png",
    alt: "Combo Plus",
    category: "combos",
    bannerText: "Combo Plus",
  },
  {
    id: 6,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/df199d449_image.png",
    alt: "Arma tu combo",
    category: "combos",
    bannerText: "Arma tu combo",
  },
  {
    id: 7,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/0948c2133_21803262319banner_arma_tu_vaso_website_1920x8001.png",
    alt: "Arma tu vaso",
    category: "combos",
    bannerText: "Arma tu vaso",
  },
  {
    id: 8,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/133545960_21803162318banner_combos_website_1920x8001.png",
    alt: "Para compartir",
    category: "combos",
    bannerText: "Para compartir",
  },
  {
    id: 9,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/48bd8d0e7_21803062313banner_malteadas_crack_website_1920x8002.jpg",
    alt: "Malteadas Crack",
    category: "malteadas",
    bannerText: "Malteadas Crack",
  },
  {
    id: 10,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/218c5c252_Capturadepantalla2026-04-03101638.jpg",
    alt: "Nuevo Fiore",
    category: "helados",
    bannerText: "Nuevo Fiore",
  },
  {
    id: 11,
    image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/b46dcf67f_2180415.png",
    alt: "Cookie Jar",
    category: "combos",
    bannerText: "Cookie Jar",
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
    <div className="px-1 mb-0" style={{ marginBottom: 0 }}>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: "grab", position: "relative", borderRadius: 16, overflow: "hidden" }}
        onClick={() => onCategorySelect?.(banner.category)}
      >
        {BANNERS.map((b, i) => (
          <img
            key={b.id}
            src={b.image}
            alt={b.alt}
            className="w-full object-cover"
            style={{
              display: "block",
              height: "auto",
              objectPosition: "center",
              position: i === 0 ? "relative" : "absolute",
              top: 0,
              left: 0,
              width: "100%",
              opacity: i === active ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: i === active ? "auto" : "none",
            }}
          />
        ))}
      </div>

      {/* Dots — máximo 5 visibles */}
      <div className="flex items-center justify-center gap-2 mt-2" style={{ overflow: "hidden", maxWidth: "150px", margin: "0 auto" }}>
        {BANNERS.map((_, i) => (
          i < 5 && (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                height: 8,
                width: i === active ? 22 : 8,
                borderRadius: 4,
                background: i === active ? "#C41E6A" : "#F5C0DC",
                transition: "all 0.3s ease",
                border: "none",
                padding: 0,
                flexShrink: 0,
              }}
            />
          )
        ))}
      </div>
    </div>
  );
}