import { Download, Trash2 } from 'lucide-react';
import { useExcelStore } from '@shared/store/useExcelStore';
import { exportToExcel } from '@shared/utils/excelParser';
import { Button } from '@shared/components/Button';

export const ExcelExport = () => {
  const excelData = useExcelStore((state) => state.excelData);
  const clearData = useExcelStore((state) => state.clearData);
  
  if (!excelData) return null;
  
  const handleExport = () => {
    const filename = `reporte_procesado_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(excelData, filename);
  };
  
  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todos los datos? Esta acción no se puede deshacer.')) {
      clearData();
    }
  };
  
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Listo para Exportar
        </h3>
        <p className="text-sm text-gray-600">
          Descarga el archivo Excel con todos los cambios aplicados
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Limpiar
        </Button>
        
        <Button
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar Excel
        </Button>
      </div>
    </div>
  );
};


