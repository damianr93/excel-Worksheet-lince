import { ProductRow as ProductRowType } from '@shared/types/excel.types';
import { useExcelStore } from '@shared/store/useExcelStore';
import { formatCurrency, formatNumber } from '@shared/utils/calculations';

interface ProductRowProps {
  producto: ProductRowType;
}

export const ProductRow = ({ producto }: ProductRowProps) => {
  const updateProduct = useExcelStore((state) => state.updateProduct);
  
  const handleInputChange = (field: keyof ProductRowType, value: string) => {
    const numericValue = parseFloat(value) || 0;
    updateProduct(producto.id, { [field]: numericValue });
  };
  
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-900 font-mono">
        {producto.codigo}
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">
        {producto.articulo}
      </td>
      <td className="px-4 py-3 bg-amber-50">
        <input
          type="number"
          value={producto.comision}
          onChange={(e) => handleInputChange('comision', e.target.value)}
          className="w-full px-2 py-1 text-sm text-center border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="0"
          step="0.01"
          min="0"
        />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 text-right font-mono">
        {formatCurrency(producto.importe)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 text-right font-mono">
        {formatNumber(producto.cantidad)}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right font-mono bg-blue-50">
        {formatCurrency(producto.total)}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-green-700 text-right font-mono bg-green-50">
        {formatCurrency(producto.comisionMonto)}
      </td>
      <td className="px-4 py-3 bg-purple-50">
        <input
          type="number"
          value={producto.percIIBB}
          onChange={(e) => handleInputChange('percIIBB', e.target.value)}
          className="w-full px-2 py-1 text-sm text-center border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="0"
          step="0.01"
          min="0"
        />
      </td>
      <td className="px-4 py-3 bg-pink-50">
        <div className="w-full px-2 py-1 text-sm text-right font-mono text-pink-700">
          {formatCurrency(producto.retIIBB)}
        </div>
      </td>
    </tr>
  );
};


