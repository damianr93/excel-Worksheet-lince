export const TableHeader = () => {
  return (
    <thead className="bg-gray-100 border-b border-gray-200">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Código
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">
          Artículo
        </th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-amber-50">
          Comisión (%)
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Importe
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Cantidad
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-blue-50">
          Total
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-green-50">
          $ Comisión
        </th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-purple-50">
          PERC IIBB
        </th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-pink-50">
          RET IIBB
        </th>
      </tr>
    </thead>
  );
};


