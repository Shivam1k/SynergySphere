import { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LayoutProps {
  children: ReactNode;
  user?: User | null;
  currentView?: string;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
  showSidebar?: boolean;
}

export const Layout = ({ 
  children, 
  user, 
  currentView = 'dashboard', 
  onNavigate = () => {}, 
  onLogout = () => {},
  showSidebar = false 
}: LayoutProps) => {
  const isMobile = useIsMobile();

  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-background">
        {children}
        <Toaster />
      </div>
    );
  }

  return (
    <SidebarProvider 
      defaultOpen={!isMobile}
    >
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar 
          user={user}
          currentView={currentView}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Header with sidebar trigger */}
          <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center h-full px-4">
              <SidebarTrigger className="mr-4" />
            </div>
          </header>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};