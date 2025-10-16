import { LucideIcon } from "lucide-react";

export interface SolutionTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: "itsm" | "hrsm" | "facilities" | "sam" | "itops" | "blank";
  prompt?: string;
  blocks: TemplateBlock[];
  blueprintPath?: string;
}

export interface TemplateBlock {
  id: string;
  label: string;
  icon: LucideIcon;
  type: "portal" | "request_types" | "knowledge" | "integrations" | "automations" | "slas" | "team_roles" | "roles" | "playbooks" | "schedules" | "escalations" | "heartbeats" | "syncs" | "entities" | "workflows" | "catalog" | "analytics";
  details?: string[];
  dataPath?: string;
}

export interface SolutionManifest {
  templateId: string;
  version: string;
  metadata: {
    name: string;
    description: string;
    created: string;
    author: string;
  };
  blocks: TemplateBlock[];
}
