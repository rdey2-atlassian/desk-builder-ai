import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Loader2, 
  Globe, 
  FileText, 
  Book, 
  Settings, 
  Users, 
  Zap,
  Shield,
  ChevronRight,
  Edit
} from "lucide-react";
import blueprint from "@/data/blueprint.json";
import { ChatInterface } from "./composer/ChatInterface";

interface ComposerProps {
  prompt: string;
  onComplete: () => void;
}

interface BuildStep {
  id: string;
  label: string;
  icon: any;
  status: "planned" | "linking" | "ready";
  details?: string[];
}

const Composer = ({ prompt, onComplete }: ComposerProps) => {
  const [steps, setSteps] = useState<BuildStep[]>([
    {
      id: "portal",
      label: "Portal & Channels",
      icon: Globe,
      status: "planned",
      details: ["Travel Desk portal scaffolded", "Email intake enabled"],
    },
    {
      id: "request_types",
      label: "Request Types",
      icon: FileText,
      status: "planned",
      details: ["6 travel-specific types seeded", "Forms + routing configured"],
    },
    {
      id: "knowledge",
      label: "Knowledge Hub",
      icon: Book,
      status: "planned",
      details: ["10 starter articles created", "Policy snippets attached"],
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: Zap,
      status: "planned",
      details: [
        "Okta connected (SSO + approvals)",
        "Slack connected (#travel-hotline)",
        "Confluence connected (KB)",
        "Concur pending",
        "Email inbound set",
      ],
    },
    {
      id: "automations",
      label: "Automations",
      icon: Settings,
      status: "planned",
      details: [
        "Routing rules configured",
        "Approval workflows set",
        "Deadline/risk escalation",
        "P1 paging enabled",
      ],
    },
    {
      id: "slas",
      label: "SLAs",
      icon: Shield,
      status: "planned",
      details: ["P1 Emergency: 5m / 1h", "Standard: 4h / 1d", "Visa: 8h / 5d"],
    },
    {
      id: "teams",
      label: "Teams & Roles",
      icon: Users,
      status: "planned",
      details: [
        "'Travel Desk' project created",
        "Roles: Owner, Agent, Viewer",
        "VIP group defined",
      ],
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(interval);
          setIsComplete(true);
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

  const handleEditStep = () => {
    // Navigate to Refine screen for editing
    onComplete();
  };

  const handleTestOut = () => {
    onComplete();
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
          <h1 className="text-3xl font-bold">Building Your Travel Helpdesk</h1>
          <p className="text-muted-foreground">
            Analyzing prompt and assembling components for Atlassian (500 employees)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
          {/* Left: Build Components (70%) */}
          <div className="space-y-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.id}
                  className={`p-4 transition-smooth cursor-pointer hover:shadow-lg ${getStatusColor(step.status)}`}
                  onClick={() => step.status === "ready" && handleEditStep()}
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

          {/* Right: Chat Interface (30%) */}
          <div className="lg:sticky lg:top-6 h-[calc(100vh-8rem)] flex flex-col gap-4">
            <ChatInterface
              userPrompt={prompt}
              currentStep={currentStep}
              totalSteps={steps.length}
              steps={steps}
            />
            
            {isComplete && (
              <Button
                onClick={handleTestOut}
                className="w-full gradient-primary"
                size="lg"
              >
                Yes, let me test it out <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
