import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Maximize2, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import ShortStockingPlanDetails from './ShortStocktakingPlanDetails';
import { useNavigate } from 'react-router-dom';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/useDebouce';
import { getAllInventoryReportPlanFn } from '@/api/services/inventoryReportPlanApi';
import { InventoryReportPlan, InventoryReportPlanResponse } from '@/types/InventoryReport';
import { cn } from '@/lib/utils';
import Loading from '@/components/common/Loading';
import CalendarSkeleton from './CalendarSkeleton';

type Event = {
  date: Date;
  title: string;
};

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function StocktakingCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [inventoryReportPlanList, setInventoryReportPlanList] = useState<InventoryReportPlan[]>([]);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const [isLoading, setIsLoading] = useState(false);


  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);
  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);

  const debouncedSorting: SortingState = useDebounce(sorting, 1000);
  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 100 //default page size
  });

  const debouncedPagination: PaginationState = useDebounce(pagination, 1000);

  const [filtersInitialized, setFiltersInitialized] = useState(false);

  useEffect(() => {
    // Set initial column filters for the date range
    setColumnFilters([
      { id: 'from', value: firstDayOfMonth.toISOString() },
      { id: 'to', value: lastDayOfMonth.toISOString() }
    ]);
    setFiltersInitialized(true);
  }, [currentDate]);

  // Fetch data when filters or pagination are updated
  useEffect(() => {
    if (filtersInitialized) {
      const fetchDataTable = async () => {
        setIsLoading(true); // Start loading
        try {
          const response = await getAllInventoryReportPlanFn({
            sorting,
            columnFilters: debouncedColumnFilters,
            pagination: debouncedPagination
          });
          // setInventoryReportPlanList(response);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };

      fetchDataTable();
    }
  }, [debouncedColumnFilters, debouncedSorting, debouncedPagination]);

  //   const renderCalendar = () => {
  //     const days = getDaysInMonth(currentDate);
  //     const firstDayOfMonth = days[0].getDay();

  //     return (
  //         <div className="grid grid-cols-7">
  //             {daysOfWeek.map((day) => (
  //                 <div key={day} className="text-center font-semibold text-sm py-2">
  //                     {day}
  //                 </div>
  //             ))}
  //             {Array(firstDayOfMonth)
  //                 .fill(null)
  //                 .map((_, index) => (
  //                     <div key={`empty-${index}`} className="p-2"></div>
  //                 ))}
  //             {days.map((day, index) => {
  //                 const dayEvents = inventoryReportPlanList.filter((event) => {
  //                     const eventFrom = new Date(event.from);
  //                     const eventTo = new Date(event.to);
  //                     return day >= eventFrom && day <= eventTo;

  //                 });

  //                 return (
  //                     <div
  //                         onClick={() => setSelectedDate(day)}
  //                         className={`p-2 border rounded-sm cursor-pointer shadow-sm flex flex-col gap-2 ${
  //                             day.toDateString() === new Date().toDateString() ? 'bg-blue-500 text-white' : ''
  //                         }`}>
  //                         <div className="font-semibold text-right mb-6">{day.getDate()}</div>
  //                         {dayEvents.map((event, eventIndex) => (
  //                             <div
  //                                 key={eventIndex}
  //                                 className="text-xs flex bg-green-500 p-1 mt-1 rounded">
  //                                 {event.title} {event.code}
  //                             </div>
  //                         ))}
  //                     </div>
  //                 );
  //             })}
  //         </div>
  //     );
  // };
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate);
    const firstDayOfMonth = days[0].getDay();
  
    if (isLoading) {
      return <CalendarSkeleton />;
    }
  
    return (
      <div className="grid grid-cols-7">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-semibold text-sm py-2">
            {day}
          </div>
        ))}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}
        {days.map((day, index) => {
          const dayEvents = inventoryReportPlanList.filter(
            (event) =>
              new Date(event.from).toLocaleDateString() <= day.toLocaleDateString() &&
              day.toLocaleDateString() <= new Date(event.to).toLocaleDateString()
          );
  
          return (
            <div
              onClick={() => setSelectedDate(day)}
              className={`p-2 border rounded-sm shadow-sm flex flex-col gap-2 ${
                day.toLocaleDateString() === new Date().toLocaleDateString()
                  ? 'bg-blue-500 text-white'
                  : ''
              }`}>
              <div className="font-semibold text-right mb-6">{day.getDate()}</div>
              {dayEvents.map((event, eventIndex) => {
                const isFirstDay =
                  new Date(event.from).toLocaleDateString() === day.toLocaleDateString();
                const isSpanningDay =
                  new Date(event.from).toLocaleDateString() < day.toLocaleDateString() &&
                  new Date(event.to).toLocaleDateString() > day.toLocaleDateString();
  
                if (isFirstDay || isSpanningDay) {
                  const eventDateFrom = new Date(event.from);
                  const eventDateTo = new Date(event.to);
                  const spanDays = Math.min(
                    (eventDateTo.getTime() - eventDateFrom.getTime()) / (1000 * 60 * 60 * 24) + 1,
                    days.length - index
                  );
  
                  const timeStart = eventDateFrom.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const timeEnd = eventDateTo.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
  
                  return (
                    <Card
                      key={eventIndex}
                      onClick={() => navigate(`/stocktaking/plan/${event.id}`)}
                      className={cn(
                        "border-none shadow-sm transition-all hover:shadow-md cursor-pointer",
                        event.status === "PENDING"
                          ? "bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70"
                          : event.status === "IN_PROGRESS"
                          ? "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:hover:bg-yellow-900/70"
                          : event.status === "FINISH"
                          ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-900/70"
                          : "bg-blue-200 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/70"
                      )}
                      style={{
                        gridColumn: `span ${spanDays}`
                      }}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <ClipboardList
                            className={cn(
                              "h-5 w-5 mt-0.5",
                              event.status === "PENDING" && "text-red-700 dark:text-red-400",
                              event.status === "IN_PROGRESS" && "text-yellow-700 dark:text-yellow-400",
                              event.status === "FINISH" && "text-green-700 dark:text-green-400"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <h3
                              className={cn(
                                "font-medium truncate text-sm",
                                event.status === "PENDING" && "text-red-900 dark:text-red-100",
                                event.status === "IN_PROGRESS" &&
                                  "text-yellow-900 dark:text-yellow-100",
                                event.status === "FINISH" && "text-green-900 dark:text-green-100"
                              )}>
                              {event.title}
                            </h3>
                            <p
                              className={cn(
                                "text-xs truncate",
                                event.status === "PENDING" && "text-red-700 dark:text-red-300",
                                event.status === "IN_PROGRESS" &&
                                  "text-yellow-700 dark:text-yellow-300",
                                event.status === "FINISH" && "text-green-700 dark:text-green-300"
                              )}>
                              {event.code}
                            </p>
                            <p
                              className={cn(
                                "text-xs font-medium mt-1",
                                event.status === "PENDING" && "text-red-800 dark:text-red-200",
                                event.status === "IN_PROGRESS" &&
                                  "text-yellow-800 dark:text-yellow-200",
                                event.status === "FINISH" && "text-green-800 dark:text-green-200"
                              )}>
                              {timeStart} - {timeEnd}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
  
                return null;
              })}
            </div>
          );
        })}
      </div>
    );
  };
  

  const updateMonth = (monthOffset: number) => {
    // Update the current date based on the offset
    setIsLoading(true);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
    setCurrentDate(newDate);

    // Calculate the first and last day of the new month
    const firstDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

    // Update column filters with the new date range
    setColumnFilters([
      { id: 'from', value: firstDayOfNewMonth.toISOString() },
      { id: 'to', value: lastDayOfNewMonth.toISOString() }
    ]);
  };
  return (
    <Card className="w-full max-w-8xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-2xl font-bold">Schedule</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => updateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <Button variant="outline" size="icon" onClick={() => updateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="default" onClick={() => navigate('/stocktaking/plan/create')}>
            Create plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderCalendar()}
        <div className="flex justify-center items-center mt-4 ">
          <div className="flex gap-4 justify-center items-center border p-2 border-slate-300 w-fit rounded-sm">
            <div className="flex gap-2 justify-center items-center">
              <div className="h-2 w-2 bg-red-500" />
              <Label>Pending</Label>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className="h-2 w-2 bg-yellow-500" />
              <Label>In progress</Label>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className="h-2 w-2 bg-green-500" />
              <Label>Finish</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
