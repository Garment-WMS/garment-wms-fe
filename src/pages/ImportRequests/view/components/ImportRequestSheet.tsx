import { Textarea } from '@/components/ui/textarea';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ImportRequestDetails from './ImportRequestDetails';
import importRequestSelector from '../../slice/selector';
import { getLabelOfImportType } from '../../management/helper';
import { convertDate } from '@/helpers/convertDate';

type Props = {};

const ImportRequestSheet = (props: Props) => {
  const importRequest: ImportRequest = useSelector(importRequestSelector.importRequest);
  let poDeliveryId = importRequest?.poDelivery?.id;
  let purchaseOrder = importRequest?.poDelivery?.purchaseOrder.poNumber;
  let purchaseOrderId = importRequest?.poDelivery?.purchaseOrder?.id;
  const POcode = importRequest?.poDelivery?.purchaseOrder?.code || 'N/A';
  const purchaseOrderDelivery = importRequest?.poDelivery?.code;
  let planDeliveryDate = importRequest?.poDelivery?.expectedDeliverDate;
  let actualDeliveryDate = importRequest?.poDelivery?.deliverDate;
  let productionBatch = importRequest?.productionBatch;
  let importType = importRequest?.type;
  const status = importRequest?.status as string;
  return (
    <div className="flex flex-col gap-4 border-2 shadow-sm rounded-xl px-4">
      <div className="font-primary text-3xl flex justify-center items-center font-bold my-5">
        Import Request
      </div>

      <div
        className="flex flex-col gap-4
        md:grid grid-cols-2 w-full">
        <div className="flex flex-col gap-2">
          {purchaseOrder && (
            <div className="font-primary font-semibold text-sm">
              Purchase Order:{' '}
              <Link
                to={`/purchase-order/${purchaseOrderId}`}
                className="text-bluePrimary underline underline-offset-2">
                {purchaseOrder}
              </Link>
            </div>
          )}
          {productionBatch && (
            <div className="font-primary font-semibold text-sm">
              Production Batch:{' '}
              <Link
                to={`/production-batch/${productionBatch?.id}`}
                className="text-bluePrimary underline underline-offset-2">
                {productionBatch.code}
              </Link>
            </div>
          )}
          {planDeliveryDate && (
            <div className="font-primary font-semibold text-sm text-slate-500">
              Plan Delivery Date:{' '}
              <span className="text-black">
                {planDeliveryDate ? convertDate(planDeliveryDate) : 'Not yet'}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-primary font-semibold text-sm text-slate-500">
            Good Import Type:{' '}
            <span className="text-primaryLight">{getLabelOfImportType(importType)}</span>
          </div>
          {/* {actualDeliveryDate && (
            <div className="font-primary font-semibold text-sm text-slate-500">
              Actual Delivery Date:{' '}
              <span className="text-green-600">
                {actualDeliveryDate ? convertDateWithTime(actualDeliveryDate) : 'Not yet'}
              </span>
            </div>
          )} */}
        </div>
      </div>
      <div>
        <div className="font-primary font-semibold text-sm">Note</div>
        <Textarea
          placeholder="Note"
          className="w-full h-20 mt-2"
          readOnly
          value={importRequest?.description}
        />
      </div>
      {/* <SupplierWarehouseInfo /> */}
      <ImportRequestDetails />
    </div>
  );
};

export default ImportRequestSheet;
