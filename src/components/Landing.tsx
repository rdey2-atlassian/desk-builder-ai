import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Plane, Users, Sparkles, Upload, FileText, Image, Monitor } from "lucide-react";

interface LandingProps {
  onGenerate: (prompt: string) => void;
  onScreenShare: () => void;
}

const Landing = ({ onGenerate, onScreenShare }: LandingProps) => {
  const [prompt, setPrompt] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const quickStarts = [
    {
      title: "IT Helpdesk",
      description: "Technical support for employees",
      icon: Briefcase,
      prompt: "Create an IT Helpdesk for a mid-sized tech company with 300 employees.",
    },
    {
      title: "Travel Helpdesk",
      description: "Corporate travel management",
      icon: Plane,
      prompt: "Create a Travel Helpdesk for Atlassian (500 employees). Mac-heavy. Use Okta, Slack, Confluence. Integrate Concur Travel if available.",
    },
    {
      title: "IT Operations",
      description: "Incident & operations management",
      icon: Sparkles,
      prompt: "Create an IT Operations desk to manage incidents, on-call schedules, and playbooks for a 200-person engineering team.",
    },
    {
      title: "HR Helpdesk",
      description: "Employee services and support",
      icon: Users,
      prompt: "Create an HR Helpdesk for employee onboarding, benefits, and general HR queries.",
    },
  ];

  const handleQuickStart = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Helpdesk Composer</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Describe your helpdesk.
            <br />
            <span className="text-primary">
              We'll build it.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From natural language to a production-ready helpdesk in minutes.
            No configuration needed.
          </p>
        </div>

        {/* Quick Start Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStarts.map((quick, idx) => {
            const Icon = quick.icon;
            return (
              <Card
                key={idx}
                className="p-6 cursor-pointer transition-smooth hover:border-primary hover:glow-primary group"
                onClick={() => handleQuickStart(quick.prompt)}
              >
                <Icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{quick.title}</h3>
                <p className="text-sm text-muted-foreground">{quick.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Prompt Input */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Textarea
              placeholder="E.g., Create a Travel Helpdesk for Atlassian (500 employees). Mac-heavy. Use Okta, Slack, Confluence. Integrate Concur Travel if available."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] text-base resize-none flex-1"
            />
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="h-[120px] px-6">
                  <Upload className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Import Existing Service Desk</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like to import your existing service desk configuration
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Card className="p-4 cursor-pointer transition-smooth hover:border-primary group">
                    <div className="flex items-start gap-4">
                      <FileText className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Upload Configuration File</h4>
                        <p className="text-sm text-muted-foreground">
                          Import a JSON, CSV, or Excel file with your service desk details
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 cursor-pointer transition-smooth hover:border-primary group">
                    <div className="flex items-start gap-4">
                      <Image className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Upload Screenshots</h4>
                        <p className="text-sm text-muted-foreground">
                          AI will analyze images of your current service desk setup
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer transition-smooth hover:border-primary group"
                    onClick={() => {
                      setImportDialogOpen(false);
                      onScreenShare();
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <Monitor className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Screen Share & Crawl</h4>
                        <p className="text-sm text-muted-foreground">
                          Share your screen and AI will crawl your existing service desk
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {prompt.length} / 500 characters
            </p>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              size="lg"
              className="gradient-primary hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Helpdesk
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-8">
          {[
            { label: "Portal & Channels", value: "Auto-generated" },
            { label: "Request Types", value: "Pre-configured" },
            { label: "Knowledge Base", value: "AI-seeded" },
            { label: "Integrations", value: "One-click" },
          ].map((feature, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-2xl font-bold text-primary">{feature.value}</p>
              <p className="text-sm text-muted-foreground">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
