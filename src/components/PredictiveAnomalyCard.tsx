
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictiveAnomalyCardProps {
  title?: string;
}

const PredictiveAnomalyCard: React.FC<PredictiveAnomalyCardProps> = ({
  title = "Predictive Insights"
}) => {
  const predictions = [
    {
      service: "Payment Processing",
      prediction: "Potential response time spike in next 30 minutes",
      confidence: 87,
      timeframe: "30 min",
      impact: "medium",
    },
    {
      service: "User Authentication Flow",
      prediction: "Increasing error rate trend detected",
      confidence: 92,
      timeframe: "2 hours",
      impact: "high",
    },
    {
      service: "Product Search API",
      prediction: "Memory usage growing abnormally",
      confidence: 78,
      timeframe: "1 hour",
      impact: "low",
    }
  ];
  
  const getImpactColor = (impact: string) => {
    switch(impact) {
      case "low": return "text-info";
      case "medium": return "text-warning";
      case "high": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            <span>AI Powered</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="border rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{prediction.service}</h4>
                <Badge 
                  variant="outline" 
                  className={cn(getImpactColor(prediction.impact))}
                >
                  {prediction.impact} impact
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{prediction.prediction}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>In next {prediction.timeframe}</span>
                </div>
                <div className="text-xs">
                  {prediction.confidence}% confidence
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnomalyCard;
