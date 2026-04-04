import React, { useRef } from "react";


export default function CategoryGrid({ categories, productCounts, onSelect }) {
  const containerRef = useRef(null);
  const startX = useRef(null);
  const scrollLeft = useRef(null);

  const handleMouseDown = (e) => {
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!startX.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    startX.current = null;
    containerRef.current.style.cursor = "grab";
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        display: "flex",
        gap: 12,
        padding: "0 16px",
        overflowX: "auto",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        cursor: "grab",
      }}
    >
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          style={{
            position: "relative",
            minWidth: 160,
            height: 200,
            borderRadius: 16,
            overflow: "hidden",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {/* Imagen de fondo */}
          {category.image && (
            <img
              src={category.image}
              alt={category.label}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Gradiente oscuro en parte inferior */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            }}
          />

          {/* Texto - esquina inferior izquierda */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              zIndex: 2,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "#fff",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {category.label}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.75)",
                margin: "4px 0 0",
              }}
            >
              {productCounts[category.id] || 0} opciones
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}