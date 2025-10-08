import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Clock, Users, AlertCircle } from "lucide-react";
import blueprint from "@/data/blueprint.json";

const AutomationsTab = () => {
  const automations = [
    {
      id: "vip-routing",
      title: "VIP Priority Routing",
      description: "Auto-escalate requests from executives to priority queue",
      trigger: "Request from VIP group",
      action: `Route to ${blueprint.routing.vip_group}`,
      status: "active",
      icon: Users,
    },
    {
      id: "p1-alert",
      title: "Emergency Alert",
      description: "Instant notification for P1 emergency requests",
      trigger: "P1 request created",
      action: `Post to ${blueprint.routing.p1_channel}`,
      status: "active",
      icon: AlertCircle,
    },
    {
      id: "approval-routing",
      title: "Approval Workflow",
      description: `Auto-route trips over ₹${blueprint.policies.approval_threshold_inr.toLocaleString()} for approval`,
      trigger: "High-value trip request",
      action: "Send to manager approval",
      status: "active",
      icon: ArrowRight,
    },
    {
      id: "sla-reminder",
      title: "SLA Breach Alerts",
      description: "Notify agents before SLA breach occurs",
      trigger: "80% of SLA time elapsed",
      action: "Send reminder notification",
      status: "active",
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Automations & Workflows
          </CardTitle>
          <CardDescription>
            Smart automation rules to streamline your helpdesk operations
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {automations.map((automation) => {
          const Icon = automation.icon;
          return (
            <Card key={automation.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{automation.title}</h3>
                        <Badge variant={automation.status === "active" ? "default" : "secondary"}>
                          {automation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {automation.description}
                      </p>
                      <div className="grid gap-2 mt-3">
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground min-w-[80px]">Trigger:</span>
                          <span className="font-medium">{automation.trigger}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-muted-foreground min-w-[80px]">Action:</span>
                          <span className="font-medium">{automation.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Button variant="outline" className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Add New Automation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationsTab;
