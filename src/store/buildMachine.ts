import { create } from "zustand";

type Status = "Planned" | "Linking" | "Configured" | "Ready";
type BlockKey = "portal" | "requestTypes" | "knowledge" | "integrations" | "automations" | "slas" | "team";

type BuildState = {
  status: Record<BlockKey, Status>;
  log: string[];
  startBuild: () => void;
  reset: () => void;
  isReady: () => boolean;
};

const initialStatus: Record<BlockKey, Status> = {
  portal: "Planned",
  requestTypes: "Planned",
  knowledge: "Planned",
  integrations: "Planned",
  automations: "Planned",
  slas: "Planned",
  team: "Planned",
};

export const useBuild = create<BuildState>((set, get) => ({
  status: { ...initialStatus },
  log: [],
  
  startBuild() {
    const order: BlockKey[] = ["portal", "requestTypes", "knowledge", "integrations", "automations", "slas", "team"];
    const lines: Record<BlockKey, string> = {
      portal: "Portal scaffolded for Atlassian Travel Desk; email intake enabled.",
      requestTypes: "Seeded: New Trip, Emergency Travel Help, Visa & Documents…",
      knowledge: "Seeded 10 KB articles; opened International Trip Checklist.",
      integrations: "Okta/Slack/Confluence connected; Concur missing (fallback: email/PDF).",
      automations: "Routing, manager approvals, <48h escalation, P1 paging, policy attachment.",
      slas: "P1 5m/1h; Standard 4h/1d; Visa 8h/5d.",
      team: "Created Travel Desk project with roles Owner/Agent/Viewer.",
    };

    order.forEach((k, i) => {
      setTimeout(() => set((s) => ({ status: { ...s.status, [k]: "Linking" } })), 200 + i * 250);
      setTimeout(() => set((s) => ({ status: { ...s.status, [k]: "Configured" } })), 500 + i * 250);
      setTimeout(() => set((s) => ({ status: { ...s.status, [k]: "Ready" }, log: [...s.log, lines[k]] })), 800 + i * 250);
    });
  },
  
  reset() {
    set({ log: [], status: { ...initialStatus } });
  },
  
  isReady() {
    const s = get().status;
    return Object.values(s).every((v) => v === "Ready");
  },
}));
