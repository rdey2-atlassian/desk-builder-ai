import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DryRunPlan } from "@/lib/compiler/plan";
import { Badge } from "@/components/ui/badge";

interface DryRunPanelProps {
  plan: DryRunPlan;
}

export function DryRunPanel({ plan }: DryRunPanelProps) {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dry-run-plan.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalItems = 
    plan.projects.length +
    plan.requestTypes.length +
    plan.workflows.length +
    plan.automations.length +
    plan.adapters.length +
    plan.security.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dry Run Plan</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{totalItems} items</Badge>
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <Accordion type="multiple" className="w-full px-4">
            {plan.projects.length > 0 && (
              <AccordionItem value="projects">
                <AccordionTrigger>
                  Projects <Badge variant="outline" className="ml-2">{plan.projects.length}</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {plan.projects.map((project, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">Key: {project.key}</div>
                        <div className="text-sm text-muted-foreground">
                          Entities: {project.entities.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {plan.requestTypes.length > 0 && (
              <AccordionItem value="requestTypes">
                <AccordionTrigger>
                  Request Types <Badge variant="outline" className="ml-2">{plan.requestTypes.length}</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {plan.requestTypes.map((rt, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card">
                        <div className="font-medium">{rt.name}</div>
                        <div className="text-sm text-muted-foreground">Workflow: {rt.workflow}</div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {plan.workflows.length > 0 && (
              <AccordionItem value="workflows">
                <AccordionTrigger>
                  Workflows <Badge variant="outline" className="ml-2">{plan.workflows.length}</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {plan.workflows.map((wf, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card">
                        <div className="font-medium">{wf.name}</div>
                        <div className="text-sm text-muted-foreground">
                          States: {wf.states.join(" → ")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {wf.transitions} transitions
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {plan.automations.length > 0 && (
              <AccordionItem value="automations">
                <AccordionTrigger>
                  Automations <Badge variant="outline" className="ml-2">{plan.automations.length}</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {plan.automations.map((auto, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card">
                        <div className="font-medium">{auto.name}</div>
                        <div className="text-sm text-muted-foreground">Trigger: {auto.trigger}</div>
                        <div className="text-sm text-muted-foreground">
                          Actions: {auto.actions.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {plan.adapters.length > 0 && (
              <AccordionItem value="adapters">
                <AccordionTrigger>
                  Adapters <Badge variant="outline" className="ml-2">{plan.adapters.length}</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {plan.adapters.map((adapter, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card">
                        <div className="font-medium">{adapter.name}</div>
                        <div className="text-sm text-muted-foreground">Vendor: {adapter.vendor}</div>
                        <div className="text-sm text-muted-foreground">
                          Config keys: {adapter.configKeys.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {plan.security.length > 0 && (
              <AccordionItem value="security">
                <AccordionTrigger>
                  Security Policies <Badge variant="outline" className="ml-2">{plan.security.length}</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {plan.security.map((sec, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card">
                        <div className="font-medium">{sec.entity}</div>
                        <div className="text-sm text-muted-foreground">
                          Roles: {sec.roles.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {totalItems === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No items to display. Add blocks to see the dry run plan.
              </div>
            )}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
