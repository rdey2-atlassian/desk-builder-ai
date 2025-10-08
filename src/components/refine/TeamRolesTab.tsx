import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Eye, Crown } from "lucide-react";
import blueprint from "@/data/blueprint.json";

const TeamRolesTab = () => {
  const roles = [
    {
      id: "owner",
      name: "Owner",
      description: "Full access to all settings, team management, and configurations",
      permissions: [
        "Manage all settings",
        "Add/remove team members",
        "Configure integrations",
        "View all analytics",
        "Manage billing",
      ],
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600/10",
      count: 2,
    },
    {
      id: "agent",
      name: "Agent",
      description: "Handle tickets, access knowledge base, and manage customer requests",
      permissions: [
        "View and respond to tickets",
        "Access knowledge base",
        "Update ticket status",
        "View team analytics",
        "Use canned responses",
      ],
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10",
      count: 15,
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Read-only access to tickets and reports for stakeholders",
      permissions: [
        "View tickets (read-only)",
        "View analytics dashboard",
        "Access knowledge base",
        "Export reports",
      ],
      icon: Eye,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      count: 5,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Team & Roles
          </CardTitle>
          <CardDescription>
            Manage team structure and role permissions for {blueprint.teams.project}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Project Name</p>
                <p className="font-semibold">{blueprint.teams.project}</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="pt-2 border-t mt-4">
              <p className="text-sm text-muted-foreground">Organization Size</p>
              <p className="font-semibold">{blueprint.org_size} employees</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card key={role.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${role.bgColor}`}>
                      <Icon className={`w-5 h-5 ${role.color}`} />
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{role.name}</h3>
                          <Badge variant="outline">{role.count} members</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                          Permissions
                        </p>
                        <ul className="space-y-1">
                          {role.permissions.map((permission, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-primary" />
                              {permission}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Invite Team Members
            </Button>
            <Button variant="outline" className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Create Custom Role
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamRolesTab;
