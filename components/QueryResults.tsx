// ResultTable.tsx
import React from 'react';

type ResultType = { [key: string]: string | number };

interface ResultTableProps {
  results: ResultType[];
}

const ResultTable: React.FC<ResultTableProps> = ({ results }) => (
  <table>
    <thead>
      <tr>
        {Object.keys(results[0]).map((key, index) => (
          <th key={index}>{key}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {results.map((row: ResultType, rowIndex: number) => (
        <tr key={rowIndex}>
          {Object.values(row).map(
            (value: string | number, valueIndex: number) => (
              <td key={valueIndex}>{value}</td>
            )
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default ResultTable;
