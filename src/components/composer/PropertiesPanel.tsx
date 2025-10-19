import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { BlockInstance, BlockParameter } from "@/types/blocks";
import { getBlockDefinitionByType } from "@/data/blockDefinitions";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertiesPanelProps {
  block: BlockInstance | null;
  onUpdate: (id: string, parameters: Record<string, any>) => void;
}

const PropertiesPanel = ({ block, onUpdate }: PropertiesPanelProps) => {
  if (!block) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Select a block to view properties</p>
        </div>
      </div>
    );
  }

  const definition = getBlockDefinitionByType(block.type);
  if (!definition) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Unknown block type</p>
        </div>
      </div>
    );
  }

  const handleParameterChange = (paramId: string, value: any) => {
    onUpdate(block.id, {
      ...block.parameters,
      [paramId]: value,
    });
  };

  const handleArrayAdd = (paramId: string) => {
    const current = block.parameters[paramId] || [];
    const newItem = paramId === "fields" 
      ? { name: "", type: "string", required: false }
      : paramId === "states"
      ? "New State"
      : paramId === "transitions"
      ? { from: "", to: "", label: "" }
      : "";
    
    handleParameterChange(paramId, [...current, newItem]);
  };

  const handleArrayRemove = (paramId: string, index: number) => {
    const current = block.parameters[paramId] || [];
    handleParameterChange(paramId, current.filter((_: any, i: number) => i !== index));
  };

  const handleArrayItemChange = (paramId: string, index: number, value: any) => {
    const current = block.parameters[paramId] || [];
    const updated = [...current];
    updated[index] = value;
    handleParameterChange(paramId, updated);
  };

  const renderEntityFields = () => {
    const fields = block.parameters.fields || [];
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Entity Fields</Label>
          <Button size="sm" variant="outline" onClick={() => handleArrayAdd("fields")}>
            <Plus className="h-3 w-3 mr-1" />
            Add Field
          </Button>
        </div>
        
        <div className="space-y-2">
          {fields.map((field: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Field name"
                    value={field.name || ""}
                    onChange={(e) => handleArrayItemChange("fields", idx, { ...field, name: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleArrayRemove("fields", idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={field.type || "string"}
                    onValueChange={(val) => handleArrayItemChange("fields", idx, { ...field, type: val })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="enum">Enum</SelectItem>
                      <SelectItem value="ref">Reference</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.required || false}
                      onCheckedChange={(checked) => handleArrayItemChange("fields", idx, { ...field, required: checked })}
                    />
                    <Label className="text-xs">Required</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.pii || false}
                      onCheckedChange={(checked) => handleArrayItemChange("fields", idx, { ...field, pii: checked })}
                    />
                    <Label className="text-xs">PII</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No fields defined. Click &quot;Add Field&quot; to get started.
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderWorkflowStates = () => {
    const states = block.parameters.states || [];
    const transitions = block.parameters.transitions || [];
    
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>States</Label>
            <Button size="sm" variant="outline" onClick={() => handleArrayAdd("states")}>
              <Plus className="h-3 w-3 mr-1" />
              Add State
            </Button>
          </div>
          
          <div className="space-y-2">
            {states.map((state: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={state}
                  onChange={(e) => handleArrayItemChange("states", idx, e.target.value)}
                  placeholder="State name"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleArrayRemove("states", idx)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Transitions</Label>
            <Button size="sm" variant="outline" onClick={() => handleArrayAdd("transitions")}>
              <Plus className="h-3 w-3 mr-1" />
              Add Transition
            </Button>
          </div>
          
          <div className="space-y-2">
            {transitions.map((transition: any, idx: number) => (
              <Card key={idx}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={transition.from || ""}
                      onValueChange={(val) => handleArrayItemChange("transitions", idx, { ...transition, from: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state: string) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span>→</span>
                    
                    <Select
                      value={transition.to || ""}
                      onValueChange={(val) => handleArrayItemChange("transitions", idx, { ...transition, to: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state: string) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArrayRemove("transitions", idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="Label (optional)"
                    value={transition.label || ""}
                    onChange={(e) => handleArrayItemChange("transitions", idx, { ...transition, label: e.target.value })}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderParameter = (param: BlockParameter) => {
    const value = block.parameters[param.id];

    switch (param.type) {
      case "text":
        return (
          <Input
            value={value || ""}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            placeholder={param.placeholder}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            placeholder={param.placeholder}
            rows={4}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
            placeholder={param.placeholder}
          />
        );

      case "boolean":
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
          />
        );

      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleParameterChange(param.id, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={param.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "json":
        return (
          <Textarea
            value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleParameterChange(param.id, parsed);
              } catch {
                handleParameterChange(param.id, e.target.value);
              }
            }}
            placeholder={param.placeholder}
            rows={6}
            className="font-mono text-xs"
          />
        );

      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {definition.icon && <definition.icon className="h-5 w-5" />}
            <h2 className="text-lg font-semibold">{block.name}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{definition.description}</p>
          <Badge variant="outline" className="mt-2">{definition.category}</Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="block-name">Block Name</Label>
            <Input
              id="block-name"
              value={block.name}
              onChange={(e) => onUpdate(block.id, { ...block.parameters, name: e.target.value })}
            />
          </div>

          {block.type === "entity" && renderEntityFields()}
          {block.type === "workflow" && renderWorkflowStates()}

          {definition.parameters.length > 0 && block.type !== "entity" && block.type !== "workflow" && (
            <>
              <Separator />
              {definition.parameters.map((param) => (
                <div key={param.id} className="space-y-2">
                  <Label htmlFor={param.id}>
                    {param.label}
                    {param.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {param.description && (
                    <p className="text-xs text-muted-foreground">{param.description}</p>
                  )}
                  {renderParameter(param)}
                </div>
              ))}
            </>
          )}

          {definition.parameters.length === 0 && block.type !== "entity" && block.type !== "workflow" && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No configurable parameters for this block type
            </p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default PropertiesPanel;
