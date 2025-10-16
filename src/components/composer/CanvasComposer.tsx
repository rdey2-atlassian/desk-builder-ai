import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Eye, Save, Sparkles, Download, FolderOpen } from "lucide-react";
import { BlockInstance } from "@/types/blocks";
import BlockLibrary from "./BlockLibrary";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import DescribePanel from "./DescribePanel";
import LoadSolutionDialog from "./LoadSolutionDialog";
import { useToast } from "@/components/ui/use-toast";
import { compileManifest, runPreflight, buildArtifactsZip } from "@/utils/manifest";
import { supabase } from "@/integrations/supabase/client";

interface CanvasComposerProps {
  onComplete: () => void;
  templateId: string;
}

const CanvasComposer = ({ onComplete, templateId }: CanvasComposerProps) => {
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
  const [showDescribePanel, setShowDescribePanel] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [solutionName, setSolutionName] = useState("Untitled Solution");
  const [solutionDescription, setSolutionDescription] = useState("");
  const [solutionId, setSolutionId] = useState<string | null>(null);
  const [version, setVersion] = useState<number>(1);
  const { toast } = useToast();

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  const handleBlockAdd = (block: BlockInstance) => {
    setBlocks(prev => [...prev, block]);
    setSelectedBlockId(block.id);
  };

  const handleBlockSelect = (id: string | null) => {
    setSelectedBlockId(id);
  };

  const handleBlockMove = (id: string, position: { x: number; y: number }) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, position } : b));
  };

  const handleBlockDelete = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleBlockUpdate = (id: string, parameters: Record<string, any>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, parameters } : b));
  };

  const handleBlocksGenerated = (generatedBlocks: BlockInstance[]) => {
    setBlocks(prev => [...prev, ...generatedBlocks]);
    // Select the first generated block
    if (generatedBlocks.length > 0) {
      setSelectedBlockId(generatedBlocks[0].id);
    }
  };

  const handleSave = async () => {
    try {
      const manifest = compileManifest({
        templateId,
        name: solutionName.trim() || "Untitled Solution",
        description: solutionDescription,
        blocks,
      });
      const issues = runPreflight(blocks);

      if (!solutionId) {
        const { data, error } = await supabase
          .from('solutions')
          .insert({
            name: manifest.metadata.name,
            description: manifest.metadata.description,
            category: 'custom',
            template_id: templateId,
            manifest: manifest as any,
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
            manifest: manifest as any,
            change_summary: 'Initial version',
          } as any
        ] as any);
      } else {
        const nextVersion = version + 1;
        const { error: upErr } = await supabase
          .from('solutions')
          .update({ manifest: manifest as any, version: nextVersion } as any)
          .eq('id', solutionId);
        if (upErr) throw upErr;
        await supabase.from('solution_versions').insert([
          {
            solution_id: solutionId as string,
            version: nextVersion,
            manifest: manifest as any,
            change_summary: 'Updated manifest',
          } as any,
        ] as any);
        setVersion(nextVersion);
      }

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
    try {
      const manifest = compileManifest({
        templateId,
        name: solutionName.trim() || 'Untitled Solution',
        description: solutionDescription,
        blocks,
      });
      const issues = runPreflight(blocks);
      const blob = await buildArtifactsZip({ manifest, issues });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(solutionName || 'solution').replace(/\s+/g, '-').toLowerCase()}-artifacts.zip`;
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
    console.log('Previewing solution:', { templateId, blocks });
    onComplete();
  };

  const handleSolutionLoad = (solution: any) => {
    setSolutionName(solution.name);
    setSolutionDescription(solution.description || "");
    setSolutionId(solution.id);
    setVersion(solution.version);
    setBlocks(solution.manifest.blocks || []);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Solution Composer</h1>
          <div className="text-sm text-muted-foreground">
            {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            Describe with AI
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview & Refine
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Block Library */}
        <div
          className={`transition-all duration-300 ${
            libraryCollapsed ? "w-0" : "w-80"
          } overflow-hidden`}
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
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onBlockAdd={handleBlockAdd}
            onBlockSelect={handleBlockSelect}
            onBlockMove={handleBlockMove}
            onBlockDelete={handleBlockDelete}
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
          } overflow-hidden`}
        >
          <PropertiesPanel
            block={selectedBlock}
            onUpdate={handleBlockUpdate}
          />
        </div>
      </div>

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
    </div>
  );
};

export default CanvasComposer;
