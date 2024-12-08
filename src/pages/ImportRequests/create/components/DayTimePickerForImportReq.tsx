import { Button } from '@/components/ui/button'
import { DatetimePicker } from '@/components/ui/DatePicker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { DatetimePickerForImportRequest } from './DatePickerForImportReq'

type Props = {
    date: Date | undefined;
    setDate: (date: Date) => void;
    className?: string;
    placeholder?: string;
    width?: string;
}

const DayTimePickerForImportRequest: React.FC<Props> = ({
    date,
    setDate,
    className,
    placeholder="Pick a date",
    width="w-[280px]",
}) => {
  return (
    <main className={cn("mt-40", className)}>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            " justify-start text-left font-normal",
            !date && "text-muted-foreground",
            width
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <DatetimePickerForImportRequest selected={date} setDate={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  </main>
  )
}

export default DayTimePickerForImportRequest