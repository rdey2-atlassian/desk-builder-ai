import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Eye, Save, Sparkles, Download, FolderOpen, Upload, PlayCircle, CheckCircle } from "lucide-react";
import { BlockInstance } from "@/types/blocks";
import BlockLibrary from "./BlockLibrary";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import DescribePanel from "./DescribePanel";
import LoadSolutionDialog from "./LoadSolutionDialog";
import { PreflightSidebar } from "@/features/composer/PreflightSidebar";
import { DryRunPanel } from "@/features/composer/DryRunPanel";
import { DryRunDiffPanel } from "@/features/composer/DryRunDiffPanel";
import { SeedDataPanel } from "@/features/composer/SeedDataPanel";
import { SyntheticTestPanel } from "@/features/composer/SyntheticTestPanel";
import { useToast } from "@/hooks/use-toast";
import { compileManifest, runPreflight as oldRunPreflight, buildArtifactsZip } from "@/utils/manifest";
import { supabase } from "@/integrations/supabase/client";
import { useManifestStore } from "@/store/manifestStore";
import { useDryRunStore } from "@/store/dryRunStore";
import { loadExample, EXAMPLES, type ExampleId } from "@/lib/examples";
import { runPreflight } from "@/lib/preflight/preflight";
import { generateDryRunPlan, type DryRunPlan } from "@/lib/compiler/plan";
import { generateDiff } from "@/lib/compiler/diff";
import { validateManifest } from "@/lib/manifest/schema";
import { Block, SolutionManifest, EntityBlock } from "@/lib/manifest/types";
import { nanoid } from "nanoid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CanvasComposerProps {
  onComplete: (data?: { name: string; description: string; blocks: BlockInstance[]; templateId: string }) => void;
  templateId: string;
}

const CanvasComposer = ({ onComplete, templateId }: CanvasComposerProps) => {
  const { toast } = useToast();
  const {
    manifest,
    dirty,
    selectedBlockId,
    setManifest,
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    setSelectedBlock,
    markDirty,
  } = useManifestStore();
  
  const { previousPlan, currentPlan, setCurrentPlan } = useDryRunStore();

  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
  const [showDescribePanel, setShowDescribePanel] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showLoadExample, setShowLoadExample] = useState(false);
  const [showPreflight, setShowPreflight] = useState(false);
  const [showDryRun, setShowDryRun] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showSeedData, setShowSeedData] = useState(false);
  const [showSynthetic, setShowSynthetic] = useState(false);
  const [solutionId, setSolutionId] = useState<string | null>(null);
  const [version, setVersion] = useState<number>(1);
  const [preflightIssues, setPreflightIssues] = useState<any[]>([]);
  const [dryRunPlan, setDryRunPlan] = useState<DryRunPlan | null>(null);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleExportManifest();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Open command palette (can be enhanced later)
        toast({ title: "Command palette", description: "Coming soon!" });
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [manifest]);

  const blocks = manifest?.blocks || [];
  
  // Convert selected Block to BlockInstance format for PropertiesPanel
  const selectedBlockRaw = blocks.find(b => b.id === selectedBlockId);
  const selectedBlock = selectedBlockRaw ? {
    id: selectedBlockRaw.id,
    type: selectedBlockRaw.type as any,
    name: selectedBlockRaw.name,
    position: { x: 0, y: 0 },
    parameters: {
      ...selectedBlockRaw,
      // Flatten all properties into parameters for backward compatibility
    },
  } as BlockInstance : null;

  // Initialize with empty manifest if none exists
  useEffect(() => {
    if (!manifest) {
      setManifest({
        version: "0.1",
        name: "New Solution",
        description: "",
        blocks: [],
      });
    }
  }, [manifest, setManifest]);

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  const handleLoadExample = async (exampleId: ExampleId) => {
    try {
      const example = await loadExample(exampleId);
      setManifest(example);
      setShowLoadExample(false);
      toast({ title: "Example loaded", description: `Loaded ${EXAMPLES[exampleId]}` });
    } catch (e) {
      console.error(e);
      toast({ title: "Load failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    }
  };

  const handleImportManifest = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        const result = validateManifest(json);
        
        if (result.ok === false) {
          const issuesText = result.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
          toast({ 
            title: "Invalid manifest", 
            description: issuesText.slice(0, 200),
            variant: "destructive" 
          });
          return;
        }
        
        setManifest(result.data as SolutionManifest);
        toast({ title: "Imported", description: "Manifest loaded successfully" });
      } catch (e) {
        console.error(e);
        toast({ title: "Import failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
      }
    };
    input.click();
  };

  const handleExportManifest = () => {
    if (!manifest) return;
    
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manifest.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Exported", description: "Manifest downloaded" });
  };

  const handleRunPreflight = () => {
    if (!manifest) return;
    const issues = runPreflight(manifest);
    setPreflightIssues(issues);
    setShowPreflight(true);
    
    const errorCount = issues.filter(i => i.severity === "error").length;
    toast({ 
      title: errorCount > 0 ? "Preflight completed with errors" : "Preflight passed",
      description: `${issues.length} total issues found`,
      variant: errorCount > 0 ? "destructive" : "default"
    });
  };

  const handleRunDryRun = () => {
    if (!manifest) return;
    const plan = generateDryRunPlan(manifest);
    setDryRunPlan(plan);
    setCurrentPlan(plan);
    setShowDryRun(true);
    toast({ title: "Dry run generated", description: "Review the execution plan" });
  };
  
  const handleShowDiff = () => {
    if (!currentPlan) {
      toast({ title: "No plan", description: "Run a dry-run first", variant: "destructive" });
      return;
    }
    setShowDiff(true);
  };

  const handlePreflightIssueClick = (issue: any) => {
    if (issue.blockId) {
      setSelectedBlock(issue.blockId);
      setShowPreflight(false);
    }
  };

  const handleBlocksGenerated = (generatedBlocks: BlockInstance[]) => {
    // Convert old BlockInstance format to new Block format
    generatedBlocks.forEach(oldBlock => {
      const newBlock: Block = {
        id: oldBlock.id,
        type: oldBlock.type as any,
        name: oldBlock.name,
        ...(oldBlock.type === "entity" && {
          fields: [],
        }),
        ...(oldBlock.type === "workflow" && {
          states: [],
          transitions: [],
        }),
      } as Block;
      
      addBlock(newBlock);
    });
    
    if (generatedBlocks.length > 0) {
      setSelectedBlock(generatedBlocks[0].id);
    }
  };

  const handleSave = async () => {
    if (!manifest) return;
    
    try {
      // Convert to old format for Supabase compatibility
      const oldBlocks: BlockInstance[] = blocks.map(b => ({
        id: b.id,
        type: b.type as any,
        name: b.name,
        position: { x: 0, y: 0 },
        parameters: (b as any),
      }));
      
      const oldManifest = compileManifest({
        templateId,
        name: manifest.name,
        description: manifest.description,
        blocks: oldBlocks,
      });
      
      const issues = oldRunPreflight(oldBlocks);

      if (!solutionId) {
        const { data, error } = await supabase
          .from('solutions')
          .insert({
            name: manifest.name,
            description: manifest.description,
            category: 'custom',
            template_id: templateId,
            manifest: oldManifest as any,
            version
          } as any)
          .select('id')
          .maybeSingle();
        if (error) throw error;
        const newId = data?.id as string;
        setSolutionId(newId);
        await supabase.from('solution_versions').insert([
          {
            solution_id: newId,
            version,
            manifest: oldManifest as any,
            change_summary: 'Initial version',
          } as any
        ] as any);
      } else {
        const nextVersion = version + 1;
        const { error: upErr } = await supabase
          .from('solutions')
          .update({ manifest: oldManifest as any, version: nextVersion } as any)
          .eq('id', solutionId);
        if (upErr) throw upErr;
        await supabase.from('solution_versions').insert([
          {
            solution_id: solutionId as string,
            version: nextVersion,
            manifest: oldManifest as any,
            change_summary: 'Updated manifest',
          } as any,
        ] as any);
        setVersion(nextVersion);
      }

      markDirty(false);
      const errorCount = issues.filter(i => i.severity === 'error').length;
      const warnCount = issues.filter(i => i.severity === 'warning').length;
      toast({
        title: 'Saved',
        description: `Manifest saved${errorCount ? ` • ${errorCount} error(s)` : ''}${warnCount ? ` • ${warnCount} warning(s)` : ''}`,
      });
    } catch (e) {
      console.error(e);
      toast({ title: 'Save failed', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' });
    }
  };

  const handleExport = async () => {
    if (!manifest) return;
    
    try {
      // Convert to old format for export
      const oldBlocks: BlockInstance[] = blocks.map(b => ({
        id: b.id,
        type: b.type as any,
        name: b.name,
        position: { x: 0, y: 0 },
        parameters: (b as any),
      }));
      
      const oldManifest = compileManifest({
        templateId,
        name: manifest.name,
        description: manifest.description,
        blocks: oldBlocks,
      });
      const issues = oldRunPreflight(oldBlocks);
      const blob = await buildArtifactsZip({ manifest: oldManifest, issues });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${manifest.name.replace(/\s+/g, '-').toLowerCase()}-artifacts.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Downloaded compiled-artifacts.zip' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Export failed', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' });
    }
  };

  const handlePreview = () => {
    if (!manifest) return;
    
    // Convert to old format
    const oldBlocks: BlockInstance[] = blocks.map(b => ({
      id: b.id,
      type: b.type as any,
      name: b.name,
      position: { x: 0, y: 0 },
      parameters: (b as any),
    }));
    
    onComplete({
      name: manifest.name,
      description: manifest.description || "",
      blocks: oldBlocks,
      templateId,
    });
  };

  const handleSolutionLoad = (solution: any) => {
    // Convert from old format
    const oldBlocks: BlockInstance[] = solution.manifest?.blocks || [];
    const newBlocks: Block[] = oldBlocks.map(ob => ({
      id: ob.id,
      type: ob.type,
      name: ob.name,
      ...ob.parameters,
    } as Block));
    
    setManifest({
      version: "0.1",
      name: solution.name,
      description: solution.description || "",
      blocks: newBlocks,
    });
    
    setSolutionId(solution.id);
    setVersion(solution.version);
  };

  if (!manifest) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <Input 
              value={manifest.name}
              onChange={(e) => setManifest({ ...manifest, name: e.target.value })}
              className="text-lg font-semibold h-8 border-0 p-0 focus-visible:ring-0"
            />
            <div className="text-xs text-muted-foreground">
              {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
              {dirty && <span className="ml-2 text-warning">• Unsaved</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showLoadExample} onOpenChange={setShowLoadExample}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderOpen className="w-4 h-4 mr-2" />
                Load Example
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Example Solution</DialogTitle>
                <DialogDescription>
                  Choose a pre-built example to get started
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {Object.entries(EXAMPLES).map(([id, label]) => (
                  <Button
                    key={id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleLoadExample(id as ExampleId)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={handleImportManifest}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExportManifest}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowLoadDialog(true)}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Load
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDescribePanel(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Describe
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleRunPreflight}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Preflight
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleRunDryRun}>
            <PlayCircle className="w-4 h-4 mr-2" />
            Dry Run
          </Button>
          
          {previousPlan && (
            <Button variant="outline" size="sm" onClick={handleShowDiff}>
              <Eye className="w-4 h-4 mr-2" />
              View Diff
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={() => setShowSeedData(true)}>
            <Download className="w-4 h-4 mr-2" />
            Seed Data
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setShowSynthetic(true)}>
            <PlayCircle className="w-4 h-4 mr-2" />
            Synthetic Test
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Zip
          </Button>
          
          <Button size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Block Library */}
        <div
          className={`transition-all duration-300 ${
            libraryCollapsed ? "w-0" : "w-80"
          } overflow-hidden border-r`}
        >
          <BlockLibrary />
        </div>
        
        {/* Library Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-0 top-20 z-10 h-12 w-6 rounded-r-md rounded-l-none p-0"
          onClick={() => setLibraryCollapsed(!libraryCollapsed)}
        >
          {libraryCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <Canvas
            blocks={blocks as any}
            selectedBlockId={selectedBlockId}
            onBlockAdd={(block) => addBlock(block as any)}
            onBlockSelect={setSelectedBlock}
            onBlockMove={() => {}}
            onBlockDelete={removeBlock}
          />
        </div>

        {/* Properties Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-20 z-10 h-12 w-6 rounded-l-md rounded-r-none p-0"
          onClick={() => setPropertiesCollapsed(!propertiesCollapsed)}
        >
          {propertiesCollapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>

        {/* Properties Panel */}
        <div
          className={`transition-all duration-300 ${
            propertiesCollapsed ? "w-0" : "w-80"
          } overflow-hidden border-l`}
        >
        <PropertiesPanel
          block={selectedBlock}
          onUpdate={(id, params) => {
            // Extract direct properties and update the block
            const { name, ...rest } = params;
            updateBlock(id, rest);
          }}
        />
        </div>
      </div>

      {/* Preflight Sidebar */}
      {showPreflight && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowPreflight(false)} />
          <div className="fixed right-4 top-20 bottom-4 w-96 z-50">
            <PreflightSidebar issues={preflightIssues} onIssueClick={handlePreflightIssueClick} />
          </div>
        </>
      )}

      {/* Dry Run Panel */}
      {showDryRun && dryRunPlan && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowDryRun(false)} />
          <div className="fixed right-4 top-20 bottom-4 w-[600px] z-50">
            <DryRunPanel plan={dryRunPlan} />
          </div>
        </>
      )}
      
      {/* Diff Panel */}
      {showDiff && previousPlan && currentPlan && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowDiff(false)} />
          <div className="fixed right-4 top-20 bottom-4 w-[600px] z-50">
            <DryRunDiffPanel diff={generateDiff(previousPlan, currentPlan)} />
          </div>
        </>
      )}

      {/* Describe Panel Overlay */}
      {showDescribePanel && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowDescribePanel(false)} />
          <DescribePanel
            onBlocksGenerated={handleBlocksGenerated}
            onClose={() => setShowDescribePanel(false)}
          />
        </>
      )}

      {/* Load Solution Dialog */}
      <LoadSolutionDialog
        open={showLoadDialog}
        onOpenChange={setShowLoadDialog}
        onSolutionLoad={handleSolutionLoad}
      />
      
      {/* Seed Data Panel */}
      {showSeedData && manifest && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSeedData(false)} />
          <div className="fixed right-4 top-20 bottom-4 w-[600px] z-50">
            <SeedDataPanel manifest={manifest} />
          </div>
        </>
      )}
      
      {/* Synthetic Test Panel */}
      {showSynthetic && manifest && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSynthetic(false)} />
          <div className="fixed right-4 top-20 bottom-4 w-[600px] z-50">
            <SyntheticTestPanel manifest={manifest} />
          </div>
        </>
      )}
    </div>
  );
};

export default CanvasComposer;
