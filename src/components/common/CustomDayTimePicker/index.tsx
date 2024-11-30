import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { DatetimePicker } from './DatePicker';

type Props = {
  date: Date | undefined;
  setDate: (date: Date) => void;
  className?: string;
  placeholder?: string;
  width?: string;
};

const CustomDayTimePicker: React.FC<Props> = ({
  date,
  setDate,
  className,
  placeholder = 'Pick a date',
  width = 'w-[280px]'
}) => {
  return (
    <main className={cn('mt-40', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              ' justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              width
            )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP HH:mm') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <DatetimePicker selected={date} setDate={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </main>
  );
};

export default CustomDayTimePicker;
