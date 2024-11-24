import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../slice/selector';
import exportRequestSelector from '../slice/selector';

type Props = {};
const WarehouseInfo = {
  name: 'Garment Official warehouse',
  address: ' 429TL8 Street, Phuoc Vinh An ward, Cu Chi District, Ho Chi Minh city, Viet Nam',
  phone: '+84838631706',
  email: 'garmentwarehousef@gmail.com',
  fax: '833-367-0171'
};
const SupplierWarehouseInfo = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 md:grid grid-cols-2 w-full">
      {/* Manufacturer Section */}
      <div className="flex flex-col gap-4">
        <div className="font-primary font-bold text-2xl mb-4">Manufacturer</div>
        <div className="flex flex-col gap-4">
          <div className="font-primary font-semibold text-sm">
            Manufacturer name:{' '}
            <span className="text-gray-600">Garment Official Factory Ward 7</span>
          </div>
          <div className="font-primary font-semibold text-sm">
            Address:{' '}
            <span className="text-gray-600">
              99 Industrial Zone, Tan Phu Ward, District 7, Ho Chi Minh City, Vietnam
            </span>
          </div>
          <div className="font-primary font-semibold text-sm">
            Phone: <span className="text-gray-600">+84838631706</span>
          </div>
          <div className="font-primary font-semibold text-sm">
            Email: <span className="text-gray-600">garmentfactory@gmail.com</span>
          </div>
          <div className="font-primary font-semibold text-sm">
            Fax: <span className="text-gray-600">833-987-6543</span>
          </div>
        </div>
      </div>

      {/* Warehouse Section */}
      <div className="flex flex-col gap-4">
        <div className="font-primary font-bold text-2xl mb-4">Warehouse</div>
        <div className="flex flex-col gap-4">
          <div className="font-primary font-semibold text-sm">
            Warehouse name: <span className="text-gray-600">{WarehouseInfo.name}</span>
          </div>
          <div className="font-primary font-semibold text-sm">
            Address: <span className="text-gray-600">{WarehouseInfo.address}</span>
          </div>
          <div className="font-primary font-semibold text-sm">
            Phone: <span className="text-gray-600">{WarehouseInfo.phone}</span>
          </div>
          <div className="font-primary font-semibold text-sm">
            Email: <span className="text-gray-600">{WarehouseInfo.email}</span>
          </div>
          <div className="font-primary font-semibold text-sm">
            Fax: <span className="text-gray-600">{WarehouseInfo.fax}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierWarehouseInfo;
