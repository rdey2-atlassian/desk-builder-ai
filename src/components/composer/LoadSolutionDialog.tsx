import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, FolderOpen, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlockInstance } from "@/types/blocks";
import { format } from "date-fns";

interface Solution {
  id: string;
  name: string;
  description: string;
  category: string;
  template_id: string;
  version: number;
  created_at: string;
  updated_at: string;
  manifest: {
    metadata: any;
    blocks: BlockInstance[];
  };
}

interface LoadSolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSolutionLoad: (solution: Solution) => void;
}

const LoadSolutionDialog = ({ open, onOpenChange, onSolutionLoad }: LoadSolutionDialogProps) => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [filteredSolutions, setFilteredSolutions] = useState<Solution[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadSolutions();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredSolutions(
        solutions.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.description?.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredSolutions(solutions);
    }
  }, [searchQuery, solutions]);

  const loadSolutions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setSolutions((data || []) as unknown as Solution[]);
      setFilteredSolutions((data || []) as unknown as Solution[]);
    } catch (error) {
      console.error('Error loading solutions:', error);
      toast({
        title: 'Load failed',
        description: error instanceof Error ? error.message : 'Failed to load solutions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSolution = (solution: Solution) => {
    onSolutionLoad(solution);
    onOpenChange(false);
    toast({
      title: 'Solution loaded',
      description: `Loaded "${solution.name}" with ${solution.manifest.blocks.length} blocks`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Load Solution
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search solutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Solutions List */}
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredSolutions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {searchQuery ? 'No solutions found matching your search' : 'No saved solutions yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSolutions.map((solution) => (
                  <Card
                    key={solution.id}
                    className="p-4 hover:shadow-lg transition-smooth cursor-pointer hover:border-primary"
                    onClick={() => handleLoadSolution(solution)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{solution.name}</h3>
                          {solution.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {solution.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0">
                          v{solution.version}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Updated {format(new Date(solution.updated_at), 'MMM d, yyyy')}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {solution.category}
                        </Badge>
                        <span>{solution.manifest.blocks.length} blocks</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadSolutionDialog;
