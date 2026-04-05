import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EDGE_THRESHOLD = 30; // px desde el borde izquierdo

export function useSwipeNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isEdgeSwipe = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      // Solo activar si el toque empieza en el borde izquierdo estricto
      isEdgeSwipe = startX < EDGE_THRESHOLD;
    };

    const handleTouchEnd = (e) => {
      if (!isEdgeSwipe) return;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - startX;
      const dy = Math.abs(endY - startY);
      // Swipe hacia la derecha, más horizontal que vertical, mínimo 60px
      if (dx > 60 && dy < 80) {
        navigate(-1);
      }
      isEdgeSwipe = false;
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);
}