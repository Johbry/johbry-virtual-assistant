/**
 * Utilidades para cálculo de fechas y experiencia
 */

export interface DateDifference {
  years: number;
  months: number;
  formatted: string; // "2 años y 8 meses"
}

/**
 * Calcula la diferencia entre dos fechas en años y meses
 * @param startDate - Fecha de inicio (ej: "2023-09-15")
 * @param endDate - Fecha de fin (ej: "2026-05-26"), por defecto la fecha actual
 * @returns Objeto con años, meses y formato legible
 */
export function calculateExperience(startDate: string, endDate: string = new Date().toISOString().split('T')[0]): DateDifference {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  // Ajustar si los meses son negativos
  if (months < 0) {
    years--;
    months += 12;
  }

  // Ajustar si el día del mes es menor
  if (end.getDate() < start.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  // Generar string formateado
  let formatted = '';
  if (years > 0) {
    formatted += `${years} año${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    if (formatted) formatted += ' y ';
    formatted += `${months} mes${months > 1 ? 'es' : ''}`;
  }
  if (!formatted) {
    formatted = 'menos de 1 mes';
  }

  return {
    years,
    months,
    formatted,
  };
}

/**
 * Formatea una experiencia como "X años y Y meses"
 */
export function formatExperience(years: number, months: number): string {
  let result = '';
  if (years > 0) {
    result += `${years} año${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    if (result) result += ' y ';
    result += `${months} mes${months > 1 ? 'es' : ''}`;
  }
  return result || 'menos de 1 mes';
}
