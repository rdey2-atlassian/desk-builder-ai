import { SolutionManifest, Block, WorkflowBlock, EntityBlock, RuleBlock, AdapterBlock } from "@/lib/manifest/types";
import { validateAdapterConfig } from "./adapterValidation";

export interface PreflightIssue {
  severity: "error" | "warning" | "info";
  message: string;
  blockId?: string;
  field?: string;
}

export function runPreflight(manifest: SolutionManifest): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  
  // Rule 1: Workflow must have ≥2 states and at least 1 transition
  manifest.blocks
    .filter((b): b is WorkflowBlock => b.type === "workflow")
    .forEach((block) => {
      if (block.states.length < 2) {
        issues.push({
          severity: "error",
          message: `Workflow "${block.name}" must have at least 2 states`,
          blockId: block.id,
          field: "states",
        });
      }
      
      if (block.transitions.length === 0) {
        issues.push({
          severity: "warning",
          message: `Workflow "${block.name}" has no transitions`,
          blockId: block.id,
          field: "transitions",
        });
      }
    });
  
  // Rule 2: If any Entity has a field named email, entity must also have an id field
  manifest.blocks
    .filter((b): b is EntityBlock => b.type === "entity")
    .forEach((block) => {
      const hasEmail = block.fields.some((f) => f.name === "email");
      const hasId = block.fields.some((f) => f.name === "id" || f.name.includes("Id"));
      
      if (hasEmail && !hasId) {
        issues.push({
          severity: "error",
          message: `Entity "${block.name}" has email field but no id field`,
          blockId: block.id,
          field: "fields",
        });
      }
    });
  
  // Rule 3: If any rule references a non-existent block id → error
  const blockIds = new Set(manifest.blocks.map((b) => b.id));
  
  manifest.blocks
    .filter((b): b is RuleBlock => b.type === "rule")
    .forEach((block) => {
      block.then.forEach((action, idx) => {
        if (action.type === "spawnTaskGraph" && !blockIds.has(action.value)) {
          issues.push({
            severity: "error",
            message: `Rule "${block.name}" references non-existent task graph "${action.value}"`,
            blockId: block.id,
            field: `then[${idx}]`,
          });
        }
      });
    });
  
  // Rule 4: If any entity has PII fields and no security block → error
  const entities = manifest.blocks.filter((b): b is EntityBlock => b.type === "entity");
  const hasSecurity = manifest.blocks.some((b) => b.type === "security");
  
  entities.forEach((block) => {
    const hasPii = block.fields.some((f) => f.pii);
    
    if (hasPii && !hasSecurity) {
      issues.push({
        severity: "error",
        message: `Entity "${block.name}" has PII fields but no security block exists`,
        blockId: block.id,
      });
    }
  });
  
  // Rule 5: Adapter config validation
  manifest.blocks
    .filter((b): b is AdapterBlock => b.type === "adapter")
    .forEach((block) => {
      const missingKeys = validateAdapterConfig(block.vendor, block.config || {});
      
      if (missingKeys.length > 0) {
        issues.push({
          severity: "warning",
          message: `Adapter "${block.name}" (${block.vendor}) is missing required config keys: ${missingKeys.join(", ")}`,
          blockId: block.id,
          field: "config",
        });
      }
    });
  
  // Rule 6: Workflow state name uniqueness
  manifest.blocks
    .filter((b): b is WorkflowBlock => b.type === "workflow")
    .forEach((block) => {
      const stateNames = new Set<string>();
      const duplicates = new Set<string>();
      
      block.states.forEach((state) => {
        if (stateNames.has(state)) {
          duplicates.add(state);
        }
        stateNames.add(state);
      });
      
      if (duplicates.size > 0) {
        issues.push({
          severity: "error",
          message: `Workflow "${block.name}" has duplicate state names: ${Array.from(duplicates).join(", ")}`,
          blockId: block.id,
          field: "states",
        });
      }
    });
  
  // Rule 7: Task graph adapter validation
  const taskGraphs = manifest.blocks.filter((b) => b.type === "taskGraph");
  const adapterIds = new Set(manifest.blocks.filter((b) => b.type === "adapter").map((b) => b.id));
  
  taskGraphs.forEach((graph: any) => {
    (graph.tasks || []).forEach((task: any, idx: number) => {
      if (task.type === "adapterAction" && task.adapterId && !adapterIds.has(task.adapterId)) {
        issues.push({
          severity: "error",
          message: `Task graph "${graph.name}" task ${idx + 1} references non-existent adapter "${task.adapterId}"`,
          blockId: graph.id,
          field: `tasks[${idx}]`,
        });
      }
    });
  });
  
  return issues;
}
