import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Headphones, Users, Plane } from "lucide-react";

export const Landing = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(
    "Create a Travel Helpdesk for Atlassian (500 employees). Mac-heavy. Use Okta, Slack, Confluence. Integrate Concur if available."
  );

  const quickStarts = [
    {
      icon: Headphones,
      title: "IT Helpdesk",
      description: "Hardware, software, and access requests",
      prompt: "Create an IT Helpdesk for a tech company with 500 employees. Mac-heavy. Use Okta, Slack, Jira.",
    },
    {
      icon: Plane,
      title: "Travel Helpdesk",
      description: "Business travel, visas, and emergency support",
      prompt: "Create a Travel Helpdesk for Atlassian (500 employees). Mac-heavy. Use Okta, Slack, Confluence. Integrate Concur if available.",
    },
    {
      icon: Users,
      title: "HR Helpdesk",
      description: "Onboarding, benefits, and policy questions",
      prompt: "Create an HR Helpdesk for a global company with 500 employees. Use Okta, Slack, Workday, BambooHR.",
    },
  ];

  const handleCompose = () => {
    navigate("/compose");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Desk Builder AI
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Build Your Helpdesk in Minutes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe your team's needs and we'll generate a complete helpdesk solution with portal, workflows, and integrations.
            </p>
          </div>

          {/* Quick Starts */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Quick Start Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStarts.map((qs) => (
                <Card
                  key={qs.title}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => setPrompt(qs.prompt)}
                >
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-primary/10 w-fit">
                      <qs.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{qs.title}</h3>
                    <p className="text-sm text-muted-foreground">{qs.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Or Describe Your Needs</h2>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your helpdesk requirements..."
              className="min-h-[120px] text-base"
            />
            <Button
              onClick={handleCompose}
              size="lg"
              className="w-full md:w-auto gap-2"
              disabled={!prompt.trim()}
            >
              <Sparkles className="h-4 w-4" />
              Compose Solution
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Smart Portal</h3>
              <p className="text-sm text-muted-foreground">
                Auto-generated request forms with policy enforcement
              </p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Workflow Automation</h3>
              <p className="text-sm text-muted-foreground">
                Routing, approvals, and escalations built-in
              </p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Integrations</h3>
              <p className="text-sm text-muted-foreground">
                Connect to Okta, Slack, and your existing tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
