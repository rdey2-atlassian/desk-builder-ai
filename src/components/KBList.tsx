import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

interface KBIndex {
  articles: string[];
}

interface KBListProps {
  onSelectArticle?: (article: string) => void;
}

export const KBList = ({ onSelectArticle }: KBListProps) => {
  const [kbIndex, setKbIndex] = useState<KBIndex | null>(null);

  useEffect(() => {
    fetch("/data/travel/kb/index.json")
      .then((r) => r.json())
      .then(setKbIndex)
      .catch(console.error);
  }, []);

  if (!kbIndex) return <div className="text-muted-foreground">Loading articles...</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Knowledge Base Articles</h3>
        <span className="text-sm text-muted-foreground">{kbIndex.articles.length} articles</span>
      </div>

      {kbIndex.articles.map((article, i) => (
        <Card key={i} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">{article}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Travel policy and procedures
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectArticle?.(article)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
