import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  ArrowLeft, 
  Trophy, 
  Eye, 
  EyeOff,
  Clock,
  Brain,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemoryChallengeProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface MemoryChallenge {
  type: 'sequence' | 'arithmetic' | 'grid' | 'equation';
  displayNumbers: number[];
  question: string;
  answer: number;
  displayTime: number;
  difficulty: number;
}

export default function MemoryChallenge({ onComplete, onBack }: MemoryChallengeProps) {
  const [currentChallenge, setCurrentChallenge] = useState<MemoryChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [challengesSolved, setChallengesSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState<'display' | 'input' | 'result'>('display');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  const generateChallenge = useCallback((difficulty: number): MemoryChallenge => {
    const challenges = [
      // Sequence Memory
      () => {
        const length = 3 + difficulty;
        const displayNumbers = Array.from({ length }, () => Math.floor(Math.random() * 20) + 1);
        const position = Math.floor(Math.random() * length);
        
        return {
          type: 'sequence' as const,
          displayNumbers,
          question: `What was the ${position + 1}${getOrdinalSuffix(position + 1)} number in the sequence?`,
          answer: displayNumbers[position],
          displayTime: Math.max(2, 5 - difficulty),
          difficulty
        };
      },
      
      // Arithmetic Memory
      () => {
        const numbers = Array.from({ length: 3 + Math.floor(difficulty/2) }, () => Math.floor(Math.random() * 15) + 1);
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        
        return {
          type: 'arithmetic' as const,
          displayNumbers: numbers,
          question: `What was the sum of all the numbers?`,
          answer: sum,
          displayTime: Math.max(3, 6 - difficulty),
          difficulty
        };
      },
      
      // Grid Memory (represented as sequence for simplicity)
      () => {
        const gridSize = 3 + Math.floor(difficulty/2);
        const displayNumbers = Array.from({ length: gridSize }, () => Math.floor(Math.random() * 50) + 1);
        const maxNumber = Math.max(...displayNumbers);
        
        return {
          type: 'grid' as const,
          displayNumbers,
          question: `What was the largest number shown?`,
          answer: maxNumber,
          displayTime: Math.max(3, 7 - difficulty),
          difficulty
        };
      },
      
      // Equation Memory
      () => {
        if (difficulty >= 2) {
          const a = Math.floor(Math.random() * 15) + 1;
          const b = Math.floor(Math.random() * 15) + 1;
          const c = Math.floor(Math.random() * 15) + 1;
          const result = a + b - c;
          const displayNumbers = [a, b, c, result];
          
          return {
            type: 'equation' as const,
            displayNumbers,
            question: `Given: ${a} + ${b} - ${c} = ?, what was the result?`,
            answer: result,
            displayTime: Math.max(4, 8 - difficulty),
            difficulty
          };
        } else {
          return challenges[0](); // Fall back to sequence for easier levels
        }
      }
    ];
    
    const availableChallenges = difficulty === 1 ? challenges.slice(0, 2) : challenges;
    const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    return randomChallenge();
  }, []);

  const getOrdinalSuffix = (number: number): string => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return 'th';
    }
    
    switch (lastDigit) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const startChallenge = () => {
    if (!currentChallenge) return;
    
    setPhase('display');
    setTimeLeft(currentChallenge.displayTime);
    setIsVisible(true);
    setUserAnswer("");
    
    // Timer for display phase
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('input');
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const checkAnswer = () => {
    if (!currentChallenge || !userAnswer.trim()) return;
    
    const answer = parseFloat(userAnswer);
    const isCorrect = answer === currentChallenge.answer;
    
    setPhase('result');
    
    if (isCorrect) {
      const basePoints = 150;
      const difficultyBonus = currentChallenge.difficulty * 40;
      const streakBonus = streak * 25;
      const speedBonus = currentChallenge.displayTime <= 3 ? 50 : 0;
      const points = basePoints + difficultyBonus + streakBonus + speedBonus;
      
      setScore(prev => prev + points);
      setChallengesSolved(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      toast({
        title: "Perfect Memory! 🧠",
        description: `+${points} points ${streak > 0 ? `(${streak + 1} streak!)` : ''}`,
      });
      
      // Level up every 4 correct answers
      if ((challengesSolved + 1) % 4 === 0 && level < 4) {
        setLevel(prev => prev + 1);
        toast({
          title: "Level Up! 🚀",
          description: `Level ${level + 1}! Memory challenges are getting harder.`,
        });
      }
      
    } else {
      setStreak(0);
      toast({
        title: "Not quite right 🤔",
        description: `The answer was ${currentChallenge.answer}`,
        variant: "destructive",
      });
    }
  };

  const nextChallenge = () => {
    setPhase('display');
    const newChallenge = generateChallenge(level);
    setCurrentChallenge(newChallenge);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && phase === 'input') {
      checkAnswer();
    }
  };

  const finishGame = () => {
    onComplete(score);
  };

  const renderDisplayContent = () => {
    if (!currentChallenge) return null;

    switch (currentChallenge.type) {
      case 'sequence':
        return (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {currentChallenge.displayNumbers.map((num, index) => (
              <div key={index} className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-2xl font-bold animate-scale-in">
                {num}
              </div>
            ))}
          </div>
        );
      
      case 'arithmetic':
        return (
          <div className="space-y-4">
            <div className="text-lg text-muted-foreground">Remember these numbers:</div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {currentChallenge.displayNumbers.map((num, index) => (
                <div key={index} className="w-16 h-16 bg-success text-success-foreground rounded-lg flex items-center justify-center text-2xl font-bold animate-scale-in">
                  {num}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'grid':
        return (
          <div className="space-y-4">
            <div className="text-lg text-muted-foreground">Study this grid:</div>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {currentChallenge.displayNumbers.map((num, index) => (
                <div key={index} className="w-16 h-16 bg-warning text-warning-foreground rounded-lg flex items-center justify-center text-xl font-bold animate-scale-in">
                  {num}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'equation':
        return (
          <div className="space-y-4">
            <div className="text-lg text-muted-foreground">Memorize this equation:</div>
            <div className="text-4xl font-bold text-primary">
              {currentChallenge.displayNumbers[0]} + {currentChallenge.displayNumbers[1]} - {currentChallenge.displayNumbers[2]} = {currentChallenge.displayNumbers[3]}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  useEffect(() => {
    const initialChallenge = generateChallenge(1);
    setCurrentChallenge(initialChallenge);
  }, [generateChallenge]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hub
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Memory Challenge
          </h1>
          <p className="text-muted-foreground">Test your memory with numbers and sequences</p>
        </div>
        <Button onClick={finishGame} className="gradient-primary">
          Finish Game
        </Button>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Star className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">{level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Brain className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{challengesSolved}</div>
            <div className="text-xs text-muted-foreground">Challenges</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Target className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Level {level} - Memory Challenge</span>
            <Badge className={`${streak >= 3 ? 'bg-success' : ''}`}>
              Streak: {streak}
            </Badge>
          </CardTitle>
          <CardDescription>
            {phase === 'display' && `Memorize the numbers - ${timeLeft}s remaining`}
            {phase === 'input' && 'Now answer the question from memory'}
            {phase === 'result' && 'Challenge complete!'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentChallenge && (
            <div className="space-y-6">
              {/* Phase Indicator */}
              <div className="flex items-center justify-center gap-4">
                <Badge variant={phase === 'display' ? 'default' : 'outline'}>
                  <Eye className="w-3 h-3 mr-1" />
                  Memorize
                </Badge>
                <Badge variant={phase === 'input' ? 'default' : 'outline'}>
                  <Brain className="w-3 h-3 mr-1" />
                  Recall
                </Badge>
                <Badge variant={phase === 'result' ? 'default' : 'outline'}>
                  <Trophy className="w-3 h-3 mr-1" />
                  Result
                </Badge>
              </div>

              {/* Display Phase */}
              {phase === 'display' && (
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 text-warning mb-4">
                    <Clock className="w-5 h-5" />
                    <span className="text-2xl font-bold">{timeLeft}s</span>
                  </div>
                  <Progress value={((currentChallenge.displayTime - timeLeft) / currentChallenge.displayTime) * 100} className="w-48 mx-auto" />
                  
                  <div className="p-6 bg-muted/30 rounded-lg">
                    {renderDisplayContent()}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Study carefully! You'll need to answer a question about these numbers.
                  </div>
                </div>
              )}

              {/* Input Phase */}
              {phase === 'input' && (
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                    <EyeOff className="w-5 h-5" />
                    <span>Numbers are now hidden</span>
                  </div>
                  
                  <div className="p-6 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-semibold mb-6">
                      {currentChallenge.question}
                    </div>
                    
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Your answer"
                        className="text-center text-xl h-12"
                        type="number"
                        autoFocus
                      />
                      <Button 
                        onClick={checkAnswer}
                        disabled={!userAnswer.trim()}
                        className="gradient-success h-12 px-6"
                      >
                        Check
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Phase */}
              {phase === 'result' && (
                <div className="text-center space-y-6">
                  <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                    <div className="text-xl font-semibold mb-2">
                      {parseFloat(userAnswer) === currentChallenge.answer ? '🎉 Correct!' : '❌ Incorrect'}
                    </div>
                    <div className="text-muted-foreground">
                      The answer was: <span className="font-bold text-foreground">{currentChallenge.answer}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <Button onClick={nextChallenge} className="gradient-primary">
                      Next Challenge
                    </Button>
                    {phase === 'display' && (
                      <Button onClick={startChallenge} className="gradient-success">
                        Start Challenge
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Start Button */}
              {phase === 'display' && timeLeft > 0 && (
                <div className="flex justify-center">
                  <Button onClick={startChallenge} className="gradient-success text-lg px-8 py-4">
                    <Eye className="w-5 h-5 mr-2" />
                    Start Memory Challenge
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{challengesSolved}</div>
              <div className="text-sm text-muted-foreground">Challenges Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{streak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}