import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useCart } from "@/lib/cartStore";
import { useStore } from "@/lib/storeContext";
import { CATEGORIES, UPSELL_RULES, formatCOP } from "@/lib/constants";
import { Search, Loader2, ChevronRight, ArrowLeft, MapPin } from "lucide-react";
import StoreSelector from "@/components/StoreSelector";
import RatingScreen from "@/components/RatingScreen";
import PopsyLogo from "@/components/menu/PopsyLogo";
import SearchModal from "@/components/menu/SearchModal";
import PromoBanners from "@/components/menu/PromoBanners";
import EditorialLayout from "@/components/menu/EditorialLayout";
import SuggestedRow from "@/components/menu/SuggestedRow";
import PremiumCartBar from "@/components/menu/PremiumCartBar";
import CategoryGrid from "@/components/menu/CategoryGrid";
import UpsellBanner from "@/components/menu/UpsellBanner";
import CheckoutDialog from "@/components/menu/CheckoutDialog";
import ConfirmationScreen from "@/components/menu/ConfirmationScreen";
import HiddenMenu from "@/components/menu/HiddenMenu";
import HeaderLine from "@/components/menu/HeaderLine";
import CombosCarousel from "@/components/menu/CombosCarousel";
import CombosAllModal from "@/components/menu/CombosAllModal";
import MostOrderedAll from "@/components/menu/MostOrderedAll";
import WaterUpsell from "@/components/menu/WaterUpsell";
import CuantosSon from "@/components/menu/CuantosSon";
import ParaLlevarUpsell from "@/components/menu/ParaLlevarUpsell";

const FAMILY_GRADIENTS = [
"linear-gradient(135deg, #6D1B4E, #B5175A)",
"linear-gradient(135deg, #7B3A00, #C97B30)",
"linear-gradient(135deg, #3A2000, #7B5A1A)",
"linear-gradient(135deg, #1A3A6D, #2A6DB5)",
"linear-gradient(135deg, #1A2A1A, #2E7D32)"];


const ITEM_BG = [
"linear-gradient(135deg, #6D1B4E, #B5175A)",
"linear-gradient(135deg, #7B3A00, #C97B30)",
"linear-gradient(135deg, #1A3A6D, #2A6DB5)",
"linear-gradient(135deg, #1A2A1A, #2E7D32)",
"linear-gradient(135deg, #3A2000, #7B5A1A)"];


const FAMILY_CARDS = [
{ id: "malteadas", label: "Malteadas", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/7f68abf79_image.png" },
{ id: "helados", label: "Helados", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2c9474e0e_Helados.png" },
{ id: "combos", label: "Cookie Jar", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/6dd912084_cookie-jaar-img.jpg" },
{ id: "granizados", label: "Granizados 🧊", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/923ba973b_images2.jpg" },
{ id: "especialidades", label: "Especiales", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/dda55ee2f_Especialidades.png" },
{ id: "cafe", label: "Café", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/e15d81047_Coffee.png" },
{ id: "bebidas", label: "Otras bebidas", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/26de2b565_image.png" },
{ id: "para_llevar", label: "Para llevar", image: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/fa4c65c0f_ComboLitrodeheladoBrownie8Und.png" }];


function CategoryIcons({ activeCategory, onSelect }) {
  return (
    <div style={{ background: "transparent", padding: "18px 16px 16px" }}>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#2D1A22", margin: "0 0 14px", letterSpacing: "0.5px" }}>Categorías</p>
      <div style={{ display: "flex", overflowX: "auto", gap: 18, scrollbarWidth: "none", paddingBottom: 2 }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              
              <div style={{
                width: 70, height: 70, borderRadius: "50%",
                background: isActive ? "#FFF0F5" : "#F5F5F5",
                border: isActive ? "2.5px solid #B5175A" : "2px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, transition: "all 0.15s ease"
              }}>
                {cat.emoji}
              </div>
              <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? "#B5175A" : "#8A7880", whiteSpace: "nowrap" }}>
                {cat.label}
              </span>
            </button>);

        })}
      </div>
    </div>);

}

function FamilyCarousel({ productCounts, onSelect }) {
  return (
    <div style={{ background: "transparent", padding: "10px 0 14px", marginTop: 2 }}>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#2D1A22", margin: "0 0 12px 16px", letterSpacing: "0.5px" }}>¿Qué se te antoja? 😏</p>
      <CategoryGrid categories={FAMILY_CARDS} productCounts={productCounts} onSelect={onSelect} />
    </div>);

}

function MostOrderedItem({ product, idx, onAdd, onSelectCategory }) {
  const [imgError, setImgError] = useState(false);
  const handleClick = () => {
    // Navegar a la categoría del producto para que el customizer funcione
    onSelectCategory(product.category, product);
  };
  return (
    <button
      onClick={handleClick}
      style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "none", borderBottom: "1px solid #F5EAEF", padding: "14px 16px", cursor: "pointer", textAlign: "left", width: "100%", WebkitTapHighlightColor: "transparent" }}>
      
      <div style={{ width: 52, height: 52, borderRadius: 14, background: ITEM_BG[idx % ITEM_BG.length], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
        {product.image_url && !imgError ?
        <img src={product.image_url} alt={product.name} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> :

        <span style={{ fontSize: 24 }}>{product.emoji || "🍦"}</span>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1A0A10", margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        <p style={{ fontSize: 11, color: "#BBA8B0", margin: "2px 0 0" }}>
          {CATEGORIES.find((c) => c.id === product.category)?.label} · {formatCOP(product.price)}
        </p>
      </div>
      <ChevronRight size={16} color="#DDD" style={{ flexShrink: 0 }} />
    </button>);

}

function MostOrdered({ products, onAdd, onShowAll, onSelectCategory }) {
  const top = useMemo(() =>
  [...products].filter((p) => p.tag === "mas_vendido" && p.is_available !== false).slice(0, 8),
  [products]
  );
  if (top.length === 0) return null;
  return (
    <div style={{ background: "transparent", marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px 4px" }}>
      <p style={{ fontSize: 16, fontWeight: 600, color: "#2D1A22", margin: 0, letterSpacing: "0.5px" }}>Los favoritos de todos 🔥</p>
      <button onClick={onShowAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#D81B60", letterSpacing: "0.3px" }}>Ver todo</button>
      </div>
      {top.map((product, idx) =>
      <MostOrderedItem key={product.id} product={product} idx={idx} onAdd={onAdd} onSelectCategory={onSelectCategory} />
      )}
      <div style={{ height: 8 }} />
    </div>);

}

function CategoryView({ activeCategory, categoryProducts, suggestedProducts, onAdd, addedFlash, onBack, searchOpen, setSearchOpen, products, onAddProduct, checkoutOpen, setCheckoutOpen, handleCheckout, isSubmitting, hiddenMenuOpen, setHiddenMenuOpen, upsellMsg, setUpsellMsg, handleUpsellAccept, showParaLlevarUpsell, handleUpsellSkip, handleUpsellAddAndPay, autoOpenProduct, onAutoOpenDone }) {
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    // Solo registrar si viene del borde izquierdo estricto (< 30px)
    if (e.touches[0].clientX < 30) {
      touchStartX.current = e.touches[0].clientX;
    } else {
      touchStartX.current = null;
    }
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 60) onBack();
    touchStartX.current = null;
  };

  return (
    <div className="min-h-screen" style={{ background: "#FFFCFD" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="sticky top-0 z-20 flex items-center justify-between px-3" style={{ height: 56, background: "linear-gradient(90deg, #C41E6A 0%, #C41E6A 55%, #FF6EB4 100%)" }}>
        <button onClick={onBack} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={20} color="#fff" />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
          {CATEGORIES.find((c) => c.id === activeCategory)?.label}
        </span>
        <div style={{ width: 44 }} />
      </div>
      <div className="pb-36 pt-2">
        <EditorialLayout products={categoryProducts} category={activeCategory} onAdd={onAdd} addedFlash={addedFlash} autoOpenProduct={autoOpenProduct} onAutoOpenDone={onAutoOpenDone} />
        {suggestedProducts.length > 0 && <SuggestedRow products={suggestedProducts} onAdd={onAdd} />}
      </div>
      <PremiumCartBar onCheckout={() => setCheckoutOpen(true)} />
      <UpsellBanner message={upsellMsg} onDismiss={() => setUpsellMsg(null)} onAccept={handleUpsellAccept} />
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={handleCheckout} isLoading={isSubmitting} />
      <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} products={products} onAddProduct={onAddProduct} />
      <ParaLlevarUpsell open={showParaLlevarUpsell} onSkip={handleUpsellSkip} onAddAndPay={handleUpsellAddAndPay} />
    </div>);

}

export default function Menu() {
  useSwipeNavigation();
  const { store, selectStore, loading: storeLoading } = useStore();
  const [activeCategory, setActiveCategory] = useState(null);
  const [upsellMsg, setUpsellMsg] = useState(null);
  const [upsellTarget, setUpsellTarget] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [hiddenMenuOpen, setHiddenMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedFlash, setAddedFlash] = useState(null);
  const [lastAdded, setLastAdded] = useState(null);
  const [showMostOrdered, setShowMostOrdered] = useState(false);
  const [showCombosAll, setShowCombosAll] = useState(false);
  const [pendingCheckoutName, setPendingCheckoutName] = useState(null);
  const [autoOpenProduct, setAutoOpenProduct] = useState(null);
  const [showParaLlevarUpsell, setShowParaLlevarUpsell] = useState(false);
  const [upsellSeenThisSession, setUpsellSeenThisSession] = useState(false);
  const [nextOrderNum, setNextOrderNum] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const upsellTimer = useRef(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);
  const { addItem, cart, clearCart, total, itemCount } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("sort_order", 200),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });

  useEffect(() => {
    const preloadNextOrderNum = async () => {
      const settings = await base44.entities.Settings.filter({ key: "next_order_number" });
      setNextOrderNum(parseInt(settings[0]?.value || "101"));
    };
    preloadNextOrderNum();

    const handleOpenCombosModal = () => setShowCombosAll(true);
    document.addEventListener("openCombosModal", handleOpenCombosModal);
    return () => document.removeEventListener("openCombosModal", handleOpenCombosModal);
  }, []);

  const productsByCategory = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => map[c.id] = []);
    products.forEach((p) => {if (map[p.category]) map[p.category].push(p);});
    return map;
  }, [products]);

  const productCounts = useMemo(() => {
    const map = {};
    products.forEach((p) => {map[p.category] = (map[p.category] || 0) + 1;});
    return map;
  }, [products]);

  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    return (productsByCategory[activeCategory] || []).filter((p) => p.is_available !== false);
  }, [productsByCategory, activeCategory]);

  const suggestedProducts = useMemo(() => {
    return products.filter((p) => p.tag === "mas_vendido" && p.category !== activeCategory && p.is_available !== false).slice(0, 6);
  }, [products, activeCategory]);

  const handleAddProduct = useCallback((product, notes = "") => {
    const finalNotes = notes || product.notes || "";
    const productToAdd = {
      product_id: product.product_id || product.id,
      product_name: product.product_name || product.name || product.title,
      price: product.price,
      quantity: 1,
      notes: finalNotes
    };
    addItem(productToAdd, finalNotes);
    setAddedFlash(product.product_id || product.id);
    setTimeout(() => setAddedFlash(null), 600);
    setLastAdded(productToAdd);

    // Animación del carrito + toast
    const cartIcon = document.querySelector('[data-cart-icon]');
    if (cartIcon) {
      cartIcon.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.4)' },
      { transform: 'scale(1)' }],
      { duration: 400, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
    }

    // Toast feedback
    toast.success(`✓ ${productToAdd.product_name} agregado al pedido`, {
      style: {
        background: "#C41E6A",
        color: "#fff",
        border: "none",
        borderRadius: "12px"
      },
      duration: 1800
    });

    const rule = UPSELL_RULES[product.category];
    if (rule && product.category === "adiciones") {
      upsellTimer.current = setTimeout(() => {
        setUpsellMsg(rule.message);
        setUpsellTarget(rule.targetCategory);
        setTimeout(() => setUpsellMsg(null), 6000);
      }, 800);
    }
  }, [addItem]);

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      setHiddenMenuOpen(true);
    } else {
      logoClickTimer.current = setTimeout(() => {logoClickCount.current = 0;}, 2000);
    }
  };

  const handleUpsellAccept = useCallback(() => {
    if (upsellTarget) setActiveCategory(upsellTarget);
    setUpsellMsg(null);
  }, [upsellTarget]);

  const hasLitroInCart = useCallback(() => {
    return cart.some((item) =>
    item.product_name?.toLowerCase().includes("litro") ||
    item.product_id?.toString().startsWith("litro-")
    );
  }, [cart]);

  const handleCheckoutStart = useCallback((name) => {
    setCheckoutOpen(false);
    // Mostrar upsell solo si: no visto esta sesión y no tiene litro ya
    if (!upsellSeenThisSession && !hasLitroInCart()) {
      setPendingCheckoutName(name);
      setShowParaLlevarUpsell(true);
      setUpsellSeenThisSession(true);
    } else {
      doCheckout(name, [], total);
    }
  }, [total, upsellSeenThisSession, hasLitroInCart]);

  const doCheckout = async (name, extraItems = [], passedTotal = 0) => {
    const cartSnapshot = [...cart, ...extraItems];
    const orderTotal = passedTotal || cartSnapshot.reduce((s, i) => s + i.price * i.quantity, 0);
    const currentNum = nextOrderNum || 101;

    clearCart();
    // Mostrar ticket inmediatamente
    setConfirmedOrder({
      order_number: currentNum,
      customer_name: name,
      items: cartSnapshot,
      total: orderTotal,
      id: `temp-${Date.now()}`
    });
    // Show rating after a short delay
    setTimeout(() => setShowRating(true), 1200);
    setPendingCheckoutName(null);
    setIsSubmitting(false);

    // Guardar orden en background sin esperar
    const settings = await base44.entities.Settings.filter({ key: "next_order_number" });
    const settingsId = settings[0]?.id;
    Promise.all([
    base44.entities.Order.create({
      order_number: currentNum,
      customer_name: name,
      items: cartSnapshot.map((i) => ({ product_id: i.product_id, product_name: i.product_name, price: i.price, quantity: i.quantity, notes: i.notes })),
      total: orderTotal,
      status: "pendiente"
    }),
    settingsId && base44.entities.Settings.update(settingsId, { value: String(currentNum + 1) })]
    ).catch(() => {});
    setNextOrderNum(currentNum + 1);
  };

  const handleCheckout = handleCheckoutStart;

  const handleUpsellSkip = useCallback(() => {
    setShowParaLlevarUpsell(false);
    doCheckout(pendingCheckoutName, [], total);
    setPendingCheckoutName(null);
  }, [pendingCheckoutName, total]);

  const handleUpsellAddAndPay = useCallback((litroItem) => {
    setShowParaLlevarUpsell(false);
    doCheckout(pendingCheckoutName, [litroItem], total + litroItem.price);
    setPendingCheckoutName(null);
  }, [pendingCheckoutName, total]);

  const handleEditOrder = (order) => {
    // Restaurar el carrito con los items del pedido confirmado
    clearCart();
    order.items.forEach((item) => addItem(item, item.notes || ""));
    setConfirmedOrder(null);
    // Resetear el upsell para que no bloquee el nuevo checkout
    setUpsellSeenThisSession(false);
  };

  // Store selector screen
  if (!storeLoading && !store) {
    return <StoreSelector onSelect={selectStore} />;
  }

  if (confirmedOrder && showRating) {
    return (
      <RatingScreen
        order={confirmedOrder}
        store={store}
        onDone={() => {setShowRating(false);setConfirmedOrder(null);}} />);


  }

  if (confirmedOrder) {
    return <ConfirmationScreen order={confirmedOrder} onNewOrder={() => {setConfirmedOrder(null);setShowRating(false);}} onEditOrder={handleEditOrder} />;
  }

  if (activeCategory === "granizados") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#FFFCFD", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🧊</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 8px" }}>
          Granizados
        </h2>
        <p style={{ fontSize: 15, color: "#666", textAlign: "center", margin: "0 0 24px", lineHeight: 1.5 }}>
          Encuentra nuestros granizados en la sección<br />
          <strong>Para llevar 🛍️</strong>
        </p>
        <button
          onClick={() => setActiveCategory("para_llevar")}
          style={{
            background: "#C41E6A", color: "#fff",
            border: "none", borderRadius: 16, padding: "14px 32px",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(196,30,106,0.35)",
            fontFamily: "'Poppins', sans-serif"
          }}>
          
          Ir a Para llevar →
        </button>
        <button
          onClick={() => setActiveCategory(null)}
          style={{ marginTop: 16, background: "none", border: "none", color: "#999", fontSize: 14, cursor: "pointer" }}>
          
          ← Volver al inicio
        </button>
      </div>);

  }

  if (activeCategory) {
    const allowedCategories = ["helados", "malteadas", "especialidades", "cafe", "bebidas", "galletas", "paletas_packs", "para_llevar", "tortas", "regalos", "combos"];
    if (!allowedCategories.includes(activeCategory)) {
      setActiveCategory(null);
      return null;
    }
    return (
      <CategoryView
        activeCategory={activeCategory}
        categoryProducts={categoryProducts}
        suggestedProducts={suggestedProducts}
        onAdd={handleAddProduct}
        addedFlash={addedFlash}
        onBack={() => setActiveCategory(null)}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        products={products}
        onAddProduct={handleAddProduct}
        checkoutOpen={checkoutOpen}
        setCheckoutOpen={setCheckoutOpen}
        handleCheckout={handleCheckout}
        isSubmitting={isSubmitting}
        hiddenMenuOpen={hiddenMenuOpen}
        setHiddenMenuOpen={setHiddenMenuOpen}
        upsellMsg={upsellMsg}
        setUpsellMsg={setUpsellMsg}
        handleUpsellAccept={handleUpsellAccept}
        showParaLlevarUpsell={showParaLlevarUpsell}
        handleUpsellSkip={handleUpsellSkip}
        handleUpsellAddAndPay={handleUpsellAddAndPay}
        autoOpenProduct={autoOpenProduct}
        onAutoOpenDone={() => setAutoOpenProduct(null)} />);


  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F7" }}>
      {/* ── HEADER ── */}
      <div
        className="sticky top-0 z-20"
        style={{ background: "linear-gradient(180deg, rgba(216, 27, 96, 0.95) 0%, rgba(216, 27, 96, 0.92) 100%)", overflow: "hidden", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        
        <HeaderLine hasCart={itemCount > 0} />
        {/* Fila logo + ubicación + buscador */}
        <div className="flex items-center" style={{ height: 48, paddingLeft: 12, paddingRight: 12, gap: 12, alignItems: "center" }}>
          {/* Logo pequeño */}
          <button onClick={handleLogoClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", outline: "none", flexShrink: 0 }}>
            <img src="https://media.base44.com/images/public/69cc99522394d529d2756aa4/ada5108ff_Captura_de_pantalla_2026-04-17_132506-removebg-preview.png" alt="Popsy" style={{ height: 42, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </button>
          
          {/* Ubicación */}
          <button onClick={() => selectStore(null)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRight: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
            <MapPin size={13} color="#fff" strokeWidth={1.5} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", fontFamily: "'Poppins', sans-serif", fontWeight: 500, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.3px" }}>
              {store?.address || store?.name || "Tienda"}
            </span>
          </button>

          {/* Buscador Glassmorphism */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              flex: 1, display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
              borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)",
              padding: "6px 12px", cursor: "pointer", textAlign: "left", minWidth: 0
            }}>
            <Search size={12} color="rgba(255,255,255,0.7)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "'Poppins', sans-serif", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "0.2px" }}>
              Búsqueda rápida
            </span>
          </button>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div style={{ paddingBottom: 120 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ background: "transparent", padding: "12px 0 8px" }}>
          <PromoBanners onCategorySelect={setActiveCategory} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} style={{ marginTop: 0 }}>
          <FamilyCarousel productCounts={productCounts} onSelect={setActiveCategory} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <CombosCarousel onAdd={handleAddProduct} onOpenAll={() => setShowCombosAll(true)} />
        </motion.div>
        {isLoading ?
        <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C41E6A" }} />
          </div> :

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
            <MostOrdered products={products} onAdd={handleAddProduct} onShowAll={() => setShowMostOrdered(true)} onSelectCategory={(cat, product) => {setActiveCategory(cat);if (product) setAutoOpenProduct(product);}} />
          </motion.div>
        }
      </div>

      {/* ── OVERLAYS ── */}
      <PremiumCartBar onCheckout={() => setCheckoutOpen(true)} />
      <UpsellBanner message={upsellMsg} onDismiss={() => setUpsellMsg(null)} onAccept={handleUpsellAccept} />
      <CheckoutDialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={handleCheckout} isLoading={isSubmitting} />
      <HiddenMenu open={hiddenMenuOpen} onClose={() => setHiddenMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} products={products} onAddProduct={handleAddProduct} />
      <ParaLlevarUpsell
        open={showParaLlevarUpsell}
        onSkip={handleUpsellSkip}
        onAddAndPay={handleUpsellAddAndPay} />
      
      <CombosAllModal open={showCombosAll} onClose={() => setShowCombosAll(false)} onAdd={handleAddProduct} />
      {showMostOrdered &&
      <MostOrderedAll products={products} onAdd={(p) => {handleAddProduct(p);setShowMostOrdered(false);}} onBack={() => setShowMostOrdered(false)} />
      }
    </div>);

}