// Core manifest types for solution builder

export type BlockType = 
  | "entity" 
  | "relationship" 
  | "workflow" 
  | "catalogItem" 
  | "rule" 
  | "adapter"
  | "taskGraph"
  | "security";

export interface BaseBlock {
  id: string;
  type: BlockType;
  name: string;
}

export interface EntityBlock extends BaseBlock {
  type: "entity";
  fields: EntityField[];
}

export interface EntityField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "enum" | "ref";
  required?: boolean;
  pii?: boolean;
  enumOptions?: string[];
  ref?: { entity: string };
}

export interface WorkflowBlock extends BaseBlock {
  type: "workflow";
  states: string[];
  transitions: WorkflowTransition[];
}

export interface WorkflowTransition {
  from: string;
  to: string;
  label?: string;
}

export interface CatalogItemBlock extends BaseBlock {
  type: "catalogItem";
  fulfillmentType: "taskGraph" | "manual";
  taskGraphId?: string;
}

export interface RuleBlock extends BaseBlock {
  type: "rule";
  when: RuleCondition[];
  then: RuleAction[];
}

export interface RuleCondition {
  field: string;
  operator: "equals" | "notEquals" | "contains";
  value: string;
}

export interface RuleAction {
  type: "assignToQueue" | "setSLA" | "spawnTaskGraph";
  value: string;
}

export interface AdapterBlock extends BaseBlock {
  type: "adapter";
  vendor: "okta" | "workday" | "intune" | "docusign" | "custom";
  config: Record<string, string>;
}

export interface TaskGraphBlock extends BaseBlock {
  type: "taskGraph";
  tasks: Task[];
}

export interface Task {
  id: string;
  name: string;
  type: "adapterAction" | "manual";
  adapterId?: string;
  action?: string;
  parallelGroup?: string;
}

export interface SecurityBlock extends BaseBlock {
  type: "security";
  visibility: SecurityVisibility[];
}

export interface SecurityVisibility {
  entityName: string;
  roles: string[];
}

export interface RelationshipBlock extends BaseBlock {
  type: "relationship";
  fromEntity: string;
  toEntity: string;
  relationshipType: "oneToMany" | "manyToMany";
}

export type Block = 
  | EntityBlock 
  | RelationshipBlock
  | WorkflowBlock 
  | CatalogItemBlock 
  | RuleBlock 
  | AdapterBlock
  | TaskGraphBlock
  | SecurityBlock;

export interface SolutionManifest {
  version: string;
  name: string;
  description?: string;
  blocks: Block[];
}
