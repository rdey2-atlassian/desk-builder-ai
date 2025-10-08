import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, Sparkles } from "lucide-react";

export const Deploy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-green-100 dark:bg-green-950">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Helpdesk Deployed!</h1>
          <p className="text-muted-foreground">
            Your Atlassian Travel Desk is now live and ready to serve your team.
          </p>
        </div>

        <div className="space-y-3 text-left bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            What's Live
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Portal:</strong> travel.atlassian.help</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Email intake:</strong> travel@atlassian.com</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Slack:</strong> #travel-hotline (P1 emergencies)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Knowledge base:</strong> 10 articles seeded</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              <span><strong>Integrations:</strong> Okta, Slack, Confluence connected</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="flex-1 gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Portal
          </Button>
          <Button variant="outline" className="flex-1">
            View Dashboard
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Pilot team members have been notified via email
        </p>
      </Card>
    </div>
  );
};

export default Deploy;
