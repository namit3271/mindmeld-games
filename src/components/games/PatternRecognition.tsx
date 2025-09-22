import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowLeft, Trophy, Target, Lightbulb, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatternRecognitionProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface Pattern {
  type: 'arithmetic' | 'geometric' | 'fibonacci' | 'square' | 'prime' | 'custom';
  sequence: number[];
  nextNumbers: number[];
  rule: string;
  hint: string;
  difficulty: number;
}

export default function PatternRecognition({ onComplete, onBack }: PatternRecognitionProps) {
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const generatePattern = useCallback((difficulty: number): Pattern => {
    const patterns = [
      // Arithmetic sequences
      () => {
        const start = Math.floor(Math.random() * 20) + 1;
        const diff = Math.floor(Math.random() * 8) + 1;
        const length = 5 + difficulty;
        const sequence = Array.from({ length }, (_, i) => start + i * diff);
        const nextNumbers = [sequence[length] + diff, sequence[length] + 2 * diff];
        
        return {
          type: 'arithmetic' as const,
          sequence,
          nextNumbers,
          rule: `Add ${diff} each time`,
          hint: `Look at the difference between consecutive numbers`,
          difficulty
        };
      },
      
      // Geometric sequences
      () => {
        const start = Math.floor(Math.random() * 5) + 2;
        const ratio = Math.floor(Math.random() * 3) + 2;
        const length = 4 + Math.floor(difficulty / 2);
        const sequence = Array.from({ length }, (_, i) => start * Math.pow(ratio, i));
        const nextNumbers = [
          sequence[length - 1] * ratio,
          sequence[length - 1] * ratio * ratio
        ];
        
        return {
          type: 'geometric' as const,
          sequence,
          nextNumbers,
          rule: `Multiply by ${ratio} each time`,
          hint: `Look at the ratio between consecutive numbers`,
          difficulty
        };
      },
      
      // Square numbers
      () => {
        const start = 1;
        const length = 5;
        const sequence = Array.from({ length }, (_, i) => (i + start) * (i + start));
        const nextNumbers = [
          Math.pow(length + start, 2),
          Math.pow(length + start + 1, 2)
        ];
        
        return {
          type: 'square' as const,
          sequence,
          nextNumbers,
          rule: `Square numbers: 1², 2², 3², 4², 5²...`,
          hint: `These are perfect squares`,
          difficulty
        };
      },
      
      // Fibonacci-like sequences
      () => {
        if (difficulty >= 2) {
          const sequence = [1, 1];
          for (let i = 2; i < 6; i++) {
            sequence.push(sequence[i - 1] + sequence[i - 2]);
          }
          const nextNumbers = [
            sequence[sequence.length - 1] + sequence[sequence.length - 2],
            sequence[sequence.length - 1] + sequence[sequence.length - 2] + sequence[sequence.length - 1]
          ];
          
          return {
            type: 'fibonacci' as const,
            sequence,
            nextNumbers,
            rule: `Each number is the sum of the two previous numbers`,
            hint: `Add the two previous numbers to get the next`,
            difficulty
          };
        } else {
          return patterns[0](); // Fall back to arithmetic for easier levels
        }
      },
      
      // Custom complex patterns
      () => {
        if (difficulty >= 3) {
          // Alternating add/multiply pattern
          const start = 2;
          const sequence = [start];
          let current = start;
          
          for (let i = 1; i < 6; i++) {
            if (i % 2 === 1) {
              current += 3; // Add 3
            } else {
              current *= 2; // Multiply by 2
            }
            sequence.push(current);
          }
          
          let next1 = current + 3; // Next would be add 3
          let next2 = next1 * 2;   // Then multiply by 2
          
          return {
            type: 'custom' as const,
            sequence,
            nextNumbers: [next1, next2],
            rule: `Alternating: +3, ×2, +3, ×2...`,
            hint: `The pattern alternates between two operations`,
            difficulty
          };
        } else {
          return patterns[0](); // Fall back to arithmetic for easier levels
        }
      }
    ];
    
    // Select patterns based on difficulty
    const availablePatterns = difficulty === 1 ? patterns.slice(0, 2) : 
                              difficulty === 2 ? patterns.slice(0, 4) : patterns;
    
    const randomPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
    return randomPattern();
  }, []);

  const checkAnswer = () => {
    if (!currentPattern || currentStep >= currentPattern.nextNumbers.length) return;
    
    const userAnswer = parseFloat(userAnswers[currentStep]);
    const correctAnswer = currentPattern.nextNumbers[currentStep];
    
    if (userAnswer === correctAnswer) {
      const basePoints = 100;
      const difficultyBonus = currentPattern.difficulty * 30;
      const streakBonus = streak * 20;
      const hintPenalty = showHint ? 20 : 0;
      const points = basePoints + difficultyBonus + streakBonus - hintPenalty;
      
      setScore(prev => prev + points);
      
      if (currentStep === currentPattern.nextNumbers.length - 1) {
        // Completed the entire pattern
        setProblemsSolved(prev => prev + 1);
        setStreak(prev => prev + 1);
        
        toast({
          title: "Pattern Mastered! 🧠",
          description: `+${points} points (${streak + 1} streak!)`,
        });
        
        // Level up every 3 completed patterns
        if ((problemsSolved + 1) % 3 === 0 && level < 4) {
          setLevel(prev => prev + 1);
          toast({
            title: "Level Up! 🚀",
            description: `Welcome to level ${level + 1}! More complex patterns await.`,
          });
        }
        
        nextPattern();
      } else {
        // Move to next number in sequence
        setCurrentStep(prev => prev + 1);
        toast({
          title: "Correct! ✨",
          description: `+${points} points - One more number to go!`,
        });
      }
    } else {
      setStreak(0);
      toast({
        title: "Not quite right 🤔",
        description: `The answer was ${correctAnswer}. Try again!`,
        variant: "destructive",
      });
    }
  };

  const nextPattern = () => {
    setUserAnswers([]);
    setCurrentStep(0);
    setShowHint(false);
    const newPattern = generatePattern(level);
    setCurrentPattern(newPattern);
  };

  const showHintHandler = () => {
    setShowHint(true);
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentStep] = value;
    setUserAnswers(newAnswers);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const finishGame = () => {
    onComplete(score);
  };

  useEffect(() => {
    const initialPattern = generatePattern(1);
    setCurrentPattern(initialPattern);
  }, [generatePattern]);

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
            <Brain className="w-6 h-6 text-primary" />
            Pattern Master
          </h1>
          <p className="text-muted-foreground">Find the hidden patterns in number sequences</p>
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
            <Target className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{problemsSolved}</div>
            <div className="text-xs text-muted-foreground">Patterns Solved</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Brain className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Level {level} - Pattern Challenge</span>
            <Badge className={`${streak >= 3 ? 'bg-success' : ''}`}>
              Streak: {streak}
            </Badge>
          </CardTitle>
          <CardDescription>
            Study the sequence and find the next {currentPattern?.nextNumbers.length} numbers
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentPattern && (
            <div className="space-y-6">
              {/* Pattern Display */}
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-4">
                  Find the pattern in this sequence:
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-3 text-3xl font-bold mb-6">
                  {currentPattern.sequence.map((num, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-primary">{num}</span>
                      {index < currentPattern.sequence.length - 1 && (
                        <span className="text-muted-foreground mx-2">,</span>
                      )}
                    </div>
                  ))}
                  <span className="text-muted-foreground mx-2">,</span>
                  
                  {/* Answer slots */}
                  {currentPattern.nextNumbers.map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-16 h-12 border-2 border-dashed rounded flex items-center justify-center ${
                        index === currentStep ? 'border-primary bg-primary/10' : 
                        index < currentStep ? 'border-success bg-success/10' : 'border-muted'
                      }`}>
                        {index < currentStep ? (
                          <span className="text-success font-bold">{userAnswers[index]}</span>
                        ) : index === currentStep ? (
                          <span className="text-primary">?</span>
                        ) : (
                          <span className="text-muted-foreground">?</span>
                        )}
                      </div>
                      {index < currentPattern.nextNumbers.length - 1 && (
                        <span className="text-muted-foreground mx-2">,</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  What comes next? ({currentStep + 1}/{currentPattern.nextNumbers.length})
                </div>
              </div>
              
              {/* Answer Input */}
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  value={userAnswers[currentStep] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Number ${currentStep + 1}`}
                  className="text-center text-xl h-12"
                  type="number"
                />
                <Button 
                  onClick={checkAnswer}
                  disabled={!userAnswers[currentStep]?.trim()}
                  className="gradient-success h-12 px-6"
                >
                  Check
                </Button>
              </div>

              {/* Hint System */}
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={showHintHandler}
                  disabled={showHint}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Need a hint? (-20 pts)
                </Button>
              </div>

              {/* Hint Display */}
              {showHint && (
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    <span className="font-semibold">Hint:</span>
                  </div>
                  <p className="text-sm mb-2">{currentPattern.hint}</p>
                  <p className="text-xs text-muted-foreground">
                    Pattern: {currentPattern.rule}
                  </p>
                </div>
              )}

              {/* Pattern Type Badge */}
              <div className="flex justify-center">
                <Badge className="text-xs">
                  {currentPattern.type.charAt(0).toUpperCase() + currentPattern.type.slice(1)} Pattern
                </Badge>
              </div>
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
              <div className="text-2xl font-bold text-success">{problemsSolved}</div>
              <div className="text-sm text-muted-foreground">Patterns Solved</div>
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