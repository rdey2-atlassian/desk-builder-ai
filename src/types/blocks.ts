import { LucideIcon } from "lucide-react";

export type BlockCategory = 
  | "domain" 
  | "workflow" 
  | "catalog" 
  | "automation" 
  | "adapter" 
  | "portal" 
  | "analytics" 
  | "security"
  | "quality";

export type BlockType =
  // Domain
  | "entity"
  | "relationship"
  | "field_pack"
  | "record_security"
  // Workflow
  | "workflow"
  | "journey"
  | "approval"
  | "escalation"
  // Catalog
  | "catalog_item"
  | "form_section"
  | "dynamic_logic"
  // Automation
  | "rule"
  | "task_graph"
  | "runbook"
  | "event_hook"
  // Adapters
  | "adapter_identity"
  | "adapter_hris"
  | "adapter_mdm"
  | "adapter_esign"
  | "adapter_cmms"
  | "adapter_generic"
  // AI & Knowledge
  | "intent_router"
  | "summarizer"
  | "policy_pack"
  | "retrieval_connector"
  // Portal
  | "portal_section"
  | "widget"
  | "branding"
  | "personas"
  // Analytics
  | "metric"
  | "dashboard"
  | "alert"
  // Security
  | "rbac_pack"
  | "data_residency"
  | "audit_log"
  // Quality
  | "seed_data"
  | "synthetic_test"
  | "diagnostics";

export interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  icon: LucideIcon;
  color: string;
  tags: string[];
  parameters: BlockParameter[];
}

export interface BlockParameter {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "select" | "multi-select" | "json";
  required: boolean;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  placeholder?: string;
  description?: string;
}

export interface BlockInstance {
  id: string;
  type: BlockType;
  name: string;
  position: { x: number; y: number };
  parameters: Record<string, any>;
  connections?: string[]; // IDs of connected blocks
}

export interface CanvasState {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  zoom: number;
  pan: { x: number; y: number };
}
