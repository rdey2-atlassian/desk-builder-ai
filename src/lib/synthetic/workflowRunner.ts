import { SolutionManifest, WorkflowBlock, RuleBlock } from "@/lib/manifest/types";

export interface SyntheticRunLog {
  workflowName: string;
  startTime: string;
  endTime?: string;
  steps: SyntheticStep[];
  status: "running" | "completed" | "error";
  error?: string;
}

export interface SyntheticStep {
  timestamp: string;
  type: "transition" | "rule_fired" | "action_executed";
  from?: string;
  to?: string;
  ruleName?: string;
  actionType?: string;
  details?: string;
}

export function runSyntheticWorkflow(
  manifest: SolutionManifest,
  workflowId: string,
  ticketData: Record<string, any> = {}
): SyntheticRunLog {
  const workflow = manifest.blocks.find(
    (b): b is WorkflowBlock => b.type === "workflow" && b.id === workflowId
  );
  
  if (!workflow) {
    return {
      workflowName: "Unknown",
      startTime: new Date().toISOString(),
      steps: [],
      status: "error",
      error: `Workflow ${workflowId} not found`,
    };
  }
  
  const log: SyntheticRunLog = {
    workflowName: workflow.name,
    startTime: new Date().toISOString(),
    steps: [],
    status: "running",
  };
  
  // Simulate workflow execution
  let currentState = workflow.states[0];
  const visited = new Set<string>([currentState]);
  
  log.steps.push({
    timestamp: new Date().toISOString(),
    type: "transition",
    to: currentState,
    details: `Workflow started in state: ${currentState}`,
  });
  
  // Find rules that might fire
  const rules = manifest.blocks.filter((b): b is RuleBlock => b.type === "rule");
  
  // Traverse workflow
  workflow.transitions.forEach((transition, idx) => {
    if (transition.from === currentState) {
      // Check if any rules fire
      rules.forEach((rule) => {
        const shouldFire = rule.when.some((condition) => {
          // Simplified: just check if field exists in ticketData
          return ticketData[condition.field] === condition.value;
        });
        
        if (shouldFire) {
          log.steps.push({
            timestamp: new Date().toISOString(),
            type: "rule_fired",
            ruleName: rule.name,
            details: `Rule triggered: ${rule.name}`,
          });
          
          rule.then.forEach((action) => {
            log.steps.push({
              timestamp: new Date().toISOString(),
              type: "action_executed",
              actionType: action.type,
              details: `Action executed: ${action.type} - ${action.value}`,
            });
          });
        }
      });
      
      // Transition to next state
      if (!visited.has(transition.to)) {
        log.steps.push({
          timestamp: new Date().toISOString(),
          type: "transition",
          from: currentState,
          to: transition.to,
          details: `Transitioned: ${transition.from} → ${transition.to}${
            transition.label ? ` (${transition.label})` : ""
          }`,
        });
        
        currentState = transition.to;
        visited.add(currentState);
      }
    }
  });
  
  log.endTime = new Date().toISOString();
  log.status = "completed";
  
  return log;
}
