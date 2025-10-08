import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Book, ChevronDown, AlertTriangle, CheckCircle2, Zap, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface PlaybookAction {
  step: number;
  action: string;
  owner: string;
  automated: boolean;
  link?: string;
}

interface Playbook {
  id: string;
  name: string;
  severity: string;
  description: string;
  actions: PlaybookAction[];
  escalation: string;
  notification_channels: string[];
}

const PlaybooksTab = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);

  useEffect(() => {
    fetch("/data/itops/playbooks.json")
      .then((res) => res.json())
      .then((data) => setPlaybooks(data.playbooks));
  }, []);

  const getSeverityColor = (severity: string) => {
    if (severity === "P1") return "destructive";
    if (severity === "P2") return "default";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Incident Response Playbooks</h2>
        <p className="text-muted-foreground">
          Structured response procedures for different incident types
        </p>
      </div>

      <div className="grid gap-4">
        {playbooks.map((playbook) => (
          <Collapsible key={playbook.id}>
            <Card className="p-6">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-start gap-4 text-left">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Book className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{playbook.name}</h3>
                      <Badge variant={getSeverityColor(playbook.severity)}>
                        {playbook.severity}
                      </Badge>
                      <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {playbook.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{playbook.actions.length} steps</span>
                      <span>•</span>
                      <span>{playbook.notification_channels.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Response Actions:</h4>
                    <div className="space-y-3">
                      {playbook.actions.map((action) => (
                        <div key={action.step} className="flex gap-3 p-3 rounded-lg bg-background-secondary/50">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {action.step}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium">{action.action}</p>
                              {action.automated ? (
                                <Badge variant="secondary" className="text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Auto
                                </Badge>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>Owner: {action.owner}</span>
                              {action.link && (
                                <>
                                  <span>•</span>
                                  <a href={action.link} className="flex items-center gap-1 hover:text-primary">
                                    Link <ExternalLink className="w-3 h-3" />
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Escalation Policy</p>
                      <p className="text-sm text-muted-foreground">{playbook.escalation}</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default PlaybooksTab;
