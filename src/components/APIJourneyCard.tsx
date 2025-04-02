
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  name: string;
  status: "healthy" | "warning" | "error";
  responseTime: number;
  environment: "cloud" | "on-prem" | "multi-cloud";
}

const Step: React.FC<StepProps> = ({ name, status, responseTime, environment }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "healthy": return "bg-success/20 text-success";
      case "warning": return "bg-warning/20 text-warning";
      case "error": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };
  
  const getEnvironmentBadge = (env: string) => {
    let color;
    switch(env) {
      case "cloud": color = "bg-blue-500/20 text-blue-500"; break;
      case "on-prem": color = "bg-green-500/20 text-green-500"; break;
      case "multi-cloud": color = "bg-purple-500/20 text-purple-500"; break;
      default: color = "bg-muted text-muted-foreground";
    }
    
    return (
      <Badge variant="outline" className={cn("text-xs", color)}>
        {env}
      </Badge>
    );
  };
  
  return (
    <div className="flex items-center mb-4 last:mb-0">
      <div className={cn(
        "w-3 h-3 rounded-full mr-2",
        status === "healthy" ? "bg-success" : 
        status === "warning" ? "bg-warning" : "bg-destructive"
      )} />
      
      <div className="flex-1 flex items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <p className="font-medium">{name}</p>
            {status !== "healthy" && (
              <AlertTriangle className="h-4 w-4 ml-2 text-warning" />
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {responseTime}ms response time
          </div>
        </div>
        <div>
          {getEnvironmentBadge(environment)}
        </div>
      </div>
    </div>
  );
};

interface APIJourneyCardProps {
  title?: string;
  steps?: StepProps[];
}

const APIJourneyCard: React.FC<APIJourneyCardProps> = ({
  title = "API Request Journey",
  steps = [
    { name: "Authentication Service", status: "healthy", responseTime: 45, environment: "cloud" },
    { name: "Payment Gateway", status: "warning", responseTime: 320, environment: "multi-cloud" },
    { name: "Order Processing", status: "healthy", responseTime: 78, environment: "on-prem" },
    { name: "Notification Service", status: "healthy", responseTime: 54, environment: "cloud" },
    { name: "Analytics", status: "error", responseTime: 502, environment: "multi-cloud" },
  ]
}) => {
  const overallStatus = steps.some(step => step.status === "error") 
    ? "error" 
    : steps.some(step => step.status === "warning") 
      ? "warning" 
      : "healthy";
  
  const totalResponseTime = steps.reduce((total, step) => total + step.responseTime, 0);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge
            variant={
              overallStatus === "healthy" ? "success" :
              overallStatus === "warning" ? "outline" : "destructive"
            }
          >
            {overallStatus === "healthy" ? "Healthy" :
             overallStatus === "warning" ? "Degraded" : "Critical"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-2 mb-3 rounded-md bg-muted/50 text-sm flex justify-between">
          <span>Total Response Time</span>
          <span className="font-bold">{totalResponseTime}ms</span>
        </div>
        
        <div className="relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-1.5 top-1.5 w-px bg-border h-[calc(100%-24px)]" />
          
          {/* Steps */}
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default APIJourneyCard;
