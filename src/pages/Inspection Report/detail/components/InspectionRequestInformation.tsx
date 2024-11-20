import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { convertDate } from '@/helpers/convertDate';
import {
  InspectionRequestStatus,
  InspectionRequestStatusLabels
} from '@/enums/inspectionRequestStatus';
import { InspectionRequestType, InspectionRequestTypeLabels } from '@/enums/inspectionRequestType';
import { ImportRequest } from '@/types/ImportRequestType';
import { Calendar, Edit3, FileText, Type } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { InspectionReport } from '@/types/InspectionReport';

const statusColors: Record<InspectionRequestStatus, string> = {
  [InspectionRequestStatus.CANCELLED]: 'bg-red-500',
  [InspectionRequestStatus.INSPECTING]: 'bg-blue-500',
  [InspectionRequestStatus.INSPECTED]: 'bg-green-500'
};

interface InspectionRequestInformationProps {
  requestCode: string;
  requestStatus: InspectionRequestStatus;
  requestType: InspectionRequestType;
  requestNote: string | null;
  requestCreatedAt: string;
  importRequestCode: string;
  poDeliveryCode: string;
  requestUpdatedAt: string;
  warehouseManager: any;
  purchaseOrderNumber: string;
  inspectionReport: InspectionReport;
  importRequest?: ImportRequest;
}

const InspectionRequestInformation: FC<InspectionRequestInformationProps> = ({
  requestCode,
  requestStatus,
  requestType,
  requestNote,
  requestCreatedAt,
  warehouseManager,
  importRequest
}) => {
  const importRequestDetails = importRequest?.importRequestDetail || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Details */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex flex-row items-center gap-2 text-lg">
              Request{' '}
              <span className="text-primaryLight text-2xl font-semibold"> #{requestCode}</span>
            </div>
            <Badge className={`${statusColors[requestStatus]} text-white`}>
              {InspectionRequestStatusLabels[requestStatus]}
            </Badge>
          </CardTitle>
          <CardDescription>Created on {convertDate(requestCreatedAt)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="inspectItem">
                {InspectionRequestTypeLabels[requestType]}s
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="mt-4">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Request Code */}
                <div className="flex items-center">
                  <Type className="text-gray-500 mr-2" />
                  <div>
                    <dt className="font-medium text-gray-500">Request Code</dt>
                    <dd className="text-gray-800">
                      <Badge className="bg-primaryLight">{requestCode}</Badge>
                    </dd>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-center">
                  <FileText className="text-gray-500 mr-2" />
                  <div>
                    <dt className="font-medium text-gray-500">Type</dt>
                    <dd className="font-semibold uppercase">
                      {InspectionRequestTypeLabels[requestType]}
                    </dd>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-center">
                  <Calendar className="text-gray-500 mr-2" />
                  <div>
                    <dt className="font-medium text-gray-500">Created At</dt>
                    <dd className="text-gray-800">{convertDate(requestCreatedAt)}</dd>
                  </div>
                </div>

                {/* Note */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <Edit3 className="text-gray-500 mr-2" />
                    <dt className="font-medium text-gray-500">Note</dt>
                  </div>
                  <Input
                    type="text"
                    defaultValue={requestNote || 'No notes provided'}
                    placeholder="Enter note here..."
                    className="text-gray-400"
                    disabled={!requestNote}
                  />
                </div>
              </dl>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="inspectItem" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {importRequestDetails.map((detail) => (
                  <div
                    key={detail.id}
                    className="flex bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    {/* Image Section */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center p-2">
                      <img
                        src={
                          detail.materialPackage?.materialVariant?.image ||
                          'https://via.placeholder.com/150'
                        }
                        alt={detail.materialPackage?.name || 'Material'}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col justify-center gap-2 flex-grow p-4">
                      <h3 className="font-semibold text-xl text-gray-800 truncate mb-2">
                        {detail.materialPackage?.materialVariant?.name || 'Unknown Material'}
                      </h3>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div>
                          <strong>Code:</strong>{' '}
                          <Badge className="bg-gray-500 text-white px-2 py-1 rounded-lg">
                            {detail.materialPackage?.code || 'N/A'}
                          </Badge>
                        </div>
                        <div>
                          <strong>Quantity:</strong>{' '}
                          <span className="lowercase text-primaryLight font-semibold">
                            {detail.quantityByPack} {detail.materialPackage?.packUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Warehouse Manager Info */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={warehouseManager.avatarUrl} alt="Warehouse Manager" />
              <AvatarFallback>
                {warehouseManager.firstName[0]}
                {warehouseManager.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{`${warehouseManager.firstName} ${warehouseManager.lastName}`}</p>
              <p className="text-sm text-gray-500">{warehouseManager.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionRequestInformation;
