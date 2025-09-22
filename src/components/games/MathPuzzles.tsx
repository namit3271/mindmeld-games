import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Puzzle, 
  ArrowLeft, 
  Trophy, 
  Target, 
  Lightbulb,
  CheckCircle,
  Timer,
  Star,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MathPuzzlesProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface MathPuzzle {
  id: string;
  title: string;
  description: string;
  question: string;
  answer: number;
  explanation: string;
  hints: string[];
  difficulty: number;
  category: 'logic' | 'algebra' | 'geometry' | 'number-theory';
  timeLimit?: number;
}

export default function MathPuzzles({ onComplete, onBack }: MathPuzzlesProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<MathPuzzle | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [userExplanation, setUserExplanation] = useState("");
  const [score, setScore] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { toast } = useToast();

  const puzzles: MathPuzzle[] = [
    {
      id: '1',
      title: 'Age Puzzle',
      description: 'A classic problem involving ages and time',
      question: 'A father is 3 times as old as his son. In 12 years, he will be twice as old as his son will be then. How old is the son now?',
      answer: 12,
      explanation: 'Let son\'s current age = x. Father\'s current age = 3x. In 12 years: son will be x+12, father will be 3x+12. Given: 3x+12 = 2(x+12). Solving: 3x+12 = 2x+24, so x = 12.',
      hints: [
        'Let the son\'s current age be x years',
        'The father is currently 3x years old',
        'In 12 years, set up an equation: father\'s age = 2 × son\'s age'
      ],
      difficulty: 2,
      category: 'algebra',
      timeLimit: 300
    },
    {
      id: '2',
      title: 'Number Pattern',
      description: 'Find the missing number in this sequence',
      question: 'What number should replace the question mark? 2, 6, 12, 20, 30, ?',
      answer: 42,
      explanation: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42',
      hints: [
        'Look at the differences between consecutive numbers',
        'The differences are 4, 6, 8, 10... they increase by 2 each time',
        'Try to express each number as a product of two consecutive integers'
      ],
      difficulty: 1,
      category: 'number-theory'
    },
    {
      id: '3',
      title: 'Coin Problem',
      description: 'A probability and counting puzzle',
      question: 'You have 50 coins: some are fair (50% heads), others always land heads. You pick a random coin and flip it 10 times, getting 10 heads. What\'s the probability it\'s a fair coin? (Express as a percentage, rounded to nearest whole number)',
      answer: 1,
      explanation: 'Using Bayes\' theorem: P(fair|10 heads) = P(10 heads|fair) × P(fair) / P(10 heads). Assuming equal numbers of each type: (1/1024) × 0.5 / [(1/1024) × 0.5 + 1 × 0.5] ≈ 0.001 = 0.1% ≈ 1%',
      hints: [
        'This is a Bayes\' theorem problem',
        'Calculate P(10 heads | fair coin) = (1/2)^10',
        'Consider the probability of getting 10 heads from each type of coin'
      ],
      difficulty: 4,
      category: 'logic'
    },
    {
      id: '4',
      title: 'Triangle Areas',
      description: 'A geometry puzzle involving areas',
      question: 'A triangle has vertices at (0,0), (6,0), and (3,4). What is its area?',
      answer: 12,
      explanation: 'Using the formula: Area = 0.5 × base × height. The base is 6 units (from (0,0) to (6,0)) and the height is 4 units (perpendicular distance from (3,4) to the x-axis). Area = 0.5 × 6 × 4 = 12.',
      hints: [
        'The base of the triangle lies on the x-axis',
        'The height is the perpendicular distance from the third vertex to the base',
        'Use the formula: Area = 0.5 × base × height'
      ],
      difficulty: 2,
      category: 'geometry'
    },
    {
      id: '5',
      title: 'The Locker Problem',
      description: 'A classic mathematical puzzle',
      question: 'There are 100 lockers and 100 students. Student 1 opens all lockers. Student 2 closes every 2nd locker. Student 3 toggles every 3rd locker, and so on. After all students have finished, how many lockers are open?',
      answer: 10,
      explanation: 'A locker ends up open if it\'s toggled an odd number of times. Locker n is toggled by student d if d divides n. So locker n is toggled once for each divisor of n. A number has an odd number of divisors only if it\'s a perfect square. Perfect squares from 1-100: 1,4,9,16,25,36,49,64,81,100. That\'s 10 lockers.',
      hints: [
        'Think about which students will toggle each locker',
        'Student k toggles locker n if k divides n evenly',
        'Count how many times each locker gets toggled'
      ],
      difficulty: 3,
      category: 'logic'
    },
    {
      id: '6',
      title: 'Clock Angle',
      description: 'Calculate the angle between clock hands',
      question: 'At 3:15, what is the acute angle (in degrees) between the hour and minute hands of a clock?',
      answer: 7.5,
      explanation: 'At 3:15: minute hand is at 90° (pointing at 3). Hour hand moves 30° per hour + 0.5° per minute. At 3:15: hour hand is at 90° + 7.5° = 97.5°. Angle between them: |97.5° - 90°| = 7.5°.',
      hints: [
        'The minute hand moves 360° in 60 minutes = 6° per minute',
        'The hour hand moves 360° in 12 hours = 30° per hour = 0.5° per minute',
        'Calculate the position of each hand separately, then find the difference'
      ],
      difficulty: 2,
      category: 'geometry'
    }
  ];

  const getRandomPuzzle = useCallback((): MathPuzzle => {
    // Filter puzzles that haven't been solved yet, or return a random one if all solved
    const availablePuzzles = puzzles.filter(p => p.id !== currentPuzzle?.id);
    if (availablePuzzles.length === 0) return puzzles[Math.floor(Math.random() * puzzles.length)];
    return availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
  }, [currentPuzzle, puzzles]);

  const startPuzzle = (puzzle: MathPuzzle) => {
    setCurrentPuzzle(puzzle);
    setUserAnswer("");
    setUserExplanation("");
    setCurrentHintIndex(0);
    setShowExplanation(false);
    
    if (puzzle.timeLimit) {
      setTimeLeft(puzzle.timeLimit);
      setIsTimerActive(true);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerActive(false);
            toast({
              title: "Time's up! ⏰",
              description: "Don't worry, you can still submit your answer",
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const checkAnswer = () => {
    if (!currentPuzzle || !userAnswer.trim()) return;
    
    const answer = parseFloat(userAnswer);
    const tolerance = Math.max(0.1, Math.abs(currentPuzzle.answer) * 0.01);
    const isCorrect = Math.abs(answer - currentPuzzle.answer) <= tolerance;
    
    if (isCorrect) {
      const basePoints = 300;
      const difficultyBonus = currentPuzzle.difficulty * 100;
      const timeBonus = isTimerActive && timeLeft > 0 ? Math.floor(timeLeft / 10) : 0;
      const hintPenalty = currentHintIndex * 50;
      const points = Math.max(100, basePoints + difficultyBonus + timeBonus - hintPenalty);
      
      setScore(prev => prev + points);
      setPuzzlesSolved(prev => prev + 1);
      setIsTimerActive(false);
      
      toast({
        title: "Brilliant! 🎯",
        description: `+${points} points! ${timeBonus > 0 ? `Time bonus: ${timeBonus}` : ''}`,
      });
      
      setShowExplanation(true);
    } else {
      toast({
        title: "Not quite right 🤔",
        description: `The answer was ${currentPuzzle.answer}`,
        variant: "destructive",
      });
      setShowExplanation(true);
    }
  };

  const showNextHint = () => {
    if (currentPuzzle && currentHintIndex < currentPuzzle.hints.length) {
      setCurrentHintIndex(prev => prev + 1);
      setHintsUsed(prev => prev + 1);
    }
  };

  const nextPuzzle = () => {
    const newPuzzle = getRandomPuzzle();
    startPuzzle(newPuzzle);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      checkAnswer();
    }
  };

  const finishGame = () => {
    onComplete(score);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-success';
      case 2: return 'text-warning';
      case 3: return 'text-destructive';
      case 4: return 'text-purple-500';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'logic': return <Brain className="w-4 h-4" />;
      case 'algebra': return <Target className="w-4 h-4" />;
      case 'geometry': return <Puzzle className="w-4 h-4" />;
      case 'number-theory': return <Star className="w-4 h-4" />;
      default: return <Puzzle className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const initialPuzzle = puzzles[0];
    startPuzzle(initialPuzzle);
  }, []);

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
            <Puzzle className="w-6 h-6 text-primary" />
            Math Puzzles
          </h1>
          <p className="text-muted-foreground">Challenge your mathematical thinking with complex problems</p>
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
            <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{puzzlesSolved}</div>
            <div className="text-xs text-muted-foreground">Puzzles Solved</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Lightbulb className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">{hintsUsed}</div>
            <div className="text-xs text-muted-foreground">Hints Used</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Timer className="w-6 h-6 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {currentPuzzle?.timeLimit ? formatTime(timeLeft) : '∞'}
            </div>
            <div className="text-xs text-muted-foreground">Time Left</div>
          </CardContent>
        </Card>
      </div>

      {/* Puzzle Area */}
      <Card className="shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentPuzzle && getCategoryIcon(currentPuzzle.category)}
              <span>{currentPuzzle?.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(currentPuzzle?.difficulty || 1)}>
                Difficulty: {currentPuzzle?.difficulty}/4
              </Badge>
              {isTimerActive && timeLeft <= 60 && (
                <Badge variant="destructive" className="animate-pulse">
                  {formatTime(timeLeft)}
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {currentPuzzle?.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentPuzzle && (
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="p-6 bg-muted/30 rounded-lg">
                <div className="text-lg leading-relaxed">
                  {currentPuzzle.question}
                </div>
              </div>
              
              {/* Answer Input */}
              <div className="space-y-4">
                <div className="flex gap-3 max-w-md mx-auto">
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Your numerical answer"
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
                
                {/* Optional Explanation */}
                <div className="max-w-2xl mx-auto">
                  <Textarea
                    value={userExplanation}
                    onChange={(e) => setUserExplanation(e.target.value)}
                    placeholder="Optional: Explain your reasoning (not graded, but helps with learning)"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Hint System */}
              <div className="text-center">
                {currentHintIndex < currentPuzzle.hints.length ? (
                  <Button 
                    variant="outline" 
                    onClick={showNextHint}
                    className="flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Show Hint {currentHintIndex + 1}/{currentPuzzle.hints.length} (-50 pts)
                  </Button>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    All hints used
                  </div>
                )}
              </div>

              {/* Hints Display */}
              {currentHintIndex > 0 && (
                <div className="space-y-3">
                  {currentPuzzle.hints.slice(0, currentHintIndex).map((hint, index) => (
                    <div key={index} className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-warning" />
                        <span className="font-semibold">Hint {index + 1}:</span>
                      </div>
                      <p className="text-sm">{hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation */}
              {showExplanation && (
                <div className="p-4 bg-info/10 rounded-lg border border-info/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-info" />
                    <span className="font-semibold">Solution & Explanation:</span>
                  </div>
                  <p className="text-sm leading-relaxed">{currentPuzzle.explanation}</p>
                  
                  <div className="mt-4 flex gap-3 justify-center">
                    <Button onClick={nextPuzzle} className="gradient-primary">
                      Next Puzzle
                    </Button>
                  </div>
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
              <div className="text-2xl font-bold text-success">{puzzlesSolved}</div>
              <div className="text-sm text-muted-foreground">Puzzles Solved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{hintsUsed}</div>
              <div className="text-sm text-muted-foreground">Hints Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {puzzlesSolved > 0 ? Math.round(score / puzzlesSolved) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Points/Puzzle</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}