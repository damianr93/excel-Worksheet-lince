import { useRef, useState, type ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '@shared/utils/excelParser';
import { useExcelStore } from '@shared/store/useExcelStore';
import { Button } from '@shared/components/Button';

export const ExcelUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setExcelData = useExcelStore((state) => state.setExcelData);
  
  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
      setError('Por favor, selecciona un archivo Excel válido (.xls o .xlsx)');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parseExcelFile(file);
      setExcelData(data);
    } catch (err) {
      setError('Error al procesar el archivo. Por favor, verifica que sea un archivo Excel válido.');
      console.error(err);
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <FileSpreadsheet className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Cargar Archivo Excel
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
          Selecciona el archivo XLS del sistema para comenzar a trabajar
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          onClick={handleButtonClick}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {isLoading ? 'Procesando...' : 'Seleccionar Archivo'}
        </Button>
      </div>
      
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};


