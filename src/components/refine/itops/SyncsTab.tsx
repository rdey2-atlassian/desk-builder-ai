import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2, Users, Calendar, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

interface TeamMapping {
  okta_group: string;
  ops_team: string;
  role: string;
  members: number;
}

interface SyncData {
  user_sync: {
    enabled: boolean;
    provider: string;
    type: string;
    description: string;
    sync_frequency: string;
    last_sync: string;
    users_synced: number;
    features: string[];
  };
  team_sync: {
    enabled: boolean;
    provider: string;
    description: string;
    sync_frequency: string;
    last_sync: string;
    mappings: TeamMapping[];
    features: string[];
  };
  calendar_sync: {
    enabled: boolean;
    provider: string;
    description: string;
    features: string[];
  };
  slack_sync: {
    enabled: boolean;
    provider: string;
    description: string;
    features: string[];
  };
}

const SyncsTab = () => {
  const [syncs, setSyncs] = useState<SyncData | null>(null);

  useEffect(() => {
    fetch("/data/itops/syncs.json")
      .then((res) => res.json())
      .then((data) => setSyncs(data));
  }, []);

  if (!syncs) return null;

  const getTimeSince = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">User & Team Sync</h2>
        <p className="text-muted-foreground">
          Keep rosters and access up-to-date automatically
        </p>
      </div>

      <div className="grid gap-4">
        {/* User Sync */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">User Provisioning</h3>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {syncs.user_sync.provider} {syncs.user_sync.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {syncs.user_sync.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{syncs.user_sync.sync_frequency}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {syncs.user_sync.users_synced} users synced
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {getTimeSince(syncs.user_sync.last_sync)}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            {syncs.user_sync.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Sync */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">Team Mapping</h3>
                <Badge variant="outline">{syncs.team_sync.provider}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {syncs.team_sync.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {syncs.team_sync.sync_frequency}
                </div>
                <span>•</span>
                <span>{getTimeSince(syncs.team_sync.last_sync)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-semibold">Group Mappings:</h4>
            {syncs.team_sync.mappings.map((mapping, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background-secondary/50">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{mapping.okta_group}</Badge>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-sm font-medium">{mapping.ops_team}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{mapping.role}</Badge>
                  <span className="text-sm text-muted-foreground">{mapping.members} members</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {syncs.team_sync.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Calendar Sync */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">Calendar Integration</h3>
                <Badge variant="outline">{syncs.calendar_sync.provider}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {syncs.calendar_sync.description}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            {syncs.calendar_sync.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Slack Sync */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">Slack Integration</h3>
                <Badge variant="outline">{syncs.slack_sync.provider}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {syncs.slack_sync.description}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            {syncs.slack_sync.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SyncsTab;
