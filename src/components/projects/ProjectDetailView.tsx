import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, Plus, Calendar, Users, MessageSquare, 
  CheckCircle, Clock, AlertCircle, Filter, MoreVertical 
} from 'lucide-react';
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

interface Discussion {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  replies?: Discussion[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  teamSize: number;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
  color: string;
}

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onCreateTask: () => void;
  onSelectTask: (task: Task) => void;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user interface mockups',
    description: 'Create high-fidelity mockups for the main user interface',
    status: 'done',
    priority: 'high',
    assignee: { name: 'Alice Johnson' },
    dueDate: '2024-03-10',
    createdAt: '2024-02-15'
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Set up user login and registration functionality',
    status: 'progress',
    priority: 'high',
    assignee: { name: 'Bob Smith' },
    dueDate: '2024-03-12',
    createdAt: '2024-02-16'
  },
  {
    id: '3',
    title: 'Create API documentation',
    description: 'Document all API endpoints and usage examples',
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'Carol Davis' },
    dueDate: '2024-03-15',
    createdAt: '2024-02-17'
  },
  {
    id: '4',
    title: 'Set up testing framework',
    description: 'Configure unit and integration testing setup',
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'David Wilson' },
    dueDate: '2024-03-18',
    createdAt: '2024-02-18'
  }
];

const mockDiscussions: Discussion[] = [
  {
    id: '1',
    author: 'Alice Johnson',
    message: 'Great progress on the UI mockups! The new design looks much cleaner.',
    timestamp: '2024-03-01T10:30:00Z',
    replies: [
      {
        id: '1-1',
        author: 'Bob Smith',
        message: 'Agreed! The color scheme really works well.',
        timestamp: '2024-03-01T10:45:00Z'
      }
    ]
  },
  {
    id: '2',
    author: 'Project Manager',
    message: 'Weekly standup scheduled for tomorrow at 9 AM. Please update your task statuses.',
    timestamp: '2024-03-01T14:15:00Z'
  }
];

export const ProjectDetailView = ({ project, onBack, onCreateTask, onSelectTask }: ProjectDetailViewProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { toast } = useToast();

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

  const filteredTasks = mockTasks.filter(task => {
    if (selectedFilter === 'all') return true;
    return task.status === selectedFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-xl font-semibold">{project.name}</h1>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Badge className={`${getStatusBadge(project.status.replace('active', 'progress'))} capitalize`}>
                {project.status}
              </Badge>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">{project.progress}%</p>
                </div>
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
              </div>
              <Progress value={project.progress} className="mt-2 h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks</p>
                  <p className="text-2xl font-bold">{project.completedTasks}/{project.totalTasks}</p>
                </div>
                <div className="h-8 w-8 bg-status-progress/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-status-progress" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team</p>
                  <p className="text-2xl font-bold">{project.teamSize}</p>
                </div>
                <div className="h-8 w-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="text-lg font-semibold">{formatDate(project.dueDate)}</p>
                </div>
                <div className="h-8 w-8 bg-status-todo/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-status-todo" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Discussions</span>
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <div className="flex space-x-1">
                  {['all', 'todo', 'progress', 'done'].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedFilter(filter)}
                      className="capitalize"
                    >
                      {filter === 'all' ? 'All' : filter.replace('progress', 'In Progress')}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button onClick={onCreateTask} className="gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="hover-lift cursor-pointer transition-all"
                  onClick={() => onSelectTask(task)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due {formatDate(task.dueDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{task.assignee.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusBadge(task.status)}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">
                            {task.status === 'progress' ? 'In Progress' : task.status}
                          </span>
                        </Badge>
                        <Badge className={getPriorityBadge(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No tasks found for the selected filter.</p>
                <Button onClick={onCreateTask} variant="outline">
                  Create your first task
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Team Discussions</h3>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>

            <div className="space-y-4">
              {mockDiscussions.map((discussion) => (
                <Card key={discussion.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {discussion.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{discussion.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(discussion.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{discussion.message}</p>
                        
                        {discussion.replies && discussion.replies.length > 0 && (
                          <div className="mt-3 pl-4 border-l-2 border-muted space-y-2">
                            {discussion.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {reply.author.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">{reply.author}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimestamp(reply.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{reply.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};