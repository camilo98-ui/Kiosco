import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useSwipeNavigation() {
  const navigate = useNavigate();
  const touchStartX = { current: 0 };
  const isEdgeSwipe = { current: false };

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      isEdgeSwipe.current = e.touches[0].clientX < 40;
    };

    const handleTouchMove = (e) => {
      if (isEdgeSwipe.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (!isEdgeSwipe.current) return;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;
      if (deltaX > 60) {
        navigate(-1);
      }
    };

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);
}