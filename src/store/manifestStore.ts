import { create } from "zustand";
import { SolutionManifest, Block } from "@/lib/manifest/types";

interface ManifestStore {
  manifest: SolutionManifest | null;
  dirty: boolean;
  selectedBlockId: string | null;
  
  // Actions
  setManifest: (manifest: SolutionManifest) => void;
  updateBlock: (id: string, patch: Partial<Block>) => void;
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  markDirty: (dirty: boolean) => void;
  setSelectedBlock: (id: string | null) => void;
  clearManifest: () => void;
}

export const useManifestStore = create<ManifestStore>((set) => ({
  manifest: null,
  dirty: false,
  selectedBlockId: null,

  setManifest: (manifest) => set({ manifest, dirty: false }),

  updateBlock: (id, patch) =>
    set((state) => {
      if (!state.manifest) return {};
      
      const blocks = state.manifest.blocks.map((block) =>
        block.id === id ? { ...block, ...patch } as Block : block
      );
      
      return {
        manifest: { ...state.manifest, blocks },
        dirty: true,
      };
    }),

  addBlock: (block) =>
    set((state) => {
      if (!state.manifest) {
        return {
          manifest: {
            version: "0.1",
            name: "New Solution",
            blocks: [block],
          },
          dirty: true,
        } as Partial<ManifestStore>;
      }
      
      return {
        manifest: {
          ...state.manifest,
          blocks: [...state.manifest.blocks, block],
        },
        dirty: true,
      } as Partial<ManifestStore>;
    }),

  removeBlock: (id) =>
    set((state) => {
      if (!state.manifest) return {};
      
      return {
        manifest: {
          ...state.manifest,
          blocks: state.manifest.blocks.filter((b) => b.id !== id),
        },
        dirty: true,
        selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      };
    }),

  reorderBlocks: (fromIndex, toIndex) =>
    set((state) => {
      if (!state.manifest) return {};
      
      const blocks = [...state.manifest.blocks];
      const [removed] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, removed);
      
      return {
        manifest: { ...state.manifest, blocks },
        dirty: true,
      };
    }),

  markDirty: (dirty) => set({ dirty }),

  setSelectedBlock: (id) => set({ selectedBlockId: id }),

  clearManifest: () => set({ manifest: null, dirty: false, selectedBlockId: null }),
}));
