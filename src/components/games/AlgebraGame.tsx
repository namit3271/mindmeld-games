import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  ArrowLeft, 
  Trophy, 
  Target, 
  Lightbulb,
  CheckCircle,
  XCircle,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AlgebraGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface AlgebraEquation {
  equation: string;
  variable: string;
  answer: number;
  steps: string[];
  difficulty: number;
}

export default function AlgebraGame({ onComplete, onBack }: AlgebraGameProps) {
  const [currentEquation, setCurrentEquation] = useState<AlgebraEquation | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const { toast } = useToast();

  const generateEquation = useCallback((difficulty: number): AlgebraEquation => {
    const variable = 'x';
    
    switch (difficulty) {
      case 1: {
        // Simple addition/subtraction: x + a = b or x - a = b
        const a = Math.floor(Math.random() * 20) + 1;
        const answer = Math.floor(Math.random() * 20) + 1;
        const isAddition = Math.random() > 0.5;
        
        if (isAddition) {
          const b = answer + a;
          return {
            equation: `${variable} + ${a} = ${b}`,
            variable,
            answer,
            steps: [
              `${variable} + ${a} = ${b}`,
              `${variable} = ${b} - ${a}`,
              `${variable} = ${answer}`
            ],
            difficulty
          };
        } else {
          const b = answer + a;
          return {
            equation: `${variable} - ${a} = ${answer}`,
            variable,
            answer: b,
            steps: [
              `${variable} - ${a} = ${answer}`,
              `${variable} = ${answer} + ${a}`,
              `${variable} = ${b}`
            ],
            difficulty
          };
        }
      }
      
      case 2: {
        // Multiplication/division: ax = b or x/a = b
        const a = Math.floor(Math.random() * 10) + 2;
        const answer = Math.floor(Math.random() * 15) + 1;
        const isMultiplication = Math.random() > 0.5;
        
        if (isMultiplication) {
          const b = a * answer;
          return {
            equation: `${a}${variable} = ${b}`,
            variable,
            answer,
            steps: [
              `${a}${variable} = ${b}`,
              `${variable} = ${b} ÷ ${a}`,
              `${variable} = ${answer}`
            ],
            difficulty
          };
        } else {
          const b = answer;
          const fullAnswer = a * b;
          return {
            equation: `${variable}/${a} = ${b}`,
            variable,
            answer: fullAnswer,
            steps: [
              `${variable}/${a} = ${b}`,
              `${variable} = ${b} × ${a}`,
              `${variable} = ${fullAnswer}`
            ],
            difficulty
          };
        }
      }
      
      case 3: {
        // Two-step equations: ax + b = c or ax - b = c
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 15) + 1;
        const answer = Math.floor(Math.random() * 10) + 1;
        const isAddition = Math.random() > 0.5;
        
        if (isAddition) {
          const c = a * answer + b;
          return {
            equation: `${a}${variable} + ${b} = ${c}`,
            variable,
            answer,
            steps: [
              `${a}${variable} + ${b} = ${c}`,
              `${a}${variable} = ${c} - ${b}`,
              `${a}${variable} = ${c - b}`,
              `${variable} = ${c - b} ÷ ${a}`,
              `${variable} = ${answer}`
            ],
            difficulty
          };
        } else {
          const c = a * answer - b;
          return {
            equation: `${a}${variable} - ${b} = ${c}`,
            variable,
            answer,
            steps: [
              `${a}${variable} - ${b} = ${c}`,
              `${a}${variable} = ${c} + ${b}`,
              `${a}${variable} = ${c + b}`,
              `${variable} = ${c + b} ÷ ${a}`,
              `${variable} = ${answer}`
            ],
            difficulty
          };
        }
      }
      
      default: {
        // Complex equations with fractions or multiple terms
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 2;
        const c = Math.floor(Math.random() * 3) + 1;
        const answer = Math.floor(Math.random() * 8) + 1;
        const d = (a * answer + b) / c;
        
        return {
          equation: `(${a}${variable} + ${b})/${c} = ${d}`,
          variable,
          answer,
          steps: [
            `(${a}${variable} + ${b})/${c} = ${d}`,
            `${a}${variable} + ${b} = ${d} × ${c}`,
            `${a}${variable} + ${b} = ${d * c}`,
            `${a}${variable} = ${d * c} - ${b}`,
            `${a}${variable} = ${d * c - b}`,
            `${variable} = ${d * c - b} ÷ ${a}`,
            `${variable} = ${answer}`
          ],
          difficulty
        };
      }
    }
  }, []);

  const checkAnswer = () => {
    if (!currentEquation || !userAnswer.trim()) return;
    
    const answer = parseFloat(userAnswer);
    const isCorrect = Math.abs(answer - currentEquation.answer) < 0.01;
    
    if (isCorrect) {
      const basePoints = 100;
      const difficultyBonus = currentEquation.difficulty * 25;
      const streakBonus = streak * 10;
      const hintPenalty = showSteps ? 30 : showHint ? 15 : 0;
      const points = Math.max(25, basePoints + difficultyBonus + streakBonus - hintPenalty);
      
      setScore(prev => prev + points);
      setProblemsSolved(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      toast({
        title: "Excellent! 🎉",
        description: `+${points} points ${streak > 0 ? `(${streak + 1} streak!)` : ''}`,
      });
      
      // Level up every 3 correct answers
      if ((problemsSolved + 1) % 3 === 0 && level < 4) {
        setLevel(prev => prev + 1);
        toast({
          title: "Level Up! 📈",
          description: `Welcome to level ${level + 1}! Equations are getting harder.`,
        });
      }
      
    } else {
      setStreak(0);
      toast({
        title: "Not quite right 🤔",
        description: `The answer was ${currentEquation.variable} = ${currentEquation.answer}`,
        variant: "destructive",
      });
    }
    
    nextProblem();
  };

  const nextProblem = () => {
    setUserAnswer("");
    setShowHint(false);
    setShowSteps(false);
    const newEquation = generateEquation(level);
    setCurrentEquation(newEquation);
  };

  const showHintHandler = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const showStepsHandler = () => {
    setShowSteps(true);
    setHintsUsed(prev => prev + 1);
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
    const initialEquation = generateEquation(1);
    setCurrentEquation(initialEquation);
  }, [generateEquation]);

  const accuracy = problemsSolved > 0 ? Math.round((streak / (problemsSolved + (streak > 0 ? 0 : 1))) * 100) : 0;

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
            <Calculator className="w-6 h-6 text-primary" />
            Algebra Master
          </h1>
          <p className="text-muted-foreground">Solve equations to find the value of x</p>
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
            <div className="text-xs text-muted-foreground">Solved</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <CheckCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Level {level} Equation</span>
            <Badge className={`${streak >= 3 ? 'bg-success' : ''}`}>
              Streak: {streak}
            </Badge>
          </CardTitle>
          <CardDescription>
            Find the value of x that makes the equation true
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentEquation && (
            <div className="text-center space-y-6">
              <div className="p-6 bg-muted/30 rounded-lg">
                <div className="text-4xl font-mono font-bold text-primary mb-4">
                  {currentEquation.equation}
                </div>
                <div className="text-lg text-muted-foreground">
                  Find: {currentEquation.variable} = ?
                </div>
              </div>
              
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter value of x"
                  className="text-center text-xl h-12"
                  type="number"
                  step="0.1"
                />
                <Button 
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="gradient-success h-12 px-6"
                >
                  Check
                </Button>
              </div>

              {/* Hint System */}
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={showHintHandler}
                  disabled={showHint || showSteps}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Hint (-15 pts)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={showStepsHandler}
                  disabled={showSteps}
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Show Steps (-30 pts)
                </Button>
              </div>

              {/* Hints */}
              {showHint && !showSteps && (
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-warning" />
                    <span className="font-semibold">Hint:</span>
                  </div>
                  <p className="text-sm">
                    {level <= 2 
                      ? "Use inverse operations to isolate the variable. What you do to one side, do to the other!"
                      : "Start by getting all terms with the variable on one side, then use inverse operations step by step."
                    }
                  </p>
                </div>
              )}

              {/* Step-by-step solution */}
              {showSteps && (
                <div className="p-4 bg-info/10 rounded-lg border border-info/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-info" />
                    <span className="font-semibold">Step-by-step solution:</span>
                  </div>
                  <div className="space-y-2 text-left">
                    {currentEquation.steps.map((step, index) => (
                      <div key={index} className="text-sm font-mono">
                        <span className="text-muted-foreground mr-2">Step {index + 1}:</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{problemsSolved % 3}/3</span>
            </div>
            <Progress value={(problemsSolved % 3) * 33.33} className="h-2" />
          </div>
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
              <div className="text-sm text-muted-foreground">Problems Solved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{hintsUsed}</div>
              <div className="text-sm text-muted-foreground">Hints Used</div>
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