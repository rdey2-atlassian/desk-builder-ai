import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface KBArticleProps {
  article: string;
  onBack: () => void;
}

export const KBArticle = ({ article, onBack }: KBArticleProps) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // For demo, only "International Trip Checklist" has actual content
    if (article.includes("International Trip Checklist")) {
      fetch("/data/travel/kb/international-trip-checklist.md")
        .then((r) => r.text())
        .then(setContent)
        .catch(console.error);
    } else {
      setContent(`# ${article}\n\nArticle content would appear here in the live system.`);
    }
  }, [article]);

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to articles
      </Button>

      <Card className="p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {content.split("\n").map((line, i) => {
            if (line.startsWith("# ")) {
              return <h1 key={i} className="text-2xl font-bold mb-4">{line.slice(2)}</h1>;
            }
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith("- ")) {
              return <li key={i} className="ml-4">{line.slice(2)}</li>;
            }
            if (line.trim() === "") {
              return <br key={i} />;
            }
            return <p key={i} className="mb-2">{line}</p>;
          })}
        </div>
      </Card>
    </div>
  );
};
