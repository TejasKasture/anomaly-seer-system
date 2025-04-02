
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import ThemeToggle from "./ThemeToggle";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [alerts, setAlerts] = useState<{ id: number; message: string; type: "warning" | "error" | "info" }[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(window.matchMedia("(prefers-color-scheme: dark)").matches);
  const { toast } = useToast();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Simulate new alerts (in a real app, this would come from API/WebSockets)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && alerts.length < 3) {
        const newAlert = {
          id: Date.now(),
          message: Math.random() > 0.5 
            ? "Unusual response time detected in payment API" 
            : "Error rate spiking in user authentication service",
          type: Math.random() > 0.5 ? "warning" : "error"
        } as const;
        
        setAlerts(prev => [newAlert, ...prev]);
        
        toast({
          title: `New ${newAlert.type} alert`,
          description: newAlert.message,
          variant: newAlert.type === "error" ? "destructive" : "default",
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [alerts, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">AS</span>
              </div>
              <span className="ml-2 text-xl font-semibold">Anomaly Seer</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 cursor-pointer" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs flex items-center justify-center text-destructive-foreground">
                  {alerts.length}
                </span>
              )}
            </div>
            <ThemeToggle isDark={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
          </div>
        </div>
      </header>
      
      <div className="flex-1 container py-6">
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={cn(
                  "p-3 rounded-md flex items-center justify-between animate-fade-in",
                  alert.type === "error" ? "bg-destructive/10 text-destructive" :
                  alert.type === "warning" ? "bg-warning/10 text-warning" : 
                  "bg-info/10 text-info"
                )}
              >
                <span>{alert.message}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => dismissAlert(alert.id)}
                  className="h-5 w-5"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
