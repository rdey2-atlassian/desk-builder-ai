# Features Documentation

Comprehensive guide to all features in the AI Helpdesk Composer.

## Table of Contents

- [Visual Canvas Composer](#visual-canvas-composer)
- [Block Library](#block-library)
- [Solution Templates](#solution-templates)
- [Property Editor](#property-editor)
- [Validation Engine](#validation-engine)
- [Dry-Run Simulation](#dry-run-simulation)
- [Seed Data Generator](#seed-data-generator)
- [Synthetic Testing](#synthetic-testing)
- [Diff Viewer](#diff-viewer)
- [Configuration Refinement](#configuration-refinement)
- [Import/Export](#importexport)
- [Keyboard Shortcuts](#keyboard-shortcuts)

---

## Visual Canvas Composer

### Overview
The canvas composer is the main interface for building solutions. It provides a drag-and-drop environment where you can visually compose your service management solution.

### Features

**Drag-and-Drop**
- Drag blocks from the library onto the canvas
- Arrange blocks spatially
- Connect blocks to show relationships
- Pan and zoom the canvas

**Block Management**
- Add blocks from the library
- Delete blocks (with confirmation)
- Duplicate blocks
- Select multiple blocks

**Visual Feedback**
- Block colors by type
- Connection lines
- Validation indicators
- Hover states

### Usage

1. **Adding Blocks**
   - Open block library (left sidebar)
   - Drag desired block type onto canvas
   - Block appears with default properties

2. **Connecting Blocks**
   - Visual connections show relationships
   - Workflow transitions appear as arrows
   - Entity relationships indicated by lines

3. **Organizing**
   - Drag blocks to arrange
   - Use grid snapping for alignment
   - Group related blocks together

---

## Block Library

### Overview
The block library contains all available block types organized by category.

### Categories

**Data Models**
- Entity - Data structures and fields
- Relationship - Connections between entities

**Automation**
- Workflow - State machines
- Rule - Conditional automation
- Task Graph - Complex task orchestration

**Integration**
- Adapter - Integration templates
- Integration - Adapter instances
- API Endpoint - Custom endpoints

**Service Management**
- Catalog Item - Service catalog entries
- SLA - Service level agreements
- Knowledge - Documentation articles

**Access & Security**
- Team Role - RBAC roles
- Security - Access control

**User Interface**
- Portal - Self-service portals
- Form - Custom forms

**AI & Intelligence**
- AI Agent - AI assistants

### Block Properties

Each block type has:
- **Icon**: Visual identifier
- **Color**: Category coding
- **Description**: Purpose explanation
- **Default Properties**: Starting values
- **Required Fields**: Must be configured

---

## Solution Templates

### Overview
Pre-built solutions for common use cases that can be customized.

### Available Templates

**Blank Canvas**
- Start from scratch
- Maximum flexibility
- Build exactly what you need

**IT Operations**
- Incident management workflow
- Change management process
- Problem tracking
- Service catalog

**HR Onboarding**
- New hire workflows
- Equipment provisioning
- Access requests
- Training schedules

**Facilities Management**
- Work order routing
- Asset tracking
- Maintenance schedules
- Space requests

### Using Templates

1. Select template on landing page
2. Template loads with pre-configured blocks
3. Customize blocks to your needs
4. Add/remove blocks as needed
5. Configure integrations

---

## Property Editor

### Overview
The property editor (right sidebar) allows detailed configuration of selected blocks.

### Features

**Type-Specific Editors**
- String fields: Text input
- Numbers: Number input
- Booleans: Toggle switches
- Enums: Dropdown selects
- References: Entity picker
- Arrays: Dynamic lists

**Validation**
- Real-time field validation
- Required field indicators
- Format validation
- Relationship validation

**Advanced Configuration**
- Nested objects
- Array management
- Conditional fields
- Default values

### Editing Workflows

**Entity Fields**
```
1. Select entity block
2. Click "Add Field"
3. Configure:
   - Field name
   - Field type
   - Required flag
   - Unique flag
   - Enum options (if enum)
   - Reference target (if ref)
```

**Workflow Transitions**
```
1. Select workflow block
2. Define states (comma-separated)
3. Add transitions:
   - From state
   - To state
   - Label (optional)
```

**Rule Configuration**
```
1. Select rule block
2. Add conditions (WHEN):
   - Field name
   - Operator
   - Value
3. Add actions (THEN):
   - Action type
   - Parameters
```

**Catalog Item Forms**
```
1. Select catalog item
2. Add form sections
3. Add fields to sections:
   - Field name
   - Field type
   - Label
   - Required flag
   - Options (if select/radio)
```

**Task Graphs**
```
1. Select task graph block
2. Add tasks:
   - Task name
   - Type (manual or adapterAction)
   - Adapter (if adapterAction)
   - Action (if adapterAction)
   - Parallel group (for concurrent tasks)
   - Description
```

---

## Validation Engine

### Overview
Automatic validation ensures your solution is complete and correct before deployment.

### Preflight Rules

**1. Block Connectivity** (Error)
- Checks for orphaned blocks
- Ensures all blocks are connected
- Validates relationships

**2. Invalid Field Types** (Error)
- Validates field type definitions
- Checks enum options
- Validates reference targets

**3. PII Detection** (Warning)
- Flags potential PII fields
- Patterns: email, ssn, phone, address
- Privacy compliance helper

**4. Adapter Validation** (Error)
- Checks required config keys
- Validates integration configs
- Ensures adapter references exist

**5. Workflow State Uniqueness** (Error)
- Ensures no duplicate states
- Validates state names
- Checks transitions

**6. Task Graph Validation** (Error)
- Validates adapter references
- Checks task dependencies
- Ensures valid action types

### Using Validation

**Manual Validation**
- Click "Preflight Check" button
- View results in sidebar
- Click issues to navigate to problem blocks

**Automatic Validation**
- Runs on major changes
- Shows badge with issue count
- Color-coded by severity:
  - Red: Errors (must fix)
  - Yellow: Warnings (should review)
  - Blue: Info (optional)

**Fixing Issues**
1. Open preflight sidebar
2. Click on issue
3. Navigate to problematic block
4. Fix in property editor
5. Re-run validation

---

## Dry-Run Simulation

### Overview
Simulate deployment without actually deploying to see what changes will be made.

### Features

**Plan Generation**
- Database schema changes
- API endpoint creation
- Configuration updates
- Integration setup

**Change Preview**
- View all changes before applying
- Understand impact
- Catch potential issues

**Rollback Information**
- Shows how to undo changes
- Safety net for mistakes

### Using Dry-Run

1. Click "Dry Run" button
2. System generates deployment plan
3. Review planned changes:
   - Tables to create
   - Migrations to run
   - Endpoints to generate
   - Configs to update
4. Click "View Diff" to compare with previous
5. Make adjustments if needed
6. Run again to verify

---

## Seed Data Generator

### Overview
Automatically generate realistic test data for all entities in your solution.

### Features

**Smart Data Generation**
- Detects field types automatically
- Generates appropriate data:
  - Emails: `user1@example.com`
  - IDs: `entity-1`
  - Names: Realistic names
  - Numbers: Sequential values
  - Booleans: Alternating true/false
  - Dates: Sequential dates
  - Enums: Cycles through options
  - References: Valid foreign keys

**Configurable Volume**
- Set records per entity (1-10)
- Calculates total records
- Preview before generating

**Export Options**
- JSON format
- Includes all entities
- Nested relationships

### Using Seed Data Generator

1. Click "Seed Data" button in toolbar
2. Configure:
   - Records per entity (default: 3)
3. Click "Generate Seed Data"
4. Review generated data in preview
5. Click "Download" to export JSON
6. Use in testing or demos

**Generated Data Structure**
```json
{
  "Entity1": [
    { "id": "entity1-1", "name": "Name 1", ... },
    { "id": "entity1-2", "name": "Name 2", ... }
  ],
  "Entity2": [
    { "id": "entity2-1", "ref": "entity1-1", ... }
  ]
}
```

---

## Synthetic Testing

### Overview
Simulate workflow execution to test your automation logic before deployment.

### Features

**Workflow Simulation**
- Executes workflow state transitions
- Fires rules based on conditions
- Logs all steps
- Shows timing information

**Detailed Logs**
- Step-by-step execution
- State transitions
- Rule triggers
- Action execution
- Timestamps

**Test Data Input**
- Provide sample ticket/record data
- Trigger specific conditions
- Test edge cases

### Using Synthetic Testing

1. Click "Synthetic Test" button
2. Select workflow to test
3. Configure test data (JSON format):
```json
{
  "priority": "high",
  "category": "incident",
  "assignee": "user-1"
}
```
4. Click "Run Test"
5. Review execution log:
   - Initial state
   - Transitions taken
   - Rules fired
   - Actions executed
   - Final state
6. Verify expected behavior
7. Adjust workflow/rules if needed

**Log Format**
```
[2024-01-15 10:30:00] Workflow started in state: new
[2024-01-15 10:30:01] Rule triggered: high-priority-alert
[2024-01-15 10:30:02] Action executed: send_notification
[2024-01-15 10:30:03] Transitioned: new → assigned
[2024-01-15 10:30:05] Workflow completed
```

---

## Diff Viewer

### Overview
Compare changes between dry-run versions to understand what modified.

### Features

**Side-by-Side Comparison**
- Previous version on left
- Current version on right
- Visual indicators:
  - Green: Added
  - Red: Removed
  - Yellow: Modified

**Block-Level Diff**
- Shows added blocks
- Shows removed blocks
- Shows modified properties
- Hierarchical view

**Property-Level Detail**
- Field-by-field comparison
- Highlights specific changes
- Shows old vs new values

### Using Diff Viewer

1. Run dry-run at least twice
2. Click "View Diff" button
3. Review changes:
   - Scroll through diff
   - Expand sections
   - Review modifications
4. Understand impact
5. Make adjustments
6. Run dry-run again

---

## Configuration Refinement

### Overview
After composing blocks, refine detailed configuration in specialized tabs.

### Tabs

**Request Types**
- Service catalog configuration
- Request forms
- Approval workflows
- Fulfillment automation

**Automations**
- Rule refinement
- Action configuration
- Condition tuning
- Workflow adjustments

**Integrations**
- Adapter configuration
- API credentials
- Webhook setup
- Test connections

**Knowledge Base**
- Article management
- Categories
- Search configuration
- Permissions

**SLAs**
- Target times
- Escalation policies
- Business hours
- Breach actions

**Team & Roles**
- Role definitions
- Permission assignment
- Team member mapping
- Access control

**Portal**
- UI customization
- Page configuration
- Widget placement
- Branding

### Workflow

1. Complete block composition
2. Click "Continue to Refine"
3. Go through each tab
4. Configure details
5. Save changes
6. Preview solution

---

## Import/Export

### Overview
Load existing solutions or export your work.

### Features

**Load Solution**
- Load pre-built packs
- Import custom solutions
- Merge with current work
- Replace entire solution

**Export Solution**
- Download as JSON
- Include all blocks
- Include configurations
- Version metadata

**Solution Packs**
- HR Onboarding v1
- Facilities Work Orders
- IT Operations
- Custom packs

### Using Import/Export

**Loading a Solution**
1. Click "Load Solution" button
2. Choose source:
   - Pre-built pack
   - Upload JSON file
3. Review solution preview
4. Click "Load"
5. Solution appears on canvas

**Exporting**
1. Complete your solution
2. Click "Export" (or Cmd/Ctrl+S)
3. File downloads as:
   `{solution-name}-manifest.json`
4. Share or version control

**JSON Format**
```json
{
  "version": "1.0",
  "name": "My Solution",
  "description": "...",
  "blocks": [ /* ... */ ],
  "metadata": { /* ... */ }
}
```

---

## Keyboard Shortcuts

### Overview
Speed up your workflow with keyboard shortcuts.

### Available Shortcuts

**Canvas**
- `Cmd/Ctrl + Z`: Undo
- `Cmd/Ctrl + Y`: Redo
- `Delete`: Delete selected block
- `Cmd/Ctrl + D`: Duplicate selected block
- `Cmd/Ctrl + A`: Select all blocks

**File Operations**
- `Cmd/Ctrl + S`: Export solution
- `Cmd/Ctrl + O`: Load solution

**Navigation**
- `Cmd/Ctrl + K`: Command palette (coming soon)
- `Escape`: Deselect all / Close panels

**View**
- `Cmd/Ctrl + +`: Zoom in
- `Cmd/Ctrl + -`: Zoom out
- `Cmd/Ctrl + 0`: Reset zoom

### Tips

- Hold `Space` + drag to pan canvas
- `Shift` + click for multi-select
- `Alt` + drag to duplicate while dragging

---

## Tips & Best Practices

### Composition

✅ **Do:**
- Start with entities, then build workflows
- Group related blocks visually
- Use meaningful names
- Add descriptions to complex blocks

❌ **Don't:**
- Create orphaned blocks
- Use generic names like "Block1"
- Skip validation
- Overload single workflows

### Validation

✅ **Do:**
- Run preflight checks frequently
- Fix errors before warnings
- Review PII warnings carefully
- Test with synthetic data

❌ **Don't:**
- Ignore validation errors
- Deploy without checking
- Skip testing
- Assume everything works

### Testing

✅ **Do:**
- Generate seed data for demos
- Test workflows synthetically
- Try edge cases
- Review execution logs

❌ **Don't:**
- Test in production first
- Skip dry-runs
- Assume happy path only
- Ignore test failures

### Performance

✅ **Do:**
- Keep solutions focused
- Use adapters for integrations
- Optimize workflows
- Archive unused blocks

❌ **Don't:**
- Create 100+ block solutions
- Inline all logic
- Create circular dependencies
- Leave test blocks in production

---

**For more information, see:**
- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Technical details
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development guide