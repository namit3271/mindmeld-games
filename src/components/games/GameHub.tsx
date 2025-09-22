import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  Shapes, 
  Zap, 
  Brain, 
  Target, 
  Puzzle, 
  Timer, 
  Trophy,
  Lock,
  Star,
  Award
} from "lucide-react";
import SpeedMath from "./SpeedMath";
import AlgebraGame from "./AlgebraGame";
import GeometryGame from "./GeometryGame";
import PatternRecognition from "./PatternRecognition";
import MemoryChallenge from "./MemoryChallenge";
import MathPuzzles from "./MathPuzzles";

interface GameInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  unlockLevel: number;
  category: 'arithmetic' | 'algebra' | 'geometry' | 'logic' | 'memory';
  estimatedTime: string;
  xpReward: number;
}

interface GameHubProps {
  playerLevel: number;
  onGameComplete: (gameId: string, score: number, xp: number) => void;
}

export default function GameHub({ playerLevel, onGameComplete }: GameHubProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [completedGames, setCompletedGames] = useState<Set<string>>(new Set());

  const games: GameInfo[] = [
    {
      id: 'speed-math',
      name: 'Speed Math',
      description: 'Solve as many problems as you can in 60 seconds!',
      icon: <Zap className="w-6 h-6" />,
      difficulty: 'easy',
      unlockLevel: 1,
      category: 'arithmetic',
      estimatedTime: '1 min',
      xpReward: 50
    },
    {
      id: 'algebra-master',
      name: 'Algebra Master',
      description: 'Solve equations and find the value of X',
      icon: <Calculator className="w-6 h-6" />,
      difficulty: 'medium',
      unlockLevel: 3,
      category: 'algebra',
      estimatedTime: '3-5 min',
      xpReward: 75
    },
    {
      id: 'geometry-explorer',
      name: 'Geometry Explorer',
      description: 'Calculate areas, perimeters, and volumes',
      icon: <Shapes className="w-6 h-6" />,
      difficulty: 'medium',
      unlockLevel: 4,
      category: 'geometry',
      estimatedTime: '5-7 min',
      xpReward: 100
    },
    {
      id: 'pattern-master',
      name: 'Pattern Master',
      description: 'Recognize mathematical sequences and patterns',
      icon: <Brain className="w-6 h-6" />,
      difficulty: 'hard',
      unlockLevel: 5,
      category: 'logic',
      estimatedTime: '3-4 min',
      xpReward: 90
    },
    {
      id: 'memory-challenge',
      name: 'Memory Challenge',
      description: 'Remember number sequences and solve problems',
      icon: <Target className="w-6 h-6" />,
      difficulty: 'medium',
      unlockLevel: 2,
      category: 'memory',
      estimatedTime: '2-3 min',
      xpReward: 60
    },
    {
      id: 'math-puzzles',
      name: 'Math Puzzles',
      description: 'Complex logic puzzles requiring mathematical thinking',
      icon: <Puzzle className="w-6 h-6" />,
      difficulty: 'expert',
      unlockLevel: 7,
      category: 'logic',
      estimatedTime: '10-15 min',
      xpReward: 150
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-destructive';
      case 'expert': return 'text-purple-500';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'arithmetic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'algebra': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'geometry': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'logic': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'memory': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const isUnlocked = (game: GameInfo) => playerLevel >= game.unlockLevel;

  const handleGameComplete = (gameId: string, score: number) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      setCompletedGames(prev => new Set([...prev, gameId]));
      onGameComplete(gameId, score, game.xpReward);
      setActiveGame(null);
    }
  };

  const renderGame = () => {
    if (!activeGame) return null;

    const gameProps = {
      onComplete: (score: number) => handleGameComplete(activeGame, score),
      onBack: () => setActiveGame(null)
    };

    switch (activeGame) {
      case 'speed-math':
        return <SpeedMath {...gameProps} />;
      case 'algebra-master':
        return <AlgebraGame {...gameProps} />;
      case 'geometry-explorer':
        return <GeometryGame {...gameProps} />;
      case 'pattern-master':
        return <PatternRecognition {...gameProps} />;
      case 'memory-challenge':
        return <MemoryChallenge {...gameProps} />;
      case 'math-puzzles':
        return <MathPuzzles {...gameProps} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return (
      <div className="animate-fade-in">
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text">Game Hub</h2>
        <p className="text-muted-foreground">Choose your mathematical adventure!</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm">Level {playerLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-sm">{completedGames.size} games completed</span>
          </div>
        </div>
      </div>

      {/* Game Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const unlocked = isUnlocked(game);
          const completed = completedGames.has(game.id);
          
          return (
            <Card 
              key={game.id} 
              className={`relative overflow-hidden transition-all duration-300 hover-scale ${
                unlocked ? 'cursor-pointer card-hover shadow-glow' : 'opacity-60'
              }`}
              onClick={() => unlocked && setActiveGame(game.id)}
            >
              {completed && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-success text-success-foreground">
                    <Award className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                    {unlocked ? game.icon : <Lock className="w-6 h-6" />}
                  </div>
                  <Badge className={getCategoryColor(game.category)}>
                    {game.category}
                  </Badge>
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span>{game.name}</span>
                  <span className={`text-sm font-normal ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </CardTitle>
                <CardDescription className="min-h-[3rem]">
                  {game.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {game.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {game.xpReward} XP
                  </div>
                </div>
                
                {!unlocked && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Unlock at level {game.unlockLevel}
                    </p>
                    <Progress 
                      value={(playerLevel / game.unlockLevel) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
                
                {unlocked && (
                  <Button 
                    className="w-full gradient-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveGame(game.id);
                    }}
                  >
                    {completed ? 'Play Again' : 'Start Game'}
                  </Button>
                )}
              </CardContent>
              
              {/* Difficulty indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                game.difficulty === 'easy' ? 'bg-success' :
                game.difficulty === 'medium' ? 'bg-warning' :
                game.difficulty === 'hard' ? 'bg-destructive' :
                'bg-purple-500'
              }`} />
            </Card>
          );
        })}
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedGames.size}</div>
              <div className="text-sm text-muted-foreground">Games Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{games.filter(isUnlocked).length}</div>
              <div className="text-sm text-muted-foreground">Games Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{playerLevel}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {completedGames.size * 100}%
              </div>
              <div className="text-sm text-muted-foreground">Collection Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}