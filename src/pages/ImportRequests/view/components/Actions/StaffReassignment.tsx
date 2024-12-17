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
import {
  AlertCircle,
  CheckCheckIcon,
  ChevronLeft,
  ChevronLeftCircleIcon,
  ChevronRight,
  Plus
} from 'lucide-react';
import { getAllTasks, getTaskByRolefn, getTaskByTimeZoneAndRole } from '@/api/services/taskApi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAccountByRole } from '@/api/account/accountApi';

import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import Loading from '@/components/common/Loading';
import { useToast } from '@/hooks/use-toast';

import { FaArrowRightLong } from 'react-icons/fa6';
import { Card } from '@/components/ui/card';
import { reassignStaffFn } from '@/api/purchase-staff/importRequestApi';
import { useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/ScrollArea';
// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);
export interface Props {
  onApproval: () => void;
  importRequest: any;
  staff?: any;
  setStaff?: (staff: any) => void;
  type: string;
  role: string;
  selectedInspectionTimeFrame?: any;
}

export default function ReassingStaffPopup({
  onApproval,
  importRequest,
  type,
  role,
  selectedInspectionTimeFrame
}: Props) {
  const [staff, setStaff] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<any>>({});
  const [participants, setParticipants] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track the selected date
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number>();
  const [selectedWareHouseTimeFrame, setSelectedWareHouseTimeFrame] = useState<any>();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // Added state for confirmation dialog
  const { id } = useParams();
  const { toast } = useToast();
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
  };
  const filteredTasks = (tasks: any) => {
    const resetTasks = tasks.filter((task: any) => task.isNew != true);
    return resetTasks.map((task: any) => ({
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
      selectedInspectionTimeFrame?.expectedFinishedAt &&
      slotInfo.start < selectedInspectionTimeFrame?.expectedFinishedAt
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
      id: Date.now(),
      startedAt: newTask.start,
      finishedAt: newTask.end,
      code: `${type == 'warehouseStaffId' ? `New Warehouse Task` : `New Inspection Task`}`
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
      const resetTasks = tasks.filter((task: any) => task.isNew != true);
      setTasks([
        ...resetTasks,
        {
          ...(newTask as any),
          id: Date.now(),
          startedAt: newTask.start,
          finishedAt: newTask.end,
          code: `${type == 'warehouseStaffId' ? `New Warehouse Task` : `New Inspection Task`}`,
          isNew: true
        }
      ]);

      setSelectedWareHouseTimeFrame({
        expectedStartedAt: newTask.start,
        expectedFinishedAt: newTask.end
      });
      handleAssignTask(newTask.resourceId);
      // setIsDialogOpen(false);
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
    setIsDialogOpen(false);
  };
  const handleDateChange = (direction: 'prev' | 'next') => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);

      if (direction === 'prev') {
        // Go back one day
        newDate.setDate(newDate.getDate() - 1);
        // If the new date is Friday, go back to Thursday
        if (newDate.getDay() === 0) {
          newDate.setDate(newDate.getDate() - 2);
        }
      } else {
        // Go forward one day
        newDate.setDate(newDate.getDate() + 1);
        // If the new date is Friday, skip to Monday
        if (newDate.getDay() === 6) {
          newDate.setDate(newDate.getDate() + 2);
        }
      }

      return newDate;
    });
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

  const handleSubmit = async () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmSubmit = async () => {
    try {
      setLoading(true);
      const res = await reassignStaffFn(
        role,
        id as string,
        staff?.id,
        selectedWareHouseTimeFrame.expectedStartedAt,
        selectedWareHouseTimeFrame.expectedFinishedAt,
        staff?.id,
        selectedWareHouseTimeFrame.expectedStartedAt,
        selectedWareHouseTimeFrame.expectedFinishedAt
      );

      if (res.statusCode == 200) {
        toast({ variant: 'success', title: 'Re-assign Successfully !' });
        setIsOpen(false);
        onApproval();
      }
    } catch (err: any) {
      console.log(err);
      toast({
        variant: 'destructive',
        title: 're-assign unsuccessfully',
        description: err.response.data.message
      });
    } finally {
      setLoading(false);
      setIsConfirmDialogOpen(false);
    }
  };

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
    if (role === 'warehouse-staff' && !selectedInspectionTimeFrame?.expectedFinishedAt) {
      toast({
        variant: 'destructive',
        title: 'Please select task for inspection first',
        description: 'Please choose time for assigning the inspection staff first'
      });
      setIsOpen(false); // Ensure the dialog remains closed
    } else {
      setIsOpen(true); // Open the dialog if conditions are met
    }
  };
  const handleOpenReassign = () => {
    setStaff(null);
    setSelectedWareHouseTimeFrame(null);
    setIsOpen(true);
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
        <Button
          variant="outline"
          onClick={handleOpenReassign} // Allow manual override
        >
          Reassign Employee
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[800px]">
        <ScrollArea className="">
          {!isLoading ? (
            <>
              <DialogHeader>
                <DialogTitle>Assign Staff to Tasks</DialogTitle>
                <p>You can select, drag and drop to assign and re-assign the task</p>
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
                          event.title === 'New Warehouse Task' ||
                          event.title === 'New Inspection Task'
                            ? '#31ad70' // Green for these tasks
                            : '#246bfd' // Default color for others
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
                    <DialogTitle>{newTask ? 'Re-Assign ' : ' Assign new '} Task</DialogTitle>
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
                      <div className="col-span-3">
                        {new Date(newTask.start).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true // Use 24-hour format
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">End Time</Label>
                      <div className="col-span-3">
                        {new Date(newTask.end).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true // Use 24-hour format
                        })}
                      </div>
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
                          {new Date(selectedEvent.start).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false // Use 24-hour format
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">End Time</Label>
                        <div className="col-span-3">
                          {selectedEvent.end.toLocaleString('en-GB', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true // Use 24-hour format
                          })}
                        </div>
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
          <div className="flex items-center">
            {role == 'inspection-department' && (
              <Card className="rounded p-2  w-[40%]">
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage
                      src={
                        importRequest?.inspectionRequest[0]?.inspectionDepartment?.account.avatarUrl
                      }
                    />
                    <AvatarFallback>
                      {importRequest?.inspectionRequest[0]?.inspectionDepartment?.account.firstName.slice(
                        0,
                        1
                      ) +
                        importRequest?.inspectionRequest[0]?.inspectionDepartment?.account.lastName.slice(
                          0,
                          1
                        )}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className={staff ? 'line-through' : ''}>
                    {' '}
                    {importRequest?.inspectionRequest[0]?.inspectionDepartment?.account.firstName +
                      ' ' +
                      importRequest?.inspectionRequest[0]?.inspectionDepartment?.account.lastName}
                  </h3>
                </div>
                <div className={staff ? 'line-through' : ''}>
                  {new Date(importRequest?.importExpectedStartedAt)
                    .toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true // 24-hour format
                    })
                    .replace(/\b(am|pm)\b/g, (match) => match.toUpperCase())}
                  {' - '}
                  {new Date(importRequest?.importExpectedFinishedAt)
                    .toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true // 24-hour format
                    })
                    .replace(/\b(am|pm)\b/g, (match) => match.toUpperCase())}
                </div>
              </Card>
            )}
            {role == 'warehouse-staff' && (
              <Card className="rounded p-2  w-[40%]">
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage src={importRequest?.warehouseStaff.account.avatarUrl} />
                    <AvatarFallback>
                      {importRequest?.warehouseStaff.account.firstName.slice(0, 1) +
                        importRequest?.warehouseStaff.account.lastName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="line-through">
                    {' '}
                    {importRequest?.warehouseStaff.account.firstName +
                      ' ' +
                      importRequest?.warehouseStaff.account.lastName}
                  </h3>
                </div>
                <div className={staff ? 'line-through' : ''}>
                  {new Date(importRequest?.importExpectedStartedAt)
                    .toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true // 24-hour format
                    })
                    .replace(/\b(am|pm)\b/g, (match) => match.toUpperCase())}
                  {' - '}
                  {new Date(importRequest?.importExpectedFinishedAt)
                    .toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true // 24-hour format
                    })
                    .replace(/\b(am|pm)\b/g, (match) => match.toUpperCase())}
                </div>
              </Card>
            )}
            {staff && (
              <div>
                <FaArrowRightLong size={90} className="mr-10 ml-10 " color="#e1e1e1" />
              </div>
            )}
            {staff && (
              <Card className="rounded p-2 bg-green-500 text-white  w-[40%]">
                <div className="flex items-center">
                  <Avatar className="mr-4">
                    <AvatarImage src={staff.account.avatarUrl} />
                    <AvatarFallback>
                      {staff.account.firstName.slice(0, 1) + staff.account.lastName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold">
                    {' '}
                    {staff.account.firstName + ' ' + staff.account.lastName}
                  </h3>
                </div>
                <div>
                  {new Date(selectedWareHouseTimeFrame?.expectedStartedAt)
                    .toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true // 24-hour format
                    })
                    .replace(/\b(am|pm)\b/g, (match) => match.toUpperCase())}
                  {' - '}
                  {new Date(selectedWareHouseTimeFrame?.expectedFinishedAt)
                    .toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true // 24-hour format
                    })
                    .replace(/\b(am|pm)\b/g, (match) => match.toUpperCase())}
                </div>
              </Card>
            )}
          </div>
          <div className="flex justify-end">
            <Button className="m-2" variant={'outline'} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button className="m-2" onClick={handleSubmit} disabled={!staff}>
              Confirm
            </Button>
          </div>
          <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Re-assignment</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to re-assign this staff member?</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmSubmit}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
