import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import AdminLogin from "@/components/admin/AdminLogin";
import ProductManager from "@/components/admin/ProductManager";
import OrderHistory from "@/components/admin/OrderHistory";
import AdminStats from "@/components/admin/AdminStats";
import RatingsPanel from "@/components/admin/RatingsPanel";
import PopsyLogo from "@/components/menu/PopsyLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { data: settings = [] } = useQuery({
    queryKey: ["settings"],
    queryFn: () => base44.entities.Settings.filter({ key: "admin_password" }),
  });

  const handleLogin = (password, callback) => {
    const adminPass = settings[0]?.value || "popsy2024";
    if (password === adminPass) {
      setAuthenticated(true);
      callback(true);
    } else {
      callback(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  if (!authenticated) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <PopsyLogo size="small" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-accent">ADMIN</span>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <Tabs defaultValue="stats">
          <TabsList className="w-full rounded-2xl bg-muted mb-4 flex-wrap gap-1">
            <TabsTrigger value="stats" className="flex-1 rounded-xl">📊 Stats</TabsTrigger>
            <TabsTrigger value="products" className="flex-1 rounded-xl">🍦 Productos</TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 rounded-xl">📋 Pedidos</TabsTrigger>
            <TabsTrigger value="ratings" className="flex-1 rounded-xl">⭐ Reseñas</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>
          <TabsContent value="products">
            <ProductManager />
          </TabsContent>
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
          <TabsContent value="ratings">
            <RatingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}