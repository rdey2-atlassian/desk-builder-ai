import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Plug } from "lucide-react";

interface Connectors {
  [key: string]: "connected" | "missing";
}

const connectorLabels: Record<string, string> = {
  okta: "Okta (SSO)",
  slack: "Slack",
  confluence: "Confluence",
  email: "Email",
  concur: "Concur",
};

export const IntegrationsStatus = () => {
  const [connectors, setConnectors] = useState<Connectors | null>(null);

  useEffect(() => {
    fetch("/data/travel/connectors.json")
      .then((r) => r.json())
      .then(setConnectors)
      .catch(console.error);
  }, []);

  if (!connectors) return <div className="text-muted-foreground">Loading integrations...</div>;

  const connected = Object.entries(connectors).filter(([_, status]) => status === "connected");
  const missing = Object.entries(connectors).filter(([_, status]) => status === "missing");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Connected Integrations</h3>
        <Badge variant="outline">{connected.length} active</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connected.map(([key, status]) => (
          <Card key={key} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-green-100 dark:bg-green-950">
                  <Plug className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">{connectorLabels[key] || key}</h4>
                  <p className="text-xs text-muted-foreground">Active connection</p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </Card>
        ))}
      </div>

      {missing.length > 0 && (
        <>
          <div className="flex items-center justify-between pt-4">
            <h3 className="text-lg font-semibold">Available Integrations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missing.map(([key, status]) => (
              <Card key={key} className="p-4 border-dashed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{connectorLabels[key] || key}</h4>
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect later
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              <strong>Concur not connected</strong> — we'll parse emails/PDFs meanwhile.
            </p>
          </Card>
        </>
      )}
    </div>
  );
};
