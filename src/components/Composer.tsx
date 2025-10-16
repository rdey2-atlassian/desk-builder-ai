import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { 
  Check, 
  Loader2, 
  ChevronRight,
  Edit
} from "lucide-react";
import blueprint from "@/data/blueprint.json";
import { ChatInterface } from "./composer/ChatInterface";
import PortalTab from "./refine/PortalTab";
import RequestTypesTab from "./refine/RequestTypesTab";
import KnowledgeTab from "./refine/KnowledgeTab";
import IntegrationsTab from "./refine/IntegrationsTab";
import AutomationsTab from "./refine/AutomationsTab";
import SLAsTab from "./refine/SLAsTab";
import TeamRolesTab from "./refine/TeamRolesTab";
import RolesTab from "./refine/itops/RolesTab";
import PlaybooksTab from "./refine/itops/PlaybooksTab";
import SchedulesTab from "./refine/itops/SchedulesTab";
import EscalationsTab from "./refine/itops/EscalationsTab";
import HeartbeatsTab from "./refine/itops/HeartbeatsTab";
import SyncsTab from "./refine/itops/SyncsTab";
import ITOpsIntegrationsTab from "./refine/itops/IntegrationsTab";
import { getTemplateById } from "@/data/templates";
import { TemplateBlock } from "@/types/templates";

interface ComposerProps {
  templateId: string;
  onComplete: (data?: { name: string; description: string; blocks: any[]; templateId: string }) => void;
}

interface BuildStep extends TemplateBlock {
  status: "planned" | "linking" | "ready";
}

const Composer = ({ templateId, onComplete }: ComposerProps) => {
  const template = getTemplateById(templateId);
  
  if (!template) {
    return <div className="p-8 text-center">Template not found</div>;
  }

  const isBlank = template.id === "blank";
  const isITOps = template.id === "it-operations";

  // Convert template blocks to build steps with status
  const initialSteps: BuildStep[] = template.blocks.map(block => ({
    ...block,
    status: "planned" as const,
  }));

  const [steps, setSteps] = useState<BuildStep[]>(initialSteps);

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [activeRefineTab, setActiveRefineTab] = useState("portal");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev > steps.length) {
          clearInterval(interval);
          return prev;
        }

        if (prev === steps.length) {
          // Mark all steps as ready when we reach the end
          setSteps((s) =>
            s.map((step) => ({ ...step, status: "ready" as const }))
          );
          setIsComplete(true);
          clearInterval(interval);
          return prev;
        }

        setSteps((s) =>
          s.map((step, idx) => {
            if (idx < prev) return { ...step, status: "ready" as const };
            if (idx === prev) return { ...step, status: "linking" as const };
            return step;
          })
        );

        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [steps.length]);

  const getStatusIcon = (status: string) => {
    if (status === "ready") return <Check className="w-4 h-4 text-success" />;
    if (status === "linking") return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    return <div className="w-2 h-2 rounded-full bg-muted" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "ready") return "border-success bg-success/5";
    if (status === "linking") return "border-primary bg-primary/5 glow-primary";
    return "border-border bg-background-secondary";
  };

  const handleEditStep = (stepId: string) => {
    // Map step IDs to refine tab names
    const tabMap: Record<string, string> = {
      portal: "portal",
      request_types: "request-types",
      knowledge: "knowledge",
      integrations: "integrations",
      automations: "automations",
      slas: "slas",
      teams: "team",
      roles: "roles",
      playbooks: "playbooks",
      schedules: "schedules",
      escalations: "escalations",
      heartbeats: "heartbeats",
      syncs: "syncs",
    };
    
    const tabName = tabMap[stepId] || "portal";
    setActiveRefineTab(tabName);
    setEditingTab(stepId);
  };

  const handleCloseEdit = () => {
    setEditingTab(null);
  };

  const handleTestOut = () => {
    onComplete({
      name: template.name,
      description: template.description,
      blocks: steps,
      templateId,
    });
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Composing solution</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {isComplete ? "Complete" : steps[currentStep]?.label}
            </span>
          </div>
          <h1 className="text-3xl font-bold">
            {template.name}
          </h1>
          <p className="text-muted-foreground">
            {template.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
          {/* Left: Build Components or Edit Experience (70%) */}
          <div>
            {editingTab ? (
              <Card className="h-[calc(100vh-12rem)] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b bg-background-secondary/50">
                  <h2 className="text-lg font-semibold">Refine Your Helpdesk</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseEdit}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Tabs value={activeRefineTab} onValueChange={setActiveRefineTab} className="flex flex-col flex-1">
                  <div className="border-b bg-background">
                    {isITOps ? (
                      <TabsList className="w-full h-auto grid grid-cols-7 bg-transparent rounded-none p-0">
                        <TabsTrigger value="roles" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Roles
                        </TabsTrigger>
                        <TabsTrigger value="playbooks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Playbooks
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Integrations
                        </TabsTrigger>
                        <TabsTrigger value="schedules" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Schedules
                        </TabsTrigger>
                        <TabsTrigger value="escalations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Escalations
                        </TabsTrigger>
                        <TabsTrigger value="heartbeats" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Heartbeats
                        </TabsTrigger>
                        <TabsTrigger value="syncs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Syncs
                        </TabsTrigger>
                      </TabsList>
                    ) : (
                      <TabsList className="w-full h-auto grid grid-cols-7 bg-transparent rounded-none p-0">
                        <TabsTrigger value="portal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Portal
                        </TabsTrigger>
                        <TabsTrigger value="request-types" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Requests
                        </TabsTrigger>
                        <TabsTrigger value="knowledge" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Knowledge
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Integrations
                        </TabsTrigger>
                        <TabsTrigger value="automations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Automations
                        </TabsTrigger>
                        <TabsTrigger value="slas" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          SLAs
                        </TabsTrigger>
                        <TabsTrigger value="team" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                          Team
                        </TabsTrigger>
                      </TabsList>
                    )}
                  </div>

                  <div className="flex-1 overflow-auto">
                    {isITOps ? (
                      <>
                        <TabsContent value="roles" className="mt-0 h-full p-6">
                          <RolesTab />
                        </TabsContent>
                        <TabsContent value="playbooks" className="mt-0 h-full p-6">
                          <PlaybooksTab />
                        </TabsContent>
                        <TabsContent value="integrations" className="mt-0 h-full p-6">
                          <ITOpsIntegrationsTab />
                        </TabsContent>
                        <TabsContent value="schedules" className="mt-0 h-full p-6">
                          <SchedulesTab />
                        </TabsContent>
                        <TabsContent value="escalations" className="mt-0 h-full p-6">
                          <EscalationsTab />
                        </TabsContent>
                        <TabsContent value="heartbeats" className="mt-0 h-full p-6">
                          <HeartbeatsTab />
                        </TabsContent>
                        <TabsContent value="syncs" className="mt-0 h-full p-6">
                          <SyncsTab />
                        </TabsContent>
                      </>
                    ) : (
                      <>
                        <TabsContent value="portal" className="mt-0 h-full p-6">
                          <PortalTab />
                        </TabsContent>
                        <TabsContent value="request-types" className="mt-0 h-full p-6">
                          <RequestTypesTab />
                        </TabsContent>
                        <TabsContent value="knowledge" className="mt-0 h-full p-6">
                          <KnowledgeTab />
                        </TabsContent>
                        <TabsContent value="integrations" className="mt-0 h-full p-6">
                          <IntegrationsTab />
                        </TabsContent>
                        <TabsContent value="automations" className="mt-0 h-full p-6">
                          <AutomationsTab />
                        </TabsContent>
                        <TabsContent value="slas" className="mt-0 h-full p-6">
                          <SLAsTab />
                        </TabsContent>
                        <TabsContent value="team" className="mt-0 h-full p-6">
                          <TeamRolesTab />
                        </TabsContent>
                      </>
                    )}
                  </div>
                </Tabs>
              </Card>
            ) : (
              <div className="space-y-3">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <Card
                      key={step.id}
                      className={`p-4 transition-smooth cursor-pointer hover:shadow-lg ${getStatusColor(step.status)}`}
                      onClick={() => step.status === "ready" && handleEditStep(step.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{step.label}</h3>
                            {getStatusIcon(step.status)}
                            {step.status === "ready" && (
                              <Edit className="w-4 h-4 text-muted-foreground ml-auto" />
                            )}
                          </div>
                          {step.status !== "planned" && step.details && (
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {step.details.map((detail, didx) => (
                                <li
                                  key={didx}
                                  className="flex items-center gap-2 animate-fade-in"
                                >
                                  <div className="w-1 h-1 rounded-full bg-primary" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Chat Interface (30%) - Always visible */}
          <div className="lg:sticky lg:top-6 h-[calc(100vh-8rem)]">
            <ChatInterface
              userPrompt={template.prompt || ""}
              currentStep={currentStep}
              totalSteps={steps.length}
              steps={steps}
              onComplete={handleTestOut}
              isComplete={isComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
