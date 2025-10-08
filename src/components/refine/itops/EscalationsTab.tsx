import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface EscalationStep {
  step: number;
  delay_minutes: number;
  action: string;
  target: string;
  notification_methods: string[];
  condition?: string;
}

interface Policy {
  id: string;
  name: string;
  severity: string;
  description: string;
  steps: EscalationStep[];
  repeat: {
    enabled: boolean;
    interval_minutes?: number;
    max_repeats?: number;
  };
}

const EscalationsTab = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    fetch("/data/itops/escalations.json")
      .then((res) => res.json())
      .then((data) => setPolicies(data.policies));
  }, []);

  const getSeverityColor = (severity: string) => {
    if (severity === "P1") return "destructive";
    if (severity === "P2") return "default";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Escalation Policies</h2>
        <p className="text-muted-foreground">
          Automated escalation chains ensure incidents get attention
        </p>
      </div>

      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id} className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{policy.name}</h3>
                  <Badge variant={getSeverityColor(policy.severity)}>
                    {policy.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {policy.description}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {policy.steps.map((step) => (
                <div key={step.step} className="relative">
                  {step.step < policy.steps.length && (
                    <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border" />
                  )}
                  <div className="flex gap-3 p-4 rounded-lg bg-background-secondary/50">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground z-10">
                      {step.step}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{step.action}</p>
                        {step.delay_minutes > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            +{step.delay_minutes}min
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline">{step.target}</Badge>
                        {step.notification_methods.map((method) => (
                          <Badge key={method} variant="secondary">
                            {method}
                          </Badge>
                        ))}
                      </div>
                      {step.condition && (
                        <p className="text-xs text-muted-foreground">
                          Condition: {step.condition}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {policy.repeat.enabled && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <p className="text-sm">
                  Repeats every {policy.repeat.interval_minutes}min, up to {policy.repeat.max_repeats} times
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EscalationsTab;
