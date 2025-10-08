import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import blueprint from "@/data/blueprint.json";

const SLAsTab = () => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
  };

  const slaTypes = [
    {
      id: "p1",
      priority: "P1 - Emergency",
      description: "Critical travel issues requiring immediate attention",
      firstResponse: blueprint.slas.P1.first_response_min,
      resolution: blueprint.slas.P1.resolve_target_min,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      id: "standard",
      priority: "Standard",
      description: "Regular travel requests and general inquiries",
      firstResponse: blueprint.slas.standard.first_response_min,
      resolution: blueprint.slas.standard.resolve_target_min,
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Service Level Agreements (SLAs)
          </CardTitle>
          <CardDescription>
            Define response and resolution time targets for different priority levels
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {slaTypes.map((sla) => {
          const Icon = sla.icon;
          return (
            <Card key={sla.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${sla.bgColor}`}>
                      <Icon className={`w-5 h-5 ${sla.color}`} />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{sla.priority}</h3>
                          <Badge variant="outline">{sla.id.toUpperCase()}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sla.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            First Response
                          </p>
                          <p className="text-lg font-semibold">
                            {formatTime(sla.firstResponse)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            Resolution Target
                          </p>
                          <p className="text-lg font-semibold">
                            {formatTime(sla.resolution)}
                          </p>
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
            <Clock className="w-4 h-4 mr-2" />
            Add New SLA Level
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAsTab;
