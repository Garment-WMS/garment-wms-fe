import { MaterialPackage } from './MaterialTypes';

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
}

export interface ProductSize {
  id: string;
  sizeName: string;
  sizeDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
