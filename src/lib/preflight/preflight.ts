import { SolutionManifest, Block, WorkflowBlock, EntityBlock, RuleBlock } from "@/lib/manifest/types";

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
  
  return issues;
}
