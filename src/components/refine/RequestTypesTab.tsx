import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import requestTypes from "@/data/requestTypes.json";
import { ChevronRight } from "lucide-react";

const RequestTypesTab = () => {
  const [selectedType, setSelectedType] = useState(requestTypes[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="space-y-2">
        <h3 className="font-semibold mb-4">Request Types ({requestTypes.length})</h3>
        {requestTypes.map((type) => (
          <Card
            key={type.id}
            className={`p-4 cursor-pointer transition-smooth hover:border-primary ${
              selectedType.id === type.id ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => setSelectedType(type)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{type.title}</h4>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {/* Detail */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedType.title}</h2>
                <p className="text-muted-foreground">{selectedType.description}</p>
              </div>
              <Badge
                variant={selectedType.priority === "P1" ? "destructive" : "secondary"}
              >
                {selectedType.priority === "P1" ? "P1 - Emergency" : "Standard"}
              </Badge>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4">Form Fields</h3>
              <div className="space-y-4">
                {selectedType.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{field.label}</span>
                        {field.required && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Type: {field.type}
                      </p>
                      {field.hint && (
                        <p className="text-xs text-muted-foreground italic mt-1">
                          {field.hint}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedType.routing && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Routing & Approvals</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Default assignment:</span>
                    <span className="font-medium">{selectedType.routing.default}</span>
                  </div>
                  {"approvals" in selectedType.routing && (
                    <>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning mt-1.5" />
                        <div>
                          <span className="text-muted-foreground">
                            Manager approval required if:
                          </span>
                          <ul className="mt-1 ml-4 space-y-1">
                            {selectedType.routing.approvals.conditions.map(
                              (cond: string, idx: number) => (
                                <li key={idx} className="text-muted-foreground">
                                  • {cond}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                  {"escalation" in selectedType.routing && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        <span className="text-muted-foreground">Slack notification:</span>
                        <span className="font-medium">
                          {selectedType.routing.escalation.notify}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        <span className="text-muted-foreground">On-call paging:</span>
                        <span className="font-medium">Enabled</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground text-sm">SLA:</span>
                  <p className="font-medium">{selectedType.sla.toUpperCase()}</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Request Type
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-bold">✓</span>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-1">AI-optimized for travel use case</p>
              <p className="text-muted-foreground">
                Fields, routing, and approval logic are pre-configured based on
                industry best practices. You can edit any field or reset to defaults.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RequestTypesTab;
