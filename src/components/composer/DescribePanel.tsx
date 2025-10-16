import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlockInstance } from "@/types/blocks";

interface DescribePanelProps {
  onBlocksGenerated: (blocks: BlockInstance[]) => void;
  onClose: () => void;
}

const DescribePanel = ({ onBlocksGenerated, onClose }: DescribePanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const examplePrompts = [
    "Create HR Onboarding solution for India and US with Workday, Okta, and Intune integrations",
    "Build IT Operations desk with incident management, on-call schedules, and playbooks",
    "Design Facilities Work Order system with preventive maintenance and space management",
    "Create Software Asset Management solution with license tracking and reclaim automation",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe the solution you want to build",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-solution', {
        body: { prompt: prompt.trim() }
      });

      if (error) {
        throw error;
      }

      if (!data || !data.blocks) {
        throw new Error('Invalid response from server');
      }

      console.log('Generated blocks:', data.blocks);

      toast({
        title: "Solution generated!",
        description: `Created ${data.blocks.length} blocks for your solution`,
      });

      onBlocksGenerated(data.blocks);
      onClose();

    } catch (error) {
      console.error('Error generating solution:', error);
      
      let errorMessage = 'Failed to generate solution';
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        } else if (error.message.includes('402')) {
          errorMessage = 'Credits required. Please add credits to your workspace.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 p-6 shadow-2xl border-2 border-primary/20 animate-scale-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Describe Your Solution</h2>
              <p className="text-sm text-muted-foreground">AI will generate blocks automatically</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={isGenerating}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">What do you want to build?</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Create an HR Onboarding solution for new hires with identity provisioning, device setup, and compliance workflows..."
            rows={4}
            className="resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Example Prompts */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Try these examples:</label>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.map((example, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(example)}
                disabled={isGenerating}
                className="justify-start h-auto py-2 px-3 text-left font-normal hover:bg-accent"
              >
                <span className="line-clamp-2 text-xs">{example}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating solution...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Solution
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default DescribePanel;
