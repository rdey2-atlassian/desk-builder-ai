import { SolutionManifest, Block } from "@/lib/manifest/types";

export interface DryRunPlan {
  projects: ProjectPlan[];
  requestTypes: RequestTypePlan[];
  workflows: WorkflowPlan[];
  automations: AutomationPlan[];
  adapters: AdapterPlan[];
  security: SecurityPlan[];
}

export interface ProjectPlan {
  name: string;
  key: string;
  entities: string[];
}

export interface RequestTypePlan {
  name: string;
  workflow: string;
  fields: string[];
}

export interface WorkflowPlan {
  name: string;
  states: string[];
  transitions: number;
}

export interface AutomationPlan {
  name: string;
  trigger: string;
  actions: string[];
}

export interface AdapterPlan {
  name: string;
  vendor: string;
  configKeys: string[];
}

export interface SecurityPlan {
  entity: string;
  roles: string[];
}

export function generateDryRunPlan(manifest: SolutionManifest): DryRunPlan {
  const plan: DryRunPlan = {
    projects: [],
    requestTypes: [],
    workflows: [],
    automations: [],
    adapters: [],
    security: [],
  };
  
  // Extract entities
  const entities = manifest.blocks
    .filter((b) => b.type === "entity")
    .map((b) => b.name);
  
  if (entities.length > 0) {
    plan.projects.push({
      name: manifest.name,
      key: manifest.name.toUpperCase().replace(/\s+/g, "_"),
      entities,
    });
  }
  
  // Extract workflows
  manifest.blocks
    .filter((b) => b.type === "workflow")
    .forEach((block) => {
      plan.workflows.push({
        name: block.name,
        states: (block as any).states || [],
        transitions: (block as any).transitions?.length || 0,
      });
    });
  
  // Extract catalog items as request types
  manifest.blocks
    .filter((b) => b.type === "catalogItem")
    .forEach((block) => {
      plan.requestTypes.push({
        name: block.name,
        workflow: (block as any).taskGraphId || "default",
        fields: [],
      });
    });
  
  // Extract rules as automations
  manifest.blocks
    .filter((b) => b.type === "rule")
    .forEach((block) => {
      const rule = block as any;
      plan.automations.push({
        name: block.name,
        trigger: rule.when?.[0]?.field || "unknown",
        actions: rule.then?.map((a: any) => a.type) || [],
      });
    });
  
  // Extract adapters
  manifest.blocks
    .filter((b) => b.type === "adapter")
    .forEach((block) => {
      const adapter = block as any;
      plan.adapters.push({
        name: block.name,
        vendor: adapter.vendor,
        configKeys: Object.keys(adapter.config || {}),
      });
    });
  
  // Extract security
  manifest.blocks
    .filter((b) => b.type === "security")
    .forEach((block) => {
      const security = block as any;
      security.visibility?.forEach((v: any) => {
        plan.security.push({
          entity: v.entityName,
          roles: v.roles,
        });
      });
    });
  
  return plan;
}
