import { useBuild } from "@/store/buildMachine";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export const BuildLog = () => {
  const { log, status } = useBuild();
  
  const allReady = Object.values(status).every((s) => s === "Ready");

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Build Log</h3>
        {allReady && (
          <Badge variant="outline" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Complete
          </Badge>
        )}
      </div>
      
      <div className="flex-1 overflow-auto space-y-2">
        {log.map((line, i) => (
          <div key={i} className="text-sm text-muted-foreground border-l-2 border-primary/20 pl-3 py-1">
            {line}
          </div>
        ))}
        {log.length === 0 && (
          <div className="text-sm text-muted-foreground italic">
            Waiting to start build...
          </div>
        )}
      </div>
    </Card>
  );
};
