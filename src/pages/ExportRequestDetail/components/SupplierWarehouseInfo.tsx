import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../slice/selector';
import exportRequestSelector from '../slice/selector';

type Props = {};
const WarehouseInfo = {
  name: 'Warehouse 1',
  address: '123, abc, xyz',
  phone: '1234567890',
  email: 'warehouse@gmail.com',
  fax: '1234567890'
};
const SupplierWarehouseInfo = (props: Props) => {
  const importRequest: ImportRequest = useSelector(exportRequestSelector.exportRequest);
  let supplier = importRequest?.poDelivery?.purchaseOrder.supplier;
  return (
    <div
      className="
        flex flex-col gap-4
        md:grid grid-cols-2 w-full">
      <div className="flex flex-col gap-4">
        <div className="font-primary font-bold text-2xl mb-4">Supplier</div>

        {/* <SuppierForm/> */}
        <div className="flex flex-col gap-4">
          <div className="font-primary font-semibold text-sm">
            Supplier name: {supplier?.supplierName}
          </div>
          <div className="font-primary font-semibold text-sm">Address: {supplier?.address}</div>
          <div className="font-primary font-semibold text-sm">Phone: {supplier?.phoneNumber}</div>
          <div className="font-primary font-semibold text-sm">Email: {supplier?.email}</div>
          <div className="font-primary font-semibold text-sm">Fax: {supplier?.fax}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="font-primary font-bold text-2xl mb-4">Warehouse</div>
        <div className="flex flex-col gap-4">
          <div className="font-primary font-semibold text-sm">
            Warehouse name: {WarehouseInfo.name}
          </div>
          <div className="font-primary font-semibold text-sm">Address: {WarehouseInfo.address}</div>
          <div className="font-primary font-semibold text-sm">Phone: {WarehouseInfo.phone}</div>
          <div className="font-primary font-semibold text-sm">Email: {WarehouseInfo.email}</div>
          <div className="font-primary font-semibold text-sm">Fax: {WarehouseInfo.fax}</div>
        </div>
      </div>
    </div>
  );
};

export default SupplierWarehouseInfo;
