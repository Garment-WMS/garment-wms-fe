import {
  getAllInventoryReportPlanFn,
  getAllInventoryReportPlanForWarehouseStaffFn
} from '@/api/services/inventoryReportPlanApi';
import { useDebounce } from '@/hooks/useDebouce';
import {
  InventoryReportPlan,
  InventoryReportPlanDetailsToRender,
  InventoryReportPlanToRender,
  InventoryReportPlanStatus
} from '@/types/InventoryReport';
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import {
  Captions,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MoreVertical,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskListSkeleton from './TaskListSkeleton';
import { Badge, badgeVariants } from '@/components/ui/Badge';
import { getStatusBadgeVariant } from '@/helpers/getStatusBadgeVariant';
import { convertTitleToTitleCase } from '@/helpers/convertTitleToCaseTitle';
import { cn } from '@/lib/utils';

type Props = {};

const StocktakingPlanList = (props: Props) => {
  const [inventoryReportPlanList, setInventoryReportPlanList] = useState<
    InventoryReportPlanToRender[]
  >([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dayFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric', // Use 'long' for full weekday name (e.g., "Monday")
    month: 'short', // Use 'long' for full month name (e.g., "November")
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

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
          const response = await getAllInventoryReportPlanForWarehouseStaffFn({
            sorting,
            columnFilters: debouncedColumnFilters,
            pagination: debouncedPagination
          });
          const list = response.data;
          setInventoryReportPlanList(list);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };

      fetchDataTable();
    }
  }, [debouncedColumnFilters, debouncedSorting, debouncedPagination]);

  const updateMonth = (monthOffset: number) => {
    // Update the current date based on the offset
    setIsLoading(true);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
    setCurrentDate(newDate);

    // Calculate the first and last day of the new month
    const firstDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1, 0, 0, 0);
    const lastDayOfNewMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Update column filters with the new date range
    setColumnFilters([
      { id: 'from', value: firstDayOfNewMonth.toISOString() },
      { id: 'to', value: lastDayOfNewMonth.toISOString() }
    ]);
  };

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // Use 'long' for full weekday name (e.g., "Monday")
      month: 'short', // Use 'long' for full month name (e.g., "November")
      day: 'numeric'
    };

    const start = startDate.toLocaleDateString('en-GB', options);
    const end = endDate.toLocaleDateString('en-GB', options);

    return start === end ? start : `${start} - ${end}`;
  };
  // Create a mapping of event date ranges
  // const eventDateRanges = Array.isArray(inventoryReportPlanList)
  // ? inventoryReportPlanList.map((plan) => {
  //     const startDate = new Date(plan.from);
  //     const endDate = new Date(plan.to);
  //     const label = formatDateRange(startDate, endDate);

  //     return {
  //       label,
  //       from: startDate,
  //       to: endDate,
  //       events: plan
  //     };
  //   }).sort((a, b) => a.from.getTime() - b.from.getTime()) // Sort by start date
  // : [];
  const eventDateRanges = inventoryReportPlanList
  .map((plan) => {
    const isFinished = plan.status === "FINISHED";
    const startDate = new Date(isFinished ? plan.startedAt : plan.from);
    const endDate = new Date(isFinished ? plan.finishedAt : plan.to);
    const label = formatDateRange(startDate, endDate);

    return {
      label,
      from: startDate,
      to: endDate,
      events: plan
    };
  })
  .sort((a, b) => a.from.getTime() - b.from.getTime());
  console.log('ds', inventoryReportPlanList);
  return (
    <Card className="w-full mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Upcoming Inventory report plan
            </h1>
            <p className="text-muted-foreground">
              Stay on top of your schedule with our detailed plan.
            </p>
          </div>
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
          </div>
        </div>
        {isLoading ? (
          <TaskListSkeleton />
        ) : (
          <div className="space-y-8 h-[400px] overflow-auto">
            {eventDateRanges.length > 0 ? (
              eventDateRanges.map((eventRange, index) => {
                const dayFormatOptions: Intl.DateTimeFormatOptions = {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                };
                const timeFormatOptions: Intl.DateTimeFormatOptions = {
                  hour: '2-digit',
                  minute: '2-digit'
                };
                // Format the from and to dates
                const formattedTimeFrom = new Date(eventRange.events.from).toLocaleString(
                  'en-GB',
                  timeFormatOptions
                );
                const formattedTimeTo = new Date(eventRange.events.to).toLocaleString(
                  'en-GB',
                  timeFormatOptions
                );
                const formattedDateFrom = new Date(eventRange.events.from).toLocaleString(
                  'en-GB',
                  dayFormatOptions
                );
                const formattedDateTo = new Date(eventRange.events.to).toLocaleString(
                  'en-GB',
                  dayFormatOptions
                );

                return (
                  <div key={index} className="grid grid-cols-[250px_1fr] gap-4 opacity-80">
                    <div>
                      <h2 className="font-semibold">{eventRange.label}</h2>
                      <p className="text-sm text-muted-foreground">
                        {formattedTimeFrom} - {formattedTimeTo}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <Card key={eventRange.events.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Captions size={20} />
                              <h3 className="font-semibold">
                                {eventRange.events.title} - {eventRange.events.code}
                              </h3>
                              <Badge
                                className={cn(
                                  `ml-2`,
                                  badgeVariants({
                                    variant: getStatusBadgeVariant(
                                      eventRange.events.status ?? '',
                                      InventoryReportPlanStatus
                                    )
                                  })
                                )}>
                                {convertTitleToTitleCase(eventRange.events.status)}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-3 *:ring *:ring-background">
                                {eventRange.events.inventoryReportPlanDetail.map(
                                  (detail, index) => (
                                    <Avatar key={index}>
                                      <AvatarImage
                                        src={detail.warehouseStaff?.account?.avatarUrl}
                                        alt="avatar"
                                      />
                                      <AvatarFallback>
                                        {detail.warehouseStaff?.account?.firstName}
                                      </AvatarFallback>
                                    </Avatar>
                                  )
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {formattedDateFrom} - {formattedDateTo}
                                </span>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`plan/${eventRange.events.id}`)}>
                                View
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No plan to display
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StocktakingPlanList;
