import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PreflightIssue } from "@/lib/preflight/preflight";

interface PreflightSidebarProps {
  issues: PreflightIssue[];
  onIssueClick?: (issue: PreflightIssue) => void;
}

export function PreflightSidebar({ issues, onIssueClick }: PreflightSidebarProps) {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const info = issues.filter((i) => i.severity === "info");

  const getIcon = (severity: PreflightIssue["severity"]) => {
    switch (severity) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getSeverityBadge = (severity: PreflightIssue["severity"]) => {
    const variants = {
      error: "destructive",
      warning: "outline",
      info: "secondary",
    } as const;

    return (
      <Badge variant={variants[severity]} className="ml-auto">
        {severity}
      </Badge>
    );
  };

  if (issues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-success" />
            Preflight Passed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No issues found. Your solution is ready to deploy.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Preflight Results
          {errors.length > 0 && (
            <Badge variant="destructive">{errors.length} errors</Badge>
          )}
          {warnings.length > 0 && (
            <Badge variant="outline">{warnings.length} warnings</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-4">
            {errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-destructive">Errors</h3>
                {errors.map((issue, idx) => (
                  <div
                    key={idx}
                    onClick={() => onIssueClick?.(issue)}
                    className="flex items-start gap-2 p-3 rounded-lg border border-destructive/20 bg-destructive/5 cursor-pointer hover:bg-destructive/10 transition-colors"
                  >
                    {getIcon(issue.severity)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.message}</p>
                      {issue.field && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Field: {issue.field}
                        </p>
                      )}
                    </div>
                    {getSeverityBadge(issue.severity)}
                  </div>
                ))}
              </div>
            )}

            {warnings.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-warning">Warnings</h3>
                {warnings.map((issue, idx) => (
                  <div
                    key={idx}
                    onClick={() => onIssueClick?.(issue)}
                    className="flex items-start gap-2 p-3 rounded-lg border border-warning/20 bg-warning/5 cursor-pointer hover:bg-warning/10 transition-colors"
                  >
                    {getIcon(issue.severity)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.message}</p>
                      {issue.field && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Field: {issue.field}
                        </p>
                      )}
                    </div>
                    {getSeverityBadge(issue.severity)}
                  </div>
                ))}
              </div>
            )}

            {info.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-info">Info</h3>
                {info.map((issue, idx) => (
                  <div
                    key={idx}
                    onClick={() => onIssueClick?.(issue)}
                    className="flex items-start gap-2 p-3 rounded-lg border border-info/20 bg-info/5 cursor-pointer hover:bg-info/10 transition-colors"
                  >
                    {getIcon(issue.severity)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.message}</p>
                      {issue.field && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Field: {issue.field}
                        </p>
                      )}
                    </div>
                    {getSeverityBadge(issue.severity)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
