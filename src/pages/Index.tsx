
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MetricsCard from "@/components/MetricsCard";
import APIResponseTimeChart from "@/components/APIResponseTimeChart";
import ErrorRateChart from "@/components/ErrorRateChart";
import EnvironmentStatusCard from "@/components/EnvironmentStatusCard";
import PredictiveAnomalyCard from "@/components/PredictiveAnomalyCard";
import APIJourneyCard from "@/components/APIJourneyCard";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  Activity, 
  AlertTriangle, 
  BarChart2, 
  Gauge,
  Clock
} from "lucide-react";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Show welcome toast when loaded
      toast({
        title: "Welcome to Anomaly Seer",
        description: "AI-powered API monitoring and anomaly detection system",
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">API Monitoring Dashboard</h1>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="journeys">API Journeys</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            {/* Top metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricsCard 
                title="Total APIs Monitored" 
                value="124" 
                icon={<Activity className="h-4 w-4" />}
                isLoading={loading}
              />
              <MetricsCard 
                title="Active Anomalies" 
                value="3" 
                trend={12}
                icon={<AlertTriangle className="h-4 w-4" />}
                isLoading={loading}
              />
              <MetricsCard 
                title="Avg Response Time" 
                value="127ms" 
                trend={-5}
                icon={<Clock className="h-4 w-4" />}
                isLoading={loading}
              />
              <MetricsCard 
                title="Error Rate" 
                value="1.2%" 
                trend={-8}
                icon={<BarChart2 className="h-4 w-4" />}
                isLoading={loading}
              />
            </div>
            
            {/* API Response Time Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <APIResponseTimeChart 
                apiName="User Authentication" 
                environment="cloud"
                baseline={120}
              />
              <APIResponseTimeChart 
                apiName="Payment Processing" 
                environment="multi-cloud"
                baseline={180}
                anomaly={true}
              />
            </div>
            
            {/* Error Rates and Environment Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ErrorRateChart />
              <EnvironmentStatusCard />
            </div>
          </TabsContent>
          
          <TabsContent value="anomalies" className="space-y-6">
            <h2 className="text-xl font-semibold">Current Anomalies</h2>
            
            {/* Anomaly charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <APIResponseTimeChart 
                apiName="Payment Processing" 
                environment="multi-cloud"
                baseline={180}
                anomaly={true}
              />
              <APIResponseTimeChart 
                apiName="Search Service" 
                environment="cloud"
                baseline={150}
                anomaly={true}
              />
            </div>
            
            {/* Error rate anomalies */}
            <div className="grid grid-cols-1 gap-4">
              <ErrorRateChart title="Error Rate Anomalies" withAnomaly={true} />
            </div>
          </TabsContent>
          
          <TabsContent value="journeys" className="space-y-6">
            <h2 className="text-xl font-semibold">API Request Journeys</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <APIJourneyCard title="Checkout Flow" />
              <APIJourneyCard 
                title="User Registration Flow"
                steps={[
                  { name: "Form Validation", status: "healthy", responseTime: 32, environment: "cloud" },
                  { name: "User DB Write", status: "healthy", responseTime: 85, environment: "on-prem" },
                  { name: "Email Verification", status: "warning", responseTime: 257, environment: "cloud" },
                  { name: "Profile Setup", status: "healthy", responseTime: 61, environment: "multi-cloud" },
                ]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-6">
            <h2 className="text-xl font-semibold">AI Predictions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PredictiveAnomalyCard />
              <div className="space-y-4">
                <MetricsCard 
                  title="Predicted Issues Next 24h" 
                  value="7" 
                  trend={-15}
                  icon={<Gauge className="h-4 w-4" />}
                />
                <div className="p-4 border rounded-md bg-background">
                  <h3 className="font-medium mb-2">System Health Forecast</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Next 6 hours</span>
                      <span className="text-sm font-medium text-success">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">6-12 hours</span>
                      <span className="text-sm font-medium text-warning">Potential Issues</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">12-24 hours</span>
                      <span className="text-sm font-medium text-warning">Degraded Performance</span>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Based on historical patterns and current system trends
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
