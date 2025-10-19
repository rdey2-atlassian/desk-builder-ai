# AI Helpdesk Composer

An enterprise-grade visual composer for building, configuring, and deploying service management solutions. Create complete helpdesk systems with workflows, automations, integrations, and AI capabilities—all through an intuitive drag-and-drop interface.

## 🎯 Overview

The AI Helpdesk Composer is a no-code/low-code platform that enables organizations to rapidly design and deploy custom service management solutions. Whether you're setting up IT operations, HR onboarding, facilities management, or any service desk scenario, this tool provides the building blocks and intelligence to go from concept to production in minutes.

## ✨ Key Features

### Visual Block-Based Composition
- **Drag-and-drop canvas** for building solutions
- **20+ pre-built block types**: Entities, Workflows, Rules, Integrations, AI Agents, and more
- **Real-time validation** with preflight checks
- **Property panels** for detailed configuration

### Solution Templates & Packs
- Pre-built solutions for common scenarios:
  - IT Operations (Incident Management, Change Management)
  - HR Onboarding
  - Facilities Work Orders
  - And more...
- Start from blank or customize templates

### Advanced Workflow Engine
- **State machine workflows** with visual transitions
- **Task graphs** with serial/parallel execution
- **Rule-based automation** with conditions and actions
- **SLA management** and escalations

### Testing & Validation
- **Dry-run simulation** before deployment
- **Synthetic workflow testing** with detailed logs
- **Seed data generation** for demos and testing
- **Diff viewer** to compare configuration changes
- **Adapter validation** for integration configs

### Integration Framework
- **Pre-built adapters** for common tools (Slack, Teams, JIRA, etc.)
- **Custom adapter support** with config validation
- **API endpoints** and webhooks
- **Event-driven architecture**

### AI-Powered Capabilities
- **Smart chat interface** for solution building
- **Natural language to workflow** translation
- **Intelligent field suggestions**
- **Auto-complete and assistance**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm (or bun)
- Git

### Installation

```bash
# Clone the repository
git clone <your-git-url>
cd <project-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### First Steps

1. **Choose a starting point**
   - Select a pre-built template
   - Start from blank canvas
   - Import existing configuration

2. **Build your solution**
   - Drag blocks from the library onto the canvas
   - Connect blocks to create workflows
   - Configure properties in the right panel

3. **Validate and test**
   - Run preflight checks
   - Generate seed data
   - Execute synthetic tests
   - Review dry-run results

4. **Refine configuration**
   - Set up integrations
   - Configure SLAs
   - Define team roles
   - Add knowledge base content

5. **Preview and deploy**
   - Review the compiled solution
   - Download manifest JSON
   - Deploy to production

## 📁 Project Structure

```
├── src/
│   ├── components/          # UI components
│   │   ├── composer/        # Canvas composer & block library
│   │   ├── refine/          # Configuration refinement tabs
│   │   └── ui/              # shadcn/ui components
│   ├── features/            # Feature-specific components
│   │   └── composer/        # Dry-run, seed data, synthetic test panels
│   ├── lib/                 # Core utilities
│   │   ├── compiler/        # Manifest compilation & diff
│   │   ├── manifest/        # Schema & types
│   │   ├── preflight/       # Validation rules
│   │   ├── seed/            # Seed data generator
│   │   └── synthetic/       # Workflow runner
│   ├── data/                # Static data & templates
│   ├── store/               # Zustand state management
│   └── types/               # TypeScript definitions
├── examples/                # Example solution manifests
│   └── packs/               # Pre-built solution packs
├── public/
│   └── data/                # Public static data
└── supabase/                # Backend configuration
```

## 🏗️ Architecture

### Core Concepts

**Blocks**: The fundamental building units of a solution. Each block has:
- Type (entity, workflow, rule, integration, etc.)
- Properties (configurable parameters)
- Connections (relationships to other blocks)

**Manifests**: JSON representation of a complete solution containing:
- Metadata (name, version, etc.)
- Block definitions
- Relationships and configurations

**Stages**: The workflow moves through:
1. **Compose** - Visual block arrangement
2. **Refine** - Detailed configuration
3. **Preview** - Review compiled output
4. **Deploy** - Push to production

### Key Technologies

- **React 18** with TypeScript
- **Vite** for blazing-fast builds
- **Tailwind CSS** + shadcn/ui for design system
- **@dnd-kit** for drag-and-drop
- **Zustand** for state management
- **React Router** for navigation
- **Zod** for schema validation
- **Supabase** for backend (optional)

## 🧪 Testing Features

### Preflight Validation
Automatically checks your solution for:
- Block connectivity issues
- Invalid field types
- PII detection in fields
- Adapter configuration problems
- Workflow state uniqueness
- Task graph validation

### Seed Data Generator
Generate realistic test data for all entities:
```typescript
// Generates N records per entity with proper field types
generateSeedData(manifest, recordsPerEntity)
```

### Synthetic Workflow Runner
Simulate workflow execution:
```typescript
// Executes workflow logic and returns detailed logs
runSyntheticWorkflow(manifest, workflowId, ticketData)
```

### Dry-Run Diff
Compare configuration changes before applying:
- Side-by-side diff viewer
- Added/removed/modified blocks
- Visual highlighting

## 📦 Block Types Reference

| Block Type | Purpose | Key Properties |
|------------|---------|----------------|
| `entity` | Data models | fields, relationships |
| `workflow` | State machines | states, transitions |
| `rule` | Automation | conditions, actions |
| `catalog_item` | Service catalog | form, fulfillment |
| `task_graph` | Task automation | tasks, dependencies |
| `integration` | External systems | adapter, config |
| `adapter` | Integration logic | required config keys |
| `ai_agent` | AI capabilities | model, instructions |
| `sla` | Service levels | target time, escalations |
| `security` | Access control | visibility, permissions |
| `knowledge` | KB articles | content, categories |
| `portal` | Self-service UI | pages, widgets |
| `team_role` | RBAC | permissions, members |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed block specifications.

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode

# Linting
npm run lint         # Check code quality
```

### Adding New Block Types

1. Define type in `src/lib/manifest/types.ts`
2. Add schema in `src/lib/manifest/schema.ts`
3. Create block definition in `src/data/blockDefinitions.ts`
4. Add rendering in `src/components/composer/BlockNode.tsx`
5. Add property panel in `src/components/composer/PropertiesPanel.tsx`

### Extending Validation Rules

Add custom rules in `src/lib/preflight/preflight.ts`:

```typescript
{
  id: "my-rule",
  level: "error",
  message: "My validation message",
  check: (manifest) => {
    // Return true if rule passes
    return isValid(manifest);
  }
}
```

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design and block specifications
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [docs/FEATURES.md](./docs/FEATURES.md) - Detailed feature documentation

## 🎯 Use Cases

### IT Operations
- Incident management workflows
- Change request processes
- Problem tracking
- Service catalogs
- On-call schedules

### HR & Onboarding
- New hire workflows
- Equipment provisioning
- Access requests
- Training programs
- Offboarding processes

### Facilities Management
- Work order routing
- Asset tracking
- Maintenance schedules
- Space requests
- Vendor management

## 🔐 Security

- Row-level security for multi-tenant data
- PII detection and warnings
- Field-level encryption support
- Audit logging
- RBAC and team roles

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## 📄 License

This project is part of Lovable (https://lovable.dev)

## 🆘 Support

- **Lovable Project**: https://lovable.dev/projects/43b64952-bcad-4703-8acf-bf360d691f58
- **Documentation**: https://docs.lovable.dev
- **Discord**: https://discord.com/channels/1119885301872070706

## 🎉 Deployment

### Via Lovable Platform
Simply open your project in Lovable and click **Share → Publish**

### Custom Domain
Navigate to **Project > Settings > Domains** and click **Connect Domain**

### Self-Hosting
The generated code is standard React/Vite and can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Any static hosting service

```bash
npm run build
# Deploy the dist/ folder
```

---

**Built with ❤️ using Lovable**