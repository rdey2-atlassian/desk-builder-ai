import { DryRunPlan } from "./plan";

export type DiffType = "added" | "removed" | "changed" | "unchanged";

export interface DiffItem {
  type: DiffType;
  category: keyof DryRunPlan;
  name: string;
  details?: string;
}

export function generateDiff(previous: DryRunPlan | null, current: DryRunPlan): DiffItem[] {
  if (!previous) {
    // Everything is added
    const items: DiffItem[] = [];
    
    Object.entries(current).forEach(([category, arr]) => {
      (arr as any[]).forEach((item: any) => {
        items.push({
          type: "added",
          category: category as keyof DryRunPlan,
          name: item.name || item.entity || "Unknown",
        });
      });
    });
    
    return items;
  }
  
  const items: DiffItem[] = [];
  
  // Compare each category
  (Object.keys(current) as (keyof DryRunPlan)[]).forEach((category) => {
    const prevArr = previous[category] as any[];
    const currArr = current[category] as any[];
    
    const prevNames = new Set(prevArr.map((item: any) => item.name || item.entity || ""));
    const currNames = new Set(currArr.map((item: any) => item.name || item.entity || ""));
    
    // Find added items
    currArr.forEach((item: any) => {
      const name = item.name || item.entity || "Unknown";
      if (!prevNames.has(name)) {
        items.push({
          type: "added",
          category,
          name,
        });
      } else {
        // Check if changed (simplified: just mark as unchanged if name exists)
        items.push({
          type: "unchanged",
          category,
          name,
        });
      }
    });
    
    // Find removed items
    prevArr.forEach((item: any) => {
      const name = item.name || item.entity || "Unknown";
      if (!currNames.has(name)) {
        items.push({
          type: "removed",
          category,
          name,
        });
      }
    });
  });
  
  return items;
}
