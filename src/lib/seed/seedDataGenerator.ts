import { SolutionManifest, EntityBlock } from "@/lib/manifest/types";

export interface SeedDataOutput {
  [entityName: string]: any[];
}

export function generateSeedData(manifest: SolutionManifest, recordsPerEntity: number = 3): SeedDataOutput {
  const entities = manifest.blocks.filter((b): b is EntityBlock => b.type === "entity");
  const seedData: SeedDataOutput = {};
  
  entities.forEach((entity) => {
    const records: any[] = [];
    
    for (let i = 0; i < recordsPerEntity; i++) {
      const record: any = {};
      
      entity.fields.forEach((field) => {
        switch (field.type) {
          case "string":
            if (field.name.toLowerCase().includes("email")) {
              record[field.name] = `user${i + 1}@example.com`;
            } else if (field.name.toLowerCase().includes("id")) {
              record[field.name] = `${entity.name.toLowerCase()}-${i + 1}`;
            } else {
              record[field.name] = `${field.name} ${i + 1}`;
            }
            break;
            
          case "number":
            record[field.name] = (i + 1) * 100;
            break;
            
          case "boolean":
            record[field.name] = i % 2 === 0;
            break;
            
          case "date":
            const date = new Date();
            date.setDate(date.getDate() + i);
            record[field.name] = date.toISOString().split("T")[0];
            break;
            
          case "enum":
            if (field.enumOptions && field.enumOptions.length > 0) {
              record[field.name] = field.enumOptions[i % field.enumOptions.length];
            }
            break;
            
          case "ref":
            // Simple reference - just use index
            if (field.ref?.entity) {
              record[field.name] = `${field.ref.entity.toLowerCase()}-${(i % recordsPerEntity) + 1}`;
            }
            break;
        }
      });
      
      records.push(record);
    }
    
    seedData[entity.name] = records;
  });
  
  return seedData;
}
