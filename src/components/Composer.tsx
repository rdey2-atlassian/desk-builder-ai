import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBuild } from "@/store/buildMachine";
import { BlockCard } from "@/components/BlockCard";
import { BuildLog } from "@/components/BuildLog";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Plug, 
  Zap, 
  Clock, 
  Users 
} from "lucide-react";

const blocks = [
  { key: "portal" as const, title: "Portal", icon: LayoutDashboard },
  { key: "requestTypes" as const, title: "Request Types", icon: FileText },
  { key: "knowledge" as const, title: "Knowledge Base", icon: BookOpen },
  { key: "integrations" as const, title: "Integrations", icon: Plug },
  { key: "automations" as const, title: "Automations", icon: Zap },
  { key: "slas" as const, title: "SLAs", icon: Clock },
  { key: "team" as const, title: "Team Setup", icon: Users },
];

export const Composer = () => {
  const navigate = useNavigate();
  const { status, startBuild, isReady } = useBuild();

  useEffect(() => {
    startBuild();
  }, [startBuild]);

  const ready = isReady();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Building Your Travel Helpdesk</h1>
              <p className="text-sm text-muted-foreground">
                Setting up portal, workflows, and integrations...
              </p>
            </div>
            {ready && (
              <Button onClick={() => navigate("/refine")} size="lg">
                Preview Solution →
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 h-full">
            {/* Left: Block Cards */}
            <div className="overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blocks.map((block) => (
                  <BlockCard
                    key={block.key}
                    title={block.title}
                    icon={block.icon}
                    status={status[block.key]}
                  />
                ))}
              </div>
            </div>

            {/* Right: Build Log */}
            <div className="overflow-auto">
              <BuildLog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
