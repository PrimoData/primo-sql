import React from 'react';

type QueryResultsProps = {
  results: { data: any } | null;
};

const QueryResults: React.FC<QueryResultsProps> = ({ results }) => {
  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {results &&
              results.data &&
              results.data.length > 0 &&
              Object.keys(results.data[0]).map((key, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results &&
            results.data &&
            results.data.map((row: Record<string, unknown>, index: number) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i} className="p-2 whitespace-nowrap text-sm">
                    {String(value).length > 100
                      ? `${String(value).slice(0, 100)}...`
                      : String(value)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueryResults;
