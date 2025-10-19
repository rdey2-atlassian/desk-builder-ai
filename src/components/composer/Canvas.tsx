import { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import { BlockInstance } from "@/types/blocks";
import { getBlockDefinitionByType } from "@/data/blockDefinitions";
import BlockNode from "./BlockNode";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useManifestStore } from "@/store/manifestStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CanvasProps {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  onBlockAdd: (block: BlockInstance) => void;
  onBlockSelect: (id: string | null) => void;
  onBlockMove: (id: string, position: { x: number; y: number }) => void;
  onBlockDelete: (id: string) => void;
}

interface SortableBlockItemProps {
  block: BlockInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function SortableBlockItem({ block, isSelected, onSelect, onDelete }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const definition = getBlockDefinitionByType(block.type);
  const categoryColors: Record<string, string> = {
    domain: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    workflow: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    catalog: "bg-green-500/10 text-green-500 border-green-500/20",
    automation: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    adapter: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    portal: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    analytics: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    security: "bg-red-500/10 text-red-500 border-red-500/20",
    quality: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {definition?.icon && <definition.icon className="h-4 w-4" />}
            <h3 className="font-semibold truncate">{block.name}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {definition && (
              <Badge variant="outline" className={categoryColors[definition.category]}>
                {definition.type}
              </Badge>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          ×
        </button>
      </div>
    </Card>
  );
}

const Canvas = ({
  blocks,
  selectedBlockId,
  onBlockAdd,
  onBlockSelect,
  onBlockMove,
  onBlockDelete,
}: CanvasProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { reorderBlocks } = useManifestStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(oldIndex, newIndex);
      }
    }
  };

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

    const newBlock: BlockInstance = {
      id: `${blockType}-${Date.now()}`,
      type: definition.type,
      name: definition.name,
      position: { x: 0, y: 0 },
      parameters: definition.parameters.reduce((acc, param) => {
        acc[param.id] = param.defaultValue ?? "";
        return acc;
      }, {} as Record<string, any>),
    };

    onBlockAdd(newBlock);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onBlockSelect(null);
    }
  };

  return (
    <div
      className={`relative w-full h-full bg-background overflow-auto p-6 ${
        isDraggingOver ? "ring-2 ring-primary ring-inset" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 max-w-4xl mx-auto">
            {blocks.map((block) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                onSelect={() => onBlockSelect(block.id)}
                onDelete={() => onBlockDelete(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Canvas;
