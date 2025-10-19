# Architecture Documentation

## System Overview

The AI Helpdesk Composer is a visual solution builder that compiles block-based configurations into deployable service management systems. This document describes the architecture, data model, and key design patterns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
├─────────────────────────────────────────────────────────────┤
│  Landing  →  Canvas Composer  →  Refine  →  Preview  →  Deploy │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Composer Engine                           │
├─────────────────────────────────────────────────────────────┤
│  • Block Library        • Property Editor                    │
│  • Canvas Manager       • Validation Engine                  │
│  • Connection Logic     • State Management                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Compiler & Runtime                        │
├─────────────────────────────────────────────────────────────┤
│  • Manifest Compiler    • Seed Data Generator                │
│  • Preflight Validator  • Synthetic Runner                   │
│  • Diff Engine          • Plan Generator                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Output & Deployment                       │
├─────────────────────────────────────────────────────────────┤
│  • JSON Manifest        • Deployment Package                 │
│  • Configuration Files  • Database Schemas                   │
└─────────────────────────────────────────────────────────────┘
```

## Core Concepts

### Solution Manifest

The central data structure representing a complete service management solution:

```typescript
interface SolutionManifest {
  version: string;              // Schema version (e.g., "1.0")
  name: string;                 // Solution name
  description?: string;         // Description
  blocks: Block[];              // Array of all blocks
  metadata?: {                  // Optional metadata
    author?: string;
    created?: string;
    tags?: string[];
  };
}
```

### Blocks

Blocks are the atomic units of composition. Each block type serves a specific purpose:

#### 1. Entity Block
Defines data models and their fields.

```typescript
interface EntityBlock {
  type: "entity";
  id: string;
  name: string;
  fields: Field[];
  relationships?: Relationship[];
}

interface Field {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "enum" | "ref";
  label?: string;
  required?: boolean;
  unique?: boolean;
  enumOptions?: string[];      // For enum type
  ref?: {                      // For ref type
    entity: string;
    field?: string;
  };
}
```

**Example:**
```json
{
  "type": "entity",
  "id": "ticket",
  "name": "Ticket",
  "fields": [
    { "name": "title", "type": "string", "required": true },
    { "name": "priority", "type": "enum", "enumOptions": ["low", "medium", "high"] },
    { "name": "assignee", "type": "ref", "ref": { "entity": "user" } }
  ]
}
```

#### 2. Workflow Block
State machine for process automation.

```typescript
interface WorkflowBlock {
  type: "workflow";
  id: string;
  name: string;
  entity: string;              // Which entity this workflow applies to
  states: string[];            // List of possible states
  initialState: string;        // Starting state
  transitions: Transition[];   // Allowed state changes
}

interface Transition {
  from: string;
  to: string;
  label?: string;
  conditions?: Condition[];    // Optional conditions
}
```

**Example:**
```json
{
  "type": "workflow",
  "id": "ticket-workflow",
  "name": "Ticket Lifecycle",
  "entity": "ticket",
  "states": ["new", "assigned", "in_progress", "resolved", "closed"],
  "initialState": "new",
  "transitions": [
    { "from": "new", "to": "assigned", "label": "Assign" },
    { "from": "assigned", "to": "in_progress", "label": "Start Work" },
    { "from": "in_progress", "to": "resolved", "label": "Resolve" }
  ]
}
```

#### 3. Rule Block
Conditional automation with triggers and actions.

```typescript
interface RuleBlock {
  type: "rule";
  id: string;
  name: string;
  when: Condition[];           // Trigger conditions (AND logic)
  then: Action[];              // Actions to execute
}

interface Condition {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: any;
}

interface Action {
  type: "set_field" | "send_notification" | "create_task" | "call_webhook";
  field?: string;              // For set_field
  value?: any;                 // For set_field
  template?: string;           // For send_notification
  url?: string;                // For call_webhook
}
```

**Example:**
```json
{
  "type": "rule",
  "id": "high-priority-alert",
  "name": "Alert on High Priority",
  "when": [
    { "field": "priority", "operator": "equals", "value": "high" }
  ],
  "then": [
    { "type": "send_notification", "template": "High priority ticket created" }
  ]
}
```

#### 4. Catalog Item Block
Service catalog entries with request forms and fulfillment.

```typescript
interface CatalogItemBlock {
  type: "catalog_item";
  id: string;
  name: string;
  description?: string;
  category?: string;
  form?: FormSection[];        // Request form definition
  fulfillment?: {              // How to fulfill the request
    type: "manual" | "automated" | "approval";
    workflow?: string;         // Workflow to trigger
    approvers?: string[];      // For approval type
  };
}

interface FormSection {
  title: string;
  fields: FormField[];
}

interface FormField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
}
```

#### 5. Task Graph Block
Complex task orchestration with dependencies.

```typescript
interface TaskGraphBlock {
  type: "task_graph";
  id: string;
  name: string;
  tasks: Task[];
}

interface Task {
  name: string;
  type: "manual" | "adapterAction";
  adapterId?: string;          // For adapterAction
  action?: string;             // For adapterAction
  parallelGroup?: number;      // Tasks in same group run parallel
  description?: string;
}
```

**Example:**
```json
{
  "type": "task_graph",
  "id": "onboarding-tasks",
  "name": "Employee Onboarding",
  "tasks": [
    { "name": "Create Email", "type": "adapterAction", "adapterId": "gsuite", "action": "create_user", "parallelGroup": 1 },
    { "name": "Provision Laptop", "type": "manual", "parallelGroup": 1 },
    { "name": "Schedule Training", "type": "manual", "parallelGroup": 2 }
  ]
}
```

#### 6. Integration & Adapter Blocks

**Integration Block** - Instance of an adapter with specific configuration:
```typescript
interface IntegrationBlock {
  type: "integration";
  id: string;
  name: string;
  adapterId: string;           // References an adapter
  config: Record<string, any>; // Adapter-specific config
}
```

**Adapter Block** - Template for integrations:
```typescript
interface AdapterBlock {
  type: "adapter";
  id: string;
  name: string;
  description?: string;
  requiredConfigKeys?: string[]; // Config validation
}
```

#### 7. AI Agent Block
AI-powered automation and assistance.

```typescript
interface AIAgentBlock {
  type: "ai_agent";
  id: string;
  name: string;
  model: string;               // e.g., "gpt-4", "claude-3"
  instructions: string;        // System prompt
  tools?: string[];            // Available tools/functions
}
```

#### 8. Supporting Blocks

**SLA Block** - Service level agreements:
```typescript
interface SLABlock {
  type: "sla";
  id: string;
  name: string;
  targetTime: number;          // In minutes
  escalations?: Escalation[];
}
```

**Security Block** - Access control:
```typescript
interface SecurityBlock {
  type: "security";
  id: string;
  name: string;
  visibility: "public" | "internal" | "restricted";
  roles?: string[];
}
```

**Knowledge Block** - Documentation:
```typescript
interface KnowledgeBlock {
  type: "knowledge";
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}
```

**Portal Block** - User interface:
```typescript
interface PortalBlock {
  type: "portal";
  id: string;
  name: string;
  pages: PortalPage[];
}
```

**Team Role Block** - RBAC:
```typescript
interface TeamRoleBlock {
  type: "team_role";
  id: string;
  name: string;
  permissions: string[];
  members?: string[];
}
```

## Data Flow

### 1. Composition Phase
```
User Action → Canvas → Block Instance → Store (Zustand) → UI Update
```

- User drags blocks from library
- Blocks instantiated with default properties
- State managed in `manifestStore`
- Canvas re-renders via React

### 2. Configuration Phase
```
Block Selection → Properties Panel → Field Editor → Validation → Store Update
```

- Click block to open properties
- Edit fields with type-specific inputs
- Validate on change
- Persist to store

### 3. Validation Phase
```
Manifest → Preflight Rules → Issue Detection → Warning/Error List
```

Preflight checks run automatically:
- Block connectivity
- Field types
- PII detection
- Adapter configs
- Workflow integrity
- Task graph dependencies

### 4. Compilation Phase
```
Manifest → Compiler → Deployment Plan → Diff Engine → Output
```

- Generate deployment instructions
- Create database schemas
- Build API endpoints
- Compile frontend code

## State Management

### Zustand Stores

**manifestStore** - Primary solution state:
```typescript
interface ManifestStore {
  manifest: SolutionManifest;
  selectedBlockId: string | null;
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  setSelectedBlock: (id: string | null) => void;
}
```

**dryRunStore** - Validation state:
```typescript
interface DryRunStore {
  previousPlan: DeploymentPlan | null;
  currentPlan: DeploymentPlan | null;
  setPreviousPlan: (plan: DeploymentPlan | null) => void;
  setCurrentPlan: (plan: DeploymentPlan | null) => void;
}
```

## Validation Engine

### Preflight Rules

Rules are executed in order with increasing severity:

```typescript
interface PreflightRule {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  check: (manifest: SolutionManifest) => boolean;
}
```

**Current Rules:**
1. **Block Connectivity** (error) - Ensures no orphaned blocks
2. **Invalid Field Types** (error) - Validates field type definitions
3. **PII Detection** (warn) - Flags potential PII fields
4. **Adapter Validation** (error) - Checks required config keys
5. **Workflow States** (error) - Validates state uniqueness
6. **Task Graph** (error) - Validates adapter references

### Adapter Config Validation

```typescript
export function validateAdapterConfig(
  integration: IntegrationBlock,
  adapter: AdapterBlock
): string[] {
  const errors: string[] = [];
  const providedKeys = Object.keys(integration.config);
  
  adapter.requiredConfigKeys?.forEach(key => {
    if (!providedKeys.includes(key)) {
      errors.push(`Missing required config: ${key}`);
    }
  });
  
  return errors;
}
```

## Testing Infrastructure

### Seed Data Generation

Generates realistic test data based on field types:

```typescript
export function generateSeedData(
  manifest: SolutionManifest,
  recordsPerEntity: number = 3
): SeedDataOutput {
  // For each entity
  // - Generate N records
  // - Infer data from field names (email, id, etc.)
  // - Handle relationships via foreign keys
  // - Respect enums and references
}
```

### Synthetic Workflow Runner

Simulates workflow execution:

```typescript
export function runSyntheticWorkflow(
  manifest: SolutionManifest,
  workflowId: string,
  ticketData: Record<string, any> = {}
): SyntheticRunLog {
  // 1. Find workflow
  // 2. Start in initial state
  // 3. Check rules for each transition
  // 4. Execute actions
  // 5. Move to next state
  // 6. Return execution log
}
```

## UI Components

### Component Hierarchy

```
App
├── Landing
│   └── Template Selection
├── CanvasComposer
│   ├── BlockLibrary (left sidebar)
│   ├── Canvas (center)
│   │   └── BlockNode (draggable)
│   ├── PropertiesPanel (right sidebar)
│   ├── PreflightSidebar (validation)
│   └── Toolbars
│       ├── LoadSolutionDialog
│       ├── SeedDataPanel
│       ├── SyntheticTestPanel
│       └── DryRunDiffPanel
├── Refine
│   └── Configuration Tabs
│       ├── RequestTypesTab
│       ├── AutomationsTab
│       ├── IntegrationsTab
│       ├── KnowledgeTab
│       ├── SLAsTab
│       ├── TeamRolesTab
│       └── PortalTab
├── Preview
│   └── Manifest Viewer
└── Deploy
    └── Success Screen
```

### Key Patterns

**Block Rendering:**
```typescript
// BlockNode.tsx
export function BlockNode({ block }: { block: Block }) {
  const icon = getBlockIcon(block.type);
  const color = getBlockColor(block.type);
  
  return (
    <Card className={`p-4 cursor-move ${color}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span>{block.name}</span>
      </div>
    </Card>
  );
}
```

**Property Editing:**
```typescript
// PropertiesPanel.tsx
function renderFieldEditor(field: Field) {
  switch (field.type) {
    case "string":
      return <Input value={field.value} onChange={...} />;
    case "enum":
      return <Select options={field.enumOptions} />;
    case "ref":
      return <EntityPicker entities={...} />;
    // ...
  }
}
```

## Extension Points

### Adding New Block Types

1. Define in `types.ts`:
```typescript
export interface MyCustomBlock extends BaseBlock {
  type: "my_custom";
  customProp: string;
}
```

2. Add to schema in `schema.ts`:
```typescript
const myCustomBlockSchema = baseBlockSchema.extend({
  type: z.literal("my_custom"),
  customProp: z.string(),
});
```

3. Register in `blockDefinitions.ts`:
```typescript
{
  type: "my_custom",
  label: "My Custom Block",
  icon: MyIcon,
  color: "bg-purple-100",
  defaultProps: { customProp: "default" }
}
```

4. Add rendering logic
5. Add property panel fields
6. Add validation rules (if needed)

### Custom Validation Rules

```typescript
// In preflight.ts
{
  id: "my-validation",
  level: "warn",
  message: "My custom validation message",
  check: (manifest) => {
    // Return true if valid, false if invalid
    return manifest.blocks.every(b => isValid(b));
  }
}
```

### Custom Adapters

```typescript
{
  type: "adapter",
  id: "my-service",
  name: "My Service Integration",
  requiredConfigKeys: ["apiKey", "endpoint"],
  actions: ["create", "update", "delete"]
}
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Use `React.memo` for block nodes
2. **Virtual Scrolling**: For large block libraries
3. **Debouncing**: Property panel updates
4. **Lazy Loading**: Example packs and templates
5. **Code Splitting**: Route-based chunks

### Scalability

- Manifests tested up to 500+ blocks
- Canvas handles 100+ visible blocks
- Preflight runs in <500ms for typical solutions
- Diff engine handles large manifests efficiently

## Security

### Validation
- Input sanitization on all text fields
- XSS prevention in rendered content
- Schema validation via Zod
- Type safety via TypeScript

### PII Detection
Automatic flagging of sensitive fields:
- Names containing: email, ssn, phone, address
- Configurable patterns
- Warning level (doesn't block)

### Access Control
- Role-based permissions (Team Role blocks)
- Field-level security (Security blocks)
- Audit logging (when deployed)

## Deployment Model

### Output Formats

1. **JSON Manifest**: Complete solution definition
2. **Deployment Plan**: Step-by-step deployment instructions
3. **Database Schema**: SQL or migration files
4. **API Spec**: OpenAPI/Swagger documentation
5. **Frontend Code**: React components

### Integration Points

- CI/CD pipelines
- Version control
- Infrastructure as code
- Container orchestration
- Service mesh

---

**Note**: This architecture is designed for extensibility. New block types, validation rules, and adapters can be added without modifying core logic.