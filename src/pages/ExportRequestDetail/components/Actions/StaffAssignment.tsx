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
import { getAccountByRole } from '@/api/account/accountApi';

export interface Props {
  staff: any;
  setStaff: any;
  type: string;
}

export default function AssignStaffPopup({ staff, setStaff, type }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningTask, setAssigningTask] = useState<number | null>(null);
  const [staffList, setStaffList] = useState<any[]>([]);

  const handleAssignTask = async (staffId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (assigningTask == staffId) {
      setAssigningTask(null);
      setStaff(null);
    } else {
      setAssigningTask(staffId);
      setStaff(staffList.find((staff) => staff.id == staffId));
    }

    console.log(staffList);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchAccountByRole = async () => {
      try {
        const data = await getAccountByRole({ role: type }); // replace 'admin' with the desired role
        setStaffList(data.data);
      } catch (err) {}
    };
    if (type) {
      fetchAccountByRole();
    }
  }, [type]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {staff ? (
          <Badge className="flex items-center" variant={'outline'}>
            <Avatar className="w-6 h-6 mr-2 ">
              <AvatarImage src={staff.account.avatarUrl} />
              <AvatarFallback>
                {staff.account.firstName.slice(0, 1) + staff.account.lastName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            {staff.account.firstName + ' ' + staff.account.lastName}
          </Badge>
        ) : (
          <Button variant={'outline'}>Assign Employee</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Staff to Tasks</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="h-[300px] rounded-md border p-4">
            {staffList.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={staff.account.avatarUrl} />
                    <AvatarFallback>
                      {staff.account.firstName.slice(0, 1) + staff.account.lastName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium ">
                      {' '}
                      {staff.account.firstName + ' ' + staff.account.lastName}
                    </p>
                    <p className="text-sm">{staff.account.gender}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    Tasks:{' '}
                    {type == 'warehouse-staff'
                      ? staff._count.importReceipt
                      : staff._count.inspectionRequest}
                  </Badge>
                  <Button size="sm" onClick={() => handleAssignTask(staff.id)}>
                    {assigningTask === staff.id ? (
                      <CheckCheckIcon className="h-4 w-4 " />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
