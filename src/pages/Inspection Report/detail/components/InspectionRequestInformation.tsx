import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { convertDate } from '@/helpers/convertDate';
import {
  InspectionRequestStatus,
  InspectionRequestStatusLabels
} from '@/enums/inspectionRequestStatus';
import { InspectionRequestType, InspectionRequestTypeLabels } from '@/enums/inspectionRequestType';
import { ImportRequest } from '@/types/ImportRequestType';
import { Box, CalendarCheck, ClipboardCopy, ReceiptText, Shirt, Type } from 'lucide-react';
import { InspectionReport } from '@/types/InspectionReport';
import { convertToVietnamesePhoneNumber } from '../../../../helpers/convertPhoneNumber';
import { Gender } from '@/enums/gender';
import fallbackAvatar from '@/assets/images/avaPlaceholder.jpg';
import { Link } from 'react-router-dom';
import { convertDateWithTime } from '@/helpers/convertDateWithTime';

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
  inspectionDepartment?: any;
  importRequestId?: string;
  importReceiptCode?: string;
}

const InspectionRequestInformation: FC<InspectionRequestInformationProps> = ({
  requestCode,
  requestStatus,
  requestType,
  requestNote,
  requestCreatedAt,
  importRequest,
  inspectionDepartment,
  importReceiptCode
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Request Code */}
            <div className="flex items-center">
              <Type className="text-gray-500 mr-2" />
              <div>
                <dt className="font-medium text-gray-500">Inspection Request</dt>
                <dd className="text-gray-800">
                  <Badge className="bg-primaryLight">{requestCode}</Badge>
                </dd>
              </div>
            </div>
            {/* Type */}
            <div className="flex items-center">
              {requestType === InspectionRequestType.MATERIAL ? (
                <Box className="text-gray-500 mr-2" />
              ) : (
                <Shirt className="text-gray-500 mr-2" />
              )}
              <div>
                <dt className="font-medium text-gray-500">Type</dt>
                <dd className="font-semibold uppercase text-primaryLight">
                  {InspectionRequestTypeLabels[requestType]}
                </dd>
              </div>
            </div>

            {/* Import Request */}
            <div className="flex items-center">
              <ClipboardCopy className="text-gray-500 mr-2" />
              <div>
                <dt className="font-medium text-gray-500">Import Request</dt>
                <dd className="text-primaryLight underline cursor-pointer">
                  <Link
                    to={`/import-request/${importRequest?.id}`}
                    className="text-primaryLight underline cursor-pointer">
                    {importRequest?.code}
                  </Link>
                </dd>
              </div>
            </div>

            {/* Import Request */}
            <div className="flex items-center">
              <CalendarCheck className="text-gray-500 mr-2" />
              <div>
                <dt className="font-medium text-gray-500">Inspected At</dt>
                <span className="text-green-600 font-semibold">
                  {convertDateWithTime(requestCreatedAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Department Info */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={inspectionDepartment?.account?.avatarUrl || fallbackAvatar}
                alt="Inspection Department"
              />
              <AvatarFallback>
                {inspectionDepartment?.account?.firstName?.[0] || 'I'}
                {inspectionDepartment?.account?.lastName?.[0] || 'D'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-xl">
                {`${inspectionDepartment?.account?.firstName || ''} ${inspectionDepartment?.account?.lastName || ''}`}
              </p>
              <p className="text-sm text-gray-500">
                {inspectionDepartment?.account?.email || 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-400">Account Username:</span>
              <span className="text-lg font-semibold">
                {inspectionDepartment?.account?.username || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-400">Phone:</span>
              <span className="text-lg font-semibold text-gray-900">
                {convertToVietnamesePhoneNumber(inspectionDepartment?.account?.phoneNumber) ||
                  'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-400">Gender:</span>
              <span className="text-lg font-semibold text-gray-900">
                {inspectionDepartment?.account?.gender
                  ? inspectionDepartment.account.gender === Gender.MALE
                    ? 'Male'
                    : 'Female'
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-400">Date of Birth:</span>
              <span className="text-lg font-semibold text-gray-900">
                {inspectionDepartment?.account?.dateOfBirth
                  ? convertDate(inspectionDepartment.account.dateOfBirth)
                  : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionRequestInformation;
