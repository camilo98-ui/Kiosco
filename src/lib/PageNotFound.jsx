import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <span className="text-8xl mb-4">🍦</span>
      <h1 className="text-4xl font-black mb-2">¡Oops!</h1>
      <p className="text-muted-foreground mb-6">Esta página se derritió... 😅</p>
      <Link to="/">
        <Button className="rounded-2xl h-12 px-6 font-bold bg-primary hover:bg-primary/90">
          <Home className="w-4 h-4 mr-2" />
          Volver al menú
        </Button>
      </Link>
    </div>
  );
}