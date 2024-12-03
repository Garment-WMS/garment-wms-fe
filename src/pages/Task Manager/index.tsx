import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Truck, ClipboardCheck } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAccountByRole } from '@/api/account/accountApi';
import { getTaskByRolefn } from '@/api/services/taskApi';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { Badge } from '@/components/ui/Badge';

interface Staff {
  id: string;
  role: string;
  accountId: string;
  account: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
  };
}
const getStatusDetails = (status: string) => {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return { label: 'Open', color: 'bg-blue-500 text-blue-950' };
    case 'DONE':
      return { label: 'Completed', color: 'bg-green-500 text-green-950' };
    case 'CANCELED':
      return { label: 'Canceled', color: 'bg-red-500 text-red-950' };
    default:
      return { label: status, color: 'bg-gray-500 text-gray-950' };
  }
};

const localizer = momentLocalizer(moment);

export interface Task {
  id: string;
  code: string;
  taskType: string;
  status: string;
  startedAt: string;
  expectedStartedAt: string;
  expectedFinishedAt: string;
  finishedAt: string;
  warehouseStaff?: {
    accountId: string;
    account: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
  inspectionDepartment?: {
    accountId: string;
    account: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
}

export function convertTasksToEvents(tasks: Task[]): CalendarEvent[] {
  return tasks.map((task) => ({
    id: task.id,
    title: `${task.taskType} - ${task.code}`,
    start: new Date(task.startedAt || task.expectedStartedAt),
    end: new Date(task.finishedAt || task.expectedFinishedAt),
    resourceId: task.warehouseStaff?.account.id || task.inspectionDepartment?.account.id || '',
    status: task.status,
    taskType: task.taskType
  }));
}

export default function TaskManagerOverview() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskEvents, setTaskEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [warehouseStaff, setWarehouseStaff] = useState<Staff[]>([]);
  const [inspectionStaff, setInspectionStaff] = useState<Staff[]>([]);
  const [activeTab, setActiveTab] = useState<'warehouse' | 'inspection'>('warehouse');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleSelectEvent = (event: CalendarEvent) => {
    const task = tasks.find((t) => t.id === event.id);
    if (task) {
      setSelectedTask(task);
      setIsDialogOpen(true);
    }
  };
  useEffect(() => {
    const fetchStaffAndTasks = async () => {
      setIsLoading(true);
      try {
        const [warehouseStaffData, inspectionStaffData, warehouseTasks, inspectionTasks] =
          await Promise.all([
            getAccountByRole({ role: 'warehouse-staff' }),
            getAccountByRole({ role: 'inspection-department' }),
            getTaskByRolefn('warehouseStaffId'),
            getTaskByRolefn('inspectionDepartmentId')
          ]);

        setWarehouseStaff(warehouseStaffData.data);
        setInspectionStaff(inspectionStaffData.data);
        setTasks([...warehouseTasks.data.data, ...inspectionTasks.data.data]);
        setTaskEvents(
          convertTasksToEvents([...warehouseTasks.data.data, ...inspectionTasks.data.data])
        );
        console.log(
          convertTasksToEvents([...warehouseTasks.data.data, ...inspectionTasks.data.data])
        );
      } catch (error) {
        console.error('Error fetching staff and tasks data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffAndTasks();
  }, []);

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

  const resources =
    activeTab === 'warehouse'
      ? warehouseStaff.map((staff: Staff) => ({
          id: staff.accountId,
          title: `${staff.account.firstName} ${staff.account.lastName}`
        }))
      : inspectionStaff.map((staff) => ({
          id: staff.accountId,
          title: `${staff.account.firstName} ${staff.account.lastName}`
        }));

  const filteredEvents = taskEvents.filter((event) =>
    activeTab === 'warehouse'
      ? warehouseStaff.some((staff) => staff.accountId === event.resourceId)
      : inspectionStaff.some((staff) => staff.accountId === event.resourceId)
  );

  if (isLoading) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        <Loading size="100" />
      </div>
    );
  }
  const closeDialog = () => {
    setSelectedTask(null);
    setIsDialogOpen(false);
  };
  const TaskTypeIcon = ({ type, className }: { type: string; className: string }) => {
    switch (type.toUpperCase()) {
      case 'IMPORT':
        return <Truck className={`h-5 w-5 ${className}`} />;
      case 'EXPORT':
        return <Truck className={`h-5 w-5 ${className}`} />;
      default:
        return <ClipboardCheck className={`h-5 w-5 ${className}`} />;
    }
  };
  const EventComponent = ({ event }: { event: any }) => {
    const { label, color } = getStatusDetails(event.status);

    return (
      <div className={`flex items-center gap-2 p-2 rounded ${color}`}>
        <TaskTypeIcon type={event.taskType} className="text-xl text-white" />
        <span className=" text-white">{event.title}</span>
      </div>
    );
  };
  const handleNavigate = (taskId: string) => {
    navigate(`/tasks-management-detail/${taskId}`);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager Overview</h1>
      </div>

      <Tabs
        defaultValue="warehouse"
        onValueChange={(value) => setActiveTab(value as 'warehouse' | 'inspection')}>
        <TabsList>
          <TabsTrigger value="warehouse">Warehouse Staff</TabsTrigger>
          <TabsTrigger value="inspection">Inspection Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="warehouse">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Warehouse Staff Tasks</CardTitle>
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
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                views={['day']}
                defaultView="day"
                date={selectedDate}
                onNavigate={(newDate) => setSelectedDate(newDate)}
                min={new Date(selectedDate.setHours(9, 0, 0, 0))}
                max={new Date(selectedDate.setHours(17, 59, 59, 999))}
                step={7.5}
                onSelectEvent={handleSelectEvent}
                timeslots={4}
                resources={resources}
                resourceIdAccessor="id"
                resourceTitleAccessor="title"
                formats={{
                  timeGutterFormat: (date, culture, localizer) =>
                    localizer.format(date, 'HH:mm', culture)
                }}
                components={{
                  event: EventComponent
                }}
                className="min-h-[600px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inspection">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Inspection Staff Tasks</CardTitle>
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
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                views={['day']}
                defaultView="day"
                date={selectedDate}
                onNavigate={(newDate) => setSelectedDate(newDate)}
                min={new Date(selectedDate.setHours(0, 0, 0, 0))}
                max={new Date(selectedDate.setHours(23, 59, 59, 999))}
                onSelectEvent={handleSelectEvent}
                step={15}
                timeslots={4}
                resources={resources}
                resourceIdAccessor="id"
                resourceTitleAccessor="title"
                formats={{
                  timeGutterFormat: (date, culture, localizer) =>
                    localizer.format(date, 'HH:mm', culture)
                }}
                components={{
                  event: EventComponent
                }}
                className="min-h-[600px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
                  <div className="text-2xl font-bold mb-2 flex items-end w-full ">
                    {selectedTask.taskType} TASK{' '}
                    <TaskTypeIcon type={selectedTask.taskType} className="ml-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Expected Started At: {new Date(selectedTask.expectedStartedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Expected End date: {new Date(selectedTask.expectedFinishedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Actual Started At:
                    {selectedTask.startedAt
                      ? new Date(selectedTask.startedAt).toLocaleString()
                      : 'Not yet'}
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
    </div>
  );
}
