import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plane, AlertCircle, FileText, CheckCircle2, Users } from "lucide-react";

interface Ticket {
  id: string;
  type: string;
  summary: string;
  status: string;
  requester?: string;
  data?: any;
}

const typeIcons: Record<string, any> = {
  new_trip: Plane,
  emergency: AlertCircle,
  visa: FileText,
};

export const Preview = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [pilotEmails, setPilotEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [showDeployDialog, setShowDeployDialog] = useState(false);

  useEffect(() => {
    fetch("/data/travel/sample_tickets.json")
      .then((r) => r.json())
      .then(setTickets)
      .catch(console.error);
  }, []);

  const handleAddEmail = () => {
    if (emailInput.trim() && !pilotEmails.includes(emailInput.trim())) {
      setPilotEmails([...pilotEmails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const handleDeploy = () => {
    setShowDeployDialog(true);
  };

  const handleConfirmDeploy = () => {
    navigate("/deploy");
  };

  const canDeploy = pilotEmails.length > 0;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Day-0 Sandbox Preview</h1>
              <p className="text-sm text-muted-foreground">
                Test with sample data before going live
              </p>
            </div>
            <Button
              onClick={handleDeploy}
              size="lg"
              disabled={!canDeploy}
            >
              Deploy Helpdesk
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Left: Sample Tickets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Sample Tickets</h2>
                <Button variant="outline" size="sm">
                  Load Sample Data
                </Button>
              </div>

              <div className="space-y-3">
                {tickets.map((ticket) => {
                  const Icon = typeIcons[ticket.type] || FileText;
                  return (
                    <Card
                      key={ticket.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium">{ticket.summary}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {ticket.id} • {ticket.requester || "Unknown"}
                              </p>
                            </div>
                            <Badge variant={ticket.status === "P1" ? "destructive" : "secondary"}>
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right: Pilot Team Setup */}
            <div className="space-y-4">
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Invite Pilot Team</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Team member emails</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@atlassian.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                    />
                    <Button onClick={handleAddEmail} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>

                {pilotEmails.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Invited ({pilotEmails.length})</p>
                    <div className="space-y-1">
                      {pilotEmails.map((email, i) => (
                        <div key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          {email}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-6 space-y-3">
                <h3 className="font-semibold">Deployment Checklist</h3>
                <div className="space-y-2">
                  {[
                    "Portal configured",
                    "Request types defined",
                    "Knowledge base seeded",
                    "Integrations connected",
                    "Team roles assigned",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox checked disabled />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Detail Sheet */}
      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent className="sm:max-w-lg overflow-auto">
          {selectedTicket && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTicket.summary}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedTicket.status === "P1" ? "destructive" : "secondary"}>
                    {selectedTicket.status}
                  </Badge>
                  <Badge variant="outline">{selectedTicket.id}</Badge>
                </div>

                {selectedTicket.data && (
                  <div className="space-y-3 pt-4">
                    {Object.entries(selectedTicket.data).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTicket.type === "new_trip" && (
                  <Card className="p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <p className="text-sm">
                      <strong>Policy Chip:</strong> Class by Level — L7 eligible for Premium Economy (W)
                    </p>
                  </Card>
                )}

                {selectedTicket.type === "emergency" && (
                  <Card className="p-3 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                    <p className="text-sm">
                      <strong>Slack channel #travel-hotline bound for P1 emergencies.</strong>
                    </p>
                  </Card>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Deploy Confirmation Dialog */}
      <AlertDialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to Deploy?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Your Travel Helpdesk will go live with:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Portal URL: travel.atlassian.help</li>
                <li>Email intake: travel@atlassian.com</li>
                <li>Slack channel: #travel-hotline (P1 emergencies)</li>
                <li>Pilot team: {pilotEmails.length} members</li>
                <li>Knowledge base: 10 articles</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeployDialog(false)}>
              Cancel
            </Button>
            <AlertDialogAction onClick={handleConfirmDeploy}>
              Deploy Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Preview;
