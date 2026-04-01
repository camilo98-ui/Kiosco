import React, { useState, useRef, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PopsyLogo from "@/components/menu/PopsyLogo";
import CategoryNav from "@/components/menu/CategoryNav";
import ProductCard from "@/components/menu/ProductCard";
import CartSheet from "@/components/menu/CartSheet";
import UpsellBanner from "@/components/menu/UpsellBanner";
import CheckoutDialog from "@/components/menu/CheckoutDialog";
import ConfirmationScreen from "@/components/menu/ConfirmationScreen";
import HiddenMenu from "@/components/menu/HiddenMenu";
import { useCart } from "@/lib/cartStore";
import { CATEGORIES, UPSELL_RULES, formatCOP } from "@/lib/constants";
import { Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("combos");
  const [upsellMsg, setUpsellMsg] = useState(null);
  const [upsellTarget, setUpsellTarget] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [hiddenMenuOpen, setHiddenMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedFlash, setAddedFlash] = useState(null); // product id flash
  const upsellTimer = useRef(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);
  const { addItem, cart, clearCart, total } = useCart();

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

  // Best sellers de otras categorías para sugerencias inline
  const suggestedProducts = useMemo(() => {
    return products
      .filter((p) => p.tag === "mas_vendido" && p.category !== activeCategory && p.is_available !== false)
      .slice(0, 4);
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

      // Upsell estratégico: no mostrar si ya hay uno activo
      clearTimeout(upsellTimer.current);
      const rule = UPSELL_RULES[product.category];
      if (rule) {
        // Pequeño delay para que se sienta natural, no inmediato
        upsellTimer.current = setTimeout(() => {
          setUpsellMsg(rule.message);
          setUpsellTarget(rule.targetCategory);
          // Auto-dismiss después de 6 segundos
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

  const categoryProducts = productsByCategory[activeCategory] || [];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#f9f6f7" }}>
      {/* Header fucsia Popsy */}
      <div
        className="sticky top-0 z-20 border-b border-primary/20"
        style={{ background: "hsl(338,82%,44%)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <PopsyLogo onClick={handleLogoClick} />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/80">Helado Gourmet</span>
            <span className="text-lg">🍦</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto" style={{ background: "white" }}>
          <CategoryNav activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>
      </div>

      {/* Hero de categoría activa */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
          >
            {/* Título de sección */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground">
                  {CATEGORIES.find(c => c.id === activeCategory)?.emoji}{" "}
                  {CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h2>
                <p className="text-xs text-muted-foreground">{categoryProducts.filter(p => p.is_available !== false).length} disponibles</p>
              </div>
            </div>

            {/* Productos */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`transition-all duration-150 ${addedFlash === product.id ? "scale-[0.97] opacity-80" : ""}`}
                  >
                    <ProductCard product={product} onAdd={handleAddProduct} />
                  </div>
                ))}
                {categoryProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-10">
                    No hay productos en esta categoría
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Sección de sugerencias estratégicas al final del listado */}
        {!isLoading && suggestedProducts.length > 0 && (
          <div className="mt-6 mb-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black text-foreground">¿Te animas con algo más?</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {suggestedProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAddProduct(p)}
                  className="shrink-0 rounded-2xl p-3 text-left w-32 transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <span className="text-2xl">{p.emoji || "🍦"}</span>
                  <p className="text-xs font-bold mt-1 leading-tight line-clamp-2 text-foreground">{p.name}</p>
                  <p className="text-xs font-black mt-1" style={{ color: "hsl(var(--primary))" }}>
                    {formatCOP(p.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <CartSheet onCheckout={() => setCheckoutOpen(true)} />
      <UpsellBanner message={upsellMsg} onDismiss={() => setUpsellMsg(null)} onAccept={handleUpsellAccept} />
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={handleCheckout} isLoading={isSubmitting} />
      <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />
    </div>
  );
}