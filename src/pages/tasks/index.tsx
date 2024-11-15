'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup';
import {
  Package,
  ClipboardCheck,
  Truck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  LayoutGrid,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Task = {
  id: string;
  title: string;
  type: 'import' | 'export' | 'recheck';
  status: 'in progress' | 'completed' | 'canceled';
  dueDate: string;
  assignedTo: {
    name: string;
    avatar: string;
  };
};

const tasks: Task[] = [
  {
    id: 'T001',
    title: 'Import packages from Dock A to Storage B',
    type: 'import',
    status: 'in progress',
    dueDate: '2024-11-15T14:00:00',
    assignedTo: {
      name: 'John Doe',
      avatar: '/placeholder.svg?height=40&width=40'
    }
  },
  {
    id: 'T002',
    title: 'Recheck inventory in Aisle C',
    type: 'recheck',
    status: 'completed',
    dueDate: '2024-11-14T16:30:00',
    assignedTo: {
      name: 'Jane Smith',
      avatar: '/placeholder.svg?height=40&width=40'
    }
  },
  {
    id: 'T003',
    title: 'Export fragile items to secure storage',
    type: 'export',
    status: 'canceled',
    dueDate: '2024-11-16T09:00:00',
    assignedTo: {
      name: 'Bob Johnson',
      avatar: '/placeholder.svg?height=40&width=40'
    }
  }
];

const getStatusDetails = (status: Task['status']) => {
  switch (status) {
    case 'in progress':
      return { label: 'In Progress', color: 'bg-blue-500 text-blue-950', icon: Clock };
    case 'completed':
      return { label: 'Completed', color: 'bg-green-500 text-green-950', icon: CheckCircle };
    case 'canceled':
      return { label: 'Canceled', color: 'bg-red-500 text-red-950', icon: XCircle };
  }
};

const TaskTypeIcon = ({ type }: { type: Task['type'] }) => {
  switch (type) {
    case 'import':
      return <Truck className="h-5 w-5 text-muted-foreground" />;
    case 'export':
      return <Truck className="h-5 w-5 text-muted-foreground" />;
    case 'recheck':
      return <ClipboardCheck className="h-5 w-5 text-muted-foreground" />;
  }
};

const categorizeTasks = (tasks: Task[]) => {
  const importTasks = tasks.filter((task) => task.type === 'import');
  const exportTasks = tasks.filter((task) => task.type === 'export');
  const recheckTasks = tasks.filter((task) => task.type === 'recheck');
  return { importTasks, exportTasks, recheckTasks };
};

export default function MyTasks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const navigate = useNavigate();
  const { importTasks, exportTasks, recheckTasks } = categorizeTasks(tasks);

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const renderTasks = (tasks: Task[]) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-full">
      {tasks.map((task) => (
        <Card key={task.id} className="flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 flex justify-center items-center opacity-10">
            {task.type === 'import' || task.type === 'export' ? (
              <Truck className="h-48 w-48 text-muted-foreground" />
            ) : (
              <ClipboardCheck className="h-48 w-48 text-muted-foreground" />
            )}
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium">Task #{task.id}</CardTitle>
            <Badge className={getStatusDetails(task.status).color}>
              {getStatusDetails(task.status).label}
            </Badge>
          </CardHeader>
          <CardContent className="h-full z-10">
            <div className="text-2xl font-bold">{task.title}</div>
            <p className="text-xs text-muted-foreground">
              Due: {new Date(task.dueDate).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-end z-10">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{task.assignedTo.name}</span>
            </div>
            <Button variant="outline" onClick={() => handleNavigate(task)}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const handleNavigate = (task: any) => {
    navigate(task.id);
  };
  const renderGridView = () => (
    <>
      <h2 className="text-xl font-semibold mb-4">Import Tasks</h2>
      {renderTasks(importTasks)}
      <h2 className="text-xl font-semibold mt-8 mb-4">Export Tasks</h2>
      {renderTasks(exportTasks)}
      <h2 className="text-xl font-semibold mt-8 mb-4">Recheck Tasks</h2>
      {renderTasks(recheckTasks)}
    </>
  );

  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.id}</TableCell>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              <TaskTypeIcon type={task.type} />
            </TableCell>
            <TableCell>
              <Badge className={getStatusDetails(task.status).color}>
                {getStatusDetails(task.status).label}
              </Badge>
            </TableCell>
            <TableCell>{new Date(task.dueDate).toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                  <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{task.assignedTo.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <Button variant="outline" onClick={() => handleNavigate(task)}>
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warehouse Tasks</h1>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value: string) => setViewMode(value as 'grid' | 'table')}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderTableView()}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>Detailed information about the selected task.</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <TaskTypeIcon type={selectedTask.type} />
                <span className="font-medium">{selectedTask.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Assigned to: {selectedTask.assignedTo.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Due: {new Date(selectedTask.dueDate).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4">
                {React.createElement(getStatusDetails(selectedTask.status).icon, {
                  className: 'h-5 w-5 text-muted-foreground'
                })}
                <span>Status: {getStatusDetails(selectedTask.status).label}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
