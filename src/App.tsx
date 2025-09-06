// import React, { useState } from 'react';
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ThemeProvider } from "@/components/theme/ThemeProvider";
// import { Layout } from "@/components/Layout";
// import { LoginPage } from "@/components/auth/LoginPage";
// import { SignUpPage } from "@/components/auth/SignUpPage";
// import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard";
// import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
// import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
// import { TaskDetailView } from "@/components/tasks/TaskDetailView";
// import { CreateProjectForm } from "@/components/projects/CreateProjectForm"; // Import the form component
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// const queryClient = new QueryClient();

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   progress: number;
//   totalTasks: number;
//   completedTasks: number;
//   teamSize: number;
//   dueDate: string;
//   status: 'active' | 'completed' | 'overdue';
//   color: string;
// }

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: 'todo' | 'progress' | 'done';
//   priority: 'low' | 'medium' | 'high';
//   assignee: {
//     name: string;
//     avatar?: string;
//   };
//   dueDate: string;
//   createdAt: string;
// }

// type AppView = 'login' | 'signup' | 'dashboard' | 'project' | 'task';

// const App = () => {
//   const [currentView, setCurrentView] = useState<AppView>('login');
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [projects, setProjects] = useState<Project[]>([]);

//   const handleLogin = (email: string) => {
//     const user = {
//       id: '1',
//       name: email.split('@')[0].replace(/[^a-zA-Z\s]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
//       email: email
//     };
//     setCurrentUser(user);
//     setCurrentView('dashboard');
//   };

//   const handleSignUp = (email: string, name: string) => {
//     const user = { id: '1', name, email };
//     setCurrentUser(user);
//     setCurrentView('dashboard');
//   };

//   const handleLogout = () => {
//     setCurrentUser(null);
//     setCurrentView('login');
//     setSelectedProject(null);
//     setSelectedTask(null);
//   };

//   const handleCreateProject = (newProjectData: any) => {
//     const newProject: Project = {
//       id: Date.now().toString(),
//       name: newProjectData.name,
//       description: newProjectData.description,
//       progress: 0,
//       totalTasks: 0,
//       completedTasks: 0,
//       teamSize: newProjectData.teamSize,
//       dueDate: newProjectData.dueDate,
//       status: 'active',
//       color: `bg-${['blue', 'purple', 'green', 'red', 'yellow', 'indigo'][Math.floor(Math.random() * 6)]}-500`
//     };
    
//     setProjects([...projects, newProject]);
//     setShowCreateForm(false);
//   };

//   const handleSelectProject = (project: Project) => {
//     setSelectedProject(project);
//     setCurrentView('project');
//   };

//   const handleBackToDashboard = () => {
//     setSelectedProject(null);
//     setCurrentView('dashboard');
//   };

//   const handleCreateTask = () => {
//     setIsTaskCreateModalOpen(true);
//   };

//   const handleSelectTask = (task: Task) => {
//     setSelectedTask(task);
//     setCurrentView('task');
//   };

//   const handleBackToProject = () => {
//     setSelectedTask(null);
//     setCurrentView('project');
//   };

//   const handleTaskCreated = (newTask: Task) => {
//     console.log('New task created:', newTask);
//     setIsTaskCreateModalOpen(false);
//   };

//   const handleTaskUpdated = (updatedTask: Task) => {
//     console.log('Task updated:', updatedTask);
//   };

//   const handleNavigate = (view: string) => {
//   // Convert the string view to your AppView type
//   const appView = view as AppView;
  
//   if (appView === 'dashboard') {
//     setCurrentView('dashboard');
//     setSelectedProject(null);
//     setSelectedTask(null);
//     setShowCreateForm(false);
//   } else {
//     console.log(`Navigate to ${appView} - to be implemented`);
//   }
// };

//   const renderCurrentView = () => {
//     if (!currentUser) {
//       return isSignUp ? (
//         <SignUpPage onSignUp={handleSignUp} onToggleAuth={() => setIsSignUp(false)} />
//       ) : (
//         <LoginPage onLogin={handleLogin} onToggleAuth={() => setIsSignUp(true)} />
//       );
//     }

//     // Show the create project form when showCreateForm is true
//     if (showCreateForm) {
//       return (
//         <CreateProjectForm 
//           onSave={handleCreateProject} 
//           onCancel={() => setShowCreateForm(false)} 
//         />
//       );
//     }

//     switch (currentView) {
//       case 'dashboard':
//         return (
//           <ProjectDashboard
//             user={currentUser}
//             projects={projects} // Pass the projects state
//             onSelectProject={handleSelectProject}
//             onLogout={handleLogout}
//             onCreateProject={() => setShowCreateForm(true)}
//           />
//         );
//       case 'project':
//         return selectedProject ? (
//           <ProjectDetailView
//             project={selectedProject}
//             onBack={handleBackToDashboard}
//             onCreateTask={handleCreateTask}
//             onSelectTask={handleSelectTask}
//             onNavigateToProjects={handleBackToDashboard}
//           />
//         ) : null;
//       case 'task':
//         return selectedTask ? (
//           <TaskDetailView
//             task={selectedTask}
//             onBack={handleBackToProject}
//             onUpdateTask={handleTaskUpdated}
//           />
//         ) : null;
//       default:
//         return null;
//     }
//   };

//   return (
//     <QueryClientProvider client={queryClient}>
//       <ThemeProvider defaultTheme="system" storageKey="synergysphere-ui-theme">
//         <TooltipProvider>
//           <Layout
//             user={currentUser}
//             currentView={currentView}
//             onNavigate={handleNavigate}
//             onLogout={handleLogout}
//             showSidebar={!!currentUser}
//           >
//             {renderCurrentView()}

//             <TaskCreateModal
//               open={isTaskCreateModalOpen}
//               onOpenChange={setIsTaskCreateModalOpen}
//               onCreateTask={handleTaskCreated}
//             />
//           </Layout>
//           <Toaster />
//         </TooltipProvider>
//       </ThemeProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;


import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Layout } from "@/components/Layout";
import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";
import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
import { TaskDetailView } from "@/components/tasks/TaskDetailView";
import { CreateProjectForm } from "@/components/projects/CreateProjectForm";
import { useUser, SignInButton } from '@clerk/clerk-react';

const queryClient = new QueryClient();

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

type AppView = 'dashboard' | 'project' | 'task';


const AppContent = () => {
  const { user: clerkUser, isSignedIn } = useUser();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  
  const currentUser = clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || ''
  } : null;

  const handleLogout = () => {
    setCurrentView('dashboard');
    setSelectedProject(null);
    setSelectedTask(null);
  };

  const handleCreateProject = (newProjectData: any) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectData.name,
      description: newProjectData.description,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      teamSize: newProjectData.teamSize,
      dueDate: newProjectData.dueDate,
      status: 'active',
      color: `bg-${['blue', 'purple', 'green', 'red', 'yellow', 'indigo'][Math.floor(Math.random() * 6)]}-500`
    };
    
    setProjects([...projects, newProject]);
    setShowCreateForm(false);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setCurrentView('dashboard');
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
    const appView = view as AppView;
    
    if (appView === 'dashboard') {
      setCurrentView('dashboard');
      setSelectedProject(null);
      setSelectedTask(null);
      setShowCreateForm(false);
    } else {
      console.log(`Navigate to ${appView} - to be implemented`);
    }
  };

  const renderCurrentView = () => {
    // Show the create project form when showCreateForm is true
    if (showCreateForm) {
      return (
        <CreateProjectForm 
          onSave={handleCreateProject} 
          onCancel={() => setShowCreateForm(false)} 
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <ProjectDashboard
            user={currentUser}
            projects={projects}
            onSelectProject={handleSelectProject}
            onLogout={handleLogout}
            onCreateProject={() => setShowCreateForm(true)}
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

  
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to SynergySphere</h1>
          <SignInButton mode="modal">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
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
  );
};


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="synergysphere-ui-theme">
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;