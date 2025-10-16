import { useState } from "react";
import { Plus } from "lucide-react";
import { BlockInstance } from "@/types/blocks";
import { getBlockDefinitionByType } from "@/data/blockDefinitions";
import BlockNode from "./BlockNode";

interface CanvasProps {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  onBlockAdd: (block: BlockInstance) => void;
  onBlockSelect: (id: string | null) => void;
  onBlockMove: (id: string, position: { x: number; y: number }) => void;
  onBlockDelete: (id: string) => void;
}

// Helper to draw curved connection line between two blocks
const drawConnection = (from: BlockInstance, to: BlockInstance) => {
  const fromX = from.position.x + 140; // Center of block (280px width / 2)
  const fromY = from.position.y + 60; // Bottom of block (120px height / 2)
  const toX = to.position.x + 140;
  const toY = to.position.y + 60;

  const midY = (fromY + toY) / 2;

  // Create a smooth curved path
  const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
  
  return path;
};

const Canvas = ({
  blocks,
  selectedBlockId,
  onBlockAdd,
  onBlockSelect,
  onBlockMove,
  onBlockDelete,
}: CanvasProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const blockType = e.dataTransfer.getData("blockType");
    if (!blockType) return;

    const definition = getBlockDefinitionByType(blockType);
    if (!definition) return;

    // Calculate drop position relative to canvas
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBlock: BlockInstance = {
      id: `${blockType}-${Date.now()}`,
      type: definition.type,
      name: definition.name,
      position: { x, y },
      parameters: definition.parameters.reduce((acc, param) => {
        acc[param.id] = param.defaultValue ?? "";
        return acc;
      }, {} as Record<string, any>),
    };

    onBlockAdd(newBlock);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking on empty canvas
    if (e.target === e.currentTarget) {
      onBlockSelect(null);
    }
  };

  return (
    <div
      className={`relative w-full h-full bg-background bg-grid-pattern overflow-auto ${
        isDraggingOver ? "ring-2 ring-primary ring-inset" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      {/* Connection Lines SVG Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {blocks.map(block => {
          if (!block.connections || block.connections.length === 0) return null;
          
          return block.connections.map(targetId => {
            const targetBlock = blocks.find(b => b.id === targetId);
            if (!targetBlock) return null;
            
            return (
              <path
                key={`${block.id}-${targetId}`}
                d={drawConnection(block, targetBlock)}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                opacity="0.4"
                className="transition-all"
              />
            );
          });
        })}
      </svg>

      {/* Drop zone hint */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4 text-muted-foreground">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">Drag blocks from the library</p>
              <p className="text-sm">to start composing your solution</p>
            </div>
          </div>
        </div>
      )}

      {/* Blocks */}
      {blocks.map(block => (
        <BlockNode
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          onSelect={() => onBlockSelect(block.id)}
          onMove={(position) => onBlockMove(block.id, position)}
          onDelete={() => onBlockDelete(block.id)}
        />
      ))}
    </div>
  );
};

export default Canvas;
