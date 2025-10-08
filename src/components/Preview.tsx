import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import sampleTickets from "@/data/sampleTickets.json";
import { 
  Rocket, 
  Users, 
  Play, 
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Calendar,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreviewProps {
  onDeploy: () => void;
}

const Preview = ({ onDeploy }: PreviewProps) => {
  const [inviteEmails, setInviteEmails] = useState("");
  const [hasInvited, setHasInvited] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const { toast } = useToast();

  const handleLoadSampleData = () => {
    toast({
      title: "Sample Data Loaded",
      description: "3 sample tickets have been created in your helpdesk.",
    });
  };

  const handleInvite = () => {
    if (inviteEmails.trim()) {
      setHasInvited(true);
      toast({
        title: "Invitations Sent",
        description: `Pilot team invites sent to ${inviteEmails.split(",").length} users.`,
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "P1") return "destructive";
    return "secondary";
  };

  const getStatusColor = (status: string) => {
    if (status === "in_progress") return "text-warning";
    if (status === "pending_approval") return "text-accent";
    if (status === "assigned") return "text-primary";
    return "text-muted-foreground";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Preview Your Helpdesk</h1>
            <p className="text-muted-foreground">
              Test with sample data before deploying
            </p>
          </div>
          <Button
            onClick={onDeploy}
            disabled={!hasInvited}
            size="lg"
            className="gradient-primary"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Deploy Helpdesk
          </Button>
        </div>

        <Tabs defaultValue="sandbox" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
            <TabsTrigger value="deploy">Deploy Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="sandbox" className="space-y-6">
            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className="p-6 cursor-pointer transition-smooth hover:border-primary hover:glow-primary"
                onClick={handleLoadSampleData}
              >
                <Play className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Load Sample Data</h3>
                <p className="text-sm text-muted-foreground">
                  Populate with realistic test tickets
                </p>
              </Card>

              <Card className="p-6 bg-muted/50">
                <Users className="w-8 h-8 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Invite Pilot Team</h3>
                <p className="text-sm text-muted-foreground">
                  Required before deployment
                </p>
              </Card>

              <Card className="p-6 bg-muted/50">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">Run Test Scenarios</h3>
                <p className="text-sm text-muted-foreground">
                  Verify workflows end-to-end
                </p>
              </Card>
            </div>

            {/* Sample Tickets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Sample Tickets</h3>
                {sampleTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="p-4 cursor-pointer transition-smooth hover:border-primary"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              {ticket.id}
                            </span>
                            <Badge variant={getPriorityColor(ticket.priority)}>
                              {ticket.priority === "P1" ? "P1" : "Standard"}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{ticket.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {ticket.requester}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatDate(ticket.created)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(
                            ticket.status
                          )}`}
                        />
                        <span className="text-sm capitalize">
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Ticket Detail */}
              <div>
                {selectedTicket ? (
                  <Card className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-mono text-muted-foreground">
                            {selectedTicket.id}
                          </span>
                          <Badge variant={getPriorityColor(selectedTicket.priority)}>
                            {selectedTicket.priority === "P1" ? "P1 - Emergency" : "Standard"}
                          </Badge>
                        </div>
                        <h2 className="text-xl font-bold mb-1">{selectedTicket.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          Opened by {selectedTicket.requester} •{" "}
                          {formatDate(selectedTicket.created)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTicket(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="pt-4 border-t space-y-3">
                      <h3 className="font-semibold">Ticket Details</h3>
                      {Object.entries(selectedTicket.data).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}:
                          </span>
                          <span className="col-span-2 font-medium">
                            {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {selectedTicket.priority === "P1" && (
                      <Card className="p-4 bg-destructive/10 border-destructive/20">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium">P1 Emergency Protocol Active</p>
                            <p className="text-muted-foreground">
                              #travel-hotline notified • On-call paged • Target: 1h resolution
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </Card>
                ) : (
                  <Card className="p-12 text-center">
                    <div className="text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a ticket to view details</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deploy" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Invite Pilot Team</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add email addresses of team members who will test the helpdesk
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="email@atlassian.com, email2@atlassian.com"
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleInvite} disabled={!inviteEmails.trim()}>
                    Send Invites
                  </Button>
                </div>
                {hasInvited && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    Invitations sent successfully
                  </div>
                )}
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Deployment Checklist</h3>
                <div className="space-y-3">
                  {[
                    { label: "Portal configured", done: true },
                    { label: "Request types reviewed", done: true },
                    { label: "Knowledge base seeded", done: true },
                    { label: "Integrations connected", done: true },
                    { label: "Pilot team invited", done: hasInvited },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted" />
                      )}
                      <span
                        className={item.done ? "font-medium" : "text-muted-foreground"}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {hasInvited && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Ready to Deploy</p>
                      <p className="text-muted-foreground">
                        Your helpdesk is configured and tested. Click "Deploy Helpdesk"
                        to make it live for your organization.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Preview;
