import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";

interface Heartbeat {
  id: string;
  name: string;
  description: string;
  interval_minutes: number;
  alert_after_minutes: number;
  last_ping: string;
  status: string;
  service: string;
  owner: string;
}

const HeartbeatsTab = () => {
  const [heartbeats, setHeartbeats] = useState<Heartbeat[]>([]);

  useEffect(() => {
    fetch("/data/itops/heartbeats.json")
      .then((res) => res.json())
      .then((data) => setHeartbeats(data.heartbeats));
  }, []);

  const formatInterval = (minutes: number) => {
    if (minutes >= 1440) return `${minutes / 1440}d`;
    if (minutes >= 60) return `${minutes / 60}h`;
    return `${minutes}m`;
  };

  const getTimeSince = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Heartbeats & Monitoring</h2>
        <p className="text-muted-foreground">
          Monitor critical jobs and services for silent failures
        </p>
      </div>

      <div className="grid gap-3">
        {heartbeats.map((hb) => (
          <Card key={hb.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-success/10">
                <Activity className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-semibold mb-1">{hb.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {hb.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {hb.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mt-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Every {formatInterval(hb.interval_minutes)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{hb.owner}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Alert if no ping: {formatInterval(hb.alert_after_minutes)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last ping: {getTimeSince(hb.last_ping)}
                  </div>
                </div>

                <div className="mt-3">
                  <Badge variant="secondary" className="text-xs">
                    {hb.service}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HeartbeatsTab;
