import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PopsyLogo from "@/components/menu/PopsyLogo";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password, (success) => {
      if (!success) {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <PopsyLogo />
      <div className="mt-8 w-full max-w-sm space-y-4">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 mx-auto text-accent mb-2" />
          <h1 className="text-2xl font-black">Panel de Administración</h1>
          <p className="text-muted-foreground text-sm">Ingresa la contraseña</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Contraseña..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`h-14 text-center text-lg rounded-2xl ${error ? "border-destructive" : ""}`}
            autoFocus
          />
          {error && <p className="text-destructive text-sm text-center">Contraseña incorrecta</p>}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}