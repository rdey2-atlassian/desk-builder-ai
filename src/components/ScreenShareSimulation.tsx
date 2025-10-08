import { useEffect, useState } from "react";
import { Monitor, Check, Loader2, Sparkles, ChevronRight, ArrowRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScreenShareSimulationProps {
  onComplete: () => void;
}

type Component = "portal" | "catalog" | "knowledge" | "integrations" | "automations";

const COMPONENT_SEQUENCE: Component[] = ["portal", "catalog", "knowledge", "integrations", "automations"];

const COMPONENT_LABELS: Record<Component, string> = {
  portal: "Service Portal",
  catalog: "Service Catalog",
  knowledge: "Knowledge Base",
  integrations: "Integrations",
  automations: "Workflows & Automations"
};

const ScreenShareSimulation = ({ onComplete }: ScreenShareSimulationProps) => {
  const [stage, setStage] = useState<"sharing" | "scanning" | "ready" | "building">("sharing");
  const [progress, setProgress] = useState(0);
  const [activeComponent, setActiveComponent] = useState<Component>("portal");
  const [scannedComponents, setScannedComponents] = useState<Set<Component>>(new Set());
  const [currentlyScanningComponent, setCurrentlyScanningComponent] = useState<Component | null>(null);
  const [showGuidanceDialog, setShowGuidanceDialog] = useState(false);
  const [allScansComplete, setAllScansComplete] = useState(false);
  const [waitingForNavigation, setWaitingForNavigation] = useState(false);
  const [nextComponentToScan, setNextComponentToScan] = useState<Component | null>(null);

  useEffect(() => {
    // Simulate screen share starting and auto-scan first component (portal)
    const shareTimer = setTimeout(() => {
      startScan("portal");
    }, 1500);

    return () => clearTimeout(shareTimer);
  }, []);

  const startScan = (component: Component) => {
    setCurrentlyScanningComponent(component);
    setStage("scanning");
    setProgress(0);
    setShowGuidanceDialog(false);
    setWaitingForNavigation(false);
  };

  useEffect(() => {
    if (stage === "scanning" && currentlyScanningComponent) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScannedComponents((prevScanned) => new Set(prevScanned).add(currentlyScanningComponent));
            
            // Check if this was the last component
            const currentIndex = COMPONENT_SEQUENCE.indexOf(currentlyScanningComponent);
            if (currentIndex === COMPONENT_SEQUENCE.length - 1) {
              // All components scanned - show final completion dialog
              setAllScansComplete(true);
              setShowGuidanceDialog(true);
              setStage("ready");
            } else {
              // More components to scan - show guidance for next one
              const nextComponent = COMPONENT_SEQUENCE[currentIndex + 1];
              setNextComponentToScan(nextComponent);
              setShowGuidanceDialog(true);
              setWaitingForNavigation(true);
              setStage("ready");
            }
            setCurrentlyScanningComponent(null);
            return 100;
          }
          return prev + 5;
        });
      }, 80);

      return () => clearInterval(interval);
    }
  }, [stage, currentlyScanningComponent]);

  // Auto-start scan when user navigates to the next component we're waiting for
  useEffect(() => {
    if (waitingForNavigation && nextComponentToScan && activeComponent === nextComponentToScan) {
      startScan(nextComponentToScan);
    }
  }, [activeComponent, waitingForNavigation, nextComponentToScan]);

  useEffect(() => {
    if (stage === "building") {
      const buildTimer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(buildTimer);
    }
  }, [stage, onComplete]);

  const handleBuild = () => {
    setShowGuidanceDialog(false);
    setStage("building");
  };

  const handleTabClick = (component: Component) => {
    if (stage !== "scanning") {
      setActiveComponent(component);
    }
  };

  const getComponentContent = (component: Component) => {
    switch (component) {
      case "portal":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#293E40] to-[#1f3033] text-white p-12 rounded-sm mb-6 shadow-lg">
              <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>IT Service Portal</h1>
              <p className="text-gray-200 text-lg">Your one-stop shop for IT services and support</p>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {[
                { title: "Get Help", desc: "Submit incident reports", count: "24 open", icon: "🎫" },
                { title: "Request Something", desc: "Hardware, software, access", count: "18 pending", icon: "📦" },
                { title: "Knowledge Base", desc: "Self-service articles", count: "1,247 articles", icon: "📚" },
                { title: "My Tickets", desc: "Track your requests", count: "5 active", icon: "📋" },
                { title: "Service Status", desc: "System health", count: "All operational", icon: "✅" },
                { title: "IT News", desc: "Updates & announcements", count: "3 new", icon: "📰" }
              ].map((item, i) => (
                <Card key={i} className="p-6 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-[#80B6A1]">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-lg mb-2 text-[#293E40] dark:text-blue-300">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.desc}</p>
                  <Badge variant="secondary" className="text-xs bg-[#E8F4F1] text-[#293E40] border-0">{item.count}</Badge>
                </Card>
              ))}
            </div>
          </div>
        );
      case "catalog":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-[#293E40] dark:text-blue-200" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>Service Catalog</h1>
              <p className="text-gray-600 dark:text-gray-400">Browse and request IT services</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { 
                  category: "Hardware", 
                  items: ["Laptop - MacBook Pro", "Monitor - Dell 27\"", "Keyboard & Mouse", "Docking Station", "Headset"],
                  color: "bg-blue-50 dark:bg-blue-900/20"
                },
                { 
                  category: "Software", 
                  items: ["Microsoft Office 365", "Adobe Creative Cloud", "Slack Premium", "Zoom Business", "Developer Tools"],
                  color: "bg-purple-50 dark:bg-purple-900/20"
                },
                { 
                  category: "Access Requests", 
                  items: ["VPN Access", "Admin Rights", "Shared Drive Access", "Application Access", "Building Badge"],
                  color: "bg-green-50 dark:bg-green-900/20"
                },
                { 
                  category: "Support Services", 
                  items: ["Password Reset", "Account Unlock", "Software Installation", "Equipment Repair", "Training Request"],
                  color: "bg-orange-50 dark:bg-orange-900/20"
                }
              ].map((cat, i) => (
                <Card key={i} className={`p-6 ${cat.color} border border-gray-200 dark:border-gray-700 rounded-sm`}>
                  <h3 className="font-semibold text-xl mb-4 text-[#293E40] dark:text-blue-200">{cat.category}</h3>
                  <ul className="space-y-2">
                  {cat.items.map((item, j) => (
                      <li key={j} className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <ChevronRight className="w-4 h-4 text-[#80B6A1]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        );
      case "knowledge":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-[#293E40] dark:text-blue-200" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>Knowledge Base</h1>
              <p className="text-gray-600 dark:text-gray-400">1,247 articles • Updated daily</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Popular Articles</h3>
                <div className="space-y-3">
                  {[
                    { title: "How to Reset Your Password", views: "12.3K views", helpful: "98%" },
                    { title: "VPN Setup Guide for Mac & Windows", views: "8.1K views", helpful: "95%" },
                    { title: "Setting Up Two-Factor Authentication", views: "6.5K views", helpful: "97%" },
                    { title: "Connecting to Company Wi-Fi", views: "5.2K views", helpful: "99%" },
                    { title: "Software Installation Procedures", views: "4.8K views", helpful: "94%" }
                  ].map((article, i) => (
                    <Card key={i} className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-[#80B6A1]">
                      <h4 className="font-medium mb-2 text-[#293E40] dark:text-blue-300">{article.title}</h4>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{article.views}</span>
                        <span>•</span>
                        <span className="text-success">{article.helpful} helpful</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-lg">Recent Updates</h3>
                <div className="space-y-3">
                  {[
                    { title: "New Security Policy: Multi-Factor Authentication", date: "2 days ago" },
                    { title: "Zoom 5.15 Update Features & Fixes", date: "5 days ago" },
                    { title: "Microsoft Teams: Best Practices for Meetings", date: "1 week ago" },
                    { title: "Acceptable Use Policy Update", date: "2 weeks ago" },
                    { title: "Cloud Storage Quota Increase", date: "3 weeks ago" }
                  ].map((article, i) => (
                    <Card key={i} className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-[#80B6A1]">
                      <h4 className="font-medium mb-2 text-[#293E40] dark:text-blue-300">{article.title}</h4>
                      <div className="text-xs text-muted-foreground">{article.date}</div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "integrations":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-[#293E40] dark:text-blue-200" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>Integrations</h1>
              <p className="text-gray-600 dark:text-gray-400">Connected applications and services</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { name: "Okta SSO", status: "Connected", type: "Identity" },
                { name: "Slack", status: "Connected", type: "Communication" },
                { name: "Microsoft Teams", status: "Connected", type: "Communication" },
                { name: "Jira Software", status: "Connected", type: "Development" },
                { name: "Confluence", status: "Connected", type: "Documentation" },
                { name: "Salesforce", status: "Connected", type: "CRM" },
                { name: "Zoom", status: "Connected", type: "Video" },
                { name: "GitHub", status: "Connected", type: "Development" },
                { name: "AWS", status: "Pending Setup", type: "Cloud" }
              ].map((integration, i) => (
                <Card key={i} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-[#80B6A1] hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[#293E40] dark:text-blue-300">{integration.name}</h3>
                    <Badge 
                      variant={integration.status === "Connected" ? "default" : "secondary"}
                      className={integration.status === "Connected" ? "text-xs bg-[#E8F4F1] text-[#293E40] border-0" : "text-xs"}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{integration.type}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      case "automations":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-[#293E40] dark:text-blue-200" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>Workflows & Automations</h1>
              <p className="text-gray-600 dark:text-gray-400">42 active workflows automating your IT operations</p>
            </div>
            <div className="space-y-4">
              {[
                { 
                  name: "Auto-assign tickets by category", 
                  trigger: "Ticket created", 
                  actions: "Categorize → Assign to team → Notify",
                  runs: "1,234 runs this month"
                },
                { 
                  name: "SLA breach escalation", 
                  trigger: "SLA threshold reached", 
                  actions: "Notify manager → Reassign to senior → Update priority",
                  runs: "89 runs this month"
                },
                { 
                  name: "New employee onboarding", 
                  trigger: "HR system sync", 
                  actions: "Create accounts → Provision hardware → Send welcome email",
                  runs: "45 runs this month"
                },
                { 
                  name: "Password reset automation", 
                  trigger: "Password reset request", 
                  actions: "Verify identity → Reset password → Notify user → Create KB article",
                  runs: "678 runs this month"
                },
                { 
                  name: "Auto-close resolved tickets", 
                  trigger: "7 days after resolution", 
                  actions: "Send satisfaction survey → Close ticket → Archive",
                  runs: "892 runs this month"
                }
              ].map((workflow, i) => (
                <Card key={i} className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm hover:border-[#80B6A1] hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-[#293E40] dark:text-blue-300">{workflow.name}</h3>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-gray-600 dark:text-gray-400">Trigger:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{workflow.trigger}</span></div>
                        <div><span className="text-gray-600 dark:text-gray-400">Actions:</span> <span className="text-gray-800 dark:text-gray-200">{workflow.actions}</span></div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-[#E8F4F1] text-[#293E40] border-0">Active</Badge>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">{workflow.runs}</div>
                </Card>
              ))}
            </div>
          </div>
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
              {scannedComponents.size} / {COMPONENT_SEQUENCE.length} components scanned
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {allScansComplete && stage === "ready" && (
            <Button 
              onClick={handleBuild}
              size="sm" 
              className="bg-white text-primary hover:bg-white/90 animate-pulse"
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
            <div className="flex-1 bg-white dark:bg-gray-700 rounded px-4 py-1 text-sm text-gray-600 dark:text-gray-300" style={{ fontFamily: "monospace" }}>
              https://company.service-now.com/now/nav/ui/classic/params/target/home.do
            </div>
          </div>

          {/* Mock ServiceNow Interface */}
          <div className="flex-1 overflow-hidden relative">
            <div className="h-full overflow-auto">
              {/* ServiceNow Header */}
              <div className="bg-[#293E40] text-white px-6 py-3 border-b border-[#1f3033] shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold tracking-wide" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", color: '#FF0000' }}>
                        NOW
                      </div>
                      <div className="h-6 w-px bg-white/20"></div>
                    </div>
                    <nav className="flex gap-6 text-sm" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
                      {COMPONENT_SEQUENCE.map((comp) => (
                        <button
                          key={comp}
                          onClick={() => handleTabClick(comp)}
                          disabled={stage === "scanning"}
                          className={`hover:text-[#80B6A1] transition-colors relative pb-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                            activeComponent === comp 
                              ? "text-white font-semibold" 
                              : "text-gray-300"
                          } ${comp === nextComponentToScan && waitingForNavigation ? "animate-pulse" : ""}`}
                        >
                          {COMPONENT_LABELS[comp]}
                          {scannedComponents.has(comp) && (
                            <Check className="w-3 h-3 inline-block ml-1 text-[#80B6A1]" />
                          )}
                          {activeComponent === comp && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#80B6A1]"></div>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-300" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
                      Admin Portal
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#80B6A1] flex items-center justify-center text-[#293E40] font-semibold text-sm">
                      A
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 bg-[#F7F9FA] dark:bg-gray-900 min-h-[calc(100%-64px)]" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>
                {getComponentContent(activeComponent)}
              </div>
            </div>

            {/* Scanning Overlay */}
            {stage === "scanning" && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center animate-fade-in z-20">
                <Card className="p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
                  <div className="flex justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Scanning {COMPONENT_LABELS[currentlyScanningComponent as Component]}
                    </h3>
                    <p className="text-muted-foreground">
                      AI is analyzing and extracting configuration...
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-mono">{progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm space-y-2 text-left">
                    <div className={`flex items-center gap-2 ${progress >= 20 ? "text-success" : "text-muted-foreground"}`}>
                      <Check className="w-4 h-4" />
                      <span>Extracting UI structure</span>
                    </div>
                    <div className={`flex items-center gap-2 ${progress >= 40 ? "text-success" : "text-muted-foreground"}`}>
                      <Check className="w-4 h-4" />
                      <span>Identifying data fields</span>
                    </div>
                    <div className={`flex items-center gap-2 ${progress >= 60 ? "text-success" : "text-muted-foreground"}`}>
                      <Check className="w-4 h-4" />
                      <span>Analyzing workflows</span>
                    </div>
                    <div className={`flex items-center gap-2 ${progress >= 80 ? "text-success" : "text-muted-foreground"}`}>
                      <Check className="w-4 h-4" />
                      <span>Mapping relationships</span>
                    </div>
                    <div className={`flex items-center gap-2 ${progress >= 100 ? "text-success" : "text-muted-foreground"}`}>
                      <Check className="w-4 h-4" />
                      <span>Scan complete</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Guidance Notification - Right Side Below Header */}
            {showGuidanceDialog && (
              <div className="absolute top-20 right-4 z-30 animate-slide-up">
                <Card className="w-80 shadow-2xl border-2 border-primary/20 bg-background">
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {allScansComplete ? (
                          <>
                            <Sparkles className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-base">All Scans Complete!</h3>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-success" />
                            <h3 className="font-semibold text-base">Scan Complete</h3>
                          </>
                        )}
                      </div>
                      <button 
                        onClick={() => setShowGuidanceDialog(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors -mt-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {allScansComplete ? (
                        "All components analyzed. Ready to build!"
                      ) : (
                        `Click "${COMPONENT_LABELS[nextComponentToScan || "portal"]}" tab to continue.`
                      )}
                    </p>

                    <div className="bg-muted/50 p-2.5 rounded-lg space-y-1.5">
                      {COMPONENT_SEQUENCE.map((comp) => (
                        <div key={comp} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {scannedComponents.has(comp) ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : comp === nextComponentToScan ? (
                              <ArrowRight className="w-3 h-3 text-primary animate-pulse" />
                            ) : (
                              <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/30" />
                            )}
                            <span className={
                              scannedComponents.has(comp) 
                                ? "text-foreground font-medium" 
                                : comp === nextComponentToScan 
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                            }>
                              {COMPONENT_LABELS[comp]}
                            </span>
                          </div>
                          {scannedComponents.has(comp) && (
                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">✓</Badge>
                          )}
                          {comp === nextComponentToScan && !scannedComponents.has(comp) && (
                            <Badge variant="default" className="text-[10px] h-4 px-1.5 animate-pulse">Next</Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    {!allScansComplete && nextComponentToScan && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded border border-primary/20">
                        <p className="text-xs text-primary font-medium">
                          👆 Click "{COMPONENT_LABELS[nextComponentToScan]}" above
                        </p>
                      </div>
                    )}

                    {allScansComplete && (
                      <Button onClick={handleBuild} className="w-full" size="sm">
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        Build Helpdesk
                      </Button>
                    )}
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
