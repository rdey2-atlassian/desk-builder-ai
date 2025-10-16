import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { blockDefinitions } from "@/data/blockDefinitions";
import { BlockCategory } from "@/types/blocks";
import { Button } from "@/components/ui/button";

interface BlockLibraryProps {
  onClose?: () => void;
}

const categoryColors: Record<BlockCategory, string> = {
  domain: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  workflow: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  catalog: "bg-green-500/10 text-green-600 border-green-500/20",
  automation: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  adapter: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  portal: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  analytics: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  security: "bg-red-500/10 text-red-600 border-red-500/20",
  quality: "bg-teal-500/10 text-teal-600 border-teal-500/20",
};

const BlockLibrary = ({ onClose }: BlockLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory | "all">("all");

  const categories: Array<{ value: BlockCategory | "all"; label: string }> = [
    { value: "all", label: "All Blocks" },
    { value: "domain", label: "Domain" },
    { value: "workflow", label: "Workflow" },
    { value: "catalog", label: "Catalog" },
    { value: "automation", label: "Automation" },
    { value: "adapter", label: "Adapters" },
    { value: "portal", label: "Portal" },
    { value: "analytics", label: "Analytics" },
    { value: "security", label: "Security" },
    { value: "quality", label: "Quality" },
  ];

  const filteredBlocks = blockDefinitions.filter(block => {
    const matchesSearch = 
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || block.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData("blockType", blockType);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Block Library</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {categories.map(cat => (
              <Badge
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20 transition-colors whitespace-nowrap"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Block List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filteredBlocks.map(block => {
            const Icon = block.icon;
            return (
              <div
                key={block.type}
                draggable
                onDragStart={(e) => handleDragStart(e, block.type)}
                className="p-3 rounded-lg border bg-card hover:bg-accent hover:shadow-md transition-smooth cursor-grab active:cursor-grabbing group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{block.name}</h3>
                      <Badge variant="outline" className={`text-xs ${categoryColors[block.category]}`}>
                        {block.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {block.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No blocks found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BlockLibrary;
