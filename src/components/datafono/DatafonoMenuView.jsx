import React, { useState, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import CategoryGrid from "@/components/menu/CategoryGrid";
import EditorialLayout from "@/components/menu/EditorialLayout";
import MostOrdered from "@/components/datafono/DatafonoMostOrdered";

const FAMILY_CARDS = [
  { id: "malteadas", label: "Malteadas", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
  { id: "helados", label: "Helados", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
  { id: "combos", label: "Cookie Jar", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6dd912084_cookie-jaar-img.jpg" },
  { id: "granizados", label: "Granizados", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/923ba973b_images2.jpg" },
  { id: "especialidades", label: "Especiales", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
  { id: "cafe", label: "Café", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e15d81047_Coffee.png" },
  { id: "bebidas", label: "Otras bebidas", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/26de2b565_image.png" },
  { id: "para_llevar", label: "Para llevar", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" },
];

/**
 * Wrapper que usa los mismos layouts del menú cliente pero redirige onAdd
 * al carrito local del Datafono (sin usar cartStore global).
 * 
 * Hack: temporalmente inyectamos el addItem del cartStore con una versión
 * que llama a onAddItem del Datafono, luego lo restauramos.
 * 
 * Solución limpia: pasamos onAddItem directo a EditorialLayout vía onAdd.
 */
export default function DatafonoMenuView({ onAddItem }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [addedFlash, setAddedFlash] = useState(null);
  const [autoOpenProduct, setAutoOpenProduct] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("sort_order", 200),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const productCounts = useMemo(() => {
    const map = {};
    products.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [products]);

  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    return products.filter(p => p.category === activeCategory && p.is_available !== false);
  }, [products, activeCategory]);

  const handleAdd = useCallback((product, notes = "") => {
    const finalNotes = notes || product.notes || "";
    onAddItem({
      id: product.product_id || product.id,
      name: product.product_name || product.name,
      price: product.price,
      notes: finalNotes,
    });
    setAddedFlash(product.product_id || product.id);
    setTimeout(() => setAddedFlash(null), 600);
    toast.success(`✓ ${product.product_name || product.name} agregado`, {
      style: { background: "#C41E6A", color: "#fff", border: "none", borderRadius: "12px" },
      duration: 1500,
    });
  }, [onAddItem]);

  // Vista de categoría
  if (activeCategory) {
    const allowedCategories = ["helados", "malteadas", "especialidades", "cafe", "bebidas", "galletas", "paletas_packs", "para_llevar", "tortas", "regalos", "combos", "granizados"];
    if (!allowedCategories.includes(activeCategory)) {
      setActiveCategory(null);
      return null;
    }
    return (
      <div className="min-h-screen" style={{ background: "#FFF5F7" }}>
        {/* Header categoría */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3" style={{ height: 56, background: "linear-gradient(90deg, #C41E6A 0%, #C41E6A 55%, #FF6EB4 100%)" }}>
          <button onClick={() => setActiveCategory(null)} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ArrowLeft size={20} color="#fff" />
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </span>
          <div style={{ width: 44 }} />
        </div>

        <div className="pb-36 pt-2" style={{ background: "#FFF5F7" }}>
          <EditorialLayout
            products={categoryProducts}
            category={activeCategory}
            onAdd={handleAdd}
            addedFlash={addedFlash}
            autoOpenProduct={autoOpenProduct}
            onAutoOpenDone={() => setAutoOpenProduct(null)}
          />
        </div>
      </div>
    );
  }

  // Vista principal (sin carrusel de combos ni banners)
  return (
    <div style={{ background: "#FFF5F7", flex: 1 }}>
      {/* Categorías */}
      <div style={{ background: "transparent", padding: "10px 0 14px", marginTop: 2 }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#2D1A22", margin: "0 0 12px 16px" }}>¿Qué se te antoja? 😏</p>
        <CategoryGrid
          categories={FAMILY_CARDS}
          productCounts={productCounts}
          onSelect={setActiveCategory}
          onCookieJaar={() => setActiveCategory("galletas")}
        />
      </div>

      {/* Más vendidos */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C41E6A" }} />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <MostOrdered
            products={products}
            onSelectCategory={(cat, product) => {
              setActiveCategory(cat);
              if (product) setAutoOpenProduct(product);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}