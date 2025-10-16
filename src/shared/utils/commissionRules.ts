import { ProductRow } from '@shared/types/excel.types';
import { calculateComisionMonto, calculateRetIIBB } from './calculations';

export const DEFAULT_RET_IIBB_PERCENTAGE = 1.25;

const PRODUCT_COMMISSION_MAP: Record<string, number> = {
  '10180': 18,
  '10542': 18,
  '10771': 18,
  '10773': 18,
  '10724': 7,
  '10215': 10,
  '10745': 50,
  '10756': 7,
  '10535': 7,
};

const normalizeProductCode = (code: string): string => {
  const raw = String(code ?? '').trim();
  if (!raw) {
    return '';
  }

  const digitsOnly = raw.replace(/\D/g, '');
  return digitsOnly.length > 0 ? digitsOnly : raw;
};

export const getCommissionByProductCode = (code: string): number => {
  const normalizedCode = normalizeProductCode(code);
  const commission = PRODUCT_COMMISSION_MAP[normalizedCode];
  return typeof commission === 'number' ? commission : 0;
};

interface ApplyCommissionOptions {
  retIIBBPercentage?: number;
  enforceMappedCommission?: boolean;
}

export const applyCommissionRules = (
  product: ProductRow,
  options: ApplyCommissionOptions = {}
): ProductRow => {
  const mappedCommission = getCommissionByProductCode(product.codigo);
  const enforceMappedCommission = options.enforceMappedCommission ?? true;

  let effectiveCommission = product.comision || 0;

  if (mappedCommission > 0) {
    if (enforceMappedCommission || effectiveCommission === 0) {
      effectiveCommission = mappedCommission;
    }
  }

  const comisionMonto = calculateComisionMonto(effectiveCommission, product.total);
  const retIIBBPercentage = options.retIIBBPercentage ?? DEFAULT_RET_IIBB_PERCENTAGE;
  const retIIBB = calculateRetIIBB(comisionMonto, retIIBBPercentage);

  return {
    ...product,
    comision: effectiveCommission,
    comisionMonto,
    retIIBB,
  };
};