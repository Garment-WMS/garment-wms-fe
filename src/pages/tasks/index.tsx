'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  ClipboardCheck,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getMytaskFn } from '@/api/services/taskApi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog'; // Assuming you have a dialog component
export interface Task {
  id: string;
  code: string;
  taskType: string;
  status: string;
  startedAt: string;
  createdAt: string;
  expectedStartedAt: string;
  expectedFinishedAt: string;
  finishedAt: string;
  warehouseStaff: {
    account: {
      id: string;
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

      return {
        id: task.id,
        title: `${task.taskType} - ${task.code}`,
        start: startDate,
        end: endDate
      };
    });
  }
}

const localizer = momentLocalizer(moment);

const getStatusDetails = (status: string) => {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return { label: 'Open', color: 'bg-yellow-500 text-yellow-950' };
    case 'DONE':
      return { label: 'Completed', color: 'bg-green-500 text-green-950' };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'bg-red-500 text-red-950' };
    case 'IN_PROGRESS':
      return { label: 'In progress', color: 'bg-blue-500 text-blue-950' };
    default:
      return { label: status, color: 'bg-gray-500 text-gray-950' };
  }
};

const TaskTypeIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type.toUpperCase()) {
    case 'IMPORT':
    case 'EXPORT':
      return <Truck className={`h-5 w-5 ${className}`} />;
    default:
      return <ClipboardCheck className={`h-5 w-5 ${className}`} />;
  }
};

export default function WarehouseTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskEvents, setTaskEvents] = useState<CalendarEvent[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'warehouse' | 'inspection'>('warehouse');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await getMytaskFn();
        setTasks(response);
        setTaskEvents(convertTasksToEvents(response));
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const convertTasksToEvents = (tasks: Task[]): CalendarEvent[] => {
    return tasks.map((task) => ({
      id: task.id,
      title: `${task.taskType} - ${task.code}`,
      start: new Date(task.startedAt || task.expectedStartedAt),
      end: new Date(task.finishedAt || task.expectedFinishedAt),
      resourceId: task.warehouseStaff?.account.id || '',
      status: task.status,
      taskType: task.taskType
    }));
  };

  const handleDateChange = (action: 'prev' | 'next') => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (action === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };

  const handleNavigate = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };
  const EventComponent = ({ event }: { event: any }) => {
    const { label, color } = getStatusDetails(event.status);

    return (
      <div className={`flex items-center gap-2 p-2 rounded ${color} justify-center h-full`}>
        <TaskTypeIcon type={event.taskType} className="text-white" />
        <span className="text-white">{event.title}</span>
      </div>
    );
  };
  const renderCalendarView = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">Tasks</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => handleDateChange('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>{selectedDate.toDateString()}</span>
          <Button variant="outline" size="icon" onClick={() => handleDateChange('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          localizer={localizer}
          events={taskEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="day"
          views={['day']}
          date={selectedDate}
          onNavigate={(newDate) => setSelectedDate(newDate)}
          min={new Date(0, 0, 0, 0, 0, 0)}
          max={new Date(0, 0, 0, 23, 59, 59)}
          step={15}
          timeslots={4}
          onSelectEvent={handleEventClick}
          components={{
            event: EventComponent
          }}
          formats={{
            timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture)
          }}
          className="min-h-[600px]"
        />
      </CardContent>
    </Card>
  );

  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks?.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.code}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <TaskTypeIcon type={task.taskType} />
                <span>{task.taskType}</span>
              </div>
            </TableCell>
            <TableCell className="">
              <Badge
                className={`${getStatusDetails(task.status).color} w-[80px] flex items-center justify-center`}>
                {getStatusDetails(task.status).label}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(task.createdAt).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Use 24-hour format
              })}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 ">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={task.warehouseStaff.account.avatarUrl || undefined}
                    alt={`${task.warehouseStaff.account.firstName} ${task.warehouseStaff.account.lastName}`}
                  />
                  <AvatarFallback>
                    {task.warehouseStaff.account.firstName[0]}
                    {task.warehouseStaff.account.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {task.warehouseStaff.account.firstName} {task.warehouseStaff.account.lastName}
                </span>
              </div>
            </TableCell>
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

  const renderLoading = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="w-full">
          <CardHeader>
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-28" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warehouse Tasks</h1>
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
      </div>

      {isLoading ? (
        renderLoading()
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : viewMode === 'calendar' ? (
        renderCalendarView()
      ) : (
        renderTableView()
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask?.code || 'Task Details'}</DialogTitle>
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
                  <div className="text-2xl font-bold mb-2 flex items-end w-full">
                    {selectedTask.taskType} TASK{' '}
                    <TaskTypeIcon type={selectedTask.taskType} className="ml-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Expected Started At:{' '}
                    {new Date(selectedTask.expectedStartedAt).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false // Use 24-hour format
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Expected End date:{' '}
                    {new Date(selectedTask.expectedFinishedAt).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false // Use 24-hour format
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Actual Started At:{' '}
                    {new Date(selectedTask.startedAt).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false // Use 24-hour format
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Actual End date:{' '}
                    {selectedTask.finishedAt
                      ? new Date(selectedTask.finishedAt).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false // Use 24-hour format
                        })
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
    </div>
  );
}
