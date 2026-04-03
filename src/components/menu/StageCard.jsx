import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { formatCOP, TAG_CONFIG } from "@/lib/constants";

const PASTEL_BG = ["#FFF0F5", "#F0FFF4", "#FFFAF0", "#FFF5F0", "#F0F5FF", "#FAFFF0"];
const PASTEL_BORDER = ["#F8D0DF", "#C3E6C3", "#F0E0C0", "#F8D0C0", "#C0D0F0", "#D0F0C0"];
const RING_COLORS = ["#FAD9E8", "#F8BBD0"];

export default function StageCard({ products, onAdd, addedFlash }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const startX = React.useRef(null);

  if (!products || products.length === 0) return null;

  const product = products[activeIdx] || products[0];
  const paletteIdx = activeIdx % PASTEL_BG.length;
  const tag = TAG_CONFIG[product.tag];

  const next = () => setActiveIdx((i) => (i + 1) % products.length);
  const prev = () => setActiveIdx((i) => (i - 1 + products.length) % products.length);

  const handleTouchStart = (e) => {startX.current = e.touches[0].clientX;};
  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();else
    if (diff < -40) prev();
    startX.current = null;
  };

  const isFlash = addedFlash === product.id;

  return null;






















































































































































}