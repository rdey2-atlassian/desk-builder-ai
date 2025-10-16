import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BlockInstance } from "@/types/blocks";
import { getBlockDefinitionByType } from "@/data/blockDefinitions";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface PropertiesPanelProps {
  block: BlockInstance | null;
  onUpdate: (id: string, parameters: Record<string, any>) => void;
}

const PropertiesPanel = ({ block, onUpdate }: PropertiesPanelProps) => {
  if (!block) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <Settings className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">Select a block to view its properties</p>
      </div>
    );
  }

  const definition = getBlockDefinitionByType(block.type);
  if (!definition) return null;

  const Icon = definition.icon;

  const handleParameterChange = (paramId: string, value: any) => {
    onUpdate(block.id, {
      ...block.parameters,
      [paramId]: value,
    });
  };

  return (
    <div className="h-full flex flex-col bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{block.name}</h2>
            <p className="text-sm text-muted-foreground">{definition.description}</p>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {definition.parameters.map(param => (
            <div key={param.id} className="space-y-2">
              <Label htmlFor={param.id}>
                {param.label}
                {param.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              
              {param.description && (
                <p className="text-xs text-muted-foreground">{param.description}</p>
              )}

              {param.type === "text" && (
                <Input
                  id={param.id}
                  value={block.parameters[param.id] || ""}
                  onChange={(e) => handleParameterChange(param.id, e.target.value)}
                  placeholder={param.placeholder}
                  required={param.required}
                />
              )}

              {param.type === "textarea" && (
                <Textarea
                  id={param.id}
                  value={block.parameters[param.id] || ""}
                  onChange={(e) => handleParameterChange(param.id, e.target.value)}
                  placeholder={param.placeholder}
                  required={param.required}
                  rows={4}
                />
              )}

              {param.type === "number" && (
                <Input
                  id={param.id}
                  type="number"
                  value={block.parameters[param.id] || ""}
                  onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
                  placeholder={param.placeholder}
                  required={param.required}
                />
              )}

              {param.type === "boolean" && (
                <div className="flex items-center gap-2">
                  <Switch
                    id={param.id}
                    checked={block.parameters[param.id] || false}
                    onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
                  />
                  <Label htmlFor={param.id} className="text-sm text-muted-foreground cursor-pointer">
                    {param.placeholder || "Enable"}
                  </Label>
                </div>
              )}

              {param.type === "select" && param.options && (
                <Select
                  value={block.parameters[param.id] || ""}
                  onValueChange={(value) => handleParameterChange(param.id, value)}
                >
                  <SelectTrigger id={param.id}>
                    <SelectValue placeholder={param.placeholder || "Select..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {param.options.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {param.type === "json" && (
                <Textarea
                  id={param.id}
                  value={block.parameters[param.id] || param.defaultValue || ""}
                  onChange={(e) => handleParameterChange(param.id, e.target.value)}
                  placeholder={param.placeholder || "Enter JSON..."}
                  required={param.required}
                  rows={6}
                  className="font-mono text-xs"
                />
              )}
            </div>
          ))}

          {definition.parameters.length === 0 && (
            <Card className="p-4 text-center text-sm text-muted-foreground">
              No configurable parameters
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PropertiesPanel;
