import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import blueprint from "@/data/blueprint.json";
import { Check, X, ExternalLink } from "lucide-react";

const IntegrationsTab = () => {
  const integrations = [
    {
      id: "okta",
      name: "Okta",
      description: "SSO authentication and user directory for approvals",
      status: blueprint.connectors.okta,
      features: ["Single Sign-On", "User Profiles", "Manager Hierarchy"],
    },
    {
      id: "slack",
      name: "Slack",
      description: "Real-time notifications and dedicated channels",
      status: blueprint.connectors.slack,
      features: ["#travel-hotline channel", "P1 alerts", "Status updates"],
    },
    {
      id: "confluence",
      name: "Confluence",
      description: "Knowledge base integration for policy docs",
      status: blueprint.connectors.confluence,
      features: ["KB sync", "Policy snippets", "Document attachments"],
    },
    {
      id: "email",
      name: "Email",
      description: "Inbound email processing",
      status: "connected" as const,
      features: ["travel@company.com", "Auto-ticket creation", "Attachments"],
    },
    {
      id: "concur",
      name: "Concur Travel",
      description: "Corporate travel booking integration",
      status: blueprint.connectors.concur,
      features: ["Auto-request from bookings", "Itinerary parsing", "Policy checks"],
      note: "Not connected - you can add later. Email/PDF parsing will work meanwhile.",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold mb-2">Integration Status</h3>
        <p className="text-sm text-muted-foreground">
          Connected integrations will sync data automatically. You can add or
          configure additional integrations at any time.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{integration.name}</h3>
                      <Badge
                        variant={
                          integration.status === "connected" ? "default" : "secondary"
                        }
                        className={
                          integration.status === "connected"
                            ? "bg-success text-success-foreground"
                            : ""
                        }
                      >
                        {integration.status === "connected" ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Connected
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 mr-1" />
                            Not Connected
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{integration.description}</p>
                  </div>
                  <Button
                    variant={
                      integration.status === "connected" ? "outline" : "default"
                    }
                    size="sm"
                    className={
                      integration.status === "missing" ? "gradient-primary" : ""
                    }
                  >
                    {integration.status === "connected" ? "Configure" : "Connect"}
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {integration.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1 rounded-full bg-muted text-sm"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {integration.note && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-warning text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{integration.note}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-accent/20 bg-accent/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-accent text-sm font-bold">+</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Add More Integrations</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Connect additional tools like Jira, Microsoft Teams, Google Workspace,
              or custom APIs to extend your helpdesk capabilities.
            </p>
            <Button variant="outline" size="sm">
              Browse Integrations
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntegrationsTab;
