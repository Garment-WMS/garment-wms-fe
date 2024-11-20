'use client';

import React, { useEffect, useState } from 'react';
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
import {
  Package,
  ClipboardCheck,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  LayoutGrid,
  List
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getMytaskFn } from '@/api/services/taskApi';
import { useNavigate } from 'react-router-dom';

type Task = {
  id: string;
  code: string;
  taskType: string;
  status: string;
  createdAt: string;
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
};

const getStatusDetails = (status: string) => {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return { label: 'Open', color: 'bg-blue-500 text-blue-950', icon: Clock };
    case 'COMPLETED':
      return { label: 'Completed', color: 'bg-green-500 text-green-950', icon: CheckCircle };
    case 'CANCELED':
      return { label: 'Canceled', color: 'bg-red-500 text-red-950', icon: XCircle };
    default:
      return { label: status, color: 'bg-gray-500 text-gray-950', icon: Clock };
  }
};

const TaskTypeIcon = ({ type }: { type: string }) => {
  switch (type.toUpperCase()) {
    case 'IMPORT':
      return <Truck className="h-5 w-5 text-muted-foreground" />;
    case 'EXPORT':
      return <Truck className="h-5 w-5 text-muted-foreground" />;
    default:
      return <ClipboardCheck className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await getMytaskFn();
        setTasks(data);
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

  const handleNavigate = (taskId: string) => {
    navigate(taskId);
  };

  const renderTasks = (tasks: Task[]) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task #{task.code}</CardTitle>
            <Badge className={getStatusDetails(task.status).color}>
              {getStatusDetails(task.status).label}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{task.taskType} Task</div>
            <p className="text-xs text-muted-foreground mb-4">
              Created: {new Date(task.createdAt).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center mt-auto">
            <div className="flex items-center space-x-2">
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
              <span className="text-sm text-muted-foreground">
                {task.warehouseStaff.account.firstName} {task.warehouseStaff.account.lastName}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => handleNavigate(task.id)}
              className="items-center flex">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
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
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.code}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <TaskTypeIcon type={task.taskType} />
                <span>{task.taskType}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusDetails(task.status).color}>
                {getStatusDetails(task.status).label}
              </Badge>
            </TableCell>
            <TableCell>{new Date(task.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
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
          onValueChange={(value) => setViewMode(value as 'grid' | 'table')}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
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
      ) : tasks.length === 0 ? (
        <div className="text-center text-muted-foreground">No tasks found.</div>
      ) : viewMode === 'grid' ? (
        renderTasks(tasks)
      ) : (
        renderTableView()
      )}
    </div>
  );
}
