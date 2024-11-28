import { MaterialVariantResponse } from '@/types/MaterialTypes';
import { PurchaseOrderResponse } from '@/types/PurchaseOrder';
import axios from 'axios';

const backend_url = import.meta.env.VITE_LOCALHOST_URL as string;

export const getallMaterialVariant: {
  (): Promise<MaterialVariantResponse>;
} = async () => {
  const res = await axios.get(`${backend_url}/material-variant`);

  return res.data;
};
