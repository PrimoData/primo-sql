// ResultTable.tsx
import React from 'react';

type ResultType = { [key: string]: string | number };

interface ResultTableProps {
  results: ResultType[];
}

const ResultTable: React.FC<ResultTableProps> = ({ results }) => (
  <div className="overflow-x-auto">
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-200">
          {Object.keys(results[0]).map((key, index) => (
            <th key={index} className="py-2 px-4 border-b">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.map((row: ResultType, rowIndex: number) => (
          <tr key={rowIndex}>
            {Object.values(row).map(
              (value: string | number, valueIndex: number) => (
                <td key={valueIndex} className="py-2 px-4 border-b">
                  {value}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ResultTable;
