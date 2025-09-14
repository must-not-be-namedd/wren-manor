import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FullscreenManagerProps {
  children: React.ReactNode;
}

const FullscreenManager = ({ children }: FullscreenManagerProps) => {
  const { toast } = useToast();
  const [warningGiven, setWarningGiven] = useState(false);
  const [gameExited, setGameExited] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [systemLocked, setSystemLocked] = useState(false);

  // Function to start fullscreen mode when game begins
  const startFullscreenMode = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setGameStarted(true);
      localStorage.setItem("wren-manor-game-session", "active");
    } catch (err) {
      console.warn("Could not enter fullscreen mode:", err);
    }
  };

  // Expose function globally for Home component to call
  useEffect(() => {
    (window as any).startFullscreenMode = startFullscreenMode;
    return () => {
      delete (window as any).startFullscreenMode;
    };
  }, []);

  useEffect(() => {
    // Check if game has been completed on this system or if system is locked
    const checkSystemLock = () => {
      const gameCompleted = localStorage.getItem("wren-manor-system-completed");
      const gameInProgress = localStorage.getItem("wren-manor-game-session");

      if (gameCompleted === "true") {
        setSystemLocked(true);
        return true;
      }

      // Check if there's an active game session from current path
      const currentPath = window.location.pathname;
      if (
        gameInProgress &&
        currentPath !== "/" &&
        currentPath !== "/leaderboard"
      ) {
        setGameStarted(true);
      }

      return false;
    };

    const isLocked = checkSystemLock();
    if (isLocked) return;

    // Only add event listeners if game is started
    if (!gameStarted && window.location.pathname === "/") {
      return; // Don't add listeners on home page until game starts
    }

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden && gameStarted) {
        if (!warningGiven) {
          setWarningGiven(true);
          toast({
            title: "⚠️ Warning!",
            description:
              "Please stay focused on the game. Next tab switch will exit the game!",
            variant: "destructive",
            duration: 5000,
          });
        } else {
          // Second violation - exit game
          setGameExited(true);
          toast({
            title: "🚫 Game Exited",
            description:
              "You have been removed from the game for tab switching.",
            variant: "destructive",
            duration: 10000,
          });

          // Clear game data and redirect
          setTimeout(() => {
            localStorage.setItem("wren-manor-system-completed", "true");
            localStorage.removeItem("wren-manor-player");
            localStorage.removeItem("wren-manor-game-session");
            // Don't clear all localStorage to preserve system lock
            window.location.href = "/";
          }, 3000);
        }
      }
    };

    // Handle fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && gameStarted) {
        if (!warningGiven) {
          setWarningGiven(true);
          toast({
            title: "⚠️ Warning!",
            description:
              "Please stay in fullscreen mode. Exiting fullscreen again will end the game!",
            variant: "destructive",
            duration: 5000,
          });

          // Try to re-enter fullscreen
          setTimeout(() => {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            }
          }, 1000);
        } else {
          // Second violation - exit game
          setGameExited(true);
          toast({
            title: "🚫 Game Exited",
            description:
              "You have been removed from the game for exiting fullscreen mode.",
            variant: "destructive",
            duration: 10000,
          });

          setTimeout(() => {
            localStorage.setItem("wren-manor-system-completed", "true");
            localStorage.removeItem("wren-manor-player");
            localStorage.removeItem("wren-manor-game-session");
            // Don't clear all localStorage to preserve system lock
            window.location.href = "/";
          }, 3000);
        }
      }
    };

    // Handle keyboard shortcuts (prevent common shortcuts)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      // Prevent Alt+Tab, Ctrl+T, Ctrl+W, Ctrl+N, etc.
      if (
        (e.altKey && e.key === "Tab") ||
        (e.ctrlKey && (e.key === "t" || e.key === "T")) ||
        (e.ctrlKey && (e.key === "w" || e.key === "W")) ||
        (e.ctrlKey && (e.key === "n" || e.key === "N")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "t" || e.key === "T")) ||
        e.key === "F11"
      ) {
        e.preventDefault();

        if (!warningGiven) {
          setWarningGiven(true);
          toast({
            title: "⚠️ Warning!",
            description:
              "Keyboard shortcuts are disabled during the game. Next attempt will exit the game!",
            variant: "destructive",
            duration: 5000,
          });
        } else {
          setGameExited(true);
          toast({
            title: "🚫 Game Exited",
            description:
              "You have been removed from the game for using forbidden shortcuts.",
            variant: "destructive",
            duration: 10000,
          });

          setTimeout(() => {
            localStorage.setItem("wren-manor-system-completed", "true");
            localStorage.removeItem("wren-manor-player");
            localStorage.removeItem("wren-manor-game-session");
            // Don't clear all localStorage to preserve system lock
            window.location.href = "/";
          }, 3000);
        }
      }
    };

    // Add event listeners only when game is active
    if (gameStarted) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [warningGiven, toast, gameStarted]);

  // Show system locked screen
  if (systemLocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-red-400">System Locked</h1>
          <p className="text-lg text-gray-300">
            A game has already been completed on this system.
          </p>
          <p className="text-sm text-gray-400">
            Each system can only be used once to maintain game integrity.
          </p>
          
        </div>
      </div>
    );
  }

  // Show game exit screen
  if (gameExited) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-red-400">Game Exited</h1>
          <p className="text-lg text-gray-300">
            You have been removed from Wren Manor for violating game rules.
          </p>
          <p className="text-sm text-gray-400">
            The investigation requires your full attention. This system is now
            locked.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting to home page...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FullscreenManager;
