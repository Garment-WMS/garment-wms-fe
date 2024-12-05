import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import { User } from '@/types/User';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Loading from '@/components/common/Loading';
import { Assignment } from '../CreateDynamicPlan';
import { AssignmentForOverall } from '../CreateOverallPlan';

type Props = {
  error: string;
  assignment: Assignment | AssignmentForOverall;
  staffList: User[];
  chosenStaff: User[];
  setChosenStaff: any;
};

export function SelectStaff({ error, assignment, staffList, chosenStaff, setChosenStaff }: Props) {
  const [checkSelectedStaff, setCheckSelectedStaff] = React.useState<User | undefined>(undefined);
  const handleStaffChange = (staffId: string) => {
  
    const selectedStaff = staffList.find((staff) => staff.id === staffId);
    const isAlreadySelected = chosenStaff.some((staff) => staff.id === staffId);
    const assignmentStaffId = assignment.staffId;

    if (selectedStaff && !isAlreadySelected) {
      setChosenStaff([...chosenStaff, selectedStaff]);
  
      if (assignmentStaffId != '') {
        const filter = chosenStaff.filter((staff) => staff.id !== assignmentStaffId);
        setChosenStaff([...filter, selectedStaff]);
        assignment.staffId = staffId;
      }else{
        assignment.staffId = staffId;
      }
    }
    setCheckSelectedStaff(selectedStaff);
  };
  return (
  <>
  <Select onValueChange={handleStaffChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a staff" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Warehouse Staff</SelectLabel>
          {staffList.length > 0 ? (
            staffList.map((staff) => (
              <SelectItem
                className="hover:bg-blue-100 "
                disabled={chosenStaff.some((chosen) => chosen.id === staff.id)}
                key={staff.id}
                value={staff.id}>
                <div className="flex justify-center items-center gap-2 ">
                  <Avatar>
                    <AvatarImage src={staff.account.avatarUrl} alt="@shadcn" />
                    <AvatarFallback>WS</AvatarFallback>
                  </Avatar>
                  <div>
                    {staff.account.firstName} {staff.account.lastName}
                  </div>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <Loading />
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
    {error && checkSelectedStaff===undefined && <p className="text-red-500 text-sm">{error}</p>}
  </>
    
  );
}
