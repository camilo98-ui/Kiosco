// Custom hook para manejar descuentos en productos repetidos (2da malteada, 2do litro)

export function useDiscountRules(items) {
  const DISCOUNT_2ND_MALTEADA = 0.15; // 15% en la 2da malteada
  const DISCOUNT_2ND_LITRO = 0.20;    // 20% en el 2do litro

  const calculateTotalWithDiscounts = () => {
    const malteadaCount = items.filter(item => item.product_name?.includes("Malteada")).length;
    const litroCount = items.filter(item => item.product_name?.includes("Litro") || item.product_name?.includes("litro")).length;

    let total = 0;
    let malteadaIndex = 0;
    let litroIndex = 0;

    items.forEach(item => {
      if (item.product_name?.includes("Malteada")) {
        malteadaIndex++;
        if (malteadaIndex === 2 && malteadaCount >= 2) {
          // 2da malteada con descuento
          total += item.price * (1 - DISCOUNT_2ND_MALTEADA);
        } else {
          total += item.price;
        }
      } else if (item.product_name?.includes("Litro") || item.product_name?.includes("litro")) {
        litroIndex++;
        if (litroIndex === 2 && litroCount >= 2) {
          // 2do litro con descuento
          total += item.price * (1 - DISCOUNT_2ND_LITRO);
        } else {
          total += item.price;
        }
      } else {
        total += item.price;
      }
    });

    return total;
  };

  const getItemDiscount = (item, index) => {
    const allItemsOfType = items.filter(i => 
      (item.product_name?.includes("Malteada") && i.product_name?.includes("Malteada")) ||
      ((item.product_name?.includes("Litro") || item.product_name?.includes("litro")) && 
       (i.product_name?.includes("Litro") || i.product_name?.includes("litro")))
    );

    if (item.product_name?.includes("Malteada") && index === 1 && allItemsOfType.length >= 2) {
      return { percentage: 15, amount: Math.round(item.price * 0.15) };
    }
    if ((item.product_name?.includes("Litro") || item.product_name?.includes("litro")) && index === 1 && allItemsOfType.length >= 2) {
      return { percentage: 20, amount: Math.round(item.price * 0.20) };
    }
    return null;
  };

  return { calculateTotalWithDiscounts, getItemDiscount };
}