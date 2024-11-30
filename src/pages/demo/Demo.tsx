'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog';
import React, { useMemo, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Sample data for our participants and their tasks
const participants = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' }
];

const initialTasks = [
  {
    id: 1,
    title: 'Meeting with clients',
    start: new Date(2024, 5, 30, 9, 0),
    end: new Date(2024, 5, 30, 10, 30),
    participantId: '1'
  },
  {
    id: 2,
    title: 'Project planning',
    start: new Date(2024, 10, 30, 10, 0),
    end: new Date(2024, 10, 30, 12, 30),
    participantId: '1'
  },
  {
    id: 3,
    title: 'Team standup',
    start: new Date(2024, 10, 30, 10, 0),
    end: new Date(2024, 10, 30, 10, 30),
    participantId: '2'
  },
  {
    id: 4,
    title: 'Code review',
    start: new Date(2024, 10, 30, 14, 0),
    end: new Date(2024, 10, 30, 15, 30),
    participantId: '2'
  },
  {
    id: 5,
    title: 'Training session',
    start: new Date(2024, 10, 30, 13, 0),
    end: new Date(2024, 10, 30, 14, 30),
    participantId: '3'
  }
];

interface Task {
  id: number;
  title: string;
  start: Date;
  end: Date;
  participantId: string;
}

export function Scheduler() {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({});

  const handleParticipantChange = (participantId: string, index: number) => {
    const newSelectedParticipants = [...selectedParticipants];
    newSelectedParticipants[index] = participantId;
    setSelectedParticipants(newSelectedParticipants);
  };

  const filteredTasks = useMemo(
    () =>
      tasks
        .filter((task) => selectedParticipants.includes(task.participantId))
        .map((task) => ({
          ...task,
          resourceId: task.participantId
        })),
    [selectedParticipants, tasks]
  );

  const resources = useMemo(
    () =>
      participants
        .filter((participant) => selectedParticipants.includes(participant.id))
        .map((participant) => ({
          id: participant.id,
          title: participant.name
        })),
    [selectedParticipants]
  );

  const handleSelectSlot = (slotInfo: any) => {
    const now = new Date();
    if (slotInfo.end < now) {
      alert('Cannot schedule tasks in the past.');
      return;
    } else if (slotInfo.start < now) {
      setNewTask({
        start: now,
        end: new Date(now.getTime() + 30 * 60000), // Default 30 minutes duration
        participantId: (slotInfo as any).resourceId
      });
      setIsDialogOpen(true);
    } else {
      setNewTask({
        start: slotInfo.start,
        end: new Date(slotInfo.start.getTime() + 30 * 60000), // Default 30 minutes duration
        participantId: (slotInfo as any).resourceId
      });
      setIsDialogOpen(true);
    }
  };

  const handleCreateTask = () => {
    if (newTask.title && newTask.start && newTask.end && newTask.participantId) {
      setTasks([...tasks, { ...(newTask as Task), id: Date.now() }]);
      setIsDialogOpen(false);
      setNewTask({});
    }
  };

  const handleDurationChange = (duration: number) => {
    if (newTask.start) {
      setNewTask({
        ...newTask,
        end: new Date(newTask.start.getTime() + duration * 60000)
      });
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Horizontal Timeline Scheduling System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          {[0, 1].map((index) => (
            <Select
              key={index}
              onValueChange={(value) => handleParticipantChange(value, index)}
              value={selectedParticipants[index]}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Select participant ${index + 1}`} />
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
        <div style={{ height: '500px' }}>
          <Calendar
            localizer={localizer}
            events={filteredTasks}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.DAY}
            views={[Views.DAY]}
            step={15}
            timeslots={1}
            resources={resources}
            resourceIdAccessor="id"
            resourceTitleAccessor="title"
            selectable
            onSelectSlot={handleSelectSlot}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.participantId === '1'
                    ? '#3174ad'
                    : event.participantId === '2'
                      ? '#ad4331'
                      : '#31ad70'
              }
            })}
            components={{
              event: (props) => (
                <div className="text-white p-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
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
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">
                Title
              </Label>
              <Input
                id="task-title"
                value={newTask.title || ''}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
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
                onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Start Time</Label>
              <div className="col-span-3">{newTask.start?.toLocaleTimeString()}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">End Time</Label>
              <div className="col-span-3">{newTask.end?.toLocaleTimeString()}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
