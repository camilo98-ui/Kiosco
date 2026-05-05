/**
 * DirectCustomizer — abre el customizer correcto para un producto
 * sin navegar ni renderizar ninguna lista. Se monta en el home.
 */
import { useEffect, useCallback } from "react";
import MalteadaCustomizer from "@/components/menu/MalteadaCustomizer";
import MalteadaCustomizer12oz from "@/components/menu/MalteadaCustomizer12oz";
import BananaSplitCustomizer from "@/components/menu/BananaSplitCustomizer";
import HeladoCustomizer from "@/components/menu/HeladoCustomizer";
import HeladoJuniorCustomizer from "@/components/menu/HeladoJuniorCustomizer";
import MaxiConoCustomizer from "@/components/menu/MaxiConoCustomizer";
import GranizadoCustomizer from "@/components/menu/GranizadoCustomizer";
import ConeCustomizer from "@/components/menu/ConeCustomizer";
import GenericCustomizer from "@/components/menu/GenericCustomizer";
import EspecialidadesCustomizer from "@/components/menu/EspecialidadesCustomizer";
import HeladoFioreCustomizer from "@/components/menu/HeladoFioreCustomizer";
import GalletaMediumHelladoCustomizer from "@/components/menu/GalletaMediumHelladoCustomizer";
import BrownieHeladoSalsaCustomizer from "@/components/menu/BrownieHeladoSalsaCustomizer";
import CharlieBrownieCustomizer from "@/components/menu/CharlieBrownieCustomizer";
import SkilletGalletaSupremaCustomizer from "@/components/menu/SkilletGalletaSupremaCustomizer";
import SkilletGalletaCombinada from "@/components/menu/SkilletGalletaCombinada";
import SkilletGalletaMedianaCustomizer from "@/components/menu/SkilletGalletaMedianaCustomizer";
import SundaeSalsaCustomizer from "@/components/menu/SundaeSalsaCustomizer";
import ParaLlevarCustomizer from "@/components/menu/ParaLlevarCustomizer";
import { useState } from "react";

export default function DirectCustomizer({ product, onAdd, onDone }) {
  const [state, setState] = useState({
    malteada: null,
    malteada12oz: null,
    bananaSplit: null,
    helado: null,
    heladoJunior: null,
    maxiCono: null,
    granizado: null,
    cono: null,
    generic: null,
    especialidades: null,
    fiore: null,
    galletaHld: null,
    brownieHld: null,
    charlieBrownie: null,
    skilletSuprema: null,
    skilletCombinada: null,
    skilletMediana: null,
    sundae: null,
    paraLlevar: null,
  });

  const clear = (key) => setState(prev => ({ ...prev, [key]: null }));
  const hasOpen = Object.values(state).some(Boolean);

  // Cuando todos los modales cierran, notificar al padre
  useEffect(() => {
    if (!hasOpen) return;
    // no-op — se notifica en onClose individual
  }, [hasOpen]);

  const handleClose = (key) => {
    clear(key);
    onDone?.();
  };

  const handleAdd = (productWithPrice, notes) => {
    onAdd(productWithPrice, notes);
  };

  useEffect(() => {
    if (!product) return;

    let p = product;
    const name = p.name?.toLowerCase() || "";
    const cat = p.category;

    // Patch imágenes de sundae
    if (name.includes("sundae 1 sabor")) {
      p = { ...p, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/2df60753e_Sundae1sabor10900.png" };
    } else if (name.includes("sundae 2 sabor")) {
      p = { ...p, image_url: "https://media.base44.com/images/public/69cc99522394d529d2756aa4/4ec8da0eb_Sundae2sabores14900.png" };
    }

    if (cat === "para_llevar") {
      setState(prev => ({ ...prev, paraLlevar: p }));
    } else if (name.includes("charlie brownie") || name.includes("charly brownie")) {
      setState(prev => ({ ...prev, charlieBrownie: p }));
    } else if (name.includes("skillet") && name.includes("galleta suprema")) {
      setState(prev => ({ ...prev, skilletSuprema: p }));
    } else if (name.includes("skillet") && name.includes("galleta combinada")) {
      setState(prev => ({ ...prev, skilletCombinada: p }));
    } else if (name.includes("skillet") && name.includes("galleta mediana")) {
      setState(prev => ({ ...prev, skilletMediana: p }));
    } else if (name.includes("helado fiore")) {
      setState(prev => ({ ...prev, fiore: p }));
    } else if (name.includes("galleta mediana") && name.includes("hld")) {
      setState(prev => ({ ...prev, galletaHld: p }));
    } else if (name.includes("brownie con helado")) {
      setState(prev => ({ ...prev, brownieHld: p }));
    } else if (name.includes("copa gelarti pops") || name.includes("sundae 1 sabor") || name.includes("sundae 2 sabor")) {
      setState(prev => ({ ...prev, sundae: p }));
    } else if (cat === "malteadas") {
      if (name.includes("12oz")) {
        setState(prev => ({ ...prev, malteada12oz: p }));
      } else {
        setState(prev => ({ ...prev, malteada: p }));
      }
    } else if (cat === "especialidades" && name.includes("banana split")) {
      setState(prev => ({ ...prev, bananaSplit: p }));
    } else if (cat === "especialidades") {
      setState(prev => ({ ...prev, especialidades: p }));
    } else if (cat === "helados" && (name.includes("maxi cono") || name.includes("maxicono"))) {
      setState(prev => ({ ...prev, maxiCono: p }));
    } else if (cat === "helados" && (name.includes("junior") || name.includes("jr"))) {
      setState(prev => ({ ...prev, heladoJunior: p }));
    } else if (cat === "helados") {
      setState(prev => ({ ...prev, helado: p }));
    } else if (cat === "granizados" && name.includes("granizado")) {
      setState(prev => ({ ...prev, granizado: p }));
    } else if (name.includes("cono") && !name.includes("maxi")) {
      setState(prev => ({ ...prev, cono: p }));
    } else if (cat === "combos") {
      setState(prev => ({ ...prev, generic: p }));
    } else {
      // Sin customizer — agregar directo
      onAdd(p);
      onDone?.();
    }
  }, [product?.id]);

  return (
    <>
      <MalteadaCustomizer product={state.malteada} open={!!state.malteada} onClose={() => handleClose("malteada")} onAdd={handleAdd} />
      <MalteadaCustomizer12oz product={state.malteada12oz} open={!!state.malteada12oz} onClose={() => handleClose("malteada12oz")} onAdd={handleAdd} />
      <BananaSplitCustomizer product={state.bananaSplit} open={!!state.bananaSplit} onClose={() => handleClose("bananaSplit")} onAdd={handleAdd} />
      <HeladoCustomizer product={state.helado} open={!!state.helado} onClose={() => handleClose("helado")} onAdd={handleAdd} />
      <HeladoJuniorCustomizer product={state.heladoJunior} open={!!state.heladoJunior} onClose={() => handleClose("heladoJunior")} onAdd={handleAdd} />
      <MaxiConoCustomizer product={state.maxiCono} open={!!state.maxiCono} onClose={() => handleClose("maxiCono")} onAdd={handleAdd} />
      <GranizadoCustomizer product={state.granizado} open={!!state.granizado} onClose={() => handleClose("granizado")} onAdd={handleAdd} />
      <ConeCustomizer product={state.cono} open={!!state.cono} onClose={() => handleClose("cono")} onAdd={handleAdd} />
      <GenericCustomizer product={state.generic} open={!!state.generic} onClose={() => handleClose("generic")} onAdd={handleAdd} />
      <EspecialidadesCustomizer product={state.especialidades} open={!!state.especialidades} onClose={() => handleClose("especialidades")} onAdd={handleAdd} />
      <HeladoFioreCustomizer product={state.fiore} open={!!state.fiore} onClose={() => handleClose("fiore")} onAdd={handleAdd} />
      <GalletaMediumHelladoCustomizer product={state.galletaHld} open={!!state.galletaHld} onClose={() => handleClose("galletaHld")} onAdd={handleAdd} />
      <BrownieHeladoSalsaCustomizer product={state.brownieHld} open={!!state.brownieHld} onClose={() => handleClose("brownieHld")} onAdd={handleAdd} />
      <CharlieBrownieCustomizer product={state.charlieBrownie} open={!!state.charlieBrownie} onClose={() => handleClose("charlieBrownie")} onAdd={handleAdd} />
      <SkilletGalletaSupremaCustomizer product={state.skilletSuprema} open={!!state.skilletSuprema} onClose={() => handleClose("skilletSuprema")} onAdd={handleAdd} />
      <SkilletGalletaCombinada product={state.skilletCombinada} open={!!state.skilletCombinada} onClose={() => handleClose("skilletCombinada")} onAdd={handleAdd} />
      <SkilletGalletaMedianaCustomizer product={state.skilletMediana} open={!!state.skilletMediana} onClose={() => handleClose("skilletMediana")} onAdd={handleAdd} />
      <SundaeSalsaCustomizer product={state.sundae} open={!!state.sundae} onClose={() => handleClose("sundae")} onAdd={handleAdd} />
      <ParaLlevarCustomizer product={state.paraLlevar} open={!!state.paraLlevar} onClose={() => handleClose("paraLlevar")} onAdd={handleAdd} />
    </>
  );
}