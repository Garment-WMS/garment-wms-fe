import { convertToVietnamesePhoneNumber } from '@/helpers/convertPhoneNumber';
import { Supplier } from '@/types/SupplierTypes';

interface KeyValueDisplayProps {
  name: string;
  value: string;
}

interface OrderToDetailsProps {
  supplier: Supplier;
}

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({ name, value }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-600">{name}:</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
};

const OrderToDetails: React.FC<OrderToDetailsProps> = ({ supplier }) => {
  const { supplierName, address, email, phoneNumber, fax } = supplier;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white shadow-lg rounded-md">
      {/* Order By Section */}
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-bold text-primaryDark border-b border-gray-300 pb-2">
          Order By (Your Details)
        </h1>
        <div className="flex flex-col gap-3">
          <KeyValueDisplay name="Warehouse Name" value="WPS Warehouse" />
          <KeyValueDisplay name="Warehouse Email" value="warehouse@gmail.com" />
          <KeyValueDisplay name="Warehouse Address" value="297/24B Bui Dinh Tuy" />
          <KeyValueDisplay
            name="Warehouse mobile number"
            value={convertToVietnamesePhoneNumber('+84 838631706')}
          />
          <KeyValueDisplay
            name="Warehouse Fax number"
            value={convertToVietnamesePhoneNumber('+84 838631706')}
          />
        </div>
      </div>

      {/* Order To Section */}
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-bold text-primaryDark border-b border-gray-300 pb-2">
          Order To (Supplier Details)
        </h1>
        <div className="flex flex-col gap-3">
          <KeyValueDisplay name="Supplier Name" value={supplierName} />
          <KeyValueDisplay name="Supplier Email" value={email} />
          <KeyValueDisplay name="Supplier Address" value={address} />
          <KeyValueDisplay
            name="Supplier mobile number"
            value={convertToVietnamesePhoneNumber(phoneNumber)}
          />
          <KeyValueDisplay name="Supplier Fax number" value={convertToVietnamesePhoneNumber(fax)} />
        </div>
      </div>
    </div>
  );
};

export default OrderToDetails;
