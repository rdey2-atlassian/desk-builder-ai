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
  ChevronRight
} from "lucide-react";
import blueprint from "@/data/blueprint.json";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
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
  }, [onComplete, steps.length]);

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

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Composing solution</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {steps[currentStep]?.label || "Complete"}
            </span>
          </div>
          <h1 className="text-3xl font-bold">Building Your Travel Helpdesk</h1>
          <p className="text-muted-foreground">
            Analyzing prompt and assembling components for Atlassian (500 employees)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Build Log */}
          <div className="lg:col-span-2 space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.id}
                  className={`p-4 transition-smooth ${getStatusColor(step.status)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{step.label}</h3>
                        {getStatusIcon(step.status)}
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

          {/* Blueprint Sidebar */}
          <div className="space-y-4">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Blueprint</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Organization:</span>
                  <p className="font-medium">Atlassian</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <p className="font-medium">{blueprint.org_size} employees</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Catalog:</span>
                  <p className="font-medium">{blueprint.catalog.length} request types</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Knowledge:</span>
                  <p className="font-medium">{blueprint.kb_seed_count} articles</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Integrations:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(blueprint.connectors).map(([key, status]) => (
                      <div
                        key={key}
                        className={`px-2 py-1 rounded text-xs ${
                          status === "connected"
                            ? "bg-success/20 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-semibold">SLA Defaults</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">P1 First Response:</span>
                  <span className="font-medium">5 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">P1 Resolve Target:</span>
                  <span className="font-medium">1 hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard Response:</span>
                  <span className="font-medium">4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard Resolve:</span>
                  <span className="font-medium">1 day</span>
                </div>
              </div>
            </Card>

            {currentStep >= steps.length && (
              <Button
                onClick={onComplete}
                className="w-full gradient-primary"
                size="lg"
              >
                Continue to Refine <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
