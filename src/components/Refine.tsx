import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PortalPreview } from "@/components/PortalPreview";
import { RequestTypeFormPreview } from "@/components/RequestTypeFormPreview";
import { KBList } from "@/components/KBList";
import { KBArticle } from "@/components/KBArticle";
import { IntegrationsStatus } from "@/components/IntegrationsStatus";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, RotateCcw } from "lucide-react";

export const Refine = () => {
  const navigate = useNavigate();
  const [newTripType, setNewTripType] = useState<any>(null);
  const [emergencyType, setEmergencyType] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/travel/request_types/new_trip.json")
      .then((r) => r.json())
      .then(setNewTripType)
      .catch(console.error);

    fetch("/data/travel/request_types/emergency.json")
      .then((r) => r.json())
      .then(setEmergencyType)
      .catch(console.error);
  }, []);

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Refine Your Solution</h1>
              <p className="text-sm text-muted-foreground">
                Review and customize before deploying
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset to AI Defaults
              </Button>
              <Button onClick={() => navigate("/preview")} size="lg">
                Test Solution →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="portal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="portal">Portal</TabsTrigger>
              <TabsTrigger value="request-types">Request Types</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="portal" className="space-y-4">
              <PortalPreview />
            </TabsContent>

            <TabsContent value="request-types" className="space-y-4">
              <div className="space-y-4">
                <Collapsible defaultOpen>
                  <Card>
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <h3 className="text-lg font-semibold">Request a New Trip</h3>
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 border-t">
                        {newTripType && <RequestTypeFormPreview requestType={newTripType} />}
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                <Collapsible>
                  <Card>
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <h3 className="text-lg font-semibold">Emergency Travel Help (24×7)</h3>
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 border-t">
                        {emergencyType && <RequestTypeFormPreview requestType={emergencyType} />}
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </div>
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-4">
              {selectedArticle ? (
                <KBArticle
                  article={selectedArticle}
                  onBack={() => setSelectedArticle(null)}
                />
              ) : (
                <KBList onSelectArticle={setSelectedArticle} />
              )}
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <IntegrationsStatus />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Refine;
