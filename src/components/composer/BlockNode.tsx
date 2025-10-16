import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { BlockInstance } from "@/types/blocks";
import { getBlockDefinitionByType } from "@/data/blockDefinitions";

interface BlockNodeProps {
  block: BlockInstance;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onDelete: () => void;
}

const BlockNode = ({ block, isSelected, onSelect, onMove, onDelete }: BlockNodeProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  const definition = getBlockDefinitionByType(block.type);
  if (!definition) return null;

  const Icon = definition.icon;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return; // Don't drag when clicking buttons
    
    setIsDragging(true);
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    onSelect();
  };

  // Attach global mouse event listeners when dragging
  React.useEffect(() => {
    if (!isDragging) return;
    
    const handleMove = (e: MouseEvent) => {
      const canvas = nodeRef.current?.parentElement;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - dragOffset.x;
      const y = e.clientY - canvasRect.top - dragOffset.y;

      onMove({ x: Math.max(0, x), y: Math.max(0, y) });
    };
    
    const handleUp = () => setIsDragging(false);
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, dragOffset, onMove]);

  return (
    <Card
      ref={nodeRef}
      className={`absolute p-3 w-64 cursor-move transition-smooth ${
        isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
      } ${isDragging ? "opacity-80 scale-105" : ""}`}
      style={{
        left: `${block.position.x}px`,
        top: `${block.position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 cursor-grab" />
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{block.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {definition.description}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};

export default BlockNode;
