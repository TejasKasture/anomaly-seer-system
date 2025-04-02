
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { cn } from "@/lib/utils";

// Generate mock data
const generateErrorData = (apiCount: number, withAnomaly: boolean) => {
  const data = [];
  
  for (let i = 0; i < apiCount; i++) {
    // Normal error rate is between 0.1% and 2%
    let errorRate = Math.random() * 1.9 + 0.1;
    
    // Introduce an anomaly in one API
    if (withAnomaly && i === 2) {
      errorRate = 5 + Math.random() * 5; // 5-10% error rate
    }
    
    data.push({
      name: `API-${i + 1}`,
      errorRate: parseFloat(errorRate.toFixed(2)),
      isAnomaly: withAnomaly && i === 2
    });
  }
  
  return data;
};

interface ErrorRateChartProps {
  title?: string;
  withAnomaly?: boolean;
}

const ErrorRateChart: React.FC<ErrorRateChartProps> = ({
  title = "API Error Rates",
  withAnomaly = false
}) => {
  const [data, setData] = useState(generateErrorData(7, withAnomaly));
  
  // Update data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateErrorData(7, withAnomaly));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [withAnomaly]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge variant="outline">Last Hour</Badge>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-2 border border-border rounded-md shadow-md">
                        <p className="text-sm">{data.name}</p>
                        <p className="text-sm font-bold">{data.errorRate}% Error Rate</p>
                        {data.isAnomaly && (
                          <p className="text-destructive text-xs">Anomalous error rate</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="errorRate">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isAnomaly ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorRateChart;
