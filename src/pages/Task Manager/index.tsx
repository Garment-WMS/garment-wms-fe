'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { IoIosArrowDown } from 'react-icons/io';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/Dialog';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { ArrowDown, LayoutGrid, List } from 'lucide-react';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAccountByRole } from '@/api/account/accountApi';
import { getAllTasks } from '@/api/services/taskApi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@/components/common/Loading';

interface Staff {
  id: string;
  role: string;
  account: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
  };
}

const localizer = momentLocalizer(moment);

const getStatusDetails = (status: string) => {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return { label: 'Open', color: 'bg-blue-500 text-blue-950' };
    case 'COMPLETED':
      return { label: 'Completed', color: 'bg-green-500 text-green-950' };
    case 'CANCELED':
      return { label: 'Canceled', color: 'bg-red-500 text-red-950' };
    default:
      return { label: status, color: 'bg-gray-500 text-gray-950' };
  }
};
export interface Task {
  expectedStartedAt: string;
  id: string;
  code: string;
  taskType: string;
  status: string;
  startedAt: string;
  createdAt: string;
  role: string;
  expectedFinishedAt: string;
  finishedAt: string;
  warehouseStaff: {
    account: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
  todo: {
    id: string;
    title: string;
    isChecked: boolean;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}
export function convertTasksToEvents(tasks: Task[]): CalendarEvent[] | undefined {
  if (tasks) {
    return tasks?.map((task) => {
      let startDate;
      if (!task.startedAt) {
        startDate = new Date(task.expectedStartedAt);
      } else {
        startDate = new Date(task.startedAt);
      }
      let endDate;
      if (!task.finishedAt) {
        endDate = new Date(task.expectedFinishedAt); // 2 hours later
      } else {
        endDate = new Date(task.finishedAt);
      }
      console.log(endDate);
      return {
        id: task.id,
        title: `${task.taskType} - ${task.code}`,
        start: startDate,
        end: endDate
      };
    });
  }
}

export default function TaskManagerOverview() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskEvents, setTaskEvents] = useState<CalendarEvent[] | undefined>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [warehouseStaff, setWarehouseStaff] = useState<Staff[]>([]);
  const [inspectionStaff, setInspectionStaff] = useState<Staff[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      try {
        const [warehouseStaffData, inspectionStaffData] = await Promise.all([
          getAccountByRole({ role: 'warehouse-staff' }),
          getAccountByRole({ role: 'inspection-department' })
        ]);
        setStaff([
          ...warehouseStaffData.data.map((s: any) => ({ ...s, role: 'warehouse' as const })),
          ...inspectionStaffData.data.map((s: any) => ({ ...s, role: 'inspection' as const }))
        ]);

        setWarehouseStaff(warehouseStaffData.data);
        setInspectionStaff(inspectionStaffData.data);

        if (id) {
          const foundStaff =
            warehouseStaffData.data.find((staff: any) => staff.id === id) ||
            inspectionStaffData.data.find((staff: any) => staff.id === id);

          if (foundStaff) {
            setSelectedStaff(foundStaff);
          }
        }
      } catch (error) {
        console.error('Error fetching staff data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedStaff) {
        setIsLoading(true);
        try {
          const staffType = warehouseStaff.some((staff) => staff.id == selectedStaff.id)
            ? 'warehouseStaffId'
            : 'inspectionDepartmentId';
          const tasksData = await getAllTasks(staffType, selectedStaff.id);
          setTasks(tasksData.data);
          setTaskEvents(convertTasksToEvents(tasksData.data));
          console.log(convertTasksToEvents(tasksData.data));
          navigate(`/tasks-management/${selectedStaff.id}`);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();
  }, [selectedStaff]);

  const renderStaffList = (staffList: Staff[], onSelect: (staff: Staff) => void) => (
    <ScrollArea className="flex flex-col h-[500px] ">
      <h2 className="font-bold m-2">Warehouse Staff</h2>
      {warehouseStaff.map((staff) => (
        <Card key={staff.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={staff.account.avatarUrl}
                alt={`${staff.account.firstName} ${staff.account.lastName}`}
              />
              <AvatarFallback>
                {staff.account.firstName[0]}
                {staff.account.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{`${staff.account.firstName} ${staff.account.lastName}`}</CardTitle>
              <CardDescription>{staff.account.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={'default'}>Warehouse Staff</Badge>
          </CardContent>
          <CardFooter>
            <Button onClick={() => onSelect(staff)} className="w-full">
              Select
            </Button>
          </CardFooter>
        </Card>
      ))}
      <h2 className="font-bold m-2">Inspection Staff</h2>
      {inspectionStaff.map((staff) => (
        <Card key={staff.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={staff.account.avatarUrl}
                alt={`${staff.account.firstName} ${staff.account.lastName}`}
              />
              <AvatarFallback>
                {staff.account.firstName[0]}
                {staff.account.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{`${staff.account.firstName} ${staff.account.lastName}`}</CardTitle>
              <CardDescription>{staff.account.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={'secondary'}>Inspection Staff</Badge>
          </CardContent>
          <CardFooter>
            <Button onClick={() => onSelect(staff)} className="w-full">
              Select
            </Button>
          </CardFooter>
        </Card>
      ))}
    </ScrollArea>
  );

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsDialogOpen(false);
  };

  const handleEventClick = (event: CalendarEvent) => {
    const task = tasks.find((task) => task.id === event.id);
    if (task) {
      setSelectedTask(task);
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setSelectedTask(null);
    setIsDialogOpen(false);
  };

  const handleNavigate = (taskId: string) => {
    navigate(`/tasks-management-detail/${taskId}`);
    console.log(`Navigating to task ${taskId}`);
  };

  const renderTasks = (tasks: Task[]) => (
    <>
      <div className="mt-8">
        <Card>
          <CardContent className="p-0">
            <Calendar
              localizer={localizer}
              events={taskEvents}
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              onSelectEvent={handleEventClick}
              views={['week']}
              min={new Date(0, 0, 0, 0, 0, 0)}
              max={new Date(0, 0, 0, 23, 0, 0)}
              step={15}
              timeslots={4}
              formats={{
                timeGutterFormat: (date: Date, culture: string, localizer: any) =>
                  localizer.format(date, 'HH:mm', culture)
              }}
              className="min-h-[600px]"
            />
          </CardContent>
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.code || 'Event Details'}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedTask && (
              <div key={selectedTask.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Task #{selectedTask.code}</CardTitle>
                  <Badge className={getStatusDetails(selectedTask.status).color}>
                    {getStatusDetails(selectedTask.status).label}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{selectedTask.taskType} TASK</div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Created: {new Date(selectedTask.startedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Expected End date: {new Date(selectedTask.expectFinishedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Actual End date:{' '}
                    {selectedTask.finishedAt
                      ? new Date(selectedTask.finishedAt).toLocaleString()
                      : 'Not yet'}
                  </p>
                </CardContent>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedTask && handleNavigate(selectedTask.id)}
              className="items-center flex">
              View Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.code}</TableCell>
            <TableCell>{task.taskType}</TableCell>
            <TableCell>
              <Badge className={getStatusDetails(task.status).color}>
                {getStatusDetails(task.status).label}
              </Badge>
            </TableCell>
            <TableCell>{new Date(task.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              <Button variant="outline" onClick={() => handleNavigate(task.id)}>
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <Loading size="100" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager Overview</h1>
        {selectedStaff && (
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => setViewMode(value as 'calendar' | 'table')}>
            <ToggleGroupItem value="calendar" aria-label="Calendar view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      <div className="mb-4 w-full flex justify-center ">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 w-40" variant={'outline'}>
              {selectedStaff ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedStaff.account.avatarUrl || undefined}
                      alt={`${selectedStaff.account.firstName} ${selectedStaff.account.lastName}`}
                    />
                    <AvatarFallback>
                      {selectedStaff.account.firstName[0]}
                      {selectedStaff.account.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {selectedStaff.account.firstName} {selectedStaff.account.lastName}
                  </span>
                  <IoIosArrowDown className="text-md" size={20} />
                </>
              ) : (
                <span className="flex items-center font-bold ">
                  Select Staff <IoIosArrowDown className="text-md" size={20} />
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Staff</DialogTitle>
            </DialogHeader>
            {renderStaffList(staff, handleStaffSelect)}
          </DialogContent>
        </Dialog>
      </div>
      {viewMode === 'calendar' ? renderTasks(tasks) : renderTableView()}
    </div>
  );
}
