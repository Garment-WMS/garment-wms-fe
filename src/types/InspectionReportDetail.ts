import { MaterialPackage } from './MaterialTypes';
import { ProductSize } from './ProductType';

export interface InspectionReportDetail {
  id: string;
  inspectionReportId: string;
  materialPackageId?: string | null;
  productSizeId?: string | null;
  approvedQuantityByPack: number;
  defectQuantityByPack: number;
  quantityByPack?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  materialPackage?: MaterialPackage | null;
  productSize?: ProductSize | null;
  inspectionReportDetailDefect?: any[] | null;
}


