import React from 'react';

interface Defect {
  defectType: string;
  quantity: number;
}

interface DefectsSummaryProps {
  defects: Defect[];
}

const DefectsSummary: React.FC<DefectsSummaryProps> = ({ defects }) => {
  const totalDefects = defects.reduce((sum, defect) => sum + defect.quantity, 0);

  return (
    <div className="border p-4 rounded-md shadow-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Defects Summary</h3>
      <ul className="space-y-2">
        {defects.map((defect) => (
          <li key={defect.defectType} className="flex justify-between">
            <span className="font-medium">{defect.defectType}</span>
            <span>{defect.quantity}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t pt-4 text-right font-bold">Total Defects: {totalDefects}</div>
    </div>
  );
};

export default DefectsSummary;
