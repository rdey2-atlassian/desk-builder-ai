import JSZip from "jszip";
import { BlockInstance } from "@/types/blocks";

export interface ManifestMeta {
  name: string;
  description?: string;
  created?: string;
  author?: string;
}

export interface CompiledManifest {
  $version: string;
  templateId?: string;
  metadata: ManifestMeta;
  blocks: Array<{
    id: string;
    type: string;
    name: string;
    parameters: Record<string, any>;
    position?: { x: number; y: number };
  }>;
}

export interface PreflightIssue {
  severity: "error" | "warning" | "info";
  message: string;
  blockId?: string;
  details?: Record<string, any>;
}

export function compileManifest({
  templateId,
  name,
  description,
  blocks,
}: {
  templateId?: string;
  name: string;
  description?: string;
  blocks: BlockInstance[];
}): CompiledManifest {
  return {
    $version: "0.1",
    templateId,
    metadata: {
      name,
      description,
      created: new Date().toISOString(),
      author: "Composer User",
    },
    blocks: blocks.map((b) => ({
      id: b.id,
      type: b.type,
      name: b.name,
      parameters: b.parameters,
      position: b.position,
    })),
  };
}

export function runPreflight(blocks: BlockInstance[]): PreflightIssue[] {
  const issues: PreflightIssue[] = [];

  // Workflow must have states & transitions
  blocks
    .filter((b) => b.type === "workflow")
    .forEach((b) => {
      const states = safeJsonArray(b.parameters.states);
      const transitions = safeJsonArray(b.parameters.transitions);
      if (!states.length) {
        issues.push({ severity: "error", message: "Workflow is missing states", blockId: b.id });
      }
      if (!transitions.length) {
        issues.push({ severity: "warning", message: "Workflow has no transitions", blockId: b.id });
      }
    });

  // Entity should declare fields
  blocks
    .filter((b) => b.type === "entity")
    .forEach((b) => {
      const fields = safeJsonArray(b.parameters.fields);
      if (!fields.length) {
        issues.push({ severity: "warning", message: "Entity has no fields defined", blockId: b.id });
      }
    });

  // Adapters should have credentials/provider
  const adapterTypes = [
    "adapter_identity",
    "adapter_hris",
    "adapter_mdm",
    "adapter_esign",
    "adapter_cmms",
    "adapter_generic",
  ];
  blocks
    .filter((b) => adapterTypes.includes(b.type))
    .forEach((b) => {
      if (!b.parameters.credentials) {
        issues.push({ severity: "warning", message: "Adapter has no credentials configured", blockId: b.id });
      }
      if (b.type !== "adapter_generic" && !b.parameters.provider) {
        issues.push({ severity: "info", message: "Adapter provider not set", blockId: b.id });
      }
    });

  return issues;
}

function safeJsonArray(value: any): any[] {
  if (!value) return [];
  try {
    if (Array.isArray(value)) return value;
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function buildArtifactsZip({
  manifest,
  issues,
}: {
  manifest: CompiledManifest;
  issues: PreflightIssue[];
}): Promise<Blob> {
  const zip = new JSZip();
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  const compiled = {
    plan: manifest.blocks.map((b) => ({ id: b.id, type: b.type, name: b.name })),
    summary: `${manifest.blocks.length} resources to create` ,
  };
  zip.file("compiled.json", JSON.stringify(compiled, null, 2));

  const preflight = {
    errors: issues.filter((i) => i.severity === "error"),
    warnings: issues.filter((i) => i.severity === "warning"),
    info: issues.filter((i) => i.severity === "info"),
    total: issues.length,
  };
  zip.file("preflight-report.json", JSON.stringify(preflight, null, 2));

  return await zip.generateAsync({ type: "blob" });
}
