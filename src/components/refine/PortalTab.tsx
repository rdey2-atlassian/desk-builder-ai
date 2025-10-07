import { Card } from "@/components/ui/card";
import { Plane, FileText, CalendarX, AlertCircle, CreditCard, User } from "lucide-react";

const PortalTab = () => {
  const tiles = [
    {
      title: "Request a New Trip",
      description: "Book business travel within policy",
      icon: Plane,
      color: "text-primary",
    },
    {
      title: "Visa/Document Support",
      description: "Visa letters and documentation help",
      icon: FileText,
      color: "text-accent",
    },
    {
      title: "Change or Cancel Trip",
      description: "Modify existing bookings",
      icon: CalendarX,
      color: "text-warning",
    },
    {
      title: "Emergency Travel Help",
      description: "24×7 urgent support",
      icon: AlertCircle,
      color: "text-destructive",
    },
    {
      title: "Corporate Card/Expense Advance",
      description: "Travel advances and cards",
      icon: CreditCard,
      color: "text-success",
    },
    {
      title: "Travel Profile Update",
      description: "Update passport & preferences",
      icon: User,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="max-w-2xl space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
            Portal Preview
          </div>
          <h2 className="text-4xl font-bold">Atlassian Travel Desk</h2>
          <p className="text-lg text-muted-foreground">
            Book business travel within policy. Typical response in 4 hours.
          </p>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Service Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <Card
                key={idx}
                className="p-6 transition-smooth hover:border-primary hover:glow-primary cursor-pointer group"
              >
                <Icon className={`w-8 h-8 ${tile.color} mb-3 group-hover:scale-110 transition-transform`} />
                <h4 className="font-semibold mb-2">{tile.title}</h4>
                <p className="text-sm text-muted-foreground">{tile.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="p-6 border-muted">
        <h3 className="font-semibold mb-3">Portal Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Theme:</span>
            <p className="font-medium">Atlassian Blue (customizable)</p>
          </div>
          <div>
            <span className="text-muted-foreground">Access:</span>
            <p className="font-medium">Okta SSO (all employees)</p>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p className="font-medium">travel@atlassian.com</p>
          </div>
          <div>
            <span className="text-muted-foreground">Slack:</span>
            <p className="font-medium">#travel-helpdesk</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PortalTab;
