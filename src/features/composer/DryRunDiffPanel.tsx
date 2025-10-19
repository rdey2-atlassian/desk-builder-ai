import { Plus, Minus, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DiffItem } from "@/lib/compiler/diff";

interface DryRunDiffPanelProps {
  diff: DiffItem[];
}

export function DryRunDiffPanel({ diff }: DryRunDiffPanelProps) {
  const added = diff.filter((d) => d.type === "added");
  const removed = diff.filter((d) => d.type === "removed");
  const changed = diff.filter((d) => d.type === "changed");
  
  const getIcon = (type: DiffItem["type"]) => {
    switch (type) {
      case "added":
        return <Plus className="h-4 w-4 text-success" />;
      case "removed":
        return <Minus className="h-4 w-4 text-destructive" />;
      case "changed":
        return <Circle className="h-4 w-4 text-warning" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getColor = (type: DiffItem["type"]) => {
    switch (type) {
      case "added":
        return "border-l-4 border-l-success bg-success/5";
      case "removed":
        return "border-l-4 border-l-destructive bg-destructive/5";
      case "changed":
        return "border-l-4 border-l-warning bg-warning/5";
      default:
        return "border-l-4 border-l-muted";
    }
  };

  if (diff.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No changes detected since last dry run.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Changes Since Last Dry Run</CardTitle>
          <div className="flex items-center gap-2">
            {added.length > 0 && <Badge variant="outline" className="text-success">{added.length} added</Badge>}
            {removed.length > 0 && <Badge variant="outline" className="text-destructive">{removed.length} removed</Badge>}
            {changed.length > 0 && <Badge variant="outline" className="text-warning">{changed.length} changed</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4">
            {diff.filter((d) => d.type !== "unchanged").map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-lg ${getColor(item.type)}`}
              >
                {getIcon(item.type)}
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {item.category.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  {item.details && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.details}
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="capitalize">
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
