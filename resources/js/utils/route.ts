/**
 * Helper para generar rutas con Inertia/Laravel
 */
export function route(name: string, params?: any, absolute?: boolean): string {
  // Mapeado de rutas de Inertia
  const routeMap: Record<string, string> = {
    // Clientes
    'treasury.clients.index': '/treasury/clients',
    'treasury.clients.create': '/treasury/clients/create',
    'treasury.clients.show': '/treasury/clients/:id',
    'treasury.clients.edit': '/treasury/clients/:id/edit',
    'treasury.clients.destroy': '/treasury/clients/:id',
    
    // Impuestos
    'treasury.clients.taxes.store': '/treasury/clients/:client_id/taxes',
    'treasury.clients.taxes.update': '/treasury/clients/:client_id/taxes/:tax_id',
    'treasury.clients.taxes.destroy': '/treasury/clients/:client_id/taxes/:tax_id',
    
    // Certificados
    'treasury.clients.certificates.store': '/treasury/clients/:client_id/certificates',
    'treasury.clients.certificates.update': '/treasury/clients/:client_id/certificates/:certificate_id',
    'treasury.clients.certificates.destroy': '/treasury/clients/:client_id/certificates/:certificate_id',
  };

  let url = routeMap[name];
  
  if (!url) {
    console.error(`Route "${name}" not found`);
    return '#';
  }

  // Si hay parámetros, reemplazarlos en la URL
  if (params) {
    if (typeof params === 'object') {
      Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
      });
    } else {
      // Si params es un número o string simple (el ID)
      url = url.replace(':id', params.toString());
    }
  }

  return absolute ? `${window.location.origin}${url}` : url;
}
