import { describe, it, expect } from "vitest";
import { validateManifest } from "../schema";

describe("validateManifest", () => {
  it("should accept valid minimal manifest", () => {
    const manifest = {
      version: "0.1",
      name: "Test Solution",
      blocks: [],
    };
    
    const result = validateManifest(manifest);
    expect(result.ok).toBe(true);
  });

  it("should reject manifest with missing name", () => {
    const manifest = {
      version: "0.1",
      blocks: [],
    };
    
    const result = validateManifest(manifest);
    expect(result.ok).toBe(false);
    if (result.ok === false) {
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].path).toContain("name");
    }
  });

  it("should reject workflow with less than 2 states", () => {
    const manifest = {
      version: "0.1",
      name: "Test",
      blocks: [
        {
          id: "wf1",
          type: "workflow",
          name: "Test Workflow",
          states: ["Draft"],
          transitions: [],
        },
      ],
    };
    
    const result = validateManifest(manifest);
    expect(result.ok).toBe(false);
  });

  it("should reject entity with invalid field type", () => {
    const manifest = {
      version: "0.1",
      name: "Test",
      blocks: [
        {
          id: "e1",
          type: "entity",
          name: "Employee",
          fields: [
            { name: "id", type: "invalid" },
          ],
        },
      ],
    };
    
    const result = validateManifest(manifest);
    expect(result.ok).toBe(false);
  });
});
