import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import knowledge from "@/data/knowledge.json";
import { Search, FileText, ChevronRight } from "lucide-react";

const KnowledgeTab = () => {
  const [selectedArticle, setSelectedArticle] = useState(knowledge[4]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKnowledge = knowledge.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">
            Knowledge Articles ({filteredKnowledge.length})
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredKnowledge.map((article) => (
            <Card
              key={article.id}
              className={`p-4 cursor-pointer transition-smooth hover:border-primary ${
                selectedArticle.id === article.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedArticle(article)}
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight">
                    {article.title}
                  </h4>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>

        <Button variant="outline" className="w-full">
          + Add Custom Article
        </Button>
      </div>

      {/* Article Content */}
      <div className="lg:col-span-2">
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          <div className="prose prose-sm max-w-none text-foreground">
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{
                __html: selectedArticle.content
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/^(.+)$/gm, "<p>$1</p>")
                  .replace(/<p>## (.+)<\/p>/g, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
                  .replace(/<p>### (.+)<\/p>/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                  .replace(/<p>- (.+)<\/p>/g, '<li class="ml-6">$1</li>')
                  .replace(/<p>✓ (.+)<\/p>/g, '<li class="ml-6 flex items-start gap-2"><span class="text-success">✓</span><span>$1</span></li>'),
              }}
            />
          </div>
        </Card>

        <Card className="p-4 mt-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-accent text-sm font-bold">AI</span>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-1">AI-generated content</p>
              <p className="text-muted-foreground">
                These articles were created based on your organization profile and
                travel policy. Review and edit to match your exact requirements.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeTab;
