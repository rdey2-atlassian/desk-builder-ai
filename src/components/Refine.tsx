import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import PortalTab from "./refine/PortalTab";
import RequestTypesTab from "./refine/RequestTypesTab";
import KnowledgeTab from "./refine/KnowledgeTab";
import IntegrationsTab from "./refine/IntegrationsTab";
import AutomationsTab from "./refine/AutomationsTab";
import SLAsTab from "./refine/SLAsTab";
import TeamRolesTab from "./refine/TeamRolesTab";

interface RefineProps {
  solutionData: { name: string; description: string; blocks: any[] } | null;
  onContinue: () => void;
}

const Refine = ({ solutionData, onContinue }: RefineProps) => {
  const [activeTab, setActiveTab] = useState("portal");
  
  const solutionName = solutionData?.name || "Your Solution";
  const blockCount = solutionData?.blocks?.length || 0;

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Refine {solutionName}</h1>
            <p className="text-muted-foreground">
              {blockCount} blocks configured • Review and customize before deploying
            </p>
          </div>
          <Button onClick={onContinue} size="lg" className="gradient-primary">
            Preview Solution <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
            <TabsTrigger value="portal">Portal</TabsTrigger>
            <TabsTrigger value="request-types">Request Types</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="slas">SLAs</TabsTrigger>
            <TabsTrigger value="team">Team & Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="portal" className="space-y-4">
            <PortalTab />
          </TabsContent>

          <TabsContent value="request-types" className="space-y-4">
            <RequestTypesTab />
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <KnowledgeTab />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="automations" className="space-y-4">
            <AutomationsTab />
          </TabsContent>

          <TabsContent value="slas" className="space-y-4">
            <SLAsTab />
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <TeamRolesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Refine;
