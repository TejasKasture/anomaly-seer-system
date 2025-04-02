
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { AlertTriangle } from "lucide-react";

// Simulated data - in a real app, this would come from API
const generateTimeSeriesData = (baseline: number, anomalyAt?: number) => {
  const now = new Date();
  const data = [];

  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60000);
    let value = baseline + Math.random() * 20 - 10;
    
    // Introduce an anomaly at the specified point
    if (anomalyAt !== undefined && i === anomalyAt) {
      value = baseline * (1.5 + Math.random() * 0.5);
    }
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(value),
      isAnomaly: i === anomalyAt
    });
  }
  return data;
};

interface APIResponseTimeChartProps {
  apiName: string;
  environment: "cloud" | "on-prem" | "multi-cloud";
  baseline: number;
  anomaly?: boolean;
}

const APIResponseTimeChart: React.FC<APIResponseTimeChartProps> = ({
  apiName,
  environment,
  baseline,
  anomaly = false
}) => {
  const [data, setData] = useState(generateTimeSeriesData(baseline, anomaly ? 3 : undefined));
  
  // Update data periodically to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: Math.round(baseline + Math.random() * 20 - 10),
        isAnomaly: false
      };
      setData(prevData => [...prevData.slice(1), newDataPoint]);
    }, 30000);

    return () => clearInterval(interval);
  }, [baseline]);

  // Calculate threshold value (e.g., 90th percentile)
  const threshold = baseline * 1.5;

  const getEnvironmentColor = (env: string) => {
    switch(env) {
      case "cloud": return "bg-blue-500";
      case "on-prem": return "bg-green-500";
      case "multi-cloud": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className={anomaly ? "border-warning" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{apiName} Response Time</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", getEnvironmentColor(environment))}>
              {environment}
            </Badge>
            {anomaly && (
              <Badge variant="destructive" className="text-xs gap-1 flex items-center">
                <AlertTriangle className="h-3 w-3" />
                <span>Anomaly Detected</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time"
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                domain={[0, (dataMax: number) => Math.max(dataMax, threshold) * 1.1]}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-background p-2 border border-border rounded-md shadow-md">
                        <p className="text-sm">{dataPoint.time}</p>
                        <p className="text-sm font-bold">{dataPoint.value}ms</p>
                        {dataPoint.isAnomaly && (
                          <p className="text-destructive text-xs">Anomaly detected</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine 
                y={threshold} 
                stroke="red" 
                strokeDasharray="3 3" 
                label={{ value: 'Threshold', position: 'left', fill: 'red', fontSize: 10 }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={({ isAnomaly }) => isAnomaly ? { r: 4, fill: "hsl(var(--destructive))" } : false}
                activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default APIResponseTimeChart;
