import { useExcelStore } from '@shared/store/useExcelStore';
import { ProductRow } from './ProductRow';
import { TableHeader } from './TableHeader';
import { TableTotals } from './TableTotals';
import { calculateColumnTotals } from '@shared/utils/calculations';

export const DataTable = () => {
  const excelData = useExcelStore((state) => state.excelData);
  
  if (!excelData) return null;
  
  const totals = calculateColumnTotals(excelData.productos);
  
  return (
    <div className="space-y-6">
      {/* Información del reporte */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{excelData.empresa}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Informe:</span>
            <span className="ml-2 text-gray-600">{excelData.informe}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Desde:</span>
            <span className="ml-2 text-gray-600">{excelData.periodo.desde}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Hasta:</span>
            <span className="ml-2 text-gray-600">{excelData.periodo.hasta}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Vendedor:</span>
            <span className="ml-2 text-gray-600">{excelData.filtros.vendedor}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Zona:</span>
            <span className="ml-2 text-gray-600">{excelData.filtros.zona}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Nivel:</span>
            <span className="ml-2 text-gray-600">{excelData.filtros.nivel}</span>
          </div>
        </div>
      </div>
      
      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody className="divide-y divide-gray-200">
              {excelData.productos.map((producto) => (
                <ProductRow key={producto.id} producto={producto} />
              ))}
            </tbody>
            <TableTotals totals={totals} />
          </table>
        </div>
      </div>
    </div>
  );
};


