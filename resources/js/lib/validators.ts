/**
 * Valida el formato de un CUIT argentino (XX-XXXXXXXX-X)
 */
export function validateCuitFormat(cuit: string): boolean {
  const cuitRegex = /^\d{2}-\d{8}-\d$/;
  return cuitRegex.test(cuit);
}

/**
 * Valida el dígito verificador de un CUIT
 */
export function validateCuitChecksum(cuit: string): boolean {
  const cleanCuit = cuit.replace(/-/g, '');
  
  if (cleanCuit.length !== 11) {
    return false;
  }

  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    suma += parseInt(cleanCuit[i]) * multiplicadores[i];
  }

  const resto = suma % 11;
  const digitoVerificador = resto === 0 ? 0 : 11 - resto;

  return digitoVerificador === parseInt(cleanCuit[10]);
}

/**
 * Formatea un CUIT agregando los guiones
 */
export function formatCuit(cuit: string): string {
  const cleaned = cuit.replace(/\D/g, '');
  
  if (cleaned.length !== 11) {
    return cuit;
  }

  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10)}`;
}

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que una fecha sea posterior a otra
 */
export function isDateAfter(date: string | Date, compareDate: string | Date): boolean {
  const d1 = new Date(date);
  const d2 = new Date(compareDate);
  return d1 > d2;
}
