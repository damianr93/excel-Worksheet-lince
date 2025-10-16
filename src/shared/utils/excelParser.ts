import * as XLSX from 'xlsx';
import { ExcelData, ProductRow } from '@shared/types/excel.types';
import { applyCommissionRules } from '@shared/utils/commissionRules';

/**
 * Parsea un archivo Excel XLS/XLSX y extrae los datos estructurados
 */
export const parseExcelFile = (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Obtener la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir a JSON (array de arrays)
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '',
          raw: false 
        });
        
        // Extraer informaciÃ³n del reporte
        const excelData = extractExcelData(jsonData);
        resolve(excelData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extrae y estructura los datos del array parseado
 */
const extractExcelData = (data: any[][]): ExcelData => {
  // Extraer empresa (primera fila)
  const empresa = data[0]?.[0] || '';
  
  // Buscar dinÃ¡micamente las filas de informaciÃ³n
  const findInfoRow = (keyword: string): any => {
    for (let i = 0; i < Math.min(15, data.length); i++) {
      const row = data[i];
      for (let j = 0; j < row.length; j++) {
        if (String(row[j]).toLowerCase().includes(keyword.toLowerCase())) {
          return row[j + 1] || row[j + 2] || '';
        }
      }
    }
    return '';
  };
  
  // Extraer informaciÃ³n del reporte de forma dinÃ¡mica
  const informe = findInfoRow('Informe');
  const desde = findInfoRow('Desde');
  const hasta = findInfoRow('Hasta');
  
  // Extraer filtros
  const filtros = {
    zona: findInfoRow('Zona'),
    vendedor: findInfoRow('Vendedor'),
    cliente: findInfoRow('Cliente'),
    nivel: findInfoRow('Nivel'),
    rubro: findInfoRow('Rubro'),
    subRubro: findInfoRow('SubRubro'),
    marca: findInfoRow('Marca'),
    tipoProducto: findInfoRow('Tipo Producto'),
  };
  
  // Encontrar la fila de encabezados (debe tener ArtÃ­culo, Importe, Cantidad Y Total)
  let headerRowIndex = -1;
  let headerRow: any[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Contar cuÃ¡ntos headers importantes tiene esta fila
    let headerCount = 0;
    const hasArticulo = row.some((cell: any) => {
      const cellStr = String(cell).toLowerCase().trim();
      return cellStr.includes('artÃ­culo') || cellStr.includes('articulo') || cellStr === 'art';
    });
    const hasImporte = row.some((cell: any) => {
      const cellStr = String(cell).toLowerCase().trim();
      return cellStr === 'importe' || cellStr.includes('importe');
    });
    const hasCantidad = row.some((cell: any) => {
      const cellStr = String(cell).toLowerCase().trim();
      return cellStr === 'cantidad' || cellStr.includes('cantidad');
    });
    const hasTotal = row.some((cell: any) => {
      const cellStr = String(cell).toLowerCase().trim();
      return cellStr === 'total';
    });
    
    if (hasArticulo) headerCount++;
    if (hasImporte) headerCount++;
    if (hasCantidad) headerCount++;
    if (hasTotal) headerCount++;
    
    // Solo aceptar si tiene al menos 3 de los 4 headers principales
    if (headerCount >= 3) {
      headerRowIndex = i;
      headerRow = row;
      break;
    }
  }
  
  // Mapear las posiciones de las columnas importantes
  const columnMap = {
    importe: -1,
    cantidad: -1,
    total: -1,
  };
  
  if (headerRowIndex !== -1) {
    headerRow.forEach((cell: any, index: number) => {
      const cellStr = String(cell).toLowerCase().trim();
      
      if (cellStr.includes('importe')) {
        columnMap.importe = index;
      }
      if (cellStr.includes('cantidad')) {
        columnMap.cantidad = index;
      }
      if (cellStr === 'total' || cellStr.includes('total')) {
        columnMap.total = index;
      }
    });
  }
  
  // Extraer productos
  const productos: ProductRow[] = [];
  
  if (headerRowIndex !== -1) {
    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i];
      
      // Detener si encontramos la fila de totales o una fila vacÃ­a
      if (!row || row.length === 0) {
        break;
      }
      
      const firstCell = String(row[0] || '').trim().toLowerCase();
      if (firstCell.includes('totales') || firstCell.includes('total')) {
        break;
      }
      
      // Extraer datos del producto
      const codigo = String(row[0] || '').trim();
      const articulo = String(row[1] || '').trim();
      
      // Skip si no hay cÃ³digo o artÃ­culo
      if (!codigo || !articulo || codigo === '' || articulo === '') {
        continue;
      }
      
      // Parsear nÃºmeros usando el mapa de columnas
      const importe = columnMap.importe !== -1 ? parseNumber(row[columnMap.importe]) : 0;
      const cantidad = columnMap.cantidad !== -1 ? parseNumber(row[columnMap.cantidad]) : 0;
      const total = columnMap.total !== -1 ? parseNumber(row[columnMap.total]) : 0;
      
      const baseProduct: ProductRow = {
        id: `${codigo}-${i}`,
        codigo,
        articulo,
        importe,
        cantidad,
        total,
        comision: 0,
        comisionMonto: 0,
        percIIBB: 0,
        retIIBB: 0,
      };

      productos.push(applyCommissionRules(baseProduct));
    }
  }
  
  return {
    empresa,
    informe,
    periodo: { desde, hasta },
    filtros,
    productos,
  };
};

/**
 * Parsea un nÃºmero que puede venir con separadores de miles y comas decimales
 * La librerÃ­a xlsx ya convierte a formato estÃ¡ndar (punto decimal), pero
 * mantenemos soporte para mÃºltiples formatos por si acaso
 */
const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  const stringValue = String(value).trim();
  
  // Contar puntos y comas para determinar el formato
  const dotCount = (stringValue.match(/\./g) || []).length;
  const commaCount = (stringValue.match(/,/g) || []).length;
  
  // Si no tiene puntos ni comas, es un nÃºmero simple
  if (dotCount === 0 && commaCount === 0) {
    return parseFloat(stringValue) || 0;
  }
  
  // Si tiene ambos (. y ,), determinar cuÃ¡l es decimal
  if (dotCount > 0 && commaCount > 0) {
    // El Ãºltimo separador es el decimal
    const lastDot = stringValue.lastIndexOf('.');
    const lastComma = stringValue.lastIndexOf(',');
    
    if (lastComma > lastDot) {
      // Formato europeo: 1.234.567,89 -> coma es decimal
      const cleaned = stringValue.replace(/\./g, '').replace(',', '.');
      return parseFloat(cleaned) || 0;
    } else {
      // Formato inglÃ©s: 1,234,567.89 -> punto es decimal
      const cleaned = stringValue.replace(/,/g, '');
      return parseFloat(cleaned) || 0;
    }
  }
  
  // Si solo tiene puntos
  if (dotCount > 0) {
    if (dotCount === 1) {
      // Un solo punto: es decimal (formato estÃ¡ndar de xlsx)
      return parseFloat(stringValue) || 0;
    } else {
      // MÃºltiples puntos: son separadores de miles (formato europeo)
      const cleaned = stringValue.replace(/\./g, '');
      return parseFloat(cleaned) || 0;
    }
  }
  
  // Si solo tiene comas
  if (commaCount > 0) {
    if (commaCount === 1) {
      // Una sola coma: puede ser decimal europeo
      const cleaned = stringValue.replace(',', '.');
      return parseFloat(cleaned) || 0;
    } else {
      // MÃºltiples comas: son separadores de miles (formato inglÃ©s)
      const cleaned = stringValue.replace(/,/g, '');
      return parseFloat(cleaned) || 0;
    }
  }
  
  return 0;
};

/**
 * Exporta los datos procesados a un archivo Excel
 */
export const exportToExcel = (excelData: ExcelData, filename: string = 'reporte_procesado.xlsx') => {
  // Crear array de datos para el Excel
  const worksheetData: any[][] = [];
  
  // Agregar informaciÃ³n del reporte
  worksheetData.push([excelData.empresa]);
  worksheetData.push(['', '', 'Informe:', excelData.informe]);
  worksheetData.push(['', '', 'Desde:', excelData.periodo.desde]);
  worksheetData.push(['', '', 'Hasta:', excelData.periodo.hasta]);
  worksheetData.push(['', '', 'Zona:', excelData.filtros.zona]);
  worksheetData.push(['', '', 'Vendedor:', excelData.filtros.vendedor]);
  worksheetData.push(['', '', 'Cliente:', excelData.filtros.cliente]);
  worksheetData.push(['', '', 'Nivel:', excelData.filtros.nivel]);
  worksheetData.push(['', '', 'Rubro:', excelData.filtros.rubro]);
  worksheetData.push(['', '', 'SubRubro:', excelData.filtros.subRubro]);
  worksheetData.push(['', '', 'Marca:', excelData.filtros.marca]);
  worksheetData.push(['', '', 'Tipo Producto:', excelData.filtros.tipoProducto]);
  
  // Agregar encabezados
  worksheetData.push([
    'ArtÃ­culo',
    '',
    '',
    '',
    '',
    '',
    'Importe',
    'ComisiÃ³n (%)',
    'Cantidad',
    'Total',
    '$ ComisiÃ³n',
    '',
    'PERC IIBB',
    '',
    'RET IIBB'
  ]);
  
  // Agregar productos
  excelData.productos.forEach(producto => {
    worksheetData.push([
      producto.codigo,
      producto.articulo,
      '',
      '',
      '',
      '',
      producto.importe,
      producto.comision,
      producto.cantidad,
      producto.total,
      producto.comisionMonto,
      '',
      producto.percIIBB,
      '',
      producto.retIIBB
    ]);
  });
  
  // Calcular totales
  const totales = excelData.productos.reduce(
    (acc, prod) => ({
      total: acc.total + prod.total,
      comisionMonto: acc.comisionMonto + prod.comisionMonto,
      percIIBB: acc.percIIBB + prod.percIIBB,
      retIIBB: acc.retIIBB + prod.retIIBB,
    }),
    { total: 0, comisionMonto: 0, percIIBB: 0, retIIBB: 0 }
  );
  
  // Agregar fila de totales
  worksheetData.push([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'TOTALES:',
    '',
    totales.total,
    totales.comisionMonto,
    '',
    totales.percIIBB,
    '',
    totales.retIIBB
  ]);
  
  // Crear workbook y worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
  
  // Exportar archivo
  XLSX.writeFile(workbook, filename);
};


