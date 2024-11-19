'use client';

import { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTaskDetail, getTaskDetailFn } from '@/api/services/taskApi';

type Task = {
  id: string;
  title: string;
  type: 'import' | 'export' | 'recheck';
  status: 'in progress' | 'completed' | 'canceled';
  dueDate: string;
  location: string;
  assignedTo: {
    name: string;
    avatar: string;
  };
  todoList: string[];
  description: string;
};

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
    case 'export':
      return <Truck className="h-5 w-5" />;
    case 'recheck':
      return <ClipboardCheck className="h-5 w-5" />;
  }
};

export default function TaskDetailPage() {
  // In a real application, you would fetch this data based on the task ID from the URL
  const task: Task = {
    id: 'T001',
    title: 'Import packages from Dock A to Storage B',
    type: 'import',
    status: 'in progress',
    dueDate: '2024-11-15T14:00:00',
    location: 'Warehouse 1, Dock A',
    assignedTo: {
      name: 'John Doe',
      avatar: '/placeholder.svg?height=40&width=40'
    },
    todoList: [
      'Verify package manifest',
      'Inspect packages for damage',
      'Sort packages by destination',
      'Update inventory system',
      'Move packages to Storage B'
    ],
    description:
      'This task involves importing a new shipment of packages from Dock A and properly storing them in Storage B. Ensure all packages are accounted for and any discrepancies are reported immediately.'
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await getTaskDetailFn();
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

  const [todoList, setTodoList] = useState(
    task.todoList.map((item) => ({ text: item, checked: false }))
  );
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');

  const handleTodoToggle = (index: number) => {
    setTodoList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleFinishJob = () => {
    setIsCompleted(true);
    // Here you would typically update the task status on the server
  };

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
          <CardTitle className="text-3xl font-bold">Task #{task.id}</CardTitle>
          <Badge className={getStatusDetails(isCompleted ? 'completed' : task.status).color}>
            {getStatusDetails(isCompleted ? 'completed' : task.status).label}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <TaskTypeIcon type={task.type} />
            <span className="text-2xl font-medium">{task.title}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due: {new Date(task.dueDate).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location: {task.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
              <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>Assigned to: {task.assignedTo.name}</span>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Description:</h3>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Todo List:</h3>
            {todoList.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`todo-${index}`}
                  checked={item.checked}
                  onCheckedChange={() => handleTodoToggle(index)}
                />
                <label
                  htmlFor={`todo-${index}`}
                  className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                  {item.text}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleFinishJob}
            disabled={isCompleted || todoList.some((item) => !item.checked)}>
            {isCompleted ? 'Job Completed' : 'Finish Job'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
