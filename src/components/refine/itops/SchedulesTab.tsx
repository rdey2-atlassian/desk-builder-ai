import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Globe } from "lucide-react";
import { useEffect, useState } from "react";

interface Rotation {
  name: string;
  timezone: string;
  hours?: string;
  members: string[];
  rotation_type: string;
  handoff_day?: string;
}

interface Schedule {
  id: string;
  name: string;
  description: string;
  type: string;
  rotations: Rotation[];
}

const SchedulesTab = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    fetch("/data/itops/schedules.json")
      .then((res) => res.json())
      .then((data) => setSchedules(data.schedules));
  }, []);

  const getTypeColor = (type: string) => {
    if (type === "24x7") return "default";
    if (type === "escalation") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">On-call Schedules</h2>
        <p className="text-muted-foreground">
          Manage rotations and ensure 24×7 coverage
        </p>
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{schedule.name}</h3>
                  <Badge variant={getTypeColor(schedule.type)}>{schedule.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {schedule.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {schedule.rotations.map((rotation, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-background-secondary/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">{rotation.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {rotation.timezone}
                        </div>
                        {rotation.hours && (
                          <>
                            <span>•</span>
                            <span>{rotation.hours}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {rotation.rotation_type} rotation
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{rotation.members.length} members:</span>
                    <span className="text-foreground">{rotation.members.join(", ")}</span>
                  </div>

                  {rotation.handoff_day && (
                    <div className="text-xs text-muted-foreground">
                      Handoff: {rotation.handoff_day}s at shift start
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SchedulesTab;
