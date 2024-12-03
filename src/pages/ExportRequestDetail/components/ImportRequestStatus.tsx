import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { ImportRequest } from '@/types/ImportRequestType';
import { useSelector } from 'react-redux';
import importRequestSelector from '../slice/selector';
import { getSatusName, getStatusBadgeVariant } from '../helper';
import exportRequestSelector from '../slice/selector';
import { MaterialExportRequest, MaterialExportRequestDetail } from '@/types/exportRequest';

type Props = {};

const ImportRequestStatus = (props: Props) => {
  const exportRequest: MaterialExportRequest = useSelector(exportRequestSelector.exportRequest);

  const status = exportRequest?.status;
  const createdDate = exportRequest?.createdAt
    ? new Date(exportRequest.createdAt).toLocaleDateString() +
      ` ` +
      new Date(exportRequest.createdAt).toLocaleTimeString()
    : 'N/A';
  const lastUpdated = exportRequest?.updatedAt
    ? new Date(exportRequest.updatedAt).toLocaleDateString() +
      ` ` +
      new Date(exportRequest.createdAt).toLocaleTimeString()
    : 'N/A';
  const closedAt = exportRequest?.finishAt
    ? new Date(exportRequest.finishAt).toLocaleDateString()
    : 'N/A';

  const getAssignedTo = (status: any) => {
    switch (status) {
      case '':
      case 'APPROVED':
      case 'DECLINED':
        return {
          role: 'Warehouse Manager',
          avatar: exportRequest?.warehouseManager?.account?.avatarUrl,
          name:
            exportRequest?.warehouseManager?.account?.lastName +
            ' ' +
            exportRequest?.warehouseManager?.account?.firstName
        };
      case 'PENDING':
      case 'EXPORTED':
      case 'PRODUCTION_APPROVED':
      case 'PRODUCTION_REJECTED':
        return {
          role: 'Production Department',
          avatar: exportRequest?.productionDepartment?.account?.avatarUrl,
          name:
            exportRequest?.productionDepartment?.account?.lastName +
            ' ' +
            exportRequest?.productionDepartment?.account?.firstName,
          avatarFallback:
            exportRequest?.productionDepartment?.account?.lastName.slice(0, 1) +
            exportRequest?.productionDepartment?.account?.firstName.slice(0, 1)
        };
      case 'EXPORTING':
        return {
          role: 'Warehouse Stafff',
          avatar: exportRequest?.warehouseStaff?.account?.avatarUrl,
          name:
            exportRequest?.warehouseStaff?.account?.lastName +
            ' ' +
            exportRequest?.warehouseStaff?.account?.firstName
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
        <div className="font-primary font-bold lg:text-xl">Export Request</div>
        <span className="font-primary  lg:text-sm">#{exportRequest?.code}</span>
        <div className="font-primary text-sm">Assigned to</div>
        <Avatar>
          <AvatarImage src={assignedTo.avatar} alt={assignedTo.role} />

          <AvatarFallback>{assignedTo.name?.slice(0, 2)}</AvatarFallback>
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
