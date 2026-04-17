import React, { createContext, useContext, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [store, setStore] = useState(null); // null = not selected yet
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Check URL param first
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("tienda");

      if (slug) {
        try {
          const stores = await base44.entities.Store.filter({ slug });
          if (stores[0]) {
            setStore(stores[0]);
            setLoading(false);
            return;
          }
        } catch (e) {}
      }

      // Check session storage
      const saved = sessionStorage.getItem("popsy_store");
      if (saved) {
        try {
          setStore(JSON.parse(saved));
          setLoading(false);
          return;
        } catch (e) {}
      }

      // Check if there's only 1 store — auto-select
      try {
        const stores = await base44.entities.Store.filter({ is_active: true });
        if (stores.length === 1) {
          setStore(stores[0]);
          sessionStorage.setItem("popsy_store", JSON.stringify(stores[0]));
        }
      } catch (e) {}

      setLoading(false);
    };

    init();
  }, []);

  const selectStore = (s) => {
    setStore(s);
    sessionStorage.setItem("popsy_store", JSON.stringify(s));
  };

  return (
    <StoreContext.Provider value={{ store, selectStore, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}