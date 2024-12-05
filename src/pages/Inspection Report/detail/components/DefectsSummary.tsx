import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/Badge';
import EmptyDataComponent from '@/components/common/EmptyData';
import { InspectionReportDetail } from '@/types/InspectionReportDetail';

interface Defect {
  id: string;
  description: string;
  quantity: number;
}

interface DefectsSummaryProps {
  defects: Defect[];
  inspectionReportDetail: any;
}

const DefectsSummary: React.FC<DefectsSummaryProps> = ({ defects, inspectionReportDetail }) => {
  const totalDefects = defects.reduce((sum, defect) => sum + defect.quantity, 0);

  // Generate consistent colors for defects based on their IDs
  const colors = [
    'text-red-600',
    'text-green-600',
    'text-blue-600',
    'text-yellow-600',
    'text-purple-600',
    'text-orange-600'
  ];

  const defectColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    defects.forEach((defect, index) => {
      const color = colors[index % colors.length];
      colorMap.set(defect.id, color);
    });
    return colorMap;
  }, [defects]);

  const getColorForDefect = (defectId: string) => {
    return defectColors.get(defectId) || 'text-gray-600';
  };

  const isMaterial = !!inspectionReportDetail.materialPackage;
  const itemDetails = isMaterial
    ? inspectionReportDetail.materialPackage
    : inspectionReportDetail.productSize;

  const name = isMaterial
    ? itemDetails.name
    : `${itemDetails.productVariant.name} - ${itemDetails.size}`;

  const code = isMaterial ? itemDetails.code : itemDetails.code;

  const uom = isMaterial
    ? itemDetails.materialVariant.material.materialUom.name
    : itemDetails.productVariant.product.productUom.name;

  const image = isMaterial ? itemDetails?.materialVariant.image : itemDetails?.productVariant.image;

  return (
    <div className="space-y-6 max-h-[90vh] overflow-y-auto">
      {/* Inspection Report Detail Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-40 h-40 flex-shrink-0">
              <img src={image} alt={name} className="w-full h-full object-cover rounded-md" />
            </div>
            <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <p className="text-sm font-semibold">{name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Code:</span>
                <p className="text-sm font-semibold">{code || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Total Quantity:</span>
                <p className="text-sm font-semibold">
                  {inspectionReportDetail.quantityByPack ||
                    inspectionReportDetail.approvedQuantityByPack +
                      inspectionReportDetail.defectQuantityByPack ||
                    0}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Approved:</span>
                <p className="text-sm font-semibold text-green-600">
                  {inspectionReportDetail.approvedQuantityByPack || 0}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Defect:</span>
                <p className="text-sm font-semibold text-red-600">
                  {inspectionReportDetail.defectQuantityByPack || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Defects Details Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Defects Details</CardTitle>
        </CardHeader>
        <CardContent>
          {defects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defects.map((defect) => (
                  <TableRow
                    key={defect.id}
                    className="hover:bg-accent transition-colors duration-150">
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={`font-medium cursor-pointer ${getColorForDefect(defect.id)}`}>
                              {defect.description.length > 20
                                ? `${defect.description.slice(0, 20)}...`
                                : defect.description}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{defect.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {defect.quantity || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {totalDefects > 0
                        ? `${Math.round((defect.quantity / totalDefects) * 100)}%`
                        : '0%'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyDataComponent />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DefectsSummary;
