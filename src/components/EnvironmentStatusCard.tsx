
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Database, Server, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusItemProps {
  name: string;
  status: "healthy" | "warning" | "critical";
  environment: "cloud" | "on-prem" | "multi-cloud";
  metric?: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ name, status, environment, metric }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "healthy": return "bg-success/20 text-success border-success/40";
      case "warning": return "bg-warning/20 text-warning border-warning/40";
      case "critical": return "bg-destructive/20 text-destructive border-destructive/40";
      default: return "bg-muted text-muted-foreground";
    }
  };
  
  const getEnvironmentIcon = (env: string) => {
    switch(env) {
      case "cloud": return <Cloud className="h-4 w-4" />;
      case "on-prem": return <Server className="h-4 w-4" />;
      case "multi-cloud": return <Database className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <div className={cn(
      "p-3 rounded-md border flex justify-between items-center mb-2",
      getStatusColor(status)
    )}>
      <div className="flex items-center gap-2">
        {getEnvironmentIcon(environment)}
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        {metric && <span className="text-xs">{metric}</span>}
        {status !== "healthy" && <AlertTriangle className="h-4 w-4" />}
      </div>
    </div>
  );
};

interface EnvironmentStatusCardProps {
  title?: string;
}

const EnvironmentStatusCard: React.FC<EnvironmentStatusCardProps> = ({
  title = "Environment Status"
}) => {
  const items: StatusItemProps[] = [
    { name: "Payment Gateway", status: "healthy", environment: "cloud", metric: "99.98% uptime" },
    { name: "User Auth", status: "warning", environment: "multi-cloud", metric: "97.2% uptime" },
    { name: "Database Cluster", status: "healthy", environment: "on-prem", metric: "99.99% uptime" },
    { name: "Search Service", status: "critical", environment: "cloud", metric: "92.1% uptime" },
    { name: "Analytics Engine", status: "healthy", environment: "multi-cloud", metric: "99.95% uptime" },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <StatusItem key={index} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentStatusCard;
