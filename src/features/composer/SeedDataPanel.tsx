import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { generateSeedData, SeedDataOutput } from "@/lib/seed/seedDataGenerator";
import { SolutionManifest } from "@/lib/manifest/types";

interface SeedDataPanelProps {
  manifest: SolutionManifest;
}

export function SeedDataPanel({ manifest }: SeedDataPanelProps) {
  const [recordCount, setRecordCount] = useState(3);
  const [seedData, setSeedData] = useState<SeedDataOutput | null>(null);

  const handleGenerate = () => {
    const data = generateSeedData(manifest, recordCount);
    setSeedData(data);
  };

  const handleDownload = () => {
    if (!seedData) return;
    
    const blob = new Blob([JSON.stringify(seedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${manifest.name.replace(/\s+/g, "-").toLowerCase()}-seed-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const entities = manifest.blocks.filter((b) => b.type === "entity");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Seed Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Records per Entity</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={recordCount}
            onChange={(e) => setRecordCount(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Will generate {recordCount} demo records for each of {entities.length} entities
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleGenerate} className="flex-1">
            Generate Seed Data
          </Button>
          {seedData && (
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>

        {seedData && (
          <ScrollArea className="h-[400px] w-full rounded-lg border">
            <pre className="p-4 text-xs">
              {JSON.stringify(seedData, null, 2)}
            </pre>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
