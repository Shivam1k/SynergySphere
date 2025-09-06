import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Layout } from "@/components/Layout";
import { LoginPage } from "@/components/auth/LoginPage";
import { SignUpPage } from "@/components/auth/SignUpPage";
import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
import { TaskDetailView } from "@/components/tasks/TaskDetailView";
import { CreateProjectPage } from "@/pages/CreateProjectPage";

const queryClient = new QueryClient();

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

type AppView = 'login' | 'signup' | 'dashboard' | 'project' | 'task';

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleLogin = (email: string) => {
    const user = {
      id: '1',
      name: email.split('@')[0].replace(/[^a-zA-Z\s]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email
    };
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleSignUp = (email: string, name: string) => {
    const user = { id: '1', name, email };
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setSelectedProject(null);
    setSelectedTask(null);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setCurrentView('dashboard');
  };

  const handleCreateProject = () => {
    setShowCreateForm(true);
  };

  const handleCreateTask = () => {
    setIsTaskCreateModalOpen(true);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setCurrentView('task');
  };

  const handleBackToProject = () => {
    setSelectedTask(null);
    setCurrentView('project');
  };

  const handleTaskCreated = (newTask: Task) => {
    console.log('New task created:', newTask);
    setIsTaskCreateModalOpen(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    console.log('Task updated:', updatedTask);
  };

  const handleNavigate = (view: string) => {
    if (view === 'dashboard') {
      setCurrentView('dashboard');
      setSelectedProject(null);
      setSelectedTask(null);
    } else if (view === 'profile' || view === 'settings') {
      console.log(`Navigate to ${view} - to be implemented`);
    }
  };

  const renderCurrentView = () => {
    if (!currentUser) {
      return isSignUp ? (
        <SignUpPage onSignUp={handleSignUp} onToggleAuth={() => setIsSignUp(false)} />
      ) : (
        <LoginPage onLogin={handleLogin} onToggleAuth={() => setIsSignUp(true)} />
      );
    }

    if (showCreateForm) {
      return (
        <CreateProjectPage
          onProjectCreated={(data) => {
            console.log("Project created:", data);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <ProjectDashboard
            user={currentUser}
            onSelectProject={handleSelectProject}
            onLogout={handleLogout}
            onCreateProject={handleCreateProject}
          />
        );
      case 'project':
        return selectedProject ? (
          <ProjectDetailView
            project={selectedProject}
            onBack={handleBackToDashboard}
            onCreateTask={handleCreateTask}
            onSelectTask={handleSelectTask}
            onNavigateToProjects={handleBackToDashboard}
          />
        ) : null;
      case 'task':
        return selectedTask ? (
          <TaskDetailView
            task={selectedTask}
            onBack={handleBackToProject}
            onUpdateTask={handleTaskUpdated}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="synergysphere-ui-theme">
        <TooltipProvider>
          <Layout
            user={currentUser}
            currentView={currentView}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            showSidebar={!!currentUser}
          >
            {renderCurrentView()}

            <TaskCreateModal
              open={isTaskCreateModalOpen}
              onOpenChange={setIsTaskCreateModalOpen}
              onCreateTask={handleTaskCreated}
            />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
