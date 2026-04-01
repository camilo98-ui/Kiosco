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
import { CATEGORIES, UPSELL_RULES } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("combos");
  const [upsellMsg, setUpsellMsg] = useState(null);
  const [upsellTarget, setUpsellTarget] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [hiddenMenuOpen, setHiddenMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const rule = UPSELL_RULES[product.category];
      if (rule) {
        setUpsellMsg(rule.message);
        setUpsellTarget(rule.targetCategory);
        setTimeout(() => setUpsellMsg(null), 5000);
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <PopsyLogo onClick={handleLogoClick} />
        </div>
        <div className="max-w-2xl mx-auto">
          <CategoryNav activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>
      </div>

      {/* Products */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {(productsByCategory[activeCategory] || []).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAddProduct} />
            ))}
            {(productsByCategory[activeCategory] || []).length === 0 && (
              <p className="text-center text-muted-foreground py-10">
                No hay productos en esta categoría
              </p>
            )}
          </div>
        )}

        {/* Also ordered section */}
        {activeCategory !== "adiciones" && (
          <div className="mt-8">
            <h3 className="font-bold text-sm text-muted-foreground mb-3">
              🛒 Clientes también piden
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {products
                .filter((p) => p.tag === "mas_vendido" && p.category !== activeCategory && p.is_available !== false)
                .slice(0, 5)
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleAddProduct(p)}
                    className="shrink-0 bg-card border border-border rounded-2xl p-3 text-left w-36 hover:border-primary/30 transition-all"
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <p className="text-xs font-semibold mt-1 leading-tight line-clamp-2">{p.name}</p>
                    <p className="text-xs text-primary font-bold mt-1">
                      {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p.price)}
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