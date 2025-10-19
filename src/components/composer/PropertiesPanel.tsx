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
      : paramId === "sections"
      ? { title: "New Section", fields: [] }
      : paramId === "when"
      ? { field: "", operator: "equals", value: "" }
      : paramId === "then"
      ? { type: "assignToQueue", value: "" }
      : paramId === "visibility"
      ? { entityName: "", roles: [] }
      : paramId === "tasks"
      ? { id: `task-${Date.now()}`, name: "", type: "manual", description: "" }
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

  const renderCatalogItemForm = () => {
    const form = block.parameters.form || { sections: [] };
    const sections = form.sections || [];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Form Sections</Label>
          <Button size="sm" variant="outline" onClick={() => {
            const current = block.parameters.form || { sections: [] };
            handleParameterChange("form", {
              sections: [...current.sections, { title: "New Section", fields: [] }]
            });
          }}>
            <Plus className="h-3 w-3 mr-1" />
            Add Section
          </Button>
        </div>
        
        <div className="space-y-3">
          {sections.map((section: any, sIdx: number) => (
            <Card key={sIdx}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Section title"
                    value={section.title || ""}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sIdx] = { ...section, title: e.target.value };
                      handleParameterChange("form", { sections: updated });
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      handleParameterChange("form", {
                        sections: sections.filter((_: any, i: number) => i !== sIdx)
                      });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Fields</Label>
                    <Button size="sm" variant="outline" onClick={() => {
                      const updated = [...sections];
                      updated[sIdx] = {
                        ...section,
                        fields: [...(section.fields || []), { name: "", label: "", type: "string", required: false }]
                      };
                      handleParameterChange("form", { sections: updated });
                    }}>
                      <Plus className="h-2 w-2" />
                    </Button>
                  </div>
                  
                  {(section.fields || []).map((field: any, fIdx: number) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs">
                      <Input
                        placeholder="Name"
                        value={field.name || ""}
                        onChange={(e) => {
                          const updated = [...sections];
                          const fields = [...updated[sIdx].fields];
                          fields[fIdx] = { ...field, name: e.target.value };
                          updated[sIdx] = { ...updated[sIdx], fields };
                          handleParameterChange("form", { sections: updated });
                        }}
                        className="flex-1"
                      />
                      <Select
                        value={field.type || "string"}
                        onValueChange={(val) => {
                          const updated = [...sections];
                          const fields = [...updated[sIdx].fields];
                          fields[fIdx] = { ...field, type: val };
                          updated[sIdx] = { ...updated[sIdx], fields };
                          handleParameterChange("form", { sections: updated });
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const updated = [...sections];
                          updated[sIdx].fields = updated[sIdx].fields.filter((_: any, i: number) => i !== fIdx);
                          handleParameterChange("form", { sections: updated });
                        }}
                      >
                        <Trash2 className="h-2 w-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label>Fulfillment</Label>
          <Select
            value={block.parameters.fulfillment?.type || "manual"}
            onValueChange={(val) => {
              handleParameterChange("fulfillment", {
                ...block.parameters.fulfillment,
                type: val
              });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="taskGraph">Task Graph</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderRuleConditionsActions = () => {
    const when = block.parameters.when || [];
    const then = block.parameters.then || [];
    
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Conditions (When)</Label>
            <Button size="sm" variant="outline" onClick={() => handleArrayAdd("when")}>
              <Plus className="h-3 w-3 mr-1" />
              Add Condition
            </Button>
          </div>
          
          <div className="space-y-2">
            {when.map((condition: any, idx: number) => (
              <Card key={idx}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Field"
                      value={condition.field || ""}
                      onChange={(e) => handleArrayItemChange("when", idx, { ...condition, field: e.target.value })}
                      className="flex-1"
                    />
                    <Select
                      value={condition.operator || "equals"}
                      onValueChange={(val) => handleArrayItemChange("when", idx, { ...condition, operator: val })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="notEquals">Not Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Value"
                      value={condition.value || ""}
                      onChange={(e) => handleArrayItemChange("when", idx, { ...condition, value: e.target.value })}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArrayRemove("when", idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Actions (Then)</Label>
            <Button size="sm" variant="outline" onClick={() => handleArrayAdd("then")}>
              <Plus className="h-3 w-3 mr-1" />
              Add Action
            </Button>
          </div>
          
          <div className="space-y-2">
            {then.map((action: any, idx: number) => (
              <Card key={idx}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={action.type || "assignToQueue"}
                      onValueChange={(val) => handleArrayItemChange("then", idx, { ...action, type: val })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignToQueue">Assign to Queue</SelectItem>
                        <SelectItem value="setSLA">Set SLA</SelectItem>
                        <SelectItem value="spawnTaskGraph">Spawn Task Graph</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Value"
                      value={action.value || ""}
                      onChange={(e) => handleArrayItemChange("then", idx, { ...action, value: e.target.value })}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArrayRemove("then", idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAdapterConfig = () => {
    const config = block.parameters.config || {};
    const vendor = block.parameters.vendor || "custom";
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Vendor</Label>
          <Select
            value={vendor}
            onValueChange={(val) => handleParameterChange("vendor", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="okta">Okta</SelectItem>
              <SelectItem value="workday">Workday</SelectItem>
              <SelectItem value="intune">Intune</SelectItem>
              <SelectItem value="docusign">DocuSign</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Configuration</Label>
            <Button size="sm" variant="outline" onClick={() => {
              const key = prompt("Enter config key:");
              if (key) {
                handleParameterChange("config", { ...config, [key]: "" });
              }
            }}>
              <Plus className="h-3 w-3 mr-1" />
              Add Key
            </Button>
          </div>
          
          <div className="space-y-2">
            {Object.entries(config).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Input
                  value={key}
                  disabled
                  className="w-32"
                />
                <Input
                  type={key.toLowerCase().includes("secret") || key.toLowerCase().includes("password") ? "password" : "text"}
                  placeholder="Value"
                  value={value as string}
                  onChange={(e) => {
                    handleParameterChange("config", { ...config, [key]: e.target.value });
                  }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const { [key]: _, ...rest } = config;
                    handleParameterChange("config", rest);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTaskGraphTasks = () => {
    const tasks = block.parameters.tasks || [];
    const adapters = []; // Would fetch from manifest in real implementation
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Tasks</Label>
          <Button size="sm" variant="outline" onClick={() => handleArrayAdd("tasks")}>
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        </div>
        
        <div className="space-y-2">
          {tasks.map((task: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Task name"
                    value={task.name || ""}
                    onChange={(e) => handleArrayItemChange("tasks", idx, { ...task, name: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleArrayRemove("tasks", idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={task.type || "manual"}
                    onValueChange={(val) => handleArrayItemChange("tasks", idx, { ...task, type: val })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="adapterAction">Adapter Action</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {task.type === "adapterAction" && (
                    <Input
                      placeholder="Adapter ID"
                      value={task.adapterId || ""}
                      onChange={(e) => handleArrayItemChange("tasks", idx, { ...task, adapterId: e.target.value })}
                      className="flex-1"
                    />
                  )}
                </div>
                
                {task.type === "adapterAction" && (
                  <Input
                    placeholder="Action name"
                    value={task.action || ""}
                    onChange={(e) => handleArrayItemChange("tasks", idx, { ...task, action: e.target.value })}
                  />
                )}
                
                <Input
                  placeholder="Parallel group (optional)"
                  value={task.parallelGroup || ""}
                  onChange={(e) => handleArrayItemChange("tasks", idx, { ...task, parallelGroup: e.target.value })}
                />
                
                <Textarea
                  placeholder="Description"
                  value={task.description || ""}
                  onChange={(e) => handleArrayItemChange("tasks", idx, { ...task, description: e.target.value })}
                  rows={2}
                />
              </CardContent>
            </Card>
          ))}
          
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks defined. Click &quot;Add Task&quot; to get started.
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderSecurityVisibility = () => {
    const visibility = block.parameters.visibility || [];
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Entity Visibility Rules</Label>
          <Button size="sm" variant="outline" onClick={() => handleArrayAdd("visibility")}>
            <Plus className="h-3 w-3 mr-1" />
            Add Rule
          </Button>
        </div>
        
        <div className="space-y-2">
          {visibility.map((rule: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Entity name"
                    value={rule.entityName || ""}
                    onChange={(e) => handleArrayItemChange("visibility", idx, { ...rule, entityName: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleArrayRemove("visibility", idx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Roles (comma-separated)"
                  value={(rule.roles || []).join(", ")}
                  onChange={(e) => {
                    const roles = e.target.value.split(",").map((r: string) => r.trim()).filter(Boolean);
                    handleArrayItemChange("visibility", idx, { ...rule, roles });
                  }}
                  rows={2}
                />
              </CardContent>
            </Card>
          ))}
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
          {block.type === "catalog_item" && renderCatalogItemForm()}
          {block.type === "rule" && renderRuleConditionsActions()}
          {block.type === "task_graph" && renderTaskGraphTasks()}
          {block.type === "adapter_generic" && renderAdapterConfig()}
          {(block.type.startsWith("adapter_") || block.type === "rbac_pack") && renderAdapterConfig()}
          {block.type === "rbac_pack" && renderSecurityVisibility()}

          {definition.parameters.length > 0 && 
           !["entity", "workflow", "catalog_item", "rule", "task_graph", "rbac_pack"].includes(block.type) && 
           !block.type.startsWith("adapter_") && (
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

          {definition.parameters.length === 0 && 
           !["entity", "workflow", "catalog_item", "rule", "task_graph", "rbac_pack"].includes(block.type) &&
           !block.type.startsWith("adapter_") && (
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
