import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../slice/selector';
import { getSatusName, getStatusBadgeVariant } from '../helper';

type Props = {};

const ImportRequestStatus = (props: Props) => {
  const importRequest: ImportRequest = useSelector(importRequestSelector.importRequest);

  const id = importRequest?.id.slice(0, 4);
  const status = importRequest?.status;
  const createdDate = importRequest?.createdAt
    ? new Date(importRequest.createdAt).toLocaleDateString()
    : 'N/A';
  const lastUpdated = importRequest?.updatedAt
    ? new Date(importRequest.updatedAt).toLocaleDateString()
    : 'N/A';
  const closedAt = importRequest?.finishAt
    ? new Date(importRequest.finishAt).toLocaleDateString()
    : 'N/A';

  const getAssignedTo = (status: ImportRequest['status']) => {
    switch (status) {
      case 'REJECTED':
      case 'APPROVED':
      case 'ARRIVED':
        return {
          role: 'Warehouse Manager',
          avatar: importRequest?.warehouseManager?.account?.avatarUrl,
          name:
            importRequest?.warehouseManager?.account?.lastName +
            ' ' +
            importRequest?.warehouseManager?.account?.firstName
        };
      case 'CANCELLED':
      case 'IMPORTED':
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
      case 'INSPECTING':
        return {
          role: 'Inspection Team',
          avatar: importRequest?.inspectionRequest[0]?.inspectionDepartment.account?.avatarUrl,
          name:
            importRequest?.inspectionRequest[0]?.inspectionDepartment.account?.lastName +
            ' ' +
            importRequest?.inspectionRequest[0]?.inspectionDepartment.account?.firstName
        };
      case 'IMPORTING':
        return {
          role: 'Warehouse Stafff',
          avatar: importRequest?.purchasingStaff?.account?.avatarUrl,
          name:
            importRequest?.purchasingStaff?.account?.lastName +
            ' ' +
            importRequest?.purchasingStaff?.account?.firstName
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
        <span className="font-primary font-bold lg:text-xl">#{id}</span>
        <div className="font-primary text-sm">Assigned to</div>
        <Avatar>
          {assignedTo.avatar ? (
            <AvatarImage src={assignedTo.avatar} alt={assignedTo.role} />
          ) : (
            <AvatarFallback>NA</AvatarFallback>
          )}
        </Avatar>
        <div className="font-primary text-sm">{assignedTo.name}</div>
        <div className="font-primary text-sm">{assignedTo.role}</div>
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
        <div className="flex justify-center items-center gap-2 font-primary text-sm">
          Closed at : <div className="font-primary text-xs text-bluePrimary">{closedAt}</div>
        </div>
      </div>
    </div>
  );
};

export default ImportRequestStatus;
