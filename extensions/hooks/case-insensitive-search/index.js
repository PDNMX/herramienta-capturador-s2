module.exports = function registerHook({ filter }) {
  // Modificar filtros para hacer las búsquedas case-insensitive
  filter('filter:items:*', async (payload, meta, context) => {
    if (!payload || !payload.filter) return payload;
    
    // Función recursiva para procesar los filtros
    function processFilters(filter) {
      for (const key in filter) {
        if (typeof filter[key] === 'object' && filter[key] !== null) {
          processFilters(filter[key]);
        } else if (key === '_contains' || key === '_starts_with' || key === '_ends_with') {
          // Añadir opción para búsqueda insensible a mayúsculas/minúsculas
          const newKey = `${key}_ic`; // _ic = insensitive case
          filter[newKey] = filter[key];
          delete filter[key];
        }
      }
      return filter;
    }
    
    payload.filter = processFilters(payload.filter);
    return payload;
  });
  
  return {
    id: 'case-insensitive-search',
    handler: () => {},
    description: 'Makes searches case-insensitive and accent-insensitive',
  };
};
