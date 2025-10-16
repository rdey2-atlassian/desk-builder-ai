import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Save } from "lucide-react";
import { BlockInstance } from "@/types/blocks";
import BlockLibrary from "./BlockLibrary";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";

interface CanvasComposerProps {
  onComplete: () => void;
  templateId: string;
}

const CanvasComposer = ({ onComplete, templateId }: CanvasComposerProps) => {
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);

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

  const handleSave = () => {
    console.log("Saving solution manifest:", { templateId, blocks });
    // TODO: Save to manifest
  };

  const handlePreview = () => {
    console.log("Previewing solution:", { templateId, blocks });
    onComplete();
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
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
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
    </div>
  );
};

export default CanvasComposer;
