import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/components/Landing";
import Composer from "@/components/Composer";
import Refine from "@/components/Refine";
import Preview from "@/components/Preview";
import Deploy from "@/pages/Deploy";
import NotFound from "./pages/NotFound";
import { Sparkles } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          {/* Minimal Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">Desk Builder AI</span>
              </div>
            </div>
          </header>

          {/* Routes */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/compose" element={<Composer />} />
              <Route path="/refine" element={<Refine />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/deploy" element={<Deploy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
