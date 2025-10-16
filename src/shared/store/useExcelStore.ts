import { create } from 'zustand';
import { ExcelData, ProductRow } from '@shared/types/excel.types';
import { applyCommissionRules, DEFAULT_RET_IIBB_PERCENTAGE } from '@shared/utils/commissionRules';
import { calculateComisionMonto, calculateRetIIBB } from '@shared/utils/calculations';

interface ExcelStore {
  excelData: ExcelData | null;
  setExcelData: (data: ExcelData) => void;
  updateProduct: (id: string, updates: Partial<ProductRow>) => void;
  retIIBBPercentage: number;
  setRetIIBBPercentage: (percentage: number) => void;
  clearData: () => void;
}

export const useExcelStore = create<ExcelStore>((set, get) => ({
  excelData: null,
  retIIBBPercentage: DEFAULT_RET_IIBB_PERCENTAGE,
  
  setRetIIBBPercentage: (percentage) => {
    const normalized = Number.isFinite(percentage) ? percentage : 0;
    
    set((state) => {
      if (!state.excelData) {
        return { retIIBBPercentage: normalized };
      }
      
      const productos = state.excelData.productos.map((producto) => {
        const comisionMonto = calculateComisionMonto(producto.comision, producto.total);
        const retIIBB = calculateRetIIBB(comisionMonto, normalized);
        
        return {
          ...producto,
          comisionMonto,
          retIIBB,
        };
      });
      
      return {
        retIIBBPercentage: normalized,
        excelData: {
          ...state.excelData,
          productos,
        },
      };
    });
  },
  
  setExcelData: (data) =>
    set(() => {
      const retention = get().retIIBBPercentage;
      
      return {
        excelData: {
          ...data,
          productos: data.productos.map((producto) =>
            applyCommissionRules(producto, {
              retIIBBPercentage: retention,
            })
          ),
        },
      };
    }),
  
  updateProduct: (id, updates) =>
    set((state) => {
      if (!state.excelData) return state;
      
      const retention = state.retIIBBPercentage;
      const productos = state.excelData.productos.map((producto) => {
        if (producto.id === id) {
          const updatedProduct = { ...producto, ...updates };
          
          if ('comision' in updates || 'total' in updates) {
            updatedProduct.comisionMonto = calculateComisionMonto(
              updatedProduct.comision,
              updatedProduct.total
            );
          }
          
          updatedProduct.retIIBB = calculateRetIIBB(updatedProduct.comisionMonto, retention);
          
          return updatedProduct;
        }
        return producto;
      });
      
      return {
        excelData: {
          ...state.excelData,
          productos,
        },
      };
    }),
  
  clearData: () => set({ excelData: null }),
}));


