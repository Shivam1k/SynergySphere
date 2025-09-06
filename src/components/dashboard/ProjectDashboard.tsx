import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, CheckCircle, Clock, AlertCircle, Search, Bell, Settings, LogOut } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface User {
  id: string;
  name: string;
  email: string;
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

interface Notification {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  timestamp: string;
}

// interface ProjectDashboardProps {
//   user: User;
//   onSelectProject: (project: Project) => void;
//   onLogout: () => void;
//   onCreateProject: () => void;
// }

interface ProjectDashboardProps {
  user: User;
  projects: Project[]; 
  onSelectProject: (project: Project) => void;
  onLogout: () => void;
  onCreateProject: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'New Task Assigned',
    description: 'You have been assigned a new task in Mobile App Redesign.',
    isRead: false,
    timestamp: '2025-09-06 10:30 AM'
  },
  {
    id: 'n2',
    title: 'Task Deadline Approaching',
    description: 'API Integration task is due in 2 days.',
    isRead: false,
    timestamp: '2025-09-06 09:15 AM'
  },
  {
    id: 'n3',
    title: 'Project Completed',
    description: 'Documentation Update project has been marked as completed.',
    isRead: true,
    timestamp: '2025-09-05 03:00 PM'
  }
];

export const ProjectDashboard = ({ user, projects, onSelectProject, onLogout, onCreateProject }: ProjectDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { toast } = useToast();

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-status-done" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-status-progress" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'status-progress',
      completed: 'status-done',
      overdue: 'bg-destructive text-destructive-foreground'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      toast({
        title: "Notifications",
        description: `You have ${unreadCount} new updates from your projects.`,
      });
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SynergySphere
              </h1>
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNotificationClick}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No notifications</p>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b last:border-b-0 ${notification.isRead ? 'text-muted-foreground' : 'font-bold'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm">{notification.title}</p>
                                <p className="text-xs">{notification.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                              </div>
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markNotificationAsRead(notification.id)}
                                  className="text-xs"
                                >
                                  Mark as Read
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <ThemeToggle />
              
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
                </div>
                <div className="h-8 w-8 bg-status-progress/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-status-progress" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.status === 'completed').length}</p>
                </div>
                <div className="h-8 w-8 bg-status-done/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-status-done" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.teamSize, 0)}</p>
                </div>
                <div className="h-8 w-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Your Projects</h3>
          <Button onClick={onCreateProject} className="gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="hover-lift cursor-pointer transition-all"
              onClick={() => onSelectProject(project)}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`h-3 w-3 rounded-full ${project.color}`}></div>
                  <Badge className={getStatusBadge(project.status)}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">{project.status}</span>
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {project.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{project.teamSize} members</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects found matching your search.</p>
            <Button onClick={onCreateProject} variant="outline">
              Create your first project
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};