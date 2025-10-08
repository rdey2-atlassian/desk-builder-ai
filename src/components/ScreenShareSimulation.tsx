import { useEffect, useState } from "react";
import { Monitor, Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScreenShareSimulationProps {
  onComplete: () => void;
}

const ScreenShareSimulation = ({ onComplete }: ScreenShareSimulationProps) => {
  const [stage, setStage] = useState<"sharing" | "scanning" | "complete">("sharing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate screen share starting
    const shareTimer = setTimeout(() => {
      setStage("scanning");
    }, 1500);

    return () => clearTimeout(shareTimer);
  }, []);

  useEffect(() => {
    if (stage === "scanning") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage("complete");
            return 100;
          }
          return prev + 5;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "complete") {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(completeTimer);
    }
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      {/* Screen Share Banner */}
      <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 animate-pulse" />
          <span className="font-medium">You are sharing your screen</span>
        </div>
        <Button variant="destructive" size="sm">
          Stop Sharing
        </Button>
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
                    <a href="#" className="hover:text-blue-300">Dashboard</a>
                    <a href="#" className="hover:text-blue-300">Incidents</a>
                    <a href="#" className="hover:text-blue-300">Service Catalog</a>
                    <a href="#" className="hover:text-blue-300">Knowledge</a>
                  </div>
                </div>
                <div className="text-sm">Admin User</div>
              </div>

              {/* Content Area */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100%-60px)]">
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
                    <h3 className="text-xl font-semibold mb-2">Analyzing Service Desk</h3>
                    <p className="text-muted-foreground">
                      AI is crawling the page and collecting configuration details...
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
                    <div className={progress >= 20 ? "text-primary" : ""}>✓ Detecting request types</div>
                    <div className={progress >= 40 ? "text-primary" : ""}>✓ Mapping integrations</div>
                    <div className={progress >= 60 ? "text-primary" : ""}>✓ Analyzing workflows</div>
                    <div className={progress >= 80 ? "text-primary" : ""}>✓ Extracting knowledge base</div>
                    <div className={progress >= 100 ? "text-primary" : ""}>✓ Building helpdesk blueprint</div>
                  </div>
                </Card>
              </div>
            )}

            {/* Complete Overlay */}
            {stage === "complete" && (
              <div className="absolute inset-0 bg-background/95 flex items-center justify-center animate-fade-in">
                <Card className="p-8 max-w-md w-full text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Scan Complete!</h3>
                    <p className="text-muted-foreground">
                      Successfully imported service desk configuration. Building your helpdesk now...
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
