import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../../slice/selector';
import { getSatusName, getStatusBadgeVariant } from '../../management/helper';
import { convertDateWithTime } from '../../../../helpers/convertDateWithTime';
import { Input } from '@/components/ui/Input';

type Props = {};

const ImportRequestStatus = (props: Props) => {
  const importRequest: ImportRequest = useSelector(importRequestSelector.importRequest);

  const code = importRequest?.code;
  const status = importRequest?.status;
  const createdDate = importRequest?.createdAt
    ? new Date(importRequest.createdAt).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format
      })
    : 'N/A';
  const lastUpdated = importRequest?.updatedAt
    ? new Date(importRequest.updatedAt).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format
      })
    : 'N/A';
  const closedAt = importRequest?.finishAt
    ? new Date(importRequest.finishAt).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format
      })
    : 'N/A';
  const cancelledAt = importRequest?.cancelledAt;
  const cancelledReason = importRequest?.cancelReason;
  const rejectedAt = importRequest?.rejectAt;
  const managerNote = importRequest?.managerNote;
  const finishedAt = importRequest?.finishedAt;

  const getAssignedTo = (status: ImportRequest['status']) => {
    switch (status) {
      case 'REJECTED':
      case 'APPROVED':
      case 'ARRIVED':
        if (!importRequest?.warehouseManager) return null;
        return {
          role: 'Warehouse Manager',
          avatar: importRequest?.warehouseManager?.account?.avatarUrl || 'N/A',
          name:
            importRequest?.warehouseManager?.account?.lastName +
              ' ' +
              importRequest?.warehouseManager?.account?.firstName || 'N/A'
        };
      case 'CANCELLED':
      case 'IMPORTED':
        const isMaterial = importRequest.purchasingStaff;
        if (isMaterial) {
          return {
            role: 'Purchasing Staff',
            avatar: importRequest?.purchasingStaff?.account?.avatarUrl,
            name:
              importRequest?.purchasingStaff?.account?.lastName +
              ' ' +
              importRequest?.purchasingStaff?.account?.firstName,
            avatarFallback:
              importRequest?.purchasingStaff?.account?.lastName.slice(0, 1) +
              importRequest?.purchasingStaff?.account?.firstName.slice(0, 1)
          };
        } else {
          return {
            role: 'Production Department',
            avatar: importRequest?.productionDepartment?.account?.avatarUrl,
            name:
              importRequest?.productionDepartment?.account?.lastName +
              ' ' +
              importRequest?.productionDepartment?.account?.firstName,
            avatarFallback:
              importRequest?.productionDepartment?.account?.lastName.slice(0, 1) +
              importRequest?.productionDepartment?.account?.firstName.slice(0, 1)
          };
        }
      case 'INSPECTING':
        return {
          role: 'Inspection Team',
          avatar: importRequest?.inspectionRequest[0]?.inspectionDepartment?.account?.avatarUrl,
          name:
            importRequest?.inspectionRequest[0]?.inspectionDepartment?.account?.lastName +
            ' ' +
            importRequest?.inspectionRequest[0]?.inspectionDepartment?.account?.firstName
        };
      case 'IMPORTING':
      case 'AWAIT_TO_IMPORT':
        return {
          role: 'Warehouse Stafff',
          avatar: importRequest?.warehouseStaff?.account?.avatarUrl,
          name:
            importRequest?.warehouseStaff?.account?.lastName +
            ' ' +
            importRequest?.warehouseStaff?.account?.firstName
        };
      default:
        return { role: 'Unassigned', avatar: null };
    }
  };

  const assignedTo = getAssignedTo(status);

  return (
    <div
      className="w-full lg:w-[90%] h-fit bg-white rounded-xl shadow-sm border-2 sticky top-4 p-4 flex flex-row justify-evenly items-center gap-2
    lg:flex-col lg:justify-center
    ">
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="font-primary font-bold lg:text-xl">Import Request</div>
        <span className="font-primary font-bold lg:text-xl">#{code}</span>
        <div className="font-primary text-sm">Assigned to</div>
        <Avatar>
          {assignedTo?.avatar ? (
            <AvatarImage src={assignedTo.avatar} alt={assignedTo.role} />
          ) : (
            <AvatarFallback>NA</AvatarFallback>
          )}
        </Avatar>
        <div className="font-primary text-sm">{assignedTo?.name}</div>
        <div className="font-primary text-sm">{assignedTo?.role}</div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <div className="flex justify-center items-center gap-2 font-primary text-sm">
          Status:{' '}
          {status ? (
            <Badge variant={getStatusBadgeVariant(status)}>{getSatusName(status)}</Badge>
          ) : (
            'N/A'
          )}
        </div>
        <div className="flex justify-center items-center gap-2 font-primary text-sm">
          Created at: <div className="font-primary text-xs text-bluePrimary">{createdDate}</div>
        </div>
        <div className="flex justify-center items-center gap-2 font-primary text-sm">
          Last updated : <div className="font-primary text-xs text-bluePrimary">{lastUpdated}</div>
        </div>
        {cancelledAt && (
          <div className="flex justify-center items-center gap-2 font-primary text-sm">
            Cancelled at :{' '}
            <div className="font-primary text-xs text-red-600">
              {convertDateWithTime(cancelledAt)}
            </div>
          </div>
        )}
        {cancelledAt && (
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="cancelReason" className="">
              Cancelled Reason:
            </label>
            <Input
              id="cancelReason"
              type="text"
              value={cancelledReason?.toString()}
              disabled={true}
              placeholder="Enter cancellation reason"
              className="w-full h-20 text-sm border-red-300 focus:border-red-500 focus:ring-red-500 placeholder-red-300"
            />
          </div>
        )}
        {rejectedAt && (
          <div className="flex justify-center items-center gap-2 font-primary text-sm">
            Rejected at :{' '}
            <div className="font-primary text-xs text-red-600">
              {convertDateWithTime(rejectedAt)}
            </div>
          </div>
        )}
        {rejectedAt && (
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="cancelReason" className="">
              Reject Reason:
            </label>
            <Input
              id="cancelReason"
              type="text"
              value={managerNote?.toString()}
              disabled={true}
              placeholder="Enter cancellation reason"
              className="w-full h-20 text-sm border-red-300 focus:border-red-500 focus:ring-red-500 placeholder-red-300"
            />
          </div>
        )}
        {finishedAt && (
          <div className="flex justify-center items-center gap-2 font-primary text-sm">
            Finished at :{' '}
            <div className="font-primary text-xs text-green-600">
              {convertDateWithTime(finishedAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportRequestStatus;
