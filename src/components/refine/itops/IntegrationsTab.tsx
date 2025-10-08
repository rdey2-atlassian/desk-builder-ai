import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface Integration {
  name: string;
  type: string;
  status: string;
  description: string;
  features: string[];
  alert_count?: number;
  schedules_synced?: number;
  projects_linked?: number;
  components?: number;
  channels_configured?: string[];
}

interface IntegrationsData {
  monitoring: Integration[];
  incident_mgmt: Integration[];
  collaboration: Integration[];
  cloud: Integration[];
}

const IntegrationsTab = () => {
  const [data, setData] = useState<IntegrationsData | null>(null);

  useEffect(() => {
    fetch("/data/itops/integrations.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return null;

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return (
        <Badge variant="outline" className="bg-success/10 border-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-warning/10 border-warning/20">
        <AlertCircle className="w-3 h-3 mr-1" />
        Needs Configuration
      </Badge>
    );
  };

  const renderIntegrationCard = (integration: Integration) => (
    <Card key={integration.name} className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{integration.name}</h3>
                {getStatusBadge(integration.status)}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {integration.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          {integration.status === "connected" && (
            <div className="flex flex-wrap gap-4 mb-3 text-sm">
              {integration.alert_count && (
                <span className="text-muted-foreground">
                  {integration.alert_count} alerts configured
                </span>
              )}
              {integration.schedules_synced && (
                <span className="text-muted-foreground">
                  {integration.schedules_synced} schedules synced
                </span>
              )}
              {integration.projects_linked && (
                <span className="text-muted-foreground">
                  {integration.projects_linked} projects linked
                </span>
              )}
              {integration.components && (
                <span className="text-muted-foreground">
                  {integration.components} components
                </span>
              )}
              {integration.channels_configured && (
                <span className="text-muted-foreground">
                  Channels: {integration.channels_configured.join(", ")}
                </span>
              )}
            </div>
          )}

          {/* Features */}
          <div className="space-y-1 mb-4">
            {integration.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          {integration.status === "missing" ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Action Required</p>
                <p className="text-xs text-muted-foreground">
                  Admin needs to provide API key to complete integration
                </p>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Integration active and syncing</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Monitoring & Integrations</h2>
        <p className="text-muted-foreground">
          Connect monitoring tools, alerting systems, and collaboration platforms
        </p>
      </div>

      {/* Monitoring & Observability */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Monitoring & Observability</h3>
        <div className="grid gap-3">
          {data.monitoring.map(renderIntegrationCard)}
        </div>
      </div>

      {/* Incident Management */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Incident Management</h3>
        <div className="grid gap-3">
          {data.incident_mgmt.map(renderIntegrationCard)}
        </div>
      </div>

      {/* Collaboration */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Collaboration</h3>
        <div className="grid gap-3">
          {data.collaboration.map(renderIntegrationCard)}
        </div>
      </div>

      {/* Cloud Monitoring */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Cloud Monitoring</h3>
        <div className="grid gap-3">
          {data.cloud.map(renderIntegrationCard)}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsTab;
