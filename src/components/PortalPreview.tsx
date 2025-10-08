import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, FileText, Calendar, AlertCircle, CreditCard, UserCircle } from "lucide-react";

interface PortalData {
  title: string;
  subtitle: string;
  tiles: string[];
}

const tileIcons = [Plane, FileText, Calendar, AlertCircle, CreditCard, UserCircle];

export const PortalPreview = () => {
  const [portal, setPortal] = useState<PortalData | null>(null);

  useEffect(() => {
    fetch("/data/travel/portal.json")
      .then((r) => r.json())
      .then(setPortal)
      .catch(console.error);
  }, []);

  if (!portal) return <div className="text-muted-foreground">Loading portal...</div>;

  return (
    <div className="space-y-6">
      <div className="text-center py-8 border-b">
        <h1 className="text-3xl font-bold mb-2">{portal.title}</h1>
        <p className="text-muted-foreground">{portal.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portal.tiles.map((tile, i) => {
          const Icon = tileIcons[i] || Plane;
          return (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">{tile}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center py-4">
        <Button variant="outline">View All Request Types</Button>
      </div>
    </div>
  );
};
