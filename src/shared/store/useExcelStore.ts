import { create } from 'zustand';
import { ExcelData, ProductRow } from '@shared/types/excel.types';

interface ExcelStore {
  excelData: ExcelData | null;
  setExcelData: (data: ExcelData) => void;
  updateProduct: (id: string, updates: Partial<ProductRow>) => void;
  clearData: () => void;
}

export const useExcelStore = create<ExcelStore>((set) => ({
  excelData: null,
  
  setExcelData: (data) => set({ excelData: data }),
  
  updateProduct: (id, updates) =>
    set((state) => {
      if (!state.excelData) return state;
      
      const productos = state.excelData.productos.map((producto) => {
        if (producto.id === id) {
          const updatedProduct = { ...producto, ...updates };
          
          // Recalcular $ comision automáticamente si cambia la comisión o el total
          if ('comision' in updates || 'total' in updates) {
            updatedProduct.comisionMonto = (updatedProduct.comision * updatedProduct.total) / 100;
          }
          
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


