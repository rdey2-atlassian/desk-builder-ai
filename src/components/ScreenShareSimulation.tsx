import { useEffect, useState } from "react";
import { Monitor, Check, Loader2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScreenShareSimulationProps {
  onComplete: () => void;
}

type Tab = "dashboard" | "incidents" | "catalog" | "knowledge";

const ScreenShareSimulation = ({ onComplete }: ScreenShareSimulationProps) => {
  const [stage, setStage] = useState<"sharing" | "scanning" | "ready" | "building">("sharing");
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [scannedPages, setScannedPages] = useState<Set<Tab>>(new Set());
  const [currentlyScanningTab, setCurrentlyScanningTab] = useState<Tab | null>(null);

  useEffect(() => {
    // Simulate screen share starting and auto-scan first page
    const shareTimer = setTimeout(() => {
      startScan("dashboard");
    }, 1500);

    return () => clearTimeout(shareTimer);
  }, []);

  const startScan = (tab: Tab) => {
    setCurrentlyScanningTab(tab);
    setStage("scanning");
    setProgress(0);
  };

  useEffect(() => {
    if (stage === "scanning" && currentlyScanningTab) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScannedPages((prevScanned) => new Set(prevScanned).add(currentlyScanningTab));
            setStage("ready");
            setCurrentlyScanningTab(null);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [stage, currentlyScanningTab]);

  useEffect(() => {
    if (stage === "building") {
      const buildTimer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(buildTimer);
    }
  }, [stage, onComplete]);

  const handleTabClick = (tab: Tab) => {
    if (stage === "ready") {
      setActiveTab(tab);
      if (!scannedPages.has(tab)) {
        startScan(tab);
      }
    }
  };

  const handleBuild = () => {
    setStage("building");
  };

  const getTabContent = (tab: Tab) => {
    switch (tab) {
      case "dashboard":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">IT Service Management</h1>
              <p className="text-muted-foreground">Manage incidents, requests, and service delivery</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Open Incidents</div>
                <div className="text-3xl font-bold text-[#0F3554]">24</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Pending Requests</div>
                <div className="text-3xl font-bold text-[#0F3554]">18</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Avg Response Time</div>
                <div className="text-3xl font-bold text-[#0F3554]">2.5h</div>
              </Card>
            </div>
          </>
        );
      case "incidents":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Incident Management</h1>
              <p className="text-muted-foreground">Track and resolve IT incidents</p>
            </div>
            <Card className="p-6 mb-4">
              <div className="flex gap-4 mb-4">
                <Button size="sm" variant="outline">All</Button>
                <Button size="sm" variant="outline">Open</Button>
                <Button size="sm" variant="outline">In Progress</Button>
                <Button size="sm" variant="outline">Resolved</Button>
              </div>
            </Card>
          </>
        );
      case "catalog":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Service Catalog</h1>
              <p className="text-muted-foreground">Browse and request IT services</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["Hardware", "Software", "Access", "Support", "Training", "Other"].map((cat) => (
                <Card key={cat} className="p-6 text-center">
                  <div className="font-semibold">{cat}</div>
                </Card>
              ))}
            </div>
          </>
        );
      case "knowledge":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Knowledge Base</h1>
              <p className="text-muted-foreground">Find answers and documentation</p>
            </div>
            <Card className="p-6">
              <div className="space-y-3">
                {["How to reset your password", "VPN connection guide", "Software installation procedures"].map((article) => (
                  <div key={article} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    {article}
                  </div>
                ))}
              </div>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      {/* Screen Share Banner */}
      <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-4">
          <Monitor className="w-5 h-5 animate-pulse" />
          <span className="font-medium">You are sharing your screen</span>
          {stage === "ready" && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              {scannedPages.size} page{scannedPages.size !== 1 ? "s" : ""} scanned
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {stage === "ready" && scannedPages.size > 0 && (
            <Button 
              onClick={handleBuild}
              size="sm" 
              className="bg-white text-primary hover:bg-white/90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Build Helpdesk
            </Button>
          )}
          <Button variant="destructive" size="sm">
            Stop Sharing
          </Button>
        </div>
      </div>

      {/* Mock Browser Window */}
      <div className="pt-16 px-8 pb-8 h-full">
        <div className="h-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col animate-scale-in">
          {/* Browser Chrome */}
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-3 border-b">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-700 rounded px-4 py-1 text-sm text-muted-foreground">
              https://company.service-now.com/helpdesk
            </div>
          </div>

          {/* Mock ServiceNow Interface */}
          <div className="flex-1 overflow-hidden relative">
            <div className="h-full overflow-auto">
              {/* ServiceNow Header */}
              <div className="bg-[#0F3554] text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">NOW</div>
                  <div className="flex gap-6 text-sm">
                    <button
                      onClick={() => handleTabClick("dashboard")}
                      className={`hover:text-blue-300 transition-colors relative ${
                        activeTab === "dashboard" ? "text-white font-semibold" : "text-blue-200"
                      }`}
                    >
                      Dashboard
                      {scannedPages.has("dashboard") && (
                        <Check className="w-3 h-3 inline-block ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleTabClick("incidents")}
                      className={`hover:text-blue-300 transition-colors relative ${
                        activeTab === "incidents" ? "text-white font-semibold" : "text-blue-200"
                      }`}
                    >
                      Incidents
                      {scannedPages.has("incidents") && (
                        <Check className="w-3 h-3 inline-block ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleTabClick("catalog")}
                      className={`hover:text-blue-300 transition-colors relative ${
                        activeTab === "catalog" ? "text-white font-semibold" : "text-blue-200"
                      }`}
                    >
                      Service Catalog
                      {scannedPages.has("catalog") && (
                        <Check className="w-3 h-3 inline-block ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleTabClick("knowledge")}
                      className={`hover:text-blue-300 transition-colors relative ${
                        activeTab === "knowledge" ? "text-white font-semibold" : "text-blue-200"
                      }`}
                    >
                      Knowledge
                      {scannedPages.has("knowledge") && (
                        <Check className="w-3 h-3 inline-block ml-1" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-sm">Admin User</div>
              </div>

              {/* Content Area */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100%-60px)]">
                {getTabContent(activeTab)}

                {stage === "ready" && activeTab === "dashboard" && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Tickets</h2>
                    <div className="space-y-3">
                      {[
                        { id: "INC0010234", title: "Laptop not connecting to VPN", priority: "High" },
                        { id: "INC0010235", title: "Password reset request", priority: "Medium" },
                        { id: "INC0010236", title: "Software installation - Adobe Creative Suite", priority: "Low" },
                        { id: "REQ0005123", title: "New employee onboarding", priority: "Medium" },
                      ].map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-sm text-[#0F3554] dark:text-blue-300">{ticket.id}</span>
                            <span>{ticket.title}</span>
                          </div>
                          <span className={`text-sm px-3 py-1 rounded ${
                            ticket.priority === "High" ? "bg-red-100 text-red-700" :
                            ticket.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Scanning Overlay */}
            {stage === "scanning" && (
              <div className="absolute inset-0 bg-background/95 flex items-center justify-center animate-fade-in">
                <Card className="p-8 max-w-md w-full text-center space-y-6">
                  <div className="flex justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Scanning {currentlyScanningTab}</h3>
                    <p className="text-muted-foreground">
                      AI is analyzing this page and extracting configuration...
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className={progress >= 25 ? "text-primary" : ""}>✓ Extracting page structure</div>
                    <div className={progress >= 50 ? "text-primary" : ""}>✓ Identifying components</div>
                    <div className={progress >= 75 ? "text-primary" : ""}>✓ Analyzing workflows</div>
                    <div className={progress >= 100 ? "text-primary" : ""}>✓ Page scan complete</div>
                  </div>
                </Card>
              </div>
            )}

            {/* Ready State - Show notification */}
            {stage === "ready" && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-slide-up">
                <Card className="p-4 shadow-lg border-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Scan complete for this page</p>
                      <p className="text-sm text-muted-foreground">
                        Click other tabs to scan more pages, or click "Build Helpdesk" to continue
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Building Overlay */}
            {stage === "building" && (
              <div className="absolute inset-0 bg-background/95 flex items-center justify-center animate-fade-in">
                <Card className="p-8 max-w-md w-full text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Building Your Helpdesk</h3>
                    <p className="text-muted-foreground">
                      Creating your helpdesk based on the scanned configuration...
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenShareSimulation;
