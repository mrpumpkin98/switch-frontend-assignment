import React from "react";

interface TableColumn {
   key: string;
   label: string;
   className?: string;
}

interface TableProps {
   columns: TableColumn[];
   data: Record<string, any>[];
   renderCell?: (column: TableColumn, row: Record<string, any>, rowIndex: number) => React.ReactNode;
   className?: string;
}

export default function Table({ columns, data, renderCell, className = "" }: TableProps) {
   return (
      <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}>
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
               <tr>
                  {columns.map((column) => (
                     <th
                        key={column.key}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${column.className || ""}`}
                     >
                        {column.label}
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
               {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                     {columns.map((column) => (
                        <td
                           key={column.key}
                           className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${column.className || ""}`}
                        >
                           {renderCell
                              ? renderCell(column, row, rowIndex)
                              : row[column.key]}
                        </td>
                     ))}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

