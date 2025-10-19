import { Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { runSyntheticWorkflow, SyntheticRunLog } from "@/lib/synthetic/workflowRunner";
import { SolutionManifest } from "@/lib/manifest/types";

interface SyntheticTestPanelProps {
  manifest: SolutionManifest;
}

export function SyntheticTestPanel({ manifest }: SyntheticTestPanelProps) {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("");
  const [runLog, setRunLog] = useState<SyntheticRunLog | null>(null);

  const workflows = manifest.blocks.filter((b) => b.type === "workflow");

  const handleRun = () => {
    if (!selectedWorkflowId) return;
    
    const log = runSyntheticWorkflow(manifest, selectedWorkflowId, {
      status: "Preboarding",
      "asset.type": "HVAC",
    });
    
    setRunLog(log);
  };

  const handleDownload = () => {
    if (!runLog) return;
    
    const blob = new Blob([JSON.stringify(runLog, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${runLog.workflowName.replace(/\s+/g, "-").toLowerCase()}-synthetic-run.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case "transition":
        return "→";
      case "rule_fired":
        return "🔥";
      case "action_executed":
        return "⚡";
      default:
        return "•";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Synthetic Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Workflow</Label>
          <Select value={selectedWorkflowId} onValueChange={setSelectedWorkflowId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a workflow..." />
            </SelectTrigger>
            <SelectContent>
              {workflows.map((wf) => (
                <SelectItem key={wf.id} value={wf.id}>
                  {wf.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleRun} disabled={!selectedWorkflowId} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Run Synthetic Test
          </Button>
          {runLog && (
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {runLog && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{runLog.workflowName}</h3>
              <Badge variant={runLog.status === "completed" ? "default" : "destructive"}>
                {runLog.status}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground">
              <div>Started: {new Date(runLog.startTime).toLocaleString()}</div>
              {runLog.endTime && <div>Ended: {new Date(runLog.endTime).toLocaleString()}</div>}
              <div>Steps: {runLog.steps.length}</div>
            </div>

            <ScrollArea className="h-[400px] w-full rounded-lg border bg-muted/30">
              <div className="p-4 space-y-2">
                {runLog.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-card">
                    <span className="text-lg">{getStepIcon(step.type)}</span>
                    <div className="flex-1 text-xs">
                      <div className="font-medium capitalize">{step.type.replace("_", " ")}</div>
                      <div className="text-muted-foreground">{step.details}</div>
                      <div className="text-muted-foreground mt-1">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {runLog.error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                Error: {runLog.error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
