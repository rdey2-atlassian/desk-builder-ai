import { SolutionManifest } from "@/lib/manifest/types";
import { validateManifest } from "@/lib/manifest/schema";
import { ExampleId } from "./index";

export async function loadExample(id: ExampleId): Promise<SolutionManifest> {
  const response = await fetch(`/examples/${id}.json`);
  
  if (!response.ok) {
    throw new Error(`Failed to load example: ${id}`);
  }
  
  const json = await response.json();
  const result = validateManifest(json);
  
  if (result.ok === false) {
    console.error("Validation issues:", result.issues);
    throw new Error("Example failed validation");
  }
  
  return result.data as SolutionManifest;
}
