import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shapes, 
  ArrowLeft, 
  Trophy, 
  Target, 
  Calculator,
  Square,
  Circle,
  Triangle,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeometryGameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface GeometryProblem {
  type: 'rectangle' | 'circle' | 'triangle' | 'square' | 'trapezoid';
  question: string;
  dimensions: Record<string, number>;
  answer: number;
  formula: string;
  visualization: string;
  difficulty: number;
}

export default function GeometryGame({ onComplete, onBack }: GeometryGameProps) {
  const [currentProblem, setCurrentProblem] = useState<GeometryProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  const { toast } = useToast();

  const generateProblem = useCallback((difficulty: number): GeometryProblem => {
    const problems = [
      // Rectangles
      () => {
        const length = Math.floor(Math.random() * 15) + 3;
        const width = Math.floor(Math.random() * 12) + 2;
        const isArea = Math.random() > 0.5;
        
        if (isArea) {
          return {
            type: 'rectangle' as const,
            question: `Find the area of a rectangle with length ${length} units and width ${width} units.`,
            dimensions: { length, width },
            answer: length * width,
            formula: "Area = length × width",
            visualization: `📐 Rectangle: ${length} × ${width}`,
            difficulty
          };
        } else {
          return {
            type: 'rectangle' as const,
            question: `Find the perimeter of a rectangle with length ${length} units and width ${width} units.`,
            dimensions: { length, width },
            answer: 2 * (length + width),
            formula: "Perimeter = 2 × (length + width)",
            visualization: `📐 Rectangle: ${length} × ${width}`,
            difficulty
          };
        }
      },
      
      // Squares
      () => {
        const side = Math.floor(Math.random() * 12) + 2;
        const isArea = Math.random() > 0.5;
        
        if (isArea) {
          return {
            type: 'square' as const,
            question: `Find the area of a square with side length ${side} units.`,
            dimensions: { side },
            answer: side * side,
            formula: "Area = side²",
            visualization: `⬜ Square: ${side} × ${side}`,
            difficulty
          };
        } else {
          return {
            type: 'square' as const,
            question: `Find the perimeter of a square with side length ${side} units.`,
            dimensions: { side },
            answer: 4 * side,
            formula: "Perimeter = 4 × side",
            visualization: `⬜ Square: ${side} × ${side}`,
            difficulty
          };
        }
      },
      
      // Circles
      () => {
        const radius = Math.floor(Math.random() * 8) + 2;
        const isArea = Math.random() > 0.5;
        
        if (isArea) {
          const area = Math.round(Math.PI * radius * radius * 100) / 100;
          return {
            type: 'circle' as const,
            question: `Find the area of a circle with radius ${radius} units. (Use π ≈ 3.14)`,
            dimensions: { radius },
            answer: area,
            formula: "Area = π × radius²",
            visualization: `🔵 Circle: radius = ${radius}`,
            difficulty
          };
        } else {
          const circumference = Math.round(2 * Math.PI * radius * 100) / 100;
          return {
            type: 'circle' as const,
            question: `Find the circumference of a circle with radius ${radius} units. (Use π ≈ 3.14)`,
            dimensions: { radius },
            answer: circumference,
            formula: "Circumference = 2 × π × radius",
            visualization: `🔵 Circle: radius = ${radius}`,
            difficulty
          };
        }
      },
      
      // Triangles
      () => {
        if (difficulty >= 2) {
          const base = Math.floor(Math.random() * 12) + 3;
          const height = Math.floor(Math.random() * 10) + 2;
          return {
            type: 'triangle' as const,
            question: `Find the area of a triangle with base ${base} units and height ${height} units.`,
            dimensions: { base, height },
            answer: (base * height) / 2,
            formula: "Area = (base × height) ÷ 2",
            visualization: `🔺 Triangle: base = ${base}, height = ${height}`,
            difficulty
          };
        } else {
          // For easier problems, just perimeter of equilateral triangle
          const side = Math.floor(Math.random() * 10) + 3;
          return {
            type: 'triangle' as const,
            question: `Find the perimeter of an equilateral triangle with side length ${side} units.`,
            dimensions: { side },
            answer: 3 * side,
            formula: "Perimeter = 3 × side (for equilateral triangle)",
            visualization: `🔺 Equilateral Triangle: side = ${side}`,
            difficulty
          };
        }
      }
    ];
    
    // Select problems based on difficulty
    const availableProblems = difficulty === 1 ? problems.slice(0, 2) : problems;
    const randomProblem = availableProblems[Math.floor(Math.random() * availableProblems.length)];
    return randomProblem();
  }, []);

  const checkAnswer = () => {
    if (!currentProblem || !userAnswer.trim()) return;
    
    const answer = parseFloat(userAnswer);
    const tolerance = Math.max(0.1, currentProblem.answer * 0.01); // 1% tolerance or 0.1, whichever is larger
    const isCorrect = Math.abs(answer - currentProblem.answer) <= tolerance;
    
    if (isCorrect) {
      const basePoints = 150;
      const difficultyBonus = currentProblem.difficulty * 25;
      const streakBonus = streak * 15;
      const formulaBonus = showFormula ? 0 : 25; // Bonus for not using formula hint
      const points = basePoints + difficultyBonus + streakBonus + formulaBonus;
      
      setScore(prev => prev + points);
      setProblemsSolved(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      toast({
        title: "Perfect! 🎯",
        description: `+${points} points ${streak > 0 ? `(${streak + 1} streak!)` : ''}`,
      });
      
      // Level up every 4 correct answers
      if ((problemsSolved + 1) % 4 === 0 && level < 3) {
        setLevel(prev => prev + 1);
        toast({
          title: "Level Up! 📐",
          description: `Welcome to level ${level + 1}! More complex shapes ahead.`,
        });
      }
      
    } else {
      setStreak(0);
      toast({
        title: "Not quite right 📏",
        description: `The answer was ${currentProblem.answer} square units`,
        variant: "destructive",
      });
    }
    
    nextProblem();
  };

  const nextProblem = () => {
    setUserAnswer("");
    setShowFormula(false);
    const newProblem = generateProblem(level);
    setCurrentProblem(newProblem);
  };

  const showFormulaHint = () => {
    setShowFormula(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const finishGame = () => {
    onComplete(score);
  };

  const renderVisualization = (problem: GeometryProblem) => {
    const size = 120;
    
    switch (problem.type) {
      case 'rectangle':
        const rectWidth = size;
        const rectHeight = size * 0.6;
        return (
          <svg width={size + 40} height={size} className="mx-auto">
            <rect 
              x="20" 
              y="20" 
              width={rectWidth} 
              height={rectHeight} 
              fill="hsl(var(--primary))" 
              fillOpacity="0.3" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2"
            />
            <text x={rectWidth/2 + 20} y="15" textAnchor="middle" className="text-xs fill-current">
              {problem.dimensions.length}
            </text>
            <text x="10" y={rectHeight/2 + 25} textAnchor="middle" className="text-xs fill-current">
              {problem.dimensions.width}
            </text>
          </svg>
        );
        
      case 'square':
        return (
          <svg width={size + 40} height={size} className="mx-auto">
            <rect 
              x="20" 
              y="20" 
              width={size - 20} 
              height={size - 20} 
              fill="hsl(var(--secondary))" 
              fillOpacity="0.3" 
              stroke="hsl(var(--secondary))" 
              strokeWidth="2"
            />
            <text x={size/2 + 10} y="15" textAnchor="middle" className="text-xs fill-current">
              {problem.dimensions.side}
            </text>
          </svg>
        );
        
      case 'circle':
        const radius = (size - 40) / 2;
        return (
          <svg width={size + 40} height={size} className="mx-auto">
            <circle 
              cx={size/2 + 20} 
              cy={size/2} 
              r={radius} 
              fill="hsl(var(--success))" 
              fillOpacity="0.3" 
              stroke="hsl(var(--success))" 
              strokeWidth="2"
            />
            <line 
              x1={size/2 + 20} 
              y1={size/2} 
              x2={size/2 + 20 + radius} 
              y2={size/2} 
              stroke="hsl(var(--success))" 
              strokeWidth="1"
            />
            <text x={size/2 + 20 + radius/2} y={size/2 - 5} textAnchor="middle" className="text-xs fill-current">
              r = {problem.dimensions.radius}
            </text>
          </svg>
        );
        
      case 'triangle':
        const base = size - 40;
        const height = size * 0.7;
        return (
          <svg width={size + 40} height={size} className="mx-auto">
            <polygon 
              points={`20,${height + 10} ${base + 20},${height + 10} ${size/2 + 20},20`}
              fill="hsl(var(--warning))" 
              fillOpacity="0.3" 
              stroke="hsl(var(--warning))" 
              strokeWidth="2"
            />
            {problem.dimensions.base && (
              <text x={size/2 + 20} y={height + 25} textAnchor="middle" className="text-xs fill-current">
                base = {problem.dimensions.base}
              </text>
            )}
            {problem.dimensions.height && (
              <text x="10" y={height/2 + 15} textAnchor="middle" className="text-xs fill-current">
                h = {problem.dimensions.height}
              </text>
            )}
            {problem.dimensions.side && (
              <text x={size/2 + 20} y={height + 25} textAnchor="middle" className="text-xs fill-current">
                side = {problem.dimensions.side}
              </text>
            )}
          </svg>
        );
        
      default:
        return <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mx-auto">
          <Shapes className="w-8 h-8 text-muted-foreground" />
        </div>;
    }
  };

  useEffect(() => {
    const initialProblem = generateProblem(1);
    setCurrentProblem(initialProblem);
  }, [generateProblem]);

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
            <Shapes className="w-6 h-6 text-primary" />
            Geometry Explorer
          </h1>
          <p className="text-muted-foreground">Calculate areas, perimeters, and more!</p>
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
            <Calculator className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Level {level} - Geometry Challenge</span>
            <Badge className={`${streak >= 3 ? 'bg-success' : ''}`}>
              Streak: {streak}
            </Badge>
          </CardTitle>
          <CardDescription>
            Study the shape and calculate the requested measurement
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentProblem && (
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-lg mb-4">{currentProblem.question}</p>
                <div className="text-sm text-muted-foreground mb-4">
                  {currentProblem.visualization}
                </div>
              </div>
              
              {/* Visual Representation */}
              <div className="flex justify-center p-6 bg-background/50 rounded-lg">
                {renderVisualization(currentProblem)}
              </div>
              
              {/* Answer Input */}
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your answer"
                  className="text-center text-xl h-12"
                  type="number"
                  step="0.01"
                />
                <Button 
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="gradient-success h-12 px-6"
                >
                  Check
                </Button>
              </div>

              {/* Formula Hint */}
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={showFormulaHint}
                  disabled={showFormula}
                  className="flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Show Formula (-25 pts)
                </Button>
              </div>

              {/* Formula Display */}
              {showFormula && (
                <div className="p-4 bg-info/10 rounded-lg border border-info/20 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-info" />
                    <span className="font-semibold">Formula:</span>
                  </div>
                  <p className="text-lg font-mono text-info">
                    {currentProblem.formula}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{problemsSolved % 4}/4</span>
            </div>
            <Progress value={(problemsSolved % 4) * 25} className="h-2" />
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
              <div className="text-2xl font-bold text-warning">{streak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
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