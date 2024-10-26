import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
type Props = {
  field: any;
};
import { Role } from '@/enums/role';

const SelectRole: React.FC<Props> = ({ field }) => {
  return (
      <Select
      onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger className="w-full flex ">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Role.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
  );
};

export default SelectRole;
