import { FileSpreadsheet } from 'lucide-react';
import { useExcelStore } from '@shared/store/useExcelStore';
import { ExcelUpload } from '@features/excel-upload/ExcelUpload';
import { DataTable } from '@features/data-table/DataTable';
import { ExcelExport } from '@features/excel-export/ExcelExport';

function App() {
  const excelData = useExcelStore((state) => state.excelData);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Excel Mica Reporte
              </h1>
              <p className="text-sm text-gray-600">
                Workspace para procesamiento de reportes
              </p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {!excelData ? (
            <div className="max-w-2xl mx-auto">
              <ExcelUpload />
            </div>
          ) : (
            <>
              <ExcelExport />
              <DataTable />
            </>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Sistema de procesamiento de reportes • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;


