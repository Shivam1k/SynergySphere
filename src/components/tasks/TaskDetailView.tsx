import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowLeft, CalendarIcon, User, Edit, Save, X, 
  CheckCircle, Clock, AlertCircle, MessageSquare 
} from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: {
    name: string;
    avatar?: string;
  };
  dueDate: string;
  createdAt: string;
}

interface TaskDetailViewProps {
  task: Task;
  onBack: () => void;
  onUpdateTask: (updatedTask: Task) => void;
}

const teamMembers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
  { id: '4', name: 'David Wilson', email: 'david@example.com' },
];

export const TaskDetailView = ({ task, onBack, onUpdateTask }: TaskDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: teamMembers.find(m => m.name === task.assignee.name)?.id || '1',
    dueDate: new Date(task.dueDate)
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assignedMember = teamMembers.find(m => m.id === formData.assignee);
      
      const updatedTask = {
        ...task,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee: {
          name: assignedMember?.name || task.assignee.name,
          avatar: task.assignee.avatar
        },
        dueDate: formData.dueDate.toISOString().split('T')[0]
      };

      onUpdateTask(updatedTask);
      setIsLoading(false);
      setIsEditing(false);
      
      toast({
        title: "Task Updated!",
        description: "Your changes have been saved successfully.",
      });
    }, 800);
  };

  const handleCancel = () => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: teamMembers.find(m => m.name === task.assignee.name)?.id || '1',
      dueDate: new Date(task.dueDate)
    });
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-4 w-4 text-status-done" />;
      case 'progress':
        return <Clock className="h-4 w-4 text-status-progress" />;
      default:
        return <AlertCircle className="h-4 w-4 text-status-todo" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      todo: 'status-todo',
      progress: 'status-progress',
      done: 'status-done'
    };
    return variants[status as keyof typeof variants] || variants.todo;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-muted text-muted-foreground',
      medium: 'bg-status-todo text-status-todo-foreground',
      high: 'bg-destructive text-destructive-foreground'
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Task Details</h1>
                <p className="text-sm text-muted-foreground">View and edit task information</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="gradient-primary hover:opacity-90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Edit the task details below" : "Task details and description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  {isEditing ? (
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="text-lg font-medium">{task.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={isLoading}
                      className="min-h-[120px]"
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {task.description || "No description provided."}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Activity Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {task.assignee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{task.assignee.name}</span> was assigned to this task
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(task.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No additional activity yet.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  {isEditing ? (
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleInputChange('status', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusBadge(task.status)}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1 capitalize">
                        {task.status === 'progress' ? 'In Progress' : task.status}
                      </span>
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  {isEditing ? (
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => handleInputChange('priority', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getPriorityBadge(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Assignee</Label>
                  {isEditing ? (
                    <Select 
                      value={formData.assignee} 
                      onValueChange={(value) => handleInputChange('assignee', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{member.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{task.assignee.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.dueDate && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={(date) => handleInputChange('dueDate', date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className="text-sm flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(task.dueDate)}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(task.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};