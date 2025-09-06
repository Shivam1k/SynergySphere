import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Mail, Lock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface LoginPageProps {
  onLogin: (email: string) => void;
  onToggleAuth: () => void;
}

export const LoginPage = ({ onLogin, onToggleAuth }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "Successfully logged into SynergySphere.",
      });
      onLogin(email);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-subtle relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 gradient-primary rounded-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SynergySphere
            </h1>
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your collaboration workspace
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full gradient-primary hover:opacity-90 transition-quick"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          <div className="text-center space-y-2">
            <button 
              onClick={onToggleAuth}
              className="text-sm text-primary hover:underline"
            >
              Don't have an account? Sign up
            </button>
            <br />
            <button className="text-sm text-muted-foreground hover:text-foreground">
              Forgot your password?
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};