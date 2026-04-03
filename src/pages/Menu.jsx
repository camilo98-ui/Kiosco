import React, { useState, useRef, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cartStore";
import { CATEGORIES, UPSELL_RULES, formatCOP } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Loader2 } from "lucide-react";
import PopsyLogo from "@/components/menu/PopsyLogo";
import SearchModal from "@/components/menu/SearchModal";

// Componentes nuevos premium
import PromoBanners from "@/components/menu/PromoBanners";
import StageCard from "@/components/menu/StageCard";
import EditorialLayout from "@/components/menu/EditorialLayout";
import SuggestedRow from "@/components/menu/SuggestedRow";
import PremiumCategoryTabs from "@/components/menu/PremiumCategoryTabs";
import PremiumCartBar from "@/components/menu/PremiumCartBar";
import AdditionsUpsell from "@/components/menu/AdditionsUpsell";
import UpsellBanner from "@/components/menu/UpsellBanner";
import CheckoutDialog from "@/components/menu/CheckoutDialog";
import ConfirmationScreen from "@/components/menu/ConfirmationScreen";
import HiddenMenu from "@/components/menu/HiddenMenu";
import HeaderLine from "@/components/menu/HeaderLine";
import { CategoryIcons, FamilyCarousel, MostOrdered } from "@/components/menu/HomeLayout";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("combos");
  const [upsellMsg, setUpsellMsg] = useState(null);
  const [upsellTarget, setUpsellTarget] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [hiddenMenuOpen, setHiddenMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedFlash, setAddedFlash] = useState(null);
  const [lastAdded, setLastAdded] = useState(null);
  const [showAdditionsUpsell, setShowAdditionsUpsell] = useState(false);
  const upsellTimer = useRef(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);
  const { addItem, cart, clearCart, total, itemCount } = useCart();



  // Banner contextual según hora del día
  const contextBanner = React.useMemo(() => {
    const h = new Date().getHours();
    if (h >= 6 && h < 11)  return { text: "☀️ ¡Buenos días! Empieza con un café Popsy", category: "cafe" };
    if (h >= 11 && h < 14) return { text: "🍦 Hora del almuerzo — ¡combos especiales hoy!", category: "combos" };
    if (h >= 14 && h < 17) return { text: "🥤 Tarde perfecta para una malteada fría", category: "malteadas" };
    if (h >= 17 && h < 20) return { text: "🍭 ¡Antojo de algo dulce? Mira las paletas", category: "paletas_packs" };
    return { text: "🌙 ¡Noche de helados! El sabor perfecto te espera", category: "helados" };
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("sort_order", 200),
  });

  const productsByCategory = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => (map[c.id] = []));
    products.forEach((p) => {
      if (map[p.category]) map[p.category].push(p);
    });
    return map;
  }, [products]);

  const categoryProducts = useMemo(() => {
    return (productsByCategory[activeCategory] || []).filter((p) => p.is_available !== false);
  }, [productsByCategory, activeCategory]);

  const featuredProducts = useMemo(() => {
    const top = categoryProducts.filter((p) => p.tag === "mas_vendido");
    const rest = categoryProducts.filter((p) => p.tag !== "mas_vendido");
    return [...top, ...rest];
  }, [categoryProducts]);

  const suggestedProducts = useMemo(() => {
    return products
      .filter((p) => p.tag === "mas_vendido" && p.category !== activeCategory && p.is_available !== false)
      .slice(0, 6);
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
        notes: i.notes,
      })),
      total,
      status: "pendiente",
    });
    await base44.entities.Settings.update(settings[0].id, {
      value: String(nextNum + 1),
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
        onNewOrder={() => setConfirmedOrder(null)}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFFCFD" }}>

      {/* ── HEADER ── */}
      <div
        className="sticky top-0 z-20"
        style={{
          background: "linear-gradient(90deg, #B5175A 0%, #B5175A 55%, #5BA8A0 100%)",
          overflow: "hidden",
        }}
      >
        <HeaderLine hasCart={itemCount > 0} />
        {/* Top row */}
        <div className="flex items-center justify-between pl-0 pr-3" style={{ height: 52 }}>
          <PopsyLogo onClick={handleLogoClick} size="normal" dark />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }}
            >
              <Search size={14} style={{ color: "#fff" }} />
            </button>
            <button
              className="flex items-center justify-center hover:opacity-80 transition-opacity relative"
              style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }}
            >
              <ShoppingBag size={14} style={{ color: "#fff" }} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 font-black flex items-center justify-center"
                  style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", color: "#B5175A", fontSize: 8 }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: "0 12px 8px" }}>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.25)",
              border: "none",
              borderRadius: 20,
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Search size={13} color="rgba(255,255,255,0.6)" />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>
              Busca tu helado favorito...
            </span>
          </button>
        </div>

        {/* Delivery row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4AE54A", boxShadow: "0 0 0 3px rgba(74,229,74,0.3)", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
              25–35 min · Bogotá
            </span>
          </div>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            🛵 Domicilio gratis
          </span>
        </div>
      </div>

      {/* ── CONTENIDO SCROLLABLE ── */}
      <div className="pb-36">

        {/* ── BANNERS PROMOCIONALES ── */}
        <div className="pt-3">
          <PromoBanners onCategorySelect={setActiveCategory} />
        </div>

        {/* ── CATEGORÍAS CON ICONOS ── */}
        <CategoryIcons activeCategory={activeCategory} onSelect={setActiveCategory} />

        {/* ── EXPLORAR FAMILIAS ── */}
        {!isLoading && (
          <FamilyCarousel products={products} activeCategory={activeCategory} onSelect={setActiveCategory} />
        )}

        {/* ── LO MÁS PEDIDO ── */}
        {!isLoading && (
          <MostOrdered products={products} onAdd={handleAddProduct} />
        )}

        {/* ── TABS DE CATEGORÍAS ── */}
        <div style={{ marginTop: 20 }}>
          <PremiumCategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>

        {/* ── PRODUCTOS ── */}
        <div className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C2185B" }} />
            </div>
          ) : activeCategory === "combos" ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <p
                  className="uppercase font-extrabold tracking-widest px-5 mb-3"
                  style={{ fontSize: 8, color: "#BBA8B0", letterSpacing: "2px" }}
                >
                  {CATEGORIES.find((c) => c.id === activeCategory)?.label} · {categoryProducts.length} disponibles
                </p>
                <StageCard
                  products={featuredProducts}
                  onAdd={handleAddProduct}
                  addedFlash={addedFlash}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <EditorialLayout
              products={categoryProducts}
              category={activeCategory}
              onAdd={handleAddProduct}
              addedFlash={addedFlash}
            />
          )}
        </div>

        {/* ── TAMBIÉN TE PUEDE GUSTAR ── */}
        {!isLoading && suggestedProducts.length > 0 && (
          <SuggestedRow products={suggestedProducts} onAdd={handleAddProduct} />
        )}
      </div>

      {/* ── OVERLAYS Y MODALES ── */}
      <PremiumCartBar onCheckout={() => setCheckoutOpen(true)} />

      {showAdditionsUpsell && (
        <AdditionsUpsell
          lastAdded={lastAdded}
          additions={productsByCategory["adiciones"] || []}
          onAdd={handleAddProduct}
          onDismiss={() => setShowAdditionsUpsell(false)}
        />
      )}

      <UpsellBanner
        message={upsellMsg}
        onDismiss={() => setUpsellMsg(null)}
        onAccept={handleUpsellAccept}
      />

      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={handleCheckout}
        isLoading={isSubmitting}
      />

      <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />

      <SearchModal 
        open={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        products={products} 
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}