import { z } from "zod";

const entityFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["string", "number", "boolean", "date", "enum", "ref"]),
  required: z.boolean().optional(),
  pii: z.boolean().optional(),
  enumOptions: z.array(z.string()).optional(),
  ref: z.object({ entity: z.string() }).optional(),
});

const workflowTransitionSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
});

const ruleConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(["equals", "notEquals", "contains"]),
  value: z.string(),
});

const ruleActionSchema = z.object({
  type: z.enum(["assignToQueue", "setSLA", "spawnTaskGraph"]),
  value: z.string(),
});

const taskSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["adapterAction", "manual"]),
  adapterId: z.string().optional(),
  action: z.string().optional(),
  parallelGroup: z.string().optional(),
});

const securityVisibilitySchema = z.object({
  entityName: z.string(),
  roles: z.array(z.string()),
});

const baseBlockSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

const entityBlockSchema = baseBlockSchema.extend({
  type: z.literal("entity"),
  fields: z.array(entityFieldSchema),
});

const relationshipBlockSchema = baseBlockSchema.extend({
  type: z.literal("relationship"),
  fromEntity: z.string(),
  toEntity: z.string(),
  relationshipType: z.enum(["oneToMany", "manyToMany"]),
});

const workflowBlockSchema = baseBlockSchema.extend({
  type: z.literal("workflow"),
  states: z.array(z.string()).min(2),
  transitions: z.array(workflowTransitionSchema),
});

const formFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(["string", "number", "boolean", "date", "select"]),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

const formSectionSchema = z.object({
  title: z.string(),
  fields: z.array(formFieldSchema),
});

const catalogItemBlockSchema = baseBlockSchema.extend({
  type: z.literal("catalogItem"),
  form: z.object({
    sections: z.array(formSectionSchema),
  }),
  fulfillment: z.object({
    type: z.enum(["taskGraph", "manual"]),
    taskGraphId: z.string().optional(),
  }),
});

const ruleBlockSchema = baseBlockSchema.extend({
  type: z.literal("rule"),
  when: z.array(ruleConditionSchema),
  then: z.array(ruleActionSchema),
});

const adapterBlockSchema = baseBlockSchema.extend({
  type: z.literal("adapter"),
  vendor: z.enum(["okta", "workday", "intune", "docusign", "custom"]),
  config: z.record(z.string()),
});

const taskGraphBlockSchema = baseBlockSchema.extend({
  type: z.literal("taskGraph"),
  tasks: z.array(taskSchema),
});

const securityBlockSchema = baseBlockSchema.extend({
  type: z.literal("security"),
  visibility: z.array(securityVisibilitySchema),
});

const blockSchema = z.discriminatedUnion("type", [
  entityBlockSchema,
  relationshipBlockSchema,
  workflowBlockSchema,
  catalogItemBlockSchema,
  ruleBlockSchema,
  adapterBlockSchema,
  taskGraphBlockSchema,
  securityBlockSchema,
]);

export const manifestSchema = z.object({
  version: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  blocks: z.array(blockSchema),
});

export type ValidationResult =
  | { ok: true; data: z.infer<typeof manifestSchema> }
  | { ok: false; issues: z.ZodIssue[] };

export function validateManifest(json: unknown): ValidationResult {
  const result = manifestSchema.safeParse(json);
  
  if (result.success) {
    return { ok: true, data: result.data } as const;
  }
  
  return { ok: false, issues: result.error.issues } as const;
}

export type ValidatedManifest = z.infer<typeof manifestSchema>;
