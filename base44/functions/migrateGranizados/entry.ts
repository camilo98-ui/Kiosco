import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Obtener todos los productos de especialidades
    const especialidades = await base44.entities.Product.filter({ category: "especialidades" }, null, 200);
    
    // Filtrar granizados por nombre
    const granizados = especialidades.filter(p => 
      p.name.toLowerCase().includes('granizado')
    );

    // Actualizar la categoría de cada granizado
    for (const granizado of granizados) {
      await base44.entities.Product.update(granizado.id, { category: "granizados" });
    }

    return Response.json({ 
      success: true, 
      message: `${granizados.length} granizados movidos a la nueva categoría`,
      products: granizados.map(p => p.name)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});