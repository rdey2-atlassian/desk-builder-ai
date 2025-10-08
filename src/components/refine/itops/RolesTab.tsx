import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const RolesTab = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetch("/data/itops/roles.json")
      .then((res) => res.json())
      .then((data) => setRoles(data.roles));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Roles & Access Control</h2>
        <p className="text-muted-foreground">
          Least-privilege access roles for operations management
        </p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{role.name}</h3>
                  <Badge variant="secondary">{role.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {role.description}
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Permissions:</h4>
                  <div className="space-y-1">
                    {role.permissions.map((permission, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RolesTab;
