import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function CheckoutDialog({ open, onClose, onConfirm, isLoading }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onConfirm(name.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-sm rounded-3xl border-border/60"
        style={{ background: "hsl(230,25%,11%)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center text-foreground">
            ¿Cómo te llamas? 🍦
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Para llamarte cuando tu pedido esté listo
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            placeholder="Tu nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-14 text-lg rounded-2xl text-center font-bold bg-muted border-border text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <Button
            type="submit"
            disabled={!name.trim() || isLoading}
            className="w-full h-14 text-base font-black rounded-2xl glow-yellow"
            style={{
              background: name.trim()
                ? "linear-gradient(135deg, hsl(42,100%,52%) 0%, hsl(32,100%,52%) 100%)"
                : undefined,
              color: name.trim() ? "hsl(230,25%,8%)" : undefined
            }}
          >
            {isLoading ? (
              "Enviando..."
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                ¡Confirmar pedido! 🎊
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}