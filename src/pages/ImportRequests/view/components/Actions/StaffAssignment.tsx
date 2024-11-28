'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { CheckCheckIcon, Plus } from 'lucide-react';
import { getTaskByTimeZoneAndRole } from '@/api/services/taskApi';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import DayTimePicker from '@/components/common/DayTimePicker';

export interface Props {
  staff: any;
  setStaff: (staff: any) => void;
  type: string;
}

export default function AssignStaffPopup({ staff, setStaff, type }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [freeStaff, setFreeStaff] = useState<any[]>([]);
  const [busyStaff, setBusyStaff] = useState<any[]>([]);

  const handleAssignTask = (staffId: string) => {
    const selectedStaff = freeStaff.find((s) => s.id === staffId);
    if (selectedStaff) {
      setSelectedStaffId(staffId);
      setStaff(selectedStaff);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchAvailableStaff = async () => {
      if (startTime && endTime) {
        try {
          const data = await getTaskByTimeZoneAndRole(
            type,
            startTime.toISOString(),
            endTime.toISOString()
          );
          setFreeStaff(data.data.free);
          setBusyStaff(data.data.busy);
        } catch (err) {
          console.error('Error fetching staff availability:', err);
        }
      }
    };

    fetchAvailableStaff();
  }, [type, startTime, endTime]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {staff ? (
          <Badge className="flex items-center" variant="outline">
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src={staff.account.avatarUrl} />
              <AvatarFallback>
                {staff.account.firstName.slice(0, 1) + staff.account.lastName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            {staff.account.firstName + ' ' + staff.account.lastName}
          </Badge>
        ) : (
          <Button variant="outline">Assign Employee</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Assign Staff to Tasks</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="start-time">Start Time</Label>
              <DayTimePicker date={startTime} setDate={setStartTime} className="mt-4" />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-time">End Time</Label>
              <DayTimePicker date={endTime} setDate={setEndTime} className="mt-4" />
            </div>
          </div>
          <div className="h-[300px] rounded-md border p-4 overflow-y-auto">
            <h3 className="font-semibold mb-2">Available Staff</h3>
            {freeStaff.map((staff) => (
              <StaffItem
                key={staff.id}
                staff={staff}
                isAssigned={selectedStaffId === staff.id}
                onAssign={() => handleAssignTask(staff.id)}
              />
            ))}
            <h3 className="font-semibold mt-4 mb-2">Busy Staff</h3>
            {busyStaff.map((staff) => (
              <StaffItem
                key={staff.id}
                staff={staff}
                isAssigned={false}
                onAssign={() => {}}
                isBusy
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface StaffItemProps {
  staff: any;
  isAssigned: boolean;
  onAssign: () => void;
  isBusy?: boolean;
}

function StaffItem({ staff, isAssigned, onAssign, isBusy = false }: StaffItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={staff.account.avatarUrl} />
          <AvatarFallback>
            {staff.account.firstName.slice(0, 1) + staff.account.lastName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">
            {staff.account.firstName + ' ' + staff.account.lastName}
          </p>
          <p className="text-sm">{staff.account.gender}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={isBusy ? 'destructive' : 'secondary'}>
          {isBusy ? 'Busy' : 'Available'}
        </Badge>
        {!isBusy && (
          <Button
            size="sm"
            onClick={onAssign}
            disabled={isAssigned || isBusy}
            variant={isAssigned ? 'secondary' : 'outline'}>
            {isAssigned ? <CheckCheckIcon className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}
