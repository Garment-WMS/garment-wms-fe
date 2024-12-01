'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllTasks, getTaskByRolefn, getTaskByTimeZoneAndRole } from '@/api/services/taskApi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAccountByRole } from '@/api/account/accountApi';

import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import Loading from '@/components/common/Loading';
import { useToast } from '@/hooks/use-toast';
// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);
export interface Props {
  staff: any;
  setStaff: (staff: any) => void;
  type: string;
  setSelectedTimeFrame: (expectFinishedAtexpectFinishedAt: any) => void;
  role: string;
  selectedInspectionTimeFrame?: any;
}

export default function AssignStaffPopup({
  staff,
  setStaff,
  type,
  setSelectedTimeFrame,
  role,
  selectedInspectionTimeFrame
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<any>>({});
  const [participants, setParticipants] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track the selected date
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number>();
  const { toast } = useToast();
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
  };
  const filteredTasks = (tasks: any) => {
    return tasks.map((task: any) => ({
      ...task,
      resourceId:
        task?.inspectionDepartment?.account?.id ||
        task?.warehouseStaff?.account?.id ||
        task.resourceId,
      start: task.startedAt ? new Date(task.startedAt) : new Date(task.expectedStartedAt),
      end: task.finishedAt ? new Date(task.finishedAt) : new Date(task.expectedFinishedAt),
      title: task?.code
    }));
  };
  console.log(filteredTasks(tasks));
  const resources = useMemo(
    () =>
      participants.map((participant: any) => ({
        id: participant.accountId,
        title: `${participant?.account?.firstName + ' ' + participant?.account?.lastName}`
      })),
    [participants]
  );

  const handleSelectSlot = (slotInfo: any) => {
    const now = new Date();
    if (slotInfo.start < now) {
      toast({
        variant: 'destructive',
        title: 'invalid selection',
        description: 'Task should be after current time '
      });
      return;
    } else if (
      selectedInspectionTimeFrame?.expectFinishedAt &&
      slotInfo.start < selectedInspectionTimeFrame?.expectFinishedAt
    ) {
      toast({
        variant: 'destructive',
        title: 'invalid selection',
        description: 'Task should be after inspection report'
      });
      return;
    }

    setDuration((slotInfo.end - slotInfo.start) / 60000);
    const participant = participants.find((p: any) => p.accountId === slotInfo.resourceId);
    setNewTask({
      title: participant
        ? `${type == 'warehouseStaffId' ? `Warehouse Task for ` : `Inspection request for `} ${participant?.account?.firstName} ${participant?.account?.lastName}`
        : '',
      start: slotInfo.start,
      end: slotInfo.end,
      resourceId: participant.accountId,
      taskType: 'EXP-TAS-NEW'
    });

    setIsDialogOpen(true);
  };
  const isParticipantAvailable = (participantId: string, start: Date, end: Date) => {
    return !filteredTasks(tasks).some((task: any) => {
      return (
        task.resourceId === participantId &&
        ((start >= task.start && start < task.end) || // Overlaps start
          (end > task.start && end <= task.end) || // Overlaps end
          (start <= task.start && end >= task.end)) // Fully overlaps
      );
    });
  };

  const handleCreateTask = () => {
    if (newTask.title && newTask.start && newTask.end) {
      setTasks([
        ...tasks,
        {
          ...(newTask as any),
          id: Date.now(),
          startedAt: newTask.start,
          finishedAt: newTask.end,
          expectedStartedAt: newTask.start,
          expectedFinishedAt: newTask.end,
          code: `${type == 'warehouseStaffId' ? `TAS-NEW` : `New Inspection Task`}`
        }
      ]);

      setSelectedTimeFrame({ expectedStartedAt: newTask.start, expectedFinishedAt: newTask.end });
      handleAssignTask(newTask.resourceId);
      setIsDialogOpen(false);
      //setNewTask({});
    }
  };

  const handleDurationChange = (duration: number) => {
    if (newTask.start) {
      setDuration(duration);
      const newEnd = new Date(newTask.start.getTime() + duration * 60000);
      if (!isParticipantAvailable(newTask.participantId as string, newTask.start, newEnd)) {
        alert('The participant is not available for the selected time range.');
        return;
      }

      setNewTask({ ...newTask, end: newEnd });
    }
  };

  const handleAssignTask = (staffId: string) => {
    setStaff(participants.find((staff: any) => staff.accountId == staffId));
    setIsOpen(false);
  };
  const handleDateChange = (direction: 'prev' | 'next') => {
    setSelectedDate((prevDate) =>
      direction === 'prev'
        ? new Date(prevDate.setDate(prevDate.getDate() - 1))
        : new Date(prevDate.setDate(prevDate.getDate() + 1))
    );
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const [tasks, accounts] = await Promise.all([
          getTaskByRolefn(type),
          getAccountByRole({ role: role })
        ]);
        setTasks(tasks.data.data);
        setParticipants(accounts.data);
      } catch (err) {
        console.error('Error fetching staff availability:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
  const slotPropGetter = (date: Date) => {
    const now = new Date();

    const isDisabled = date < selectedInspectionTimeFrame?.expectedFinishedAt;
    const isPast = date < now;

    return {
      style: {
        backgroundColor: isPast ? '#cdcccc' : isDisabled ? '#d4bfbf' : 'white',
        cursor: isDisabled || isPast ? 'not-allowed' : 'pointer'
      }
    };
  };
  const handleOpen = () => {
    setIsOpen(true); // Open the dialog if conditions are met
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          handleOpen();
        } else {
          setIsOpen(false); // Close the dialog when manually toggled off
        }
      }}>
      <DialogTrigger asChild>
        {staff ? (
          <Badge variant="outline">
            <div className="">
              <div className="flex items-center">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={staff.account.avatarUrl} />
                  <AvatarFallback>
                    {staff.account.firstName.slice(0, 1) + staff.account.lastName.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                {staff.account.firstName + ' ' + staff.account.lastName}
              </div>
              <div>
                <div>
                  {newTask.start && newTask.end
                    ? `${new Date(newTask.start).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })} - ${new Date(newTask.end).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}`
                    : 'No date available'}
                </div>
              </div>
            </div>
          </Badge>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsOpen(true)} // Allow manual override
          >
            Assign Employee
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[825px]">
        {!isLoading ? (
          <>
            <DialogHeader>
              <DialogTitle>Assign Staff to Tasks</DialogTitle>
              <div className="flex justify-between items-center my-4">
                <Button variant="ghost" onClick={() => handleDateChange('prev')}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-lg font-semibold">{selectedDate.toDateString()}</span>
                <Button variant="ghost" onClick={() => handleDateChange('next')}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </DialogHeader>
            <div style={{ height: '500px' }}>
              {participants && tasks && (
                <Calendar
                  localizer={localizer}
                  events={filteredTasks(tasks)}
                  startAccessor="start"
                  endAccessor="end"
                  date={selectedDate}
                  defaultView={Views.DAY}
                  views={[Views.DAY]}
                  step={15}
                  timeslots={1}
                  resources={resources}
                  resourceIdAccessor="id"
                  resourceTitleAccessor="title"
                  selectable
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={(event: any) => ({
                    style: {
                      backgroundColor:
                        event.title === 'New Warehouse Task'
                          ? '#31ad70'
                          : event.participantId === '2'
                            ? '#ad4331'
                            : '#246bfd'
                    }
                  })}
                  slotPropGetter={slotPropGetter}
                  components={{
                    event: (props) => (
                      <div className="text-white p-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap text-center">
                        {props.title}
                      </div>
                    )
                  }}
                  dayLayoutAlgorithm="no-overlap"
                  formats={{
                    dayFormat: 'dddd, MMMM D, YYYY'
                  }}
                  toolbar={false}
                  min={new Date(2024, 10, 30, 9, 0)}
                  max={new Date(2024, 10, 30, 18, 0)}
                />
              )}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Warehouse Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-center">
                    <div className="">
                      <h3 className="">{newTask.title}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-duration" className="text-right">
                      Duration (minutes)
                    </Label>
                    <Input
                      id="task-duration"
                      type="number"
                      min="15"
                      step="15"
                      defaultValue="30"
                      value={duration}
                      onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Start Time</Label>
                    <div className="col-span-3">{new Date(newTask.start).toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">End Time</Label>
                    <div className="col-span-3">{new Date(newTask.end).toLocaleString()}</div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateTask}>Assign Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {selectedEvent && (
              <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Task Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Task type</Label>
                      <div className="col-span-3">{selectedEvent.taskType}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Code</Label>
                      <div className="col-span-3">{selectedEvent.code}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Start Time</Label>
                      <div className="col-span-3">
                        {new Date(selectedEvent.start).toLocaleString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">End Time</Label>
                      <div className="col-span-3">{selectedEvent.end.toLocaleString()}</div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setSelectedEvent(null)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-[500px]">
            <Loading size={'100'} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
