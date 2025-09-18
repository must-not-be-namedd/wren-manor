import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  ManorCard,
  ManorCardContent,
  ManorCardDescription,
  ManorCardHeader,
  ManorCardTitle,
} from "@/components/ui/manor-card";
import { ManorButton } from "@/components/ui/manor-button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Medal,
  Clock,
  Users,
  Crown,
  ArrowLeft,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  getLeaderboard,
  getGameProgress,
  type LeaderboardEntry,
  type GameProgress,
} from "@/lib/gameState";
import { useToast } from "@/hooks/use-toast";

const Leaderboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [currentPlayerProgress, setCurrentPlayerProgress] = useState<GameProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  const [currentTeam, setCurrentTeam] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load current player info
        const stored = localStorage.getItem("wren-manor-player");
        if (stored) {
          const playerData = JSON.parse(stored);
          setCurrentPlayer(playerData.playerName || "");
          setCurrentTeam(playerData.teamId || "");
          
          // Load player progress
          if (playerData.playerName && playerData.teamId) {
            const progress = await getGameProgress(playerData.playerName, playerData.teamId);
            setCurrentPlayerProgress(progress);
          }
        }
        
        // Load leaderboard
        const leaderboard = await getLeaderboard();
        setLeaderboardData(leaderboard);
        setError(null);
        setIsOnline(true);
      } catch (err) {
        console.error("Error loading leaderboard data:", err);
        setError("Failed to load leaderboard data");
        setIsOnline(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number): string => {
    if (!ms || ms <= 0) return "In Progress";
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgressBadge = (progress: number) => {
    if (progress === 9)
      return { icon: "🏆", text: "Master Detective", color: "bg-yellow-500" };
    if (progress >= 7)
      return { icon: "🕵️", text: "Senior Detective", color: "bg-blue-500" };
    if (progress >= 5)
      return { icon: "🔍", text: "Detective", color: "bg-green-500" };
    if (progress >= 3)
      return { icon: "👤", text: "Investigator", color: "bg-orange-500" };
    return { icon: "🔰", text: "Rookie", color: "bg-gray-500" };
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500 animate-glow" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-lg text-muted-foreground">#{position + 1}</span>;
    }
  };

  const isCurrentPlayer = (entry: LeaderboardEntry): boolean => {
    return entry.playerName === currentPlayer && entry.teamId === currentTeam;
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const leaderboard = await getLeaderboard();
      setLeaderboardData(leaderboard);
      setError(null);
      setIsOnline(true);
      toast({
        title: "🔄 Refreshed",
        description: "Leaderboard updated successfully",
      });
    } catch (err) {
      console.error("Error refreshing leaderboard:", err);
      setError("Failed to refresh leaderboard");
      setIsOnline(false);
      toast({
        title: "❌ Error",
        description: "Failed to refresh leaderboard",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && leaderboardData.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg text-muted-foreground">
                Loading leaderboard...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const leaderboard = leaderboardData || [];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto space-y-8 p-6">
          {/* Header */}
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <ManorButton
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Investigation</span>
              </ManorButton>

              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <ManorButton
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center space-x-1"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </ManorButton>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-3 mb-6">
              <Trophy className="h-10 w-10 text-primary animate-glow" />
              <h1 className="font-manor text-5xl font-bold text-foreground">
                Hall of Detectives
              </h1>
              <Users className="h-10 w-10 text-accent" />
            </div>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              Track the progress of all investigators as they uncover the
              mysteries of Wren Manor. May the best detective solve the case
              first!
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center"
            >
              <p className="text-red-500 font-medium">{error}</p>
              <ManorButton
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-2"
              >
                Try Again
              </ManorButton>
            </motion.div>
          )}

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <ManorCard className="text-center hover-scale">
              <ManorCardContent className="p-4">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {leaderboard.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Investigators
                </div>
              </ManorCardContent>
            </ManorCard>

            <ManorCard className="text-center hover-scale">
              <ManorCardContent className="p-4">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-2 animate-glow" />
                <div className="text-2xl font-bold text-foreground">
                  {leaderboard.filter((entry) => entry.currentProgress === 9).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Cases Solved
                </div>
              </ManorCardContent>
            </ManorCard>

            <ManorCard className="text-center hover-scale">
              <ManorCardContent className="p-4">
                <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {leaderboard.length > 0 && leaderboard[0].completionTime > 0
                    ? formatTime(leaderboard[0].completionTime)
                    : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">Best Time</div>
              </ManorCardContent>
            </ManorCard>
          </div>

          {/* Main Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ManorCard>
              <ManorCardHeader>
                <ManorCardTitle className="text-center text-2xl">
                  🏆 Detective Rankings
                </ManorCardTitle>
                <ManorCardDescription className="text-center">
                  Current standings of all investigators at Wren Manor
                </ManorCardDescription>
              </ManorCardHeader>
              <ManorCardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-manor text-xl text-muted-foreground mb-2">
                      No Investigators Yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      No investigators have started their journey yet. Be the
                      first to enter Wren Manor!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 p-6">
                    {leaderboard.map((entry, index) => {
                      const progressBadge = getProgressBadge(entry.currentProgress);
                      const isCurrentUser = isCurrentPlayer(entry);
                      const progressPercentage = (entry.currentProgress / 9) * 100;

                      return (
                        <motion.div
                          key={`${entry.playerName}-${entry.teamId}-${entry.timestamp}`}
                          className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
                            isCurrentUser
                              ? "bg-gradient-blood/10 border-primary/30 shadow-blood ring-2 ring-primary/20"
                              : "bg-card/30 border-border hover:bg-card/50 hover:border-primary/20"
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0 w-10 text-center">
                                {getMedalIcon(index)}
                              </div>

                              <div className="flex-grow min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-lg text-foreground truncate">
                                    {entry.playerName}
                                  </h3>
                                  {isCurrentUser && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-primary/20 text-primary border-primary/30 animate-pulse"
                                    >
                                      You
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge className={`${progressBadge.color} text-white text-xs`}>
                                    <span>{progressBadge.icon}</span>
                                    <span>{progressBadge.text}</span>
                                  </Badge>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>{entry.currentProgress}/9</span>
                                  </div>
                                  <div className="w-full bg-muted/30 rounded-full h-2">
                                    <motion.div
                                      className={`h-2 rounded-full ${
                                        isCurrentUser
                                          ? "bg-gradient-blood"
                                          : "bg-gradient-candlelight"
                                      }`}
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${progressPercentage}%`,
                                      }}
                                      transition={{
                                        delay: index * 0.1 + 0.5,
                                        duration: 0.8,
                                        ease: "easeOut",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-1">
                              <motion.div
                                className="text-sm font-medium text-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                              >
                                {Math.round(progressPercentage)}% Complete
                              </motion.div>
                              <div className="text-xs text-muted-foreground">
                                {formatTime(entry.completionTime)}
                              </div>
                              {entry.currentProgress === 9 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: index * 0.1 + 0.6,
                                    type: "spring",
                                  }}
                                >
                                  <Badge className="bg-green-500 text-white text-xs animate-pulse">
                                    🎉 Solved!
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ManorCardContent>
            </ManorCard>
          </motion.div>

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ManorCard>
                <ManorCardHeader>
                  <ManorCardTitle className="text-center text-2xl">
                    🏅 Champions Podium
                  </ManorCardTitle>
                </ManorCardHeader>
                <ManorCardContent>
                  <div className="flex justify-center items-end space-x-4 py-8">
                    {[1, 0, 2].map((actualIndex, displayIndex) => {
                      if (!leaderboard[actualIndex]) return null;
                      const entry = leaderboard[actualIndex];
                      const heights = ["h-20", "h-24", "h-16"];
                      const colors = [
                        "bg-gray-400",
                        "bg-yellow-500",
                        "bg-orange-500",
                      ];

                      return (
                        <motion.div
                          key={entry.playerName}
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: displayIndex * 0.2 + 0.6,
                            type: "spring",
                          }}
                        >
                          <div
                            className={`${colors[displayIndex]} ${heights[displayIndex]} w-20 rounded-t-lg mb-2 flex items-end justify-center pb-2`}
                          >
                            <span className="text-white font-bold text-lg">
                              {actualIndex + 1}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-foreground truncate w-20">
                            {entry.playerName}
                          </div>
                          <div
                            className={`text-lg font-bold mb-1 ${
                              actualIndex === 0
                                ? "text-yellow-500"
                                : actualIndex === 1
                                ? "text-gray-400"
                                : "text-orange-500"
                            }`}
                          >
                            {entry.currentProgress}/9
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(entry.completionTime)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ManorCardContent>
              </ManorCard>
            </motion.div>
          )}

          {/* Your Progress Card */}
          {currentPlayerProgress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ManorCard className="bg-gradient-blood/5 border-primary/30">
                <ManorCardHeader>
                  <ManorCardTitle className="text-center text-xl text-primary">
                    🎯 Your Investigation Progress
                  </ManorCardTitle>
                </ManorCardHeader>
                <ManorCardContent className="text-center">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {[
                          currentPlayerProgress.p1,
                          currentPlayerProgress.p2,
                          currentPlayerProgress.p3,
                          currentPlayerProgress.p4,
                          currentPlayerProgress.p5,
                          currentPlayerProgress.p6,
                          currentPlayerProgress.p7,
                          currentPlayerProgress.p8,
                          currentPlayerProgress.p9,
                        ].filter(Boolean).length}
                        /9
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Puzzles Solved
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {formatTime(Date.now() - currentPlayerProgress.startTime)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Time Elapsed
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        #{leaderboard.findIndex(
                          (entry) =>
                            entry.playerName === currentPlayer &&
                            entry.teamId === currentTeam
                        ) + 1 || "?"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Rank
                      </div>
                    </div>
                  </div>
                </ManorCardContent>
              </ManorCard>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;