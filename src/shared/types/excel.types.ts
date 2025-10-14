/**
 * Tipos compartidos para el manejo de datos de Excel
 */

export interface ProductRow {
  id: string;
  codigo: string;
  articulo: string;
  importe: number;
  cantidad: number;
  total: number;
  comision: number; // Porcentaje de comisión
  comisionMonto: number; // $ comision calculado automáticamente
  percIIBB: number;
  retIIBB: number;
}

export interface ExcelData {
  empresa: string;
  informe: string;
  periodo: {
    desde: string;
    hasta: string;
  };
  filtros: {
    zona: string;
    vendedor: string;
    cliente: string;
    nivel: string;
    rubro: string;
    subRubro: string;
    marca: string;
    tipoProducto: string;
  };
  productos: ProductRow[];
}

export interface ColumnTotals {
  total: number;
  comisionMonto: number;
  percIIBB: number;
  retIIBB: number;
}


