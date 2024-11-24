import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ExportRequestDetail from './ExportRequestDetail';
import SupplierWarehouseInfo from './SupplierWarehouseInfo';

import exportRequestSelector from '../slice/selector';

const ImportRequestSheet: React.FC = () => {
  const exportRequest: any = useSelector(exportRequestSelector.exportRequest);

  if (!exportRequest) {
    return <div>No export request data available.</div>;
  }

  const {
    productionBatch,
    poDelivery,
    importType,
    planDeliveryDate,
    actualDeliveryDate,
    description
  } = exportRequest;

  return (
    <div className="flex flex-col gap-4 border-2 shadow-sm rounded-xl px-4">
      <div className="font-primary text-3xl flex justify-center items-center font-bold my-5">
        Export Request
      </div>

      <div className="flex flex-col gap-4 md:grid grid-cols-2 w-full">
        <div className="flex flex-col gap-2">
          <div className="font-primary font-semibold text-sm">
            Production Batch:{' '}
            <Link to={'/'} className="text-bluePrimary underline underline-offset-2">
              {productionBatch?.code || 'N/A'}
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-primary font-semibold text-sm">
            Good Export Type: <span className=" text-gray-600">Material For Production</span>
          </div>
        </div>
      </div>
      <div>
        <div className="font-primary font-semibold text-sm">Note</div>
        <Textarea
          placeholder="Note"
          className="w-full h-20 mt-2"
          readOnly
          value={description || ''}
        />
      </div>
      <SupplierWarehouseInfo />
      <ExportRequestDetail />
    </div>
  );
};

export default ImportRequestSheet;
