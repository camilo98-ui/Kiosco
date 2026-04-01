import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatCOP, CATEGORIES } from "@/lib/constants";
import { Save, Search } from "lucide-react";
import { toast } from "sonner";

export default function ProductManager() {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => base44.entities.Product.list("sort_order", 200),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto actualizado");
    },
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    products: filtered.filter((p) => p.category === cat.id),
  })).filter((g) => g.products.length > 0);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-2xl"
        />
      </div>

      {grouped.map((group) => (
        <div key={group.id}>
          <h3 className="font-bold text-sm text-muted-foreground mb-2">
            {group.emoji} {group.label}
          </h3>
          <div className="space-y-2">
            {group.products.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-xl border border-border p-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  {editingId === product.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="h-8 w-28 text-sm"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        className="h-8 rounded-lg"
                        onClick={() => {
                          updateProduct.mutate({
                            id: product.id,
                            data: { price: parseInt(editPrice) },
                          });
                          setEditingId(null);
                        }}
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(product.id);
                        setEditPrice(String(product.price));
                      }}
                      className="text-primary font-bold text-sm hover:underline"
                    >
                      {formatCOP(product.price)}
                    </button>
                  )}
                </div>
                <Switch
                  checked={product.is_available !== false}
                  onCheckedChange={(checked) =>
                    updateProduct.mutate({
                      id: product.id,
                      data: { is_available: checked },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}