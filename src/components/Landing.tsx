import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Image, Monitor, Sparkles } from "lucide-react";
import { solutionTemplates } from "@/data/templates";

interface LandingProps {
  onTemplateSelect: (templateId: string) => void;
  onScreenShare: () => void;
}

const Landing = ({ onTemplateSelect, onScreenShare }: LandingProps) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);

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
            Build enterprise solutions.
            <br />
            <span className="text-primary">
              Start from a template.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a pre-built solution or start from scratch. Customize everything.
          </p>
        </div>

        {/* Solution Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solutionTemplates.map((template) => {
            const Icon = template.icon;
            const isBlank = template.id === "blank";
            return (
              <Card
                key={template.id}
                className={`p-6 cursor-pointer transition-smooth hover:border-primary hover:glow-primary group ${
                  isBlank ? "border-2 border-dashed border-primary/50" : ""
                }`}
                onClick={() => onTemplateSelect(template.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isBlank ? "bg-muted" : "bg-primary/10"}`}>
                    <Icon className={`w-6 h-6 ${isBlank ? "text-muted-foreground" : "text-primary"} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    {template.blocks.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.blocks.slice(0, 3).map((block, idx) => (
                          <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                            {block.label}
                          </span>
                        ))}
                        {template.blocks.length > 3 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{template.blocks.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Import Option */}
        <div className="flex justify-center">
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Import Existing Solution
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

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-8">
          {[
            { label: "Solution Templates", value: "6+" },
            { label: "Pre-built Blocks", value: "50+" },
            { label: "Integrations", value: "One-click" },
            { label: "Deployment", value: "Minutes" },
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
