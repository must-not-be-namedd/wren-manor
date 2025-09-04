import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Puzzle1 from "./pages/Puzzle1";
import Puzzle2 from "./pages/Puzzle2";
import Puzzle3 from "./pages/Puzzle3";
import Puzzle4 from "./pages/Puzzle4";
import Puzzle5 from "./pages/Puzzle5";
import Puzzle6 from "./pages/Puzzle6";
import Puzzle7 from "./pages/Puzzle7";
import Puzzle8 from "./pages/Puzzle8";
import Puzzle9 from "./pages/Puzzle9";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/puzzle1" element={<Puzzle1 />} />
          <Route path="/puzzle2" element={<Puzzle2 />} />
          <Route path="/puzzle3" element={<Puzzle3 />} />
          <Route path="/puzzle4" element={<Puzzle4 />} />
          <Route path="/puzzle5" element={<Puzzle5 />} />
          <Route path="/puzzle6" element={<Puzzle6 />} />
          <Route path="/puzzle7" element={<Puzzle7 />} />
          <Route path="/puzzle8" element={<Puzzle8 />} />
          <Route path="/puzzle9" element={<Puzzle9 />} />
          <Route path="/results" element={<Results />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
