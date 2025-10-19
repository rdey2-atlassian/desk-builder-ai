import { create } from "zustand";
import { DryRunPlan } from "@/lib/compiler/plan";

interface DryRunStore {
  previousPlan: DryRunPlan | null;
  currentPlan: DryRunPlan | null;
  
  setPreviousPlan: (plan: DryRunPlan | null) => void;
  setCurrentPlan: (plan: DryRunPlan) => void;
}

export const useDryRunStore = create<DryRunStore>((set) => ({
  previousPlan: null,
  currentPlan: null,
  
  setPreviousPlan: (plan) => set({ previousPlan: plan }),
  
  setCurrentPlan: (plan) => set((state) => ({
    previousPlan: state.currentPlan,
    currentPlan: plan,
  })),
}));
