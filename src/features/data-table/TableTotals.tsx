import { ColumnTotals } from '@shared/types/excel.types';
import { formatCurrency } from '@shared/utils/calculations';

interface TableTotalsProps {
  totals: ColumnTotals;
}

export const TableTotals = ({ totals }: TableTotalsProps) => {
  return (
    <tfoot className="bg-gray-800 text-white font-bold">
      <tr>
        <td colSpan={5} className="px-4 py-4 text-right text-sm uppercase tracking-wider">
          TOTALES:
        </td>
        <td className="px-4 py-4 text-right text-base font-mono bg-blue-900">
          {formatCurrency(totals.total)}
        </td>
        <td className="px-4 py-4 text-right text-base font-mono bg-green-900">
          {formatCurrency(totals.comisionMonto)}
        </td>
        <td className="px-4 py-4 text-center text-base font-mono bg-purple-900">
          {formatCurrency(totals.percIIBB)}
        </td>
        <td className="px-4 py-4 text-center text-base font-mono bg-pink-900">
          {formatCurrency(totals.retIIBB)}
        </td>
      </tr>
    </tfoot>
  );
};


