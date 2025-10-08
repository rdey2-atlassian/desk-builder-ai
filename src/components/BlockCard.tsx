import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Circle, Link as LinkIcon } from "lucide-react";
import { type LucideIcon } from "lucide-react";

type Status = "Planned" | "Linking" | "Configured" | "Ready";

interface BlockCardProps {
  title: string;
  icon: LucideIcon;
  status: Status;
}

const statusConfig: Record<Status, { icon: LucideIcon; variant: "secondary" | "outline" | "default"; label: string }> = {
  Planned: { icon: Circle, variant: "secondary", label: "Planned" },
  Linking: { icon: Loader2, variant: "outline", label: "Linking" },
  Configured: { icon: LinkIcon, variant: "outline", label: "Configured" },
  Ready: { icon: CheckCircle2, variant: "default", label: "Ready" },
};

export const BlockCard = ({ title, icon: Icon, status }: BlockCardProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isAnimating = status === "Linking";

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-md bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <Badge variant={config.variant} className="gap-1">
          <StatusIcon className={`h-3 w-3 ${isAnimating ? "animate-spin" : ""}`} />
          {config.label}
        </Badge>
      </div>
      <h3 className="font-medium text-sm">{title}</h3>
    </Card>
  );
};
