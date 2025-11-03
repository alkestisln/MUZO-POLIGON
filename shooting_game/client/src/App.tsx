import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Landing from "./pages/Landing";
import Game from "./pages/Game";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            {!gameStarted ? (
              <Landing onStart={() => setGameStarted(true)} />
            ) : (
              <Game onBackToMenu={() => setGameStarted(false)} />
            )}
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
