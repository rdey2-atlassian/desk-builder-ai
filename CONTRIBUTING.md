# Contributing Guide

Thank you for your interest in contributing to the AI Helpdesk Composer! This guide will help you get started with development.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm or bun package manager
- Git
- Code editor (VS Code recommended)

### Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:8080` with hot reload enabled.

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript + JavaScript
- GitLens

## 📦 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── composer/       # Canvas & block components
│   ├── refine/         # Configuration tabs
│   └── ui/             # shadcn/ui base components
├── features/           # Feature-specific modules
│   └── composer/       # Advanced composer features
├── lib/                # Core utilities & logic
│   ├── compiler/       # Manifest compilation
│   ├── manifest/       # Schema & types
│   ├── preflight/      # Validation engine
│   ├── seed/           # Test data generation
│   └── synthetic/      # Workflow simulation
├── data/               # Static data & templates
├── store/              # State management (Zustand)
├── types/              # TypeScript definitions
└── pages/              # Route components
```

## 🎨 Design System

### Semantic Tokens

**Always use semantic tokens from the design system:**

```tsx
// ❌ DON'T use direct colors
<div className="bg-blue-500 text-white">

// ✅ DO use semantic tokens
<div className="bg-primary text-primary-foreground">
```

### Available Tokens

Colors are defined in `src/index.css`:
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--accent` / `--accent-foreground`
- `--muted` / `--muted-foreground`
- `--destructive` / `--destructive-foreground`
- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--border`

### Component Patterns

Use shadcn/ui components as base:
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

## 🏗️ Architecture Patterns

### State Management

**Use Zustand for global state:**

```typescript
// store/myStore.ts
import { create } from 'zustand';

interface MyStore {
  data: string;
  setData: (data: string) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  data: '',
  setData: (data) => set({ data }),
}));

// In component
import { useMyStore } from '@/store/myStore';

const MyComponent = () => {
  const { data, setData } = useMyStore();
  // ...
};
```

**Use React state for local component state:**
```tsx
const [isOpen, setIsOpen] = useState(false);
```

### TypeScript

**Always define types:**
```typescript
// types/myFeature.ts
export interface MyData {
  id: string;
  name: string;
  optional?: string;
}

// Use in component
const MyComponent = ({ data }: { data: MyData }) => {
  // ...
};
```

**Use type guards:**
```typescript
function isEntityBlock(block: Block): block is EntityBlock {
  return block.type === "entity";
}

const entities = blocks.filter(isEntityBlock);
```

### Component Structure

**Functional components with TypeScript:**
```tsx
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    onAction?.();
  };
  
  // Render
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
}
```

## 🧪 Testing

### Unit Tests

```typescript
// __tests__/myFeature.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFeature';

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction('input')).toBe('output');
  });
});
```

Run tests:
```bash
npm run test           # Run once
npm run test:watch     # Watch mode
```

### Manual Testing Checklist

When adding features:
- [ ] Test happy path
- [ ] Test edge cases
- [ ] Test error handling
- [ ] Test validation
- [ ] Test accessibility
- [ ] Test responsive design
- [ ] Test dark mode

## 🎯 Adding New Features

### 1. New Block Type

**Step 1: Define Type**
```typescript
// src/lib/manifest/types.ts
export interface MyNewBlock extends BaseBlock {
  type: "my_new_block";
  customProperty: string;
}

export type Block = EntityBlock | WorkflowBlock | MyNewBlock | ...;
```

**Step 2: Add Schema**
```typescript
// src/lib/manifest/schema.ts
const myNewBlockSchema = baseBlockSchema.extend({
  type: z.literal("my_new_block"),
  customProperty: z.string(),
});

export const blockSchema = z.union([
  entityBlockSchema,
  workflowBlockSchema,
  myNewBlockSchema,
  // ...
]);
```

**Step 3: Register Definition**
```typescript
// src/data/blockDefinitions.ts
import { MyIcon } from "lucide-react";

export const blockDefinitions: BlockDefinition[] = [
  // ... existing blocks
  {
    type: "my_new_block",
    label: "My New Block",
    description: "Does something awesome",
    icon: MyIcon,
    color: "bg-purple-100 dark:bg-purple-900",
    category: "automation",
    defaultProperties: {
      customProperty: "default value",
    },
  },
];
```

**Step 4: Add Rendering**
```typescript
// src/components/composer/BlockNode.tsx
function getBlockColor(type: string): string {
  const colors = {
    // ... existing
    my_new_block: "border-purple-300 bg-purple-50 dark:bg-purple-950",
  };
  return colors[type] || "border-gray-300";
}
```

**Step 5: Add Property Panel**
```typescript
// src/components/composer/PropertiesPanel.tsx
function renderProperties(block: Block) {
  if (block.type === "my_new_block") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Custom Property</Label>
          <Input
            value={block.customProperty}
            onChange={(e) => handleUpdate("customProperty", e.target.value)}
          />
        </div>
      </div>
    );
  }
  // ... other types
}
```

### 2. New Validation Rule

```typescript
// src/lib/preflight/preflight.ts
export const preflightRules: PreflightRule[] = [
  // ... existing rules
  {
    id: "my-new-rule",
    level: "warn",
    message: "My validation message",
    details: "Detailed explanation of the issue and how to fix it.",
    check: (manifest: SolutionManifest) => {
      // Return true if valid, false if invalid
      return manifest.blocks.every(block => {
        // Your validation logic
        return isValid(block);
      });
    },
  },
];
```

### 3. New Adapter

```typescript
// Create adapter definition
const myAdapter: AdapterBlock = {
  type: "adapter",
  id: "my-service",
  name: "My Service",
  description: "Integration with My Service",
  requiredConfigKeys: ["apiKey", "endpoint", "region"],
};

// Add to examples or allow users to create
```

## 🎨 Styling Guidelines

### Tailwind CSS

**Use utility classes:**
```tsx
<div className="flex items-center gap-4 p-6 rounded-lg border">
```

**Responsive design:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

**Dark mode:**
```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

### Animations

Use defined transitions:
```tsx
<div className="transition-smooth hover:scale-105">
```

Custom animations in `index.css`:
```css
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 📝 Code Style

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Utilities**: camelCase (`myUtil.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Types**: PascalCase (`MyType`)
- **Interfaces**: PascalCase (`MyInterface`)

### File Organization

```typescript
// 1. Imports - external first, then internal
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { myUtil } from '@/lib/utils';

// 2. Types & Interfaces
interface Props {
  // ...
}

// 3. Constants
const DEFAULT_VALUE = 'foo';

// 4. Component
export function MyComponent({ prop }: Props) {
  // ...
}

// 5. Helper functions (if needed)
function helperFunction() {
  // ...
}
```

### Comments

**Use JSDoc for functions:**
```typescript
/**
 * Generates seed data for all entities in the manifest
 * @param manifest - The solution manifest
 * @param recordsPerEntity - Number of records to generate per entity
 * @returns Object with entity names as keys and record arrays as values
 */
export function generateSeedData(
  manifest: SolutionManifest,
  recordsPerEntity: number = 3
): SeedDataOutput {
  // ...
}
```

**Inline comments for complex logic:**
```typescript
// Check if block is orphaned (no connections)
const isOrphaned = !connections.some(c => c.targetId === block.id);
```

## 🔍 Code Review Guidelines

When reviewing PRs:

- [ ] Code follows style guide
- [ ] Types are properly defined
- [ ] No console.log statements
- [ ] Semantic tokens used (no direct colors)
- [ ] Components are properly structured
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
- [ ] Accessibility considered
- [ ] Performance implications considered

## 🐛 Debugging

### Development Tools

**React DevTools:**
- Install browser extension
- Inspect component tree
- Profile performance

**Console Debugging:**
```typescript
// Use during development, remove before commit
console.log('Debug:', data);
```

**Zustand DevTools:**
```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools((set) => ({
    // ...
  }))
);
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zustand Guide](https://docs.pmnd.rs/zustand)

### Internal Docs
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [docs/FEATURES.md](./docs/FEATURES.md) - Feature documentation

## 🤝 Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make changes**
   - Follow coding standards
   - Add tests
   - Update documentation

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new block type for XYZ"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Formatting
   - `refactor:` - Code restructuring
   - `test:` - Tests
   - `chore:` - Maintenance

4. **Push and create PR**
   ```bash
   git push origin feature/my-new-feature
   ```

5. **PR template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   Describe testing done
   
   ## Screenshots (if applicable)
   ```

## 🙋 Getting Help

- Check [ARCHITECTURE.md](./ARCHITECTURE.md)
- Review existing code for patterns
- Ask questions in pull requests
- Join the Lovable Discord community

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Happy coding! 🚀**
