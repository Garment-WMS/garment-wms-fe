// Supplier Type
export interface Supplier {
  id: string;
  supplierName: string;
  representativeName: string;
  code: string;
  address: string;
  email: string;
  phoneNumber: string;
  fax: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}
