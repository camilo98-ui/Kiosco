import React, { useState, useRef, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cartStore";
import { CATEGORIES, UPSELL_RULES, formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, MapPin, Loader2 } from "lucide-react";
import PopsyLogo from "@/components/menu/PopsyLogo";

// Componentes nuevos premium
import PromoBanners from "@/components/menu/PromoBanners";
import StageCard from "@/components/menu/StageCard";
import SuggestedRow from "@/components/menu/SuggestedRow";
import PremiumCategoryTabs from "@/components/menu/PremiumCategoryTabs";
import PremiumCartBar from "@/components/menu/PremiumCartBar";
import AdditionsUpsell from "@/components/menu/AdditionsUpsell";
import UpsellBanner from "@/components/menu/UpsellBanner";
import CheckoutDialog from "@/components/menu/CheckoutDialog";
import ConfirmationScreen from "@/components/menu/ConfirmationScreen";
import HiddenMenu from "@/components/menu/HiddenMenu";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("combos");
  const [upsellMsg, setUpsellMsg] = useState(null);
  const [upsellTarget, setUpsellTarget] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [hiddenMenuOpen, setHiddenMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedFlash, setAddedFlash] = useState(null);
  const [lastAdded, setLastAdded] = useState(null);
  const [showAdditionsUpsell, setShowAdditionsUpsell] = useState(false);
  const upsellTimer = useRef(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);
  const { addItem, cart, clearCart, total, itemCount } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("sort_order", 200)
  });

  const productsByCategory = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => map[c.id] = []);
    products.forEach((p) => {
      if (map[p.category]) map[p.category].push(p);
    });
    return map;
  }, [products]);

  // Productos de la categoría activa (solo disponibles)
  const categoryProducts = useMemo(() => {
    return (productsByCategory[activeCategory] || []).filter((p) => p.is_available !== false);
  }, [productsByCategory, activeCategory]);

  // Featured: los "mas_vendido" primero, resto después
  const featuredProducts = useMemo(() => {
    const top = categoryProducts.filter((p) => p.tag === "mas_vendido");
    const rest = categoryProducts.filter((p) => p.tag !== "mas_vendido");
    return [...top, ...rest];
  }, [categoryProducts]);

  // Sugerencias: best sellers de otras categorías
  const suggestedProducts = useMemo(() => {
    return products.
    filter((p) => p.tag === "mas_vendido" && p.category !== activeCategory && p.is_available !== false).
    slice(0, 6);
  }, [products, activeCategory]);

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      setHiddenMenuOpen(true);
    } else {
      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0;
      }, 2000);
    }
  };

  const handleAddProduct = useCallback(
    (product) => {
      addItem(product);
      setAddedFlash(product.id);
      setTimeout(() => setAddedFlash(null), 600);

      if (product.category !== "adiciones") {
        clearTimeout(upsellTimer.current);
        setShowAdditionsUpsell(false);
        upsellTimer.current = setTimeout(() => {
          setLastAdded(product);
          setShowAdditionsUpsell(true);
          setTimeout(() => setShowAdditionsUpsell(false), 8000);
        }, 700);
      }

      const rule = UPSELL_RULES[product.category];
      if (rule && product.category === "adiciones") {
        upsellTimer.current = setTimeout(() => {
          setUpsellMsg(rule.message);
          setUpsellTarget(rule.targetCategory);
          setTimeout(() => setUpsellMsg(null), 6000);
        }, 800);
      }
    },
    [addItem]
  );

  const handleUpsellAccept = () => {
    if (upsellTarget) setActiveCategory(upsellTarget);
    setUpsellMsg(null);
  };

  const handleCheckout = async (name) => {
    setIsSubmitting(true);
    const settings = await base44.entities.Settings.filter({ key: "next_order_number" });
    const nextNum = parseInt(settings[0]?.value || "101");
    const order = await base44.entities.Order.create({
      order_number: nextNum,
      customer_name: name,
      items: cart.map((i) => ({
        product_id: i.product_id,
        product_name: i.product_name,
        price: i.price,
        quantity: i.quantity,
        notes: i.notes
      })),
      total,
      status: "pendiente"
    });
    await base44.entities.Settings.update(settings[0].id, {
      value: String(nextNum + 1)
    });
    clearCart();
    setCheckoutOpen(false);
    setConfirmedOrder({ ...order, order_number: nextNum, customer_name: name, items: cart, total });
    setIsSubmitting(false);
  };

  if (confirmedOrder) {
    return (
      <ConfirmationScreen
        order={confirmedOrder}
        onNewOrder={() => setConfirmedOrder(null)} />);


  }

  return (
    <div className="min-h-screen" style={{ background: "#FFFCFD" }}>

      {/* ── BARRA SUPERIOR ── */}
      <div className="sticky top-0 z-20" style={{ background: "#FFFCFD" }}>
        {/* Status bar: ubicación + íconos */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <button className="flex items-center gap-1.5" onClick={handleLogoClick}>
            <span
              className="rounded-full"
              style={{ width: 7, height: 7, background: "#C2185B", display: "inline-block" }} />
            
            <span className="font-semibold" style={{ fontSize: 12, color: "#BBA8B0" }}>
              Bogotá, Colombia
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#F5EEF1",
                border: "1px solid #F0E4EA"
              }}>
              
              <Search size={15} style={{ color: "#2D1A22" }} />
            </button>
            <button
              className="flex items-center justify-center relative"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#F5EEF1",
                border: "1px solid #F0E4EA"
              }}>
              
              <ShoppingBag size={15} style={{ color: "#2D1A22" }} />
              {itemCount > 0 &&
              <span
                className="absolute -top-1 -right-1 font-black flex items-center justify-center"
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#C2185B", color: "#fff", fontSize: 9
                }}>
                
                  {itemCount}
                </span>
              }
            </button>
          </div>
        </div>

        {/* ── HEADER DE MARCA ── */}
        <div className="flex items-end justify-between px-5 pb-3">
          <div>
            




            
            <PopsyLogo onClick={handleLogoClick} />
          </div>
          <p
            className="text-right pb-1"
            style={{ fontSize: 9, color: "#BBA8B0", lineHeight: 1.5 }}>
            
            Hecho con<br />amor y crema
          </p>
        </div>

        {/* Divisor */}
        <div style={{ height: 1, background: "#F0E4EA", marginLeft: 20, marginRight: 20 }} />
      </div>

      {/* ── CONTENIDO SCROLLABLE ── */}
      <div className="pb-32">

        {/* ── BANNERS PROMOCIONALES ── */}
        <div className="pt-4">
          <PromoBanners onCategorySelect={setActiveCategory} />
        </div>

        {/* ── TABS DE CATEGORÍAS ── */}
        <PremiumCategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />

        {/* ── STAGE CARD: producto estrella de la categoría ── */}
        <div className="pt-4">
          {isLoading ?
          <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C2185B" }} />
            </div> :

          <AnimatePresence mode="wait">
              <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}>
              
                {/* Número de disponibles */}
                <p
                className="uppercase font-extrabold tracking-widest px-5 mb-3"
                style={{ fontSize: 8, color: "#BBA8B0", letterSpacing: "2px" }}>
                
                  {CATEGORIES.find((c) => c.id === activeCategory)?.label} · {categoryProducts.length} disponibles
                </p>

                <StageCard
                products={featuredProducts}
                onAdd={handleAddProduct}
                addedFlash={addedFlash} />
              
              </motion.div>
            </AnimatePresence>
          }
        </div>

        {/* ── TAMBIÉN TE PUEDE GUSTAR ── */}
        {!isLoading && suggestedProducts.length > 0 &&
        <SuggestedRow products={suggestedProducts} onAdd={handleAddProduct} />
        }
      </div>

      {/* ── OVERLAYS Y MODALES ── */}
      <PremiumCartBar onCheckout={() => setCheckoutOpen(true)} />

      {showAdditionsUpsell &&
      <AdditionsUpsell
        lastAdded={lastAdded}
        additions={productsByCategory["adiciones"] || []}
        onAdd={handleAddProduct}
        onDismiss={() => setShowAdditionsUpsell(false)} />

      }

      <UpsellBanner
        message={upsellMsg}
        onDismiss={() => setUpsellMsg(null)}
        onAccept={handleUpsellAccept} />
      

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={handleCheckout}
        isLoading={isSubmitting} />
      

      <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />
    </div>);

}