import { BreadcrumbResponsive } from '@/components/common/BreadcrumbReponsive';
import Loading from '@/components/common/Loading';
import { useGetInspectionRequestById } from '@/hooks/useGetInspectionRequestById';
import { useParams } from 'react-router-dom';
import InspectionRequestInformation from './components/InspectionRequestInformation';
import InspectionRequestChart from './components/InspectionRequestChart';

const InspectionRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: inspectionRequestData, isPending, isError } = useGetInspectionRequestById(id!);

  if (isPending) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>Failed to load inspection request details</div>;
  }

  const {
    data: {
      code: requestCode,
      status: requestStatus,
      type: requestType,
      note: requestNote,
      createdAt: requestCreatedAt,
      updatedAt: requestUpdatedAt,
      importRequest,
      warehouseManager,
      inspectionReport = null
    } = {}
  } = inspectionRequestData || {};

  const {
    code: importRequestCode,
    poDelivery: { code: poDeliveryCode, purchaseOrder: { poNumber: purchaseOrderNumber } = {} } = {}
  } = importRequest || {};

  const breadcrumbItems = [
    { label: 'Inspection Request', href: '/purchase-staff/report' },
    { label: `Inspection Request #${requestCode}`, href: `/purchase-staff/purchase-order/${id}` }
  ];

  return (
    <section className="h-full w-full px-4 py-3 flex flex-col space-y-7">
      <div className="bg-white px-5 py-3 rounded-xl shadow-lg ring-1 ring-gray-300 flex flex-col gap-8">
        <BreadcrumbResponsive breadcrumbItems={breadcrumbItems} itemsToDisplay={2} />
        {/* Inspection Information */}
        <InspectionRequestInformation
          requestCode={requestCode || ''}
          requestStatus={requestStatus || ''}
          requestType={requestType || ''}
          requestNote={requestNote || ''}
          requestCreatedAt={requestCreatedAt || ''}
          requestUpdatedAt={requestUpdatedAt || ''}
          importRequestCode={importRequestCode || ''}
          poDeliveryCode={poDeliveryCode || ''}
          purchaseOrderNumber={purchaseOrderNumber || ''}
          warehouseManager={{
            firstName: warehouseManager?.account.firstName || '',
            lastName: warehouseManager?.account.lastName || '',
            email: warehouseManager?.account.email || '',
            avatarUrl: warehouseManager?.account.avatarUrl
          }}
          inspectionReport={inspectionReport}
          importRequest={importRequest}
        />
        {/* Inspection Report Detail */}
        <InspectionRequestChart inspectionReport={inspectionReport} />
      </div>
    </section>
  );
};

export default InspectionRequestDetails;
