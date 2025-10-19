import { describe, it, expect, beforeEach } from "vitest";
import { useManifestStore } from "../manifestStore";

describe("manifestStore", () => {
  beforeEach(() => {
    useManifestStore.getState().clearManifest();
  });

  it("should initialize with null manifest", () => {
    const { manifest } = useManifestStore.getState();
    expect(manifest).toBeNull();
  });

  it("should add block and mark dirty", () => {
    const block = {
      id: "e1",
      type: "entity" as const,
      name: "Employee",
      fields: [],
    };
    
    useManifestStore.getState().addBlock(block);
    
    const { manifest, dirty } = useManifestStore.getState();
    expect(manifest?.blocks).toHaveLength(1);
    expect(dirty).toBe(true);
  });

  it("should update block", () => {
    const block = {
      id: "e1",
      type: "entity" as const,
      name: "Employee",
      fields: [],
    };
    
    useManifestStore.getState().addBlock(block);
    useManifestStore.getState().updateBlock("e1", { name: "Person" });
    
    const { manifest } = useManifestStore.getState();
    expect(manifest?.blocks[0].name).toBe("Person");
  });

  it("should remove block and clear selection", () => {
    const block = {
      id: "e1",
      type: "entity" as const,
      name: "Employee",
      fields: [],
    };
    
    useManifestStore.getState().addBlock(block);
    useManifestStore.getState().setSelectedBlock("e1");
    useManifestStore.getState().removeBlock("e1");
    
    const { manifest, selectedBlockId } = useManifestStore.getState();
    expect(manifest?.blocks).toHaveLength(0);
    expect(selectedBlockId).toBeNull();
  });

  it("should reorder blocks", () => {
    const block1 = { id: "e1", type: "entity" as const, name: "A", fields: [] };
    const block2 = { id: "e2", type: "entity" as const, name: "B", fields: [] };
    
    useManifestStore.getState().addBlock(block1);
    useManifestStore.getState().addBlock(block2);
    useManifestStore.getState().reorderBlocks(0, 1);
    
    const { manifest } = useManifestStore.getState();
    expect(manifest?.blocks[0].id).toBe("e2");
    expect(manifest?.blocks[1].id).toBe("e1");
  });
});
