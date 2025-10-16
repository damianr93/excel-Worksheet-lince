import { ProductRow, ColumnTotals } from '@shared/types/excel.types';

/**
 * Factor fijo aplicado sobre la comisión para calcular la base de retención
 */
export const RET_IIBB_BASE_FACTOR = 0.8;

/**
 * Calcula la retención de ingresos brutos considerando el porcentaje configurable
 */
export const calculateRetIIBB = (comisionMonto: number, percentage: number): number => {
  const normalizedPercentage = Number.isFinite(percentage) ? percentage : 0;
  return comisionMonto * RET_IIBB_BASE_FACTOR * (normalizedPercentage / 100);
};

/**
 * Calcula el monto de comisión basado en el porcentaje y el total
 */
export const calculateComisionMonto = (comisionPorcentaje: number, total: number): number => {
  return (comisionPorcentaje * total) / 100;
};

/**
 * Calcula los totales de todas las columnas numéricas
 */
export const calculateColumnTotals = (productos: ProductRow[]): ColumnTotals => {
  return productos.reduce(
    (acc, producto) => ({
      total: acc.total + producto.total,
      comisionMonto: acc.comisionMonto + producto.comisionMonto,
      percIIBB: acc.percIIBB + producto.percIIBB,
      retIIBB: acc.retIIBB + producto.retIIBB,
    }),
    {
      total: 0,
      comisionMonto: 0,
      percIIBB: 0,
      retIIBB: 0,
    }
  );
};

/**
 * Formatea un número como moneda (peso argentino)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};


