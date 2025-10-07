import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DeploySuccess = () => {
  const { toast } = useToast();

  const deploymentDetails = [
    { label: "Portal URL", value: "https://travel.atlassian.com" },
    { label: "Email", value: "travel@atlassian.com" },
    { label: "Slack Channel", value: "#travel-helpdesk" },
    { label: "Status", value: "Live" },
  ];

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        {/* Success Icon */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 glow-primary">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-4xl font-bold">Deployment Complete!</h1>
          <p className="text-xl text-muted-foreground">
            Your Travel Helpdesk is now live and ready for your team.
          </p>
        </div>

        {/* Deployment Details */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Deployment Details</h3>
          <div className="space-y-3">
            {deploymentDetails.map((detail, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <span className="text-sm text-muted-foreground">{detail.label}</span>
                  <p className="font-medium">{detail.value}</p>
                </div>
                {detail.label !== "Status" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(detail.value)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* What's Next */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">What's Next?</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Share with your team</p>
                <p className="text-muted-foreground">
                  Your pilot team can now access the portal and start creating requests
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Connect Concur (optional)</p>
                <p className="text-muted-foreground">
                  Add travel booking integration for automated request creation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Monitor & iterate</p>
                <p className="text-muted-foreground">
                  Use analytics to refine request types, SLAs, and automations
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="flex-1 gradient-primary" size="lg">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Portal
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            View Dashboard
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
          {[
            { label: "Components", value: "7" },
            { label: "Request Types", value: "6" },
            { label: "KB Articles", value: "10" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeploySuccess;
