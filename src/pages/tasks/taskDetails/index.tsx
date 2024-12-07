'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Truck,
  ClipboardCheck,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Assuming you have an API function to fetch task details
import { getTaskDetailFn } from '@/api/services/taskApi';

type Todo = {
  id: string;
  code: string;
  title: string;
  isChecked: boolean;
};

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
  importReceipt: {
    code: string;
    startedAt: string;
  };
  importReceiptId: string;
  todo: Todo[];
};

const getStatusDetails = (status: string) => {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return { label: 'Open', color: 'bg-blue-500 text-blue-950', icon: Clock };
    case 'COMPLETED':
      return { label: 'Completed', color: 'bg-green-500 text-green-950', icon: CheckCircle };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'bg-red-500 text-red-950', icon: XCircle };
    default:
      return { label: status, color: 'bg-gray-500 text-gray-950', icon: Clock };
  }
};

const TaskTypeIcon = ({ type }: { type: string }) => {
  switch (type.toUpperCase()) {
    case 'IMPORT':
      return <Truck className="h-5 w-5" />;
    case 'EXPORT':
      return <Truck className="h-5 w-5 rotate-180" />;
    default:
      return <ClipboardCheck className="h-5 w-5" />;
  }
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null | any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [staff, setStaff] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setIsLoading(true);
        const response = await getTaskDetailFn(id as string);
        if (response.statusCode === 200) {
          setTask(response.data);
          if (response.data.taskType == 'INSPECTION') {
            setStaff(response.data.inspectionDepartment);
          } else {
            setStaff(response.data.warehouseStaff);
          }
        } else {
          throw new Error(response.message || 'Failed to fetch task details');
        }
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to load task details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetail();
  }, []);

  const handleTodoToggle = async (todoId: string) => {
    if (!task) return;
    // Here you would typically update the todo status on the server
    // For now, we'll just update it locally
    setTask({
      ...task,
      todo: task.todo.map((item) =>
        item.id === todoId ? { ...item, isChecked: !item.isChecked } : item
      )
    });
  };

  const handleFinishJob = async () => {
    if (!task) return;
    // Here you would typically update the task status on the server
    // For now, we'll just update it locally
    setTask({
      ...task,
      status: 'COMPLETED'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">{error || 'Task not found'}</p>
      </div>
    );
  }
  const handleGoToTask = () => {
    let url;
    if (task.inventoryReportId) {
      url = `/inventory/${task.inventoryReportId}`;
    } else if (task.inventoryReportPlanId) {
      url = `/inventory/${task.inventoryReportPlanId}`;
    } else if (task.importReceiptId) {
      url = `/import-receipt/${task.importReceiptId}`;
    } else if (task.materialExportReceiptId) {
      url = `/export-receipt/${task.materialExportReceiptId}`;
    } else {
      url = ``;
    }

    navigate(url);
  };

  const statusDetails = getStatusDetails(task.status);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link to="/tasks" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Link>
      </div>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">Task #{task.code}</CardTitle>
          <Badge className={statusDetails.color}>{statusDetails.label}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <TaskTypeIcon type={task.taskType} />
            <span className="text-2xl font-medium">{task.taskType} Task</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Created:{' '}
                {new Date(task.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false // Use 24-hour format
                })}
              </span>
            </div>
            {task.importReceipt && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Import Receipt: {task.importReceipt.code}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={staff?.account.avatarUrl || undefined}
                alt={`${staff?.account.firstName} ${staff?.account.lastName}`}
              />
              <AvatarFallback>
                {staff?.account.firstName[0]}
                {staff?.account.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span>
              Assigned to: {staff?.account.firstName} {staff?.account.lastName}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Todo List:</h3>
            {task.todo.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={item.isChecked}
                  onCheckedChange={() => handleTodoToggle(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className={`text-sm ${item.isChecked ? 'line-through text-muted-foreground' : ''}`}>
                  {item.title}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link
            to={task.taskType == 'IMPORT' ? `import/receipt${task.importReceiptId}` : ''}
            className="w-full">
            <Button className="w-full" onClick={handleGoToTask}>
              Go to Task
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
