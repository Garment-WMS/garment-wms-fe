'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Ghost, Loader2, Plus, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/Label';

// Mock data for staff members
const staffMembers = [
  { id: 1, name: 'John Doe', taskCount: 5, department: 'Packaging', efficiency: 92 },
  { id: 2, name: 'Jane Smith', taskCount: 3, department: 'Shipping', efficiency: 88 },
  { id: 3, name: 'Mike Johnson', taskCount: 7, department: 'Inventory', efficiency: 95 },
  { id: 4, name: 'Emily Brown', taskCount: 2, department: 'Receiving', efficiency: 90 },
  { id: 5, name: 'Chris Lee', taskCount: 4, department: 'Quality Control', efficiency: 87 }
];
export interface Props {
  staff: any;
  setStaff: any;
}

export default function AssignStaffPopup({ staff, setStaff }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningTask, setAssigningTask] = useState<number | null>(null);

  const sortedStaff = [...staffMembers].sort((a, b) => b.taskCount - a.taskCount);

  const filteredStaff = sortedStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignTask = async (staffId: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAssigningTask(staffId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {staff ? (
          <Badge className="flex items-center" variant={'outline'}>
            <Avatar className="w-6 h-6 mr-2 ">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt={'Warehouse Manager'} />
              <AvatarFallback>{123}</AvatarFallback>
            </Avatar>
            Nguyen Duc Bao
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
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${staff.name}`}
                    />
                    <AvatarFallback>
                      {staff.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium ">{staff.name}</p>
                    <p className="text-sm">{staff.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Tasks: {staff.taskCount}</Badge>
                  <Button
                    size="sm"
                    onClick={() => handleAssignTask(staff.id)}
                    disabled={assigningTask === staff.id}>
                    {assigningTask === staff.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
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
